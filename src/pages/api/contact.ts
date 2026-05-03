import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const TO_EMAIL = import.meta.env.CONTACT_TO_EMAIL ?? "hakfastigheter@gmail.com";
const FROM_EMAIL =
  import.meta.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

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
