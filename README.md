# Jeunes Compagnons, Grands Héros

Page de partage gratuite du livre de **l’Institut de l’Excellence**, collection « Héritages et modèles ».

## Publier sur Vercel

1. Importer le dépôt GitHub dans **Vercel → Add New → Project**.
2. Le projet est statique (**Framework preset : Other**). Build command : `npm run build` ; output directory : `dist` (géré par `vercel.json`).
3. Cliquer **Deploy**. Les pages, images et PDF sont produits ensemble pendant la compilation.
4. Facultatif : configurer la variable `SITE_URL=https://votre-domaine.fr`, puis redéployer, pour fixer les métadonnées de partage.

## Fichiers

- `index.html` — page de partage responsive, avec boutons de réseaux sociaux
- `assets/couverture.svg` — visuel vectoriel de couverture
- `assets/miniature-og.svg` — miniature vectorielle 1200×630, convertie en JPEG pour l’OpenGraph
- `assets/favicon.svg` — favicon
- `manuscrit.md` — texte complet de la réédition commentée
- `scripts/generer-pdf.mjs` — génère un PDF A5 à partir du manuscrit Markdown
- `scripts/build.mjs` — assemble le site, les images et le PDF
- `package.json`, `vercel.json` — configuration du déploiement

**Important :** les visuels et le PDF sont *reconstruits depuis les sources textuelles du dépôt* pendant la compilation. Pour conserver **à l’identique** la couverture illustrée et la maquette PDF originale, ajouter les trois fichiers binaires originaux depuis l’archive fournie dans ChatGPT : `assets/couverture.jpg`, `assets/miniature-og.jpg` et `assets/livre.pdf`. Le build conserve et utilise automatiquement ces fichiers lorsqu'ils sont présents. Le contenu éditorial reste identique dans la version PDF reconstruite, mais la pagination et la mise en page peuvent différer.

© 2026 Institut de l’Excellence. La diffusion gratuite de l’ouvrage n'exonère pas de la vérification des sources et des droits avant publication.