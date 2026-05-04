"""Generera QR-koder för Skatelövsvägen 44.

Kör: python3 scripts/generate_qr.py
Skapar PNG-filer i public/qr/.
"""

from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_H

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "qr"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Hög felkorrigering (~30%) så koden funkar även vid blekt tryck.
TARGETS = {
    "skatelovsvagen44.png": "https://skatelovsvagen44.se",
    "skatelovsvagen44-vercel.png": "https://s44-hemsida.vercel.app",
}

for filename, url in TARGETS.items():
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=20,  # px per modul → ger ~1000+ px bred PNG, bra för utskrift
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    out_path = OUT_DIR / filename
    img.save(out_path)
    print(f"Skapade {out_path}  →  {url}  ({img.size[0]}x{img.size[1]} px)")
