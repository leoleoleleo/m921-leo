# Brief · LT-design app

## Pitch

LT-design app est une application web mobile qui permet de suivre toutes les nouvelles sorties de LT Design (affiches, identités visuelles, sport design). Une notification annonce chaque nouvelle sortie et ouvre directement sa fiche, pour voir le projet en quelques secondes, le garder en favori ou le partager.

## Public

Benjamin Favre, 20 ans, étudiant en communication visuelle en Suisse romande et fan de LT Design. Il utilise uniquement son smartphone, arrive presque toujours dans l'app par une notification et partage souvent les visuels qu'il aime sur Instagram. Voir le [persona](application/Design/persona.md) et le [user flow](application/Design/user-flow.md).

## Écrans

- Écran 1 : Notification (hors de l'app)
- Écran 2 : Fiche sortie
- Écran 3 : Image en plein écran
- Écran 4 : Accueil « Dernières sorties »

## Contenu de chaque écran

### Écran 1 · Notification
- On y voit : le nom de l'app, « Nouvelle sortie LT Design » et le titre du projet (ex. « Affiche FC Sion 2026 »).
- On peut y faire : toucher la notification pour ouvrir la sortie.
- Bouton principal : la notification elle-même

### Écran 2 · Fiche sortie
- On y voit : le visuel principal en grand, le titre, la catégorie, la date, une courte description et la galerie d'images.
- Catégories, les mêmes que sur le portfolio : Des vrais clients, Projets fictifs, Affiches, Sport design, Édition & print.
- On peut y faire : faire défiler la galerie, ouvrir une image, ajouter aux favoris, partager, revenir à l'accueil.
- Bouton principal : « Ajouter aux favoris » (cœur)

### Écran 3 · Image en plein écran
- On y voit : une image de la galerie sur fond sombre, sa position (ex. 2 / 5).
- On peut y faire : zoomer, passer à l'image suivante ou précédente, fermer.
- Bouton principal : « Fermer »

### Écran 4 · Accueil « Dernières sorties »
- On y voit : la liste des sorties de la plus récente à la plus ancienne (vignette, titre, catégorie, date), avec un badge « Nouveau » sur les sorties pas encore vues.
- On peut y faire : ouvrir une sortie, filtrer par catégorie, accéder aux favoris.
- Bouton principal : la carte de la sortie (ouvre la fiche)
- Intégré dans [index.html](index.html) : sortie à la une, filtres par catégorie, compteur de sorties et favoris (cœur sur chaque carte, gardés dans le navigateur, vue « Mes favoris »). La recherche arrive en semaine 12.

## Ambiance visuelle

Sombre et sobre, comme une galerie : l'interface s'efface pour laisser toute la place aux visuels de LT Design. Grands titres, peu d'éléments décoratifs. Le bleu LT Design sert uniquement d'accent (badge « Nouveau », favoris, bouton principal).

L'app reprend l'identité du portfolio [leotache.ch](https://leotache.ch) : mêmes couleurs, mêmes polices, mêmes catégories. Un fan passe de l'un à l'autre sans changer d'univers.

## Typographie

- Titres : Archivo Black, en capitales
- Texte : Roboto
- Étiquettes (catégorie, date, navigation) : Roboto Mono, en capitales espacées

## Palette

Règle 60-30-10, avec les valeurs de leotache.ch :

- Fond, 60 % : `#0d0d0f`
- Surfaces et texte, 30 % : surface `#18181b`, texte `#f2f2f2` (17,3:1 sur le fond), texte secondaire `rgba(242, 242, 242, .7)` (8,7:1 sur le fond)
- Accent, 10 % : `#189CD8`, bleu LT Design (6,3:1 sur le fond). Texte sur fond bleu toujours en `#0d0d0f` : le blanc sur ce bleu ne passe pas l'AA (3,1:1).
- Attention / erreur : `#FF6B5E` (7:1 sur le fond)

## Interdits

- pas de Bootstrap
- pas de React
- pas de framework
- pas de compte obligatoire pour voir les sorties
- pas de publicité
- pas de notification pour autre chose qu'une vraie nouvelle sortie
- pas de notification qui ouvre l'accueil au lieu de la sortie annoncée
- pas d'images floues : les visuels doivent rester nets en plein écran

## Contraintes techniques

- Mobile First
- largeur de référence : 390 px
- HTML5 sémantique
- CSS moderne avec variables
- JavaScript natif
- images optimisées (formats WebP ou AVIF, chargement différé dans la galerie)
- accessibilité WCAG AA : texte alternatif sur chaque visuel, navigation au clavier, contraste minimum de 4,5:1 pour le texte normal
- zones de toucher de 44 px minimum
