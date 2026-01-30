# Guide de Génération des Livrables

Ce dossier contient toute la documentation technique de **Cyber Solution** sous forme de fichiers Markdown. Voici comment générer les formats PNG (pour les diagrammes UML) et PDF (pour la documentation complète).

---

## 📁 Fichiers Disponibles

1. **UML-Diagrams.md** - Tous les diagrammes UML (classes, séquence, activité, composants)
2. **MCD-MLD.md** - Modèle Conceptuel et Logique de Données
3. **MVP-Technologies.md** - Choix et justification des technologies
4. **Documentation-Technique.md** - Documentation technique complète (90+ pages)

---

## 🖼️ Génération des Diagrammes PNG

Les diagrammes sont écrits en **Mermaid** (syntaxe Markdown). Plusieurs options pour les convertir en PNG :

### Option 1: Mermaid Live Editor (En ligne - Recommandé)

1. Ouvrir https://mermaid.live
2. Copier-coller un diagramme depuis `UML-Diagrams.md`
3. Cliquer sur **"Actions"** → **"PNG"** ou **"SVG"**
4. Télécharger l'image

**Exemple:**
```
1. Copier le diagramme de classes (lignes 6-78)
2. Coller dans Mermaid Live
3. Exporter en PNG
4. Nommer: "diagramme-classes.png"
```

---

### Option 2: Mermaid CLI (Ligne de Commande)

```bash
# 1. Installer Mermaid CLI
npm install -g @mermaid-js/mermaid-cli

# 2. Extraire chaque diagramme dans un fichier .mmd
# Exemple: diagramme-classes.mmd contient uniquement le code Mermaid

# 3. Générer PNG
mmdc -i diagramme-classes.mmd -o diagramme-classes.png -w 1920 -H 1080 -b white

# Générer tous les diagrammes:
mmdc -i UML-Diagrams.md -o diagrams/ -w 1920 -H 1080 -b white
```

**Paramètres:**
- `-w 1920`: Largeur 1920px (Full HD)
- `-H 1080`: Hauteur 1080px
- `-b white`: Fond blanc
- `-t dark`: Thème sombre (optionnel)

---

### Option 3: VS Code Extension

1. Installer extension **"Markdown Preview Mermaid Support"**
2. Ouvrir `UML-Diagrams.md` dans VS Code
3. Cliquer sur **Preview** (Ctrl+Shift+V)
4. Clic droit sur diagramme → **"Copy as PNG"**
5. Coller dans un fichier image

---

### Option 4: Draw.io (Conversion Manuelle)

1. Ouvrir https://app.diagrams.net
2. Importer fichier Mermaid (ou dessiner manuellement)
3. Exporter en PNG (File → Export as → PNG)

---

## 📄 Génération des PDF

### Option 1: Markdown to PDF (VS Code Extension) - Recommandé

1. Installer extension **"Markdown PDF"** dans VS Code
2. Ouvrir `Documentation-Technique.md`
3. Clic droit → **"Markdown PDF: Export (pdf)"**
4. Le PDF est généré automatiquement

**Configuration (settings.json):**
```json
{
  "markdown-pdf.format": "A4",
  "markdown-pdf.displayHeaderFooter": true,
  "markdown-pdf.headerTemplate": "<div style='font-size:9px; text-align:center; width:100%;'>Cyber Solution - Documentation Technique</div>",
  "markdown-pdf.footerTemplate": "<div style='font-size:9px; text-align:center; width:100%;'>Page <span class='pageNumber'></span> sur <span class='totalPages'></span></div>",
  "markdown-pdf.margin": {
    "top": "1.5cm",
    "bottom": "1.5cm",
    "left": "2cm",
    "right": "2cm"
  }
}
```

---

### Option 2: Pandoc (Ligne de Commande)

```bash
# 1. Installer Pandoc
# Windows: choco install pandoc
# Mac: brew install pandoc
# Linux: sudo apt install pandoc

# 2. Installer LaTeX (pour PDF de qualité)
# Windows: https://miktex.org/download
# Mac: brew install --cask mactex
# Linux: sudo apt install texlive-full

# 3. Générer PDF
pandoc Documentation-Technique.md -o Documentation-Technique.pdf --pdf-engine=xelatex

# Avec table des matières et numérotation:
pandoc Documentation-Technique.md -o Documentation-Technique.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  --highlight-style=tango \
  -V geometry:margin=2cm \
  -V fontsize=11pt \
  -V documentclass=report

# Générer tous les PDF:
pandoc UML-Diagrams.md -o UML-Diagrams.pdf --pdf-engine=xelatex --toc
pandoc MCD-MLD.md -o MCD-MLD.pdf --pdf-engine=xelatex --toc
pandoc MVP-Technologies.md -o MVP-Technologies.pdf --pdf-engine=xelatex --toc
pandoc Documentation-Technique.md -o Documentation-Technique.pdf --pdf-engine=xelatex --toc
```

---

### Option 3: Markdown to PDF (En ligne)

1. Ouvrir https://www.markdowntopdf.com
2. Copier-coller contenu de `Documentation-Technique.md`
3. Cliquer **"Convert"**
4. Télécharger le PDF

**Limitations:** Diagrammes Mermaid ne seront pas rendus (uniquement code)

---

### Option 4: Print to PDF (Navigateur)

1. Ouvrir `Documentation-Technique.md` dans GitHub ou VS Code Preview
2. Utiliser extension **"Markdown Preview Enhanced"**
3. Clic droit → **"Chrome (Puppeteer)"** → **"PDF"**
4. Ou ouvrir preview dans navigateur et **Ctrl+P** → **"Save as PDF"**

---

## 📊 Génération du MCD/MLD (Diagrammes Entités-Relations)

