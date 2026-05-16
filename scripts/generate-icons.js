// Script pour générer les icônes PWA
// Ce script crée des icônes placeholder
// Pour une vraie app, utilisez un outil comme https://realfavicongenerator.net/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Créer un SVG simple comme icône
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c9922a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#07070f"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="url(#grad)"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="${size/4}" font-weight="bold" fill="#07070f">C</text>
</svg>`;
};

console.log('🎨 Génération des icônes PWA...\n');

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(publicDir, filename);
  
  // Pour ce script, on crée juste des fichiers SVG
  // Dans une vraie app, vous devriez convertir en PNG
  const svgFilename = `icon-${size}x${size}.svg`;
  const svgFilepath = path.join(publicDir, svgFilename);
  
  fs.writeFileSync(svgFilepath, createSVGIcon(size));
  console.log(`✅ Créé: ${svgFilename}`);
});

console.log('\n📝 Note: Les fichiers SVG ont été créés.');
console.log('Pour une app de production, convertissez-les en PNG avec un outil comme:');
console.log('- https://realfavicongenerator.net/');
console.log('- https://www.pwabuilder.com/imageGenerator');
console.log('- ImageMagick: convert icon.svg -resize 192x192 icon-192x192.png');

console.log('\n✨ Terminé!');
