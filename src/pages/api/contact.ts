import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const TO_EMAIL = import.meta.env.CONTACT_TO_EMAIL ?? "hakfastigheter@gmail.com";
const FROM_EMAIL =
  import.meta.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

// --- Inputbegränsningar (förhindrar abuse av jättepayloads) ---
const MAX_NAME = 200;
const MAX_EMAIL = 320; // RFC 5321 maxlängd
const MAX_PHONE = 50;
const MAX_MESSAGE = 5000;

// --- Rate limit per IP (skydd mot enkel formulär-spam) ---
// In-memory; nollställs vid serverless cold start. För enkel sajt räcker det.
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const rateLimitOk = (ip: string): boolean => {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    // Periodisk städning av gamla buckets för att undvika minnesläcka
    if (rateBuckets.size > 1000) {
      for (const [k, v] of rateBuckets) {
        if (v.resetAt < now) rateBuckets.delete(k);
      }
    }
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count++;
  return true;
};

const getClientIp = (request: Request): string => {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
};

// CRLF kan användas till mejl-header-injection — avslå i alla single-line fält.
const hasCrLf = (s: string) => /[\r\n]/.test(s);

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const POST: APIRoute = async ({ request }) => {
  if (!RESEND_API_KEY) {
    return Response.json(
      { ok: false, error: "Server saknar RESEND_API_KEY." },
      { status: 500 },
    );
  }

  // Rate-limit innan vi gör något dyrt
  const ip = getClientIp(request);
  if (!rateLimitOk(ip)) {
    return Response.json(
      {
        ok: false,
        error: "För många inskick från din anslutning. Försök igen om en stund.",
      },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    }
  } catch {
    return Response.json(
      { ok: false, error: "Ogiltigt format på förfrågan." },
      { status: 400 },
    );
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const honeypot = String(payload.company ?? "").trim();

  if (honeypot) {
    return Response.json({ ok: true });
  }

  if (!name || !email || !message) {
    return Response.json(
      { ok: false, error: "Namn, e-post och meddelande krävs." },
      { status: 400 },
    );
  }

  // Längdgräns
  if (
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    phone.length > MAX_PHONE ||
    message.length > MAX_MESSAGE
  ) {
    return Response.json(
      { ok: false, error: "Ett av fälten är för långt." },
      { status: 400 },
    );
  }

  // CRLF-injektion (skydd för mejl-headers)
  if (hasCrLf(name) || hasCrLf(email) || hasCrLf(phone)) {
    return Response.json(
      { ok: false, error: "Ogiltiga tecken i fälten." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { ok: false, error: "Ange en giltig e-postadress." },
      { status: 400 },
    );
  }

  const resend = new Resend(RESEND_API_KEY);

  const html = `
    <h2>Nytt meddelande från skatelovsvagen44.se</h2>
    <p><strong>Namn:</strong> ${escapeHtml(name)}</p>
    <p><strong>E-post:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
    <p><strong>Meddelande:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const { error } = await resend.emails.send({
    from: `Skatelövsvägen 44 <${FROM_EMAIL}>`,
    to: [TO_EMAIL],
    replyTo: email,
    subject: `Kontaktformulär: ${name}`,
    html,
  });

  if (error) {
    return Response.json(
      { ok: false, error: "Det gick inte att skicka meddelandet." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
};
