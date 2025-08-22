#!/usr/bin/env node
// update-md.js
// Met à jour un Markdown avec une section "# Auto generated" listant les images du dossier ./images

const fs = require('fs');
const path = require('path');

const mdFile = path.join(__dirname, 'README.md');
const imagesFolder = path.join(__dirname, '../documentation/graph');

// Lire le contenu existant du fichier
let content = fs.existsSync(mdFile) ? fs.readFileSync(mdFile, 'utf8') : '';

// Supprimer une ancienne section "# Auto generated" si elle existe
content = content.replace(/\n?# Auto generated[\s\S]*$/m, '');

// Récupérer la liste des images
const files = fs.readdirSync(imagesFolder)
  .filter(f => !fs.statSync(path.join(imagesFolder, f)).isDirectory());

// Créer la nouvelle section auto-générée
let autoSection = '\n# Auto generated\n\n';
for (const file of files) {
  autoSection += `- [${file}](images/${file})\n`;
}

// Écrire le fichier avec la nouvelle section ajoutée
fs.writeFileSync(mdFile, content + autoSection, 'utf8');

console.log(`Section "# Auto generated" mise à jour dans ${path.basename(mdFile)} avec ${files.length} image(s).`);
