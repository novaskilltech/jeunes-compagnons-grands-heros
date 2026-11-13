# Jeunes Compagnons, Grands Héros

Page de partage officielle du livre de **l’Institut de l’Excellence** (édition commentée, 47 pages).

Le dépôt contient une page web statique responsive et autonome : couverture, aperçu OpenGraph, présentation des huit compagnons et PDF offert au téléchargement. Aucun compte, backend, ni service tiers n'est nécessaire.

## Déploiement Vercel

1. Dans Vercel, **Add New → Project**, importer ce dépôt GitHub.
2. Laisser le framework **Other** (site statique). Le fichier `vercel.json` gère la commande de compilation `npm run build` et le dossier de sortie `dist`.
3. Cliquer sur **Deploy**. Le site et le PDF sont publiés ensemble.
4. Partager l’URL de production qui sera créée par Vercel.

### Prévisualisation des liens (OpenGraph)

La compilation insère automatiquement l'URL publique dans `og:url`, `og:image`, `twitter:image` et le lien canonique, en priorité à partir de `SITE_URL`, puis de `VERCEL_PROJECT_PRODUCTION_URL`, et enfin de `VERCEL_URL`.

Pour utiliser un domaine personnalisé, renseigner `SITE_URL=https://votre-domaine.fr` dans **Vercel → Project → Settings → Environment Variables**, puis redéployer. Vérifier l’aperçu via le [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) ou une publication test WhatsApp.

## Développement local

```bash
npm run build
```

Ouvrir le fichier `dist/index.html` après la compilation (les boutons de partage nécessitent une URL HTTP/HTTPS). Les fichiers de sortie sont reconstruits lors des déploiements, ne pas les versionner.

## Arborescence

- `index.html` : page web source
- `assets/couverture.jpg` : visuel du livre
- `assets/miniature-og.jpg` : miniature 1200×630
- `assets/livre.pdf` : ouvrage complet à télécharger
- `assets/favicon.svg` : icône de l’éditeur
- `scripts/build.mjs` : préparation des métadonnées OpenGraph
- `vercel.json` : configuration Vercel

© 2026 Institut de l’Excellence. Veiller à vérifier les droits de diffusion et les sources de l’ouvrage avant une publication publique.