Les diagrammes ER sont en **Mermaid ERD**. Pour les rendre :

### Option 1: Mermaid Live (Recommandé)

1. Ouvrir https://mermaid.live
2. Copier le diagramme ER depuis `MCD-MLD.md` (lignes 6-80)
3. Exporter en PNG/SVG

### Option 2: Draw.io / Lucidchart

1. Ouvrir https://app.diagrams.net ou https://lucidchart.com
2. Créer nouveau diagramme ER
3. Dessiner manuellement depuis `MCD-MLD.md`
4. Exporter PNG/PDF

### Option 3: MySQL Workbench (Si migration PostgreSQL)

```bash
# 1. Installer MySQL Workbench
# 2. Créer modèle depuis schéma SQL
# 3. File → Export → Export as PNG

# Ou générer depuis SQLite:
sqlite3 cyber-solution.db .schema > schema.sql
# Importer dans Workbench → Reverse Engineer
```

---

## 🎨 Exemple de Workflow Complet

```bash
# 1. Cloner repository
git clone https://github.com/username/cyber-solution.git
cd cyber-solution/docs

# 2. Générer tous les diagrammes PNG
npm install -g @mermaid-js/mermaid-cli
mmdc -i UML-Diagrams.md -o output/diagrams/ -w 1920 -H 1080 -b white

# 3. Générer tous les PDF
pandoc UML-Diagrams.md -o output/UML-Diagrams.pdf --pdf-engine=xelatex --toc
pandoc MCD-MLD.md -o output/MCD-MLD.pdf --pdf-engine=xelatex --toc
pandoc MVP-Technologies.md -o output/MVP-Technologies.pdf --pdf-engine=xelatex --toc
pandoc Documentation-Technique.md -o output/Documentation-Technique.pdf --pdf-engine=xelatex --toc --number-sections

# 4. Structure finale:
# output/
# ├─ diagrams/
# │  ├─ diagramme-classes.png
# │  ├─ diagramme-sequence-audit.png
# │  ├─ diagramme-sequence-formation.png
# │  ├─ diagramme-activite.png
# │  └─ diagramme-composants.png
# ├─ UML-Diagrams.pdf
# ├─ MCD-MLD.pdf
# ├─ MVP-Technologies.pdf
# └─ Documentation-Technique.pdf
```

---

## 📦 Outils Recommandés

| Outil | Usage | Installation |
|-------|-------|--------------|
| **Mermaid CLI** | Générer PNG depuis Mermaid | `npm i -g @mermaid-js/mermaid-cli` |
| **Pandoc** | Markdown vers PDF | https://pandoc.org/installing.html |
| **MiKTeX / MacTeX** | Engine PDF pour Pandoc | https://miktex.org / https://tug.org/mactex |
| **VS Code + Extensions** | Preview Markdown + Export | Extensions: Markdown PDF, Mermaid Support |
| **Draw.io Desktop** | Éditer diagrammes manuellement | https://github.com/jgraph/drawio-desktop/releases |

---

## ✅ Checklist de Génération

- [ ] **UML-Diagrams.md → PNG**
  - [ ] Diagramme de Classes
  - [ ] Diagramme de Séquence (Audit)
  - [ ] Diagramme de Séquence (Formation)
  - [ ] Diagramme d'Activité
  - [ ] Diagramme de Composants
  - [ ] Diagramme de Déploiement

- [ ] **MCD-MLD.md → PNG + PDF**
  - [ ] Diagramme ER (Entités-Relations)
  - [ ] Schéma relationnel
  - [ ] PDF complet

- [ ] **MVP-Technologies.md → PDF**
  - [ ] Documentation choix technologies (50+ pages)

- [ ] **Documentation-Technique.md → PDF**
  - [ ] Documentation complète (90+ pages)
  - [ ] Table des matières
  - [ ] Numérotation sections

---

## 🔧 Troubleshooting

### Erreur: "mmdc: command not found"
```bash
# Réinstaller Mermaid CLI
npm uninstall -g @mermaid-js/mermaid-cli
npm install -g @mermaid-js/mermaid-cli@latest

# Ou utiliser npx:
npx @mermaid-js/mermaid-cli -i UML-Diagrams.md -o output/
```

### Erreur: "pandoc: command not found"
```bash
# Windows (Chocolatey):
choco install pandoc

# Mac (Homebrew):
brew install pandoc

# Linux (APT):
sudo apt update
sudo apt install pandoc texlive-xetex
```

### Diagrammes Mermaid non rendus dans PDF
```bash
# Solution: Utiliser Mermaid CLI pour générer PNG d'abord
mmdc -i UML-Diagrams.md -o diagrams/
# Puis insérer images dans Markdown:
# ![Diagramme Classes](diagrams/diagramme-classes.png)
```

### PDF sans styles / formatage
```bash
# Installer LaTeX engine complet:
# Windows: MiKTeX (https://miktex.org)
# Mac: MacTeX (sudo brew install --cask mactex)
# Linux: sudo apt install texlive-full

# Puis utiliser xelatex:
pandoc doc.md -o doc.pdf --pdf-engine=xelatex
```

---

## 📝 Notes

- **Diagrammes Mermaid** : Si certains ne s'affichent pas correctement, vérifier la syntaxe sur https://mermaid.live
- **Taille PDF** : Documentation complète fait ~5-10 MB selon les images incluses
- **Qualité Images** : PNG recommandé pour diagrammes, résolution 1920x1080 minimum pour impression
- **Liens Hypertextes** : Pandoc génère automatiquement les liens internes dans le PDF (table des matières cliquable)

---

**Pour toute question:** dpo@cyber-solution.fr

**Dernière mise à jour:** 28 Janvier 2026
