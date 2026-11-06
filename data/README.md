# Données de LT-design app

| Fichier | Rôle |
|---|---|
| [`../data.json`](../data.json) | La base de l'app : 31 sorties de LT Design, une fiche par livrable (atelier e3-2) |
| [`schema.json`](schema.json) | Le schéma qui valide `data.json` (atelier S10-AV1) |
| [`../.vscode/settings.json`](../.vscode/settings.json) | Relie le schéma à `data.json` dans VS Code |
| [`data-avance.json`](data-avance.json) | Échantillon enrichi avec un lieu, des coordonnées GPS et des horaires (atelier S10-AV2) |

## Une fiche de `data.json`

| Champ | Type | Règle du schéma | Exemple |
|---|---|---|---|
| `id` | nombre entier | obligatoire, à partir de 1 | `1` |
| `titre` | texte | 3 à 60 caractères | `"Logo Portes ouvertes 2026"` |
| `projet` | texte | 2 à 60 caractères | `"Portes ouvertes 2026"` |
| `categorie` | texte | une des 5 catégories de leotache.ch | `"Des vrais clients"` |
| `type` | texte | 3 à 30 caractères | `"Logo"` |
| `annee` | nombre entier | de 2020 à 2100 | `2026` |
| `mois` | nombre entier | de 1 à 12 | `11` |
| `description` | texte | 20 à 300 caractères | `"Logo des portes ouvertes…"` |
| `estNouveau` | booléen | `true` affiche le badge « Nouveau » | `true` |
| `estCommande` | booléen | `true` pour un mandat réel | `true` |
| `tags` | tableau de textes | 1 à 6 mots-clés en minuscules, sans doublon | `["logo", "japon"]` |
| `image` | texte | commence par `https://` ou `images/`, finit par jpg, png, webp ou svg | `"https://leotache.ch/assets/riat/poster.jpg"` |
| `alt` | texte | 10 à 200 caractères, décrit l'image | `"Affiche de hockey sur glace…"` |
| `lien` | texte ou `null` | commence par `https://`, `null` si le projet n'est pas encore publié | `"https://leotache.ch/projet.html?p=riat"` |

Les 5 catégories : Des vrais clients, Projets fictifs, Affiches, Sport design, Édition & print.

## Ce que le schéma empêche

Le schéma suit la spécification JSON Schema **draft-07**. Tous les champs sont obligatoires et `additionalProperties: false` refuse toute clé inconnue : une faute de frappe dans un nom de clé est donc signalée au lieu de faire planter l'app sans message.

Erreurs testées volontairement sur une copie de `data.json`, toutes détectées :

| Erreur introduite | Message du validateur |
|---|---|
| Clé `titr` au lieu de `titre` | `Additional properties are not allowed ('titr' was unexpected)` |
| `"id": "1"` (texte au lieu d'un nombre) | `'1' is not of type 'integer'` |
| `"mois": 13` | `13 is greater than the maximum of 12` |
| `"categorie": "Logos"` | `'Logos' is not one of […]` |
| Champ `alt` supprimé | `'alt' is a required property` |
| `"tags": []` | `[] should be non-empty` |
| Tag `"Logo"` en majuscules | `'Logo' does not match […]` |
| `"lien": "leotache.ch"` | `'leotache.ch' does not match '^https://'` |
| Moins de 30 fiches | la liste est trop courte (`minItems: 30`) |

Résultat sur le vrai fichier : **31 fiches, 0 erreur**.

## Valider les données

**Dans VS Code (automatique).** Le fichier `.vscode/settings.json` relie `data.json` au schéma. Dès qu'une fiche ne respecte pas une règle, VS Code la souligne en rouge et affiche le message au survol. Rien à installer.

**Avec un validateur en ligne.** Coller `schema.json` à gauche et `data.json` à droite sur [jsonschemavalidator.net](https://www.jsonschemavalidator.net/).

**Ce que draft-07 ne vérifie pas.** Le schéma ne peut pas contrôler que deux fiches n'ont pas le même `id`. Pour le vérifier, ouvrir l'app, puis dans la console du navigateur (F12) :

```js
const d = await fetch("data.json").then(r => r.json());
d.length === new Set(d.map(f => f.id)).size // true : aucun id en double
```

## Images

Les images viennent de [leotache.ch](https://leotache.ch), comme sur l'écran d'accueil. Les 2 fiches du hackathon INV (ids 8 et 9) pointent vers `images/inv-logo.jpg` et `images/inv-charte.jpg` : ces fichiers sont à ajouter dans le dossier `images/` quand le projet sera prêt à être montré.

## Données avancées : lieu, coordonnées et horaires

[`data-avance.json`](data-avance.json) reprend deux fiches de `data.json` (mêmes `id`) et leur ajoute trois sous-objets. Ils préparent une future carte « Où voir LT Design en vrai ».

```json
"lieu": {
  "nom": "CPNV, site de Sainte-Croix",
  "role": "Le logo est visible sur place pendant les portes ouvertes de la médiamatique.",
  "adresse": "Avenue de la Gare 14",
  "commune": "Sainte-Croix",
  "coordonnees": { "lat": 46.82135, "lng": 6.50014 }
},
"periode": { "debut": "2026-11-28", "fin": "2026-11-28" },
"horaires": {
  "lundi": [],
  "samedi": [{ "ouverture": "09:00", "fermeture": "16:00" }]
}
```

| Sous-objet | Contenu | Règles |
|---|---|---|
| `lieu.coordonnees` | `lat` et `lng`, des nombres en degrés décimaux (WGS 84) | 5 décimales, soit environ 1 m de précision |
| `periode` | `debut` et `fin` au format `AAAA-MM-JJ` | `null` pour un lieu ouvert toute l'année |
| `horaires` | les 7 jours, chacun avec une liste de plages `{ "ouverture", "fermeture" }` au format `HH:MM` | liste vide = fermé ; plusieurs plages possibles le même jour (par exemple une pause de midi) |

| Fiche | Lieu | Horaires |
|---|---|---|
| 1 · Logo Portes ouvertes 2026 | CPNV, Sainte-Croix (46.82135, 6.50014) | samedi 28 novembre 2026, de 9 h à 16 h |
| 2 · Brochure Deuxième Peau | MAH, Genève (46.19936, 6.15164) | du mardi au dimanche de 11 h à 18 h, le jeudi de 12 h à 21 h, fermé le lundi |

**D'où viennent ces données**

- Coordonnées : recherche d'adresse du géoportail fédéral (map.geo.admin.ch).
- Portes ouvertes : date sur [cpnv.ch](https://www.cpnv.ch/po2026/), heures données par Léo (à confirmer quand le programme sera publié).
- MAH : horaires publiés sur [mahmah.ch](https://www.mahmah.ch/preparez-votre-visite/horaires-acces).
