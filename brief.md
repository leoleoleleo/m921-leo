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

## Ambiance visuelle

Sombre et sobre, comme une galerie : l'interface s'efface pour laisser toute la place aux visuels de LT Design. Typographie grotesque, grands titres, peu d'éléments décoratifs. Le bleu LT Design sert uniquement d'accent (badge « Nouveau », favoris, bouton principal).

## Palette

- Fond : `#0F1115`
- Surface (cartes) : `#16191F`
- Texte : `#F2F4F7` (17,2:1 sur le fond)
- Texte secondaire : `#A7AFBA` (8,5:1 sur le fond)
- Accent : `#189CD8`, bleu LT Design (6,1:1 sur le fond). Texte sur fond bleu toujours en `#0F1115` : le blanc sur ce bleu ne passe pas l'AA (3,1:1).
- Attention / erreur : `#FF6B5E` (6,8:1 sur le fond)

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
