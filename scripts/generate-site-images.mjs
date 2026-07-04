import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const outDir = new URL("../public/images/", import.meta.url);

const palette = {
  forest: "#0d4a36",
  forest2: "#143b2b",
  leaf: "#78ad25",
  violet: "#79308f",
  gold: "#c89a31",
  paper: "#fbfaf4",
  mint: "#e8f4e1",
  ink: "#17231c",
  muted: "#617064",
  white: "#ffffff"
};

function esc(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  })[char]);
}

function svg(width, height, body) {
  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.paper}"/>
      <stop offset="0.55" stop-color="#ffffff"/>
      <stop offset="1" stop-color="${palette.mint}"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.forest}"/>
      <stop offset="0.72" stop-color="${palette.leaf}"/>
      <stop offset="1" stop-color="${palette.gold}"/>
    </linearGradient>
    <linearGradient id="foil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f7f9fa"/>
      <stop offset="0.18" stop-color="#bfc9cd"/>
      <stop offset="0.34" stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#9ba6ab"/>
      <stop offset="0.72" stop-color="#f5f7f8"/>
      <stop offset="1" stop-color="#aeb8bd"/>
    </linearGradient>
    <linearGradient id="softShadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.88"/>
      <stop offset="1" stop-color="#dfe8db" stop-opacity="0.55"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="${palette.forest}" flood-opacity="0.16"/>
    </filter>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M54 0H0V54" stroke="${palette.forest}" stroke-opacity="0.055" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  ${body}
