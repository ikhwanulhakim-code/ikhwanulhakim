import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'public', 'og-image.png');

const W = 1200;
const H = 630;

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0F0F0F"/>
      <stop offset="100%" stop-color="#1C1C1C"/>
    </linearGradient>
    <linearGradient id="lime-fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#AAFF00" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#AAFF00" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#lime-fade)"/>

  <circle cx="1050" cy="150" r="200" fill="#AAFF00" opacity="0.05"/>
  <circle cx="1100" cy="500" r="120" fill="#AAFF00" opacity="0.03"/>

  <rect x="80" y="180" width="6" height="280" rx="3" fill="#AAFF00"/>

  <text x="110" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#8A8A82" font-weight="400">SOFTWARE ENGINEER &amp; PROJECT MANAGER</text>

  <text x="110" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="64" fill="#F5F5F0" font-weight="700">Muhammad</text>
  <text x="110" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="64" fill="#F5F5F0" font-weight="700">Ikhwanul Hakim</text>

  <rect x="110" y="460" width="80" height="4" rx="2" fill="#AAFF00"/>

  <text x="110" y="510" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#AAFF00" font-weight="500">ikhwanulhakim.dev</text>

  <rect x="950" y="540" width="170" height="50" rx="25" fill="none" stroke="#AAFF00" stroke-width="2" opacity="0.4"/>
  <text x="1035" y="572" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#AAFF00" text-anchor="middle" font-weight="500" opacity="0.7">Let's Talk</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`OG image saved to ${outPath}`);
