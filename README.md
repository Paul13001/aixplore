# Aixplore

Anciennement « Aix, capitale étudiante ». Site statique (HTML, CSS, JavaScript, sans base de données) : guide de la vie étudiante à Aix-en-Provence.
Projet « Développement d'interfaces Web » – IUT d'Aix-Marseille, 2026.

## Pages

| Fichier | Page |
|---|---|
| `index.html` | Accueil, vidéo, formulaire d'avis |
| `nightlife.html` | Soirées |
| `sports.html` | Sports |
| `deals.html` | Bons plans (avec filtre par catégorie) |
| `links.html` | Liens utiles et sources |

## Arborescence

```
index.html, nightlife.html, sports.html, deals.html, links.html
favicon.ico, robots.txt, sitemap.xml
assets/css/   style.css (thème « Provence ») et alternate.css (thème « Nuit électrique »)
              + leurs versions minifiées *.min.css, chargées par les pages
assets/js/    main.js (changement de style, menu mobile, formulaire, filtre, haut de page)
assets/img/   favicon, icône Apple, image de partage, affiche de la vidéo
assets/video/ vidéo + sous-titres WebVTT
tools/        minify-css.mjs (régénère les .min.css)
```

Après chaque modification d'un fichier CSS : `node tools/minify-css.mjs`.
Le script supprime aussi les variables CSS dans les `.min.css` (pour un validateur W3C sans avertissement).

## Points du sujet couverts

Favicon, meta description, menu permanent, liens externes (`links.html`), formulaire qui génère un e-mail,
vidéo sous-titrée, lien « Haut de page », changement de style en JavaScript (choix mémorisé),
site adaptatif (téléphone, tablette, ordinateur), balises sémantiques, accessibilité (lien d'évitement,
focus visible, libellés, `aria-*`), référencement (titres, descriptions, Open Graph, sitemap,
données structurées avec l'adresse du département informatique), CSS minifié et préfixé,
écoconception (pas de police ni de bibliothèque externe, vidéo chargée seulement au clic, images légères).

## À compléter avant le rendu

- [x] Adresse du formulaire : `aixplore.contact@gmail.com` (dans `index.html` et `assets/js/main.js`).
- [x] Adresse du site : `https://paul13001.github.io/aixplore/` (GitHub Pages), reportée dans toutes les pages, `robots.txt` et `sitemap.xml`.
- [x] Vidéo ajoutée : `assets/video/aix-capitale-etudiante.mp4`, 1 min 54, 960×540, 8 Mo.
  Vidéo d'origine (2 min 45) de la Ville d'Aix-en-Provence ; passages retirés : 0:30 → 1:10 (études)
  et 1:39 → 1:50 (nature), avec un court fondu sonore à chaque coupure.
- [x] Sous-titres : `assets/video/aix-capitale-etudiante.fr.vtt` (titres affichés à l'écran, musique, générique).
- [x] Son vérifié à l'écoute : musique seule, pas de voix (les sous-titres sont donc complets).
- [ ] Relire les contenus (chiffres, tarifs, lieux) sur les sites officiels.