</svg>`;
}

function logo(x, y, scale = 1) {
  return `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <text x="0" y="0" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900">RENN</text>
    <text x="1" y="20" fill="${palette.forest2}" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="900">PRODUCTS LLP</text>
  </g>`;
}

function tissueBox(x, y, w, h, label = "TISSUE") {
  return `
  <g filter="url(#shadow)" transform="translate(${x} ${y})">
    <rect x="0" y="42" width="${w}" height="${h - 42}" rx="16" fill="#ffffff" stroke="#dce4da" stroke-width="2"/>
    <path d="M28 54C76 2 118 -2 168 54C118 40 82 40 28 54Z" fill="#f5f7f3" stroke="#dfe7dc" stroke-width="2"/>
    <rect x="${w * 0.12}" y="${h * 0.45}" width="${w * 0.76}" height="${h * 0.2}" rx="10" fill="${palette.mint}"/>
    <text x="${w * 0.18}" y="${h * 0.58}" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(18, w * 0.08)}" font-weight="900">${esc(label)}</text>
    <circle cx="${w * 0.8}" cy="${h * 0.75}" r="${w * 0.055}" fill="${palette.leaf}"/>
    <circle cx="${w * 0.88}" cy="${h * 0.75}" r="${w * 0.055}" fill="${palette.gold}"/>
  </g>`;
}

function napkinStack(x, y, w, h) {
  return `
  <g filter="url(#shadow)" transform="translate(${x} ${y})">
    <path d="M20 ${h * 0.78}L${w * 0.48} 18L${w - 18} ${h * 0.78}Z" fill="#ffffff" stroke="#d9e2d6" stroke-width="2"/>
    <path d="M${w * 0.48} 18L${w * 0.48} ${h * 0.78}" stroke="#e6ece4" stroke-width="3"/>
    <path d="M36 ${h * 0.88}H${w - 24}L${w - 6} ${h * 0.99}H18Z" fill="#f3f6f0" stroke="#d9e2d6" stroke-width="2"/>
    <rect x="${w * 0.12}" y="${h * 0.84}" width="${w * 0.76}" height="${h * 0.13}" rx="8" fill="#ffffff" stroke="#dce4da"/>
  </g>`;
}

function roll(x, y, r, length, rotate = 0) {
  return `
  <g filter="url(#shadow)" transform="translate(${x} ${y}) rotate(${rotate})">
    <rect x="0" y="${-r}" width="${length}" height="${r * 2}" rx="${r}" fill="#ffffff" stroke="#dce4da" stroke-width="2"/>
    <ellipse cx="${length}" cy="0" rx="${r}" ry="${r}" fill="#f7faf3" stroke="#cfdacb" stroke-width="2"/>
    <ellipse cx="${length}" cy="0" rx="${r * 0.46}" ry="${r * 0.46}" fill="#d7e0d4" stroke="#b7c5b5" stroke-width="2"/>
    <path d="M24 ${-r * 0.72}H${length - 22}" stroke="#edf2ea" stroke-width="2"/>
    <path d="M24 0H${length - 22}" stroke="#edf2ea" stroke-width="2"/>
    <path d="M24 ${r * 0.72}H${length - 22}" stroke="#edf2ea" stroke-width="2"/>
  </g>`;
}

function foilRoll(x, y, w, h, rotate = 0) {
  return `
  <g filter="url(#shadow)" transform="translate(${x} ${y}) rotate(${rotate})">
    <rect x="0" y="0" width="${w}" height="${h}" rx="${h / 2}" fill="url(#foil)" stroke="#c8d0d3" stroke-width="2"/>
    <ellipse cx="${w}" cy="${h / 2}" rx="${h / 2}" ry="${h / 2}" fill="url(#foil)" stroke="#aab4b8" stroke-width="2"/>
    <ellipse cx="${w}" cy="${h / 2}" rx="${h * 0.22}" ry="${h * 0.22}" fill="#7d8588" opacity="0.75"/>
    <path d="M${w * 0.18} 0L${w * 0.46} ${h}" stroke="#ffffff" stroke-opacity="0.45" stroke-width="10"/>
    <path d="M${w * 0.54} 0L${w * 0.72} ${h}" stroke="#eef2f3" stroke-opacity="0.45" stroke-width="7"/>
  </g>`;
}

function pack(x, y, w, h, title, color = palette.forest) {
  return `
  <g filter="url(#shadow)" transform="translate(${x} ${y})">
    <rect x="0" y="0" width="${w}" height="${h}" rx="18" fill="#ffffff" stroke="#dce4da" stroke-width="2"/>
    <rect x="0" y="0" width="${w}" height="${h * 0.34}" rx="18" fill="${color}"/>
    <rect x="0" y="${h * 0.24}" width="${w}" height="${h * 0.1}" fill="${color}"/>
    <text x="${w * 0.09}" y="${h * 0.2}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(15, w * 0.085)}" font-weight="900">RENN</text>
    <text x="${w * 0.09}" y="${h * 0.6}" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(13, w * 0.06)}" font-weight="900">${esc(title)}</text>
    <rect x="${w * 0.09}" y="${h * 0.68}" width="${w * 0.62}" height="8" rx="4" fill="${palette.mint}"/>
    <rect x="${w * 0.09}" y="${h * 0.78}" width="${w * 0.42}" height="8" rx="4" fill="#edf2e9"/>
    <circle cx="${w * 0.82}" cy="${h * 0.76}" r="${w * 0.055}" fill="${palette.gold}"/>
  </g>`;
}

function leaves(x, y, scale = 1) {
  return `
  <g transform="translate(${x} ${y}) scale(${scale})" opacity="0.92">
    <path d="M0 70C18 26 42 8 74 0C68 38 48 62 0 70Z" fill="${palette.leaf}"/>
    <path d="M58 82C76 42 104 22 142 18C134 58 104 82 58 82Z" fill="${palette.forest}"/>
    <path d="M10 68C32 50 48 30 66 6" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3"/>
  </g>`;
}

function titleBlock(x, y, title, subtitle, width = 520) {
  return `
  <g transform="translate(${x} ${y})">
    <text x="0" y="0" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="900">${esc(title)}</text>
    <text x="0" y="40" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">${esc(subtitle)}</text>
    <rect x="0" y="64" width="${width}" height="10" rx="5" fill="${palette.mint}"/>
    <rect x="0" y="64" width="${width * 0.38}" height="10" rx="5" fill="${palette.leaf}"/>
  </g>`;
}

const assets = [
  {
    file: "napkins.png",
    width: 900,
    height: 680,
    body: `
      ${titleBlock(56, 92, "Paper Napkins", "Dining, catering and hospitality", 360)}
      <rect x="76" y="438" width="720" height="86" rx="43" fill="${palette.forest}" opacity="0.08"/>
      ${napkinStack(250, 150, 390, 360)}
      ${pack(92, 358, 190, 150, "NAPKIN", palette.violet)}
      ${leaves(642, 396, 0.72)}
    `
  },
  {
    file: "facial-tissue.png",
    width: 900,
    height: 680,
    body: `
      ${titleBlock(56, 92, "Facial Tissues", "Soft tabletop hygiene packs", 360)}
      <rect x="110" y="440" width="700" height="86" rx="43" fill="${palette.forest}" opacity="0.08"/>
      ${tissueBox(250, 145, 410, 330, "SOFT TISSUE")}
      ${pack(96, 372, 190, 142, "FACIAL", palette.forest)}
      ${leaves(670, 372, 0.65)}
    `
  },
  {
    file: "rolls.png",
    width: 900,
    height: 680,
    body: `
      ${titleBlock(56, 92, "Roll Products", "Washroom and kitchen care", 360)}
      <rect x="92" y="462" width="720" height="86" rx="43" fill="${palette.forest}" opacity="0.08"/>
      ${roll(250, 365, 82, 300, -10)}
      ${roll(238, 245, 58, 250, 8)}
      ${roll(488, 430, 46, 190, -5)}
      ${pack(92, 354, 168, 142, "ROLLS", palette.leaf)}
    `
  },
  {
    file: "foil.png",
    width: 900,
    height: 680,
    body: `
      ${titleBlock(56, 92, "Aluminium Foil", "Food-safe wrapping and packing", 390)}
      <rect x="122" y="448" width="660" height="90" rx="45" fill="${palette.forest}" opacity="0.08"/>
      ${foilRoll(225, 250, 430, 120, -9)}
      <path d="M236 386L724 302L800 374L300 470Z" fill="url(#foil)" opacity="0.8" stroke="#d4dcdf" stroke-width="2"/>
      ${pack(96, 366, 178, 142, "FOIL", palette.gold)}
    `
  },
  {
    file: "custom-packaging.png",
    width: 1280,
    height: 820,
    body: `
      ${logo(74, 82, 1.1)}
      ${titleBlock(74, 188, "Custom Supply Support", "Private-label packs for shelves, counters and cartons", 520)}
      <rect x="710" y="132" width="430" height="520" rx="44" fill="${palette.white}" stroke="${palette.line}" stroke-width="2" filter="url(#shadow)"/>
      ${pack(780, 210, 250, 190, "SOFTEL", palette.forest)}
      ${pack(640, 430, 255, 190, "LONEL", palette.violet)}
      ${tissueBox(904, 400, 220, 190, "TISSUE")}
      <rect x="96" y="410" width="430" height="230" rx="28" fill="${palette.white}" stroke="#dce4da" filter="url(#shadow)"/>
      <text x="138" y="484" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900">Retail + Bulk</text>
      <text x="138" y="530" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">Napkins, tissue packs, rolls and foil</text>
      <rect x="138" y="566" width="248" height="12" rx="6" fill="${palette.mint}"/>
      <rect x="138" y="566" width="132" height="12" rx="6" fill="${palette.leaf}"/>
      ${leaves(1028, 110, 0.7)}
    `
  },
  {
    file: "product-showcase.png",
    width: 1280,
    height: 820,
    body: `
      ${logo(74, 82, 1.1)}
      ${titleBlock(74, 188, "Complete Product Range", "Hygiene paper, napkins, roll products and food-safe foil", 580)}
      <rect x="110" y="650" width="1020" height="80" rx="40" fill="${palette.forest}" opacity="0.08"/>
      ${tissueBox(102, 328, 260, 220, "TISSUE")}
      ${napkinStack(394, 270, 270, 280)}
      ${roll(690, 440, 56, 250, -8)}
      ${foilRoll(764, 282, 330, 92, -5)}
      ${pack(922, 472, 210, 156, "CUSTOM", palette.violet)}
      ${leaves(1038, 156, 0.72)}
    `
  },
  {
    file: "hero-products.png",
    width: 1400,
    height: 980,
    body: `
      ${logo(86, 94, 1.3)}
      <text x="88" y="236" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="900">Hygiene essentials</text>
      <text x="92" y="294" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">Premium tissue, napkins, rolls and foil for everyday business use</text>
      <rect x="160" y="812" width="1060" height="88" rx="44" fill="${palette.forest}" opacity="0.08"/>
      ${tissueBox(145, 428, 310, 250, "FACIAL")}
      ${napkinStack(458, 348, 330, 360)}
      ${roll(820, 586, 70, 300, -8)}
      ${foilRoll(826, 384, 390, 116, -5)}
      ${pack(1064, 594, 220, 170, "RENN", palette.forest)}
      ${leaves(1120, 168, 0.78)}
    `
  },
  {
    file: "story-renn.png",
    width: 1120,
    height: 1120,
    body: `
      <circle cx="560" cy="560" r="440" fill="${palette.white}" stroke="#dce4da" stroke-width="2" filter="url(#shadow)"/>
      ${logo(398, 222, 1.35)}
      <text x="300" y="370" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="900">Better Tomorrow</text>
      <text x="336" y="420" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">Clean presentation. Reliable supply.</text>
      ${tissueBox(218, 520, 260, 230, "SOFT")}
      ${napkinStack(500, 454, 260, 300)}
      ${foilRoll(596, 740, 310, 88, -8)}
      ${leaves(736, 540, 0.8)}
    `
  },
  {
    file: "about-operations.png",
    width: 1280,
    height: 820,
    body: `
      ${titleBlock(76, 112, "Organized Operations", "Clean packing, consistent finishing and dispatch planning", 560)}
      <rect x="84" y="312" width="1110" height="350" rx="34" fill="${palette.white}" stroke="#dce4da" filter="url(#shadow)"/>
      <rect x="132" y="372" width="280" height="210" rx="20" fill="${palette.mint}"/>
      <rect x="470" y="372" width="280" height="210" rx="20" fill="#f7f2df"/>
      <rect x="808" y="372" width="280" height="210" rx="20" fill="#f2edf5"/>
      ${pack(166, 418, 210, 128, "PACK", palette.forest)}
      ${roll(510, 482, 44, 190, -6)}
      ${foilRoll(842, 438, 210, 72, -5)}
      <path d="M412 476H470M750 476H808" stroke="${palette.leaf}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="441" cy="476" r="14" fill="${palette.leaf}"/>
      <circle cx="779" cy="476" r="14" fill="${palette.leaf}"/>
    `
  },
  {
    file: "company-profile.png",
    width: 920,
    height: 1260,
    body: `
      ${logo(90, 110, 1.2)}
      <text x="90" y="260" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="900">Company</text>
      <text x="90" y="322" fill="${palette.forest}" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="900">Profile</text>
      <text x="92" y="378" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">Smart Solution For Better Tomorrow</text>
      <rect x="90" y="448" width="740" height="560" rx="44" fill="${palette.white}" stroke="#dce4da" filter="url(#shadow)"/>
      ${tissueBox(148, 560, 240, 210, "TISSUE")}
      ${napkinStack(388, 512, 230, 260)}
      ${foilRoll(420, 806, 300, 82, -8)}
      ${pack(602, 608, 170, 130, "RENN", palette.violet)}
      ${leaves(620, 420, 0.68)}
      <rect x="90" y="1088" width="280" height="12" rx="6" fill="${palette.leaf}"/>
      <rect x="390" y="1088" width="160" height="12" rx="6" fill="${palette.gold}"/>
      <rect x="570" y="1088" width="100" height="12" rx="6" fill="${palette.violet}"/>
    `
  }
];

await mkdir(outDir, { recursive: true });

for (const asset of assets) {
  const input = Buffer.from(svg(asset.width, asset.height, asset.body));
  await sharp(input)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(new URL(asset.file, outDir));
}

console.log(`Generated ${assets.length} website images in ${outDir.pathname}`);
