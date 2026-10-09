# Propositions de design · LT-design app

Trois directions visuelles générées avec l'IA à partir du [brief](../../../brief.md), du [persona](../persona.md) et du [user flow](../user-flow.md). Chacune est archivée en image (planche des écrans à 390 px) et en prototype cliquable.

| Proposition | Image | Prototype | Départ du flow |
|---|---|---|---|
| 01 · Nuit | [01-nuit.png](01-nuit.png) | [01-nuit/index.html](01-nuit/index.html) | [01-nuit/notification.html](01-nuit/notification.html) |
| 02 · Épreuve | [02-epreuve.png](02-epreuve.png) | [02-epreuve/index.html](02-epreuve/index.html) | [02-epreuve/notification.html](02-epreuve/notification.html) |
| 03 · Match | [03-match.png](03-match.png) | [03-match/index.html](03-match/index.html) | [03-match/notification.html](03-match/notification.html) |

![Proposition 01 · Nuit](01-nuit.png)
![Proposition 02 · Épreuve](02-epreuve.png)
![Proposition 03 · Match](03-match.png)

## Comment tester un prototype

1. Ouvrir `notification.html` dans le navigateur, en vue mobile (390 px de large dans les outils de développement) ou sur un téléphone.
2. Toucher la notification : l'app s'ouvre directement sur la fiche « Affiche FC Sion 2026 ».
3. Le lien de la notification remet le prototype à zéro (favoris, sorties vues, badge). On peut aussi ajouter `?reset` à l'adresse de `index.html`.

## Organisation des fichiers

- `commun/` : ce qui est partagé par les 3 propositions. `data.js` contient les données inventées et le générateur de visuels, `app.js` la logique du flow, `base.css` la base accessible commune et `fonts/` les polices.
- `01-nuit/`, `02-epreuve/`, `03-match/` : `index.html`, `notification.html` et le `style.css` propre à chaque direction.

Les 3 propositions ont la même structure HTML et le même JavaScript : elles ne diffèrent que par leur CSS. La comparaison de la [critique](../critique.md) porte donc sur la direction visuelle.

## Données et polices

- Les sorties, les textes et les visuels (affiches abstraites générées en SVG) sont **inventés** pour le prototype. Ils seront remplacés par les vrais projets de LT Design.
- Polices TeX Gyre Heros, Heros Cn et Adventor, sous [licence GUST](commun/fonts/GUST-FONT-LICENSE.txt) (libre, redistribution autorisée). Elles sont hébergées dans le dépôt, sans appel à Google Fonts.
- HTML, CSS et JavaScript natifs, sans framework (voir les interdits du brief).
