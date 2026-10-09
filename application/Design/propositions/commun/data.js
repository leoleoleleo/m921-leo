/* Données inventées pour le prototype LT-design app.
   Les visuels sont des affiches abstraites générées en SVG : à remplacer par les vrais visuels de LT Design. */
"use strict";

const CATEGORIES = { affiche: "Affiche", identite: "Identité", sport: "Sport design" };

const SORTIES = [
  {
    id: "fc-sion-2026", numero: 24, titre: "Affiche FC Sion 2026", categorie: "sport",
    date: "2026-10-08", nouveau: true,
    format: "F4, 89,5 × 128 cm", technique: "Impression numérique",
    description: "Affiche de début de saison. Le rouge et le blanc se répondent dans un grand cercle en mouvement, comme un ballon qui file vers le but.",
    alt: "Grand cercle blanc en mouvement sur fond rouge, titre SION 2026",
    motif: "cercle", palette: ["#C8102E", "#FFFFFF", "#1A1A1A", "#FFFFFF"], texte: ["SION", "2026"]
  },
  {
    id: "brume-cafe", numero: 23, titre: "Identité Brume Café", categorie: "identite",
    date: "2026-09-24", nouveau: false,
    format: "Logo, cartes, gobelets", technique: "Identité visuelle",
    description: "Identité pour un petit café de quartier. Une grille de tasses vues du dessus, dont une seule fume encore : celle qu'on vient de servir.",
    alt: "Grille de cercles ardoise sur fond clair, un cercle jaune, titre BRUME CAFÉ",
    motif: "grille", palette: ["#E6E2DA", "#2F3E46", "#D9A21B", "#2F3E46"], texte: ["BRUME", "CAFÉ"]
  },
  {
    id: "nuit-du-basket", numero: 22, titre: "Affiche Nuit du basket", categorie: "sport",
    date: "2026-09-10", nouveau: false,
    format: "A2, 42 × 59,4 cm", technique: "Sérigraphie deux couleurs",
    description: "Tournoi de basket en salle qui dure toute la nuit. Les diagonales reprennent les lignes du terrain sous les projecteurs.",
    alt: "Bandes diagonales et ballon orange sur fond bleu nuit, titre NUIT DU BASKET",
    motif: "diagonales", palette: ["#17133B", "#FF6B1A", "#F2F2F2", "#F2F2F2"], texte: ["NUIT DU", "BASKET"]
  },
  {
    id: "atelier-vire", numero: 21, titre: "Charte graphique Atelier Vire", categorie: "identite",
    date: "2026-08-28", nouveau: false,
    format: "Charte de 24 pages", technique: "Identité visuelle",
    description: "Charte pour un atelier de menuiserie. Les quarts de cercle rappellent les copeaux et les courbes du bois travaillé.",
    alt: "Quarts de cercle verts et orange sur fond clair, titre ATELIER VIRE",
    motif: "arcs", palette: ["#F0EEE6", "#2D6A4F", "#E07A5F", "#1F3B2D"], texte: ["ATELIER", "VIRE"]
  },
  {
    id: "les-echos", numero: 20, titre: "Affiche concert Les Échos", categorie: "affiche",
    date: "2026-08-12", nouveau: false,
    format: "F4, 89,5 × 128 cm", technique: "Impression numérique",
    description: "Affiche pour un concert en plein air. Les cercles concentriques partent du centre comme le son qui rebondit dans la vallée.",
    alt: "Cercles concentriques roses et violets sur fond sombre, titre LES ÉCHOS",
    motif: "ondes", palette: ["#140C30", "#F72585", "#8A3FFC", "#F7F2FF"], texte: ["LES", "ÉCHOS"]
  },
  {
    id: "trail-chasseron", numero: 19, titre: "Affiche Trail du Chasseron", categorie: "affiche",
    date: "2026-07-30", nouveau: false,
    format: "A1, 59,4 × 84,1 cm", technique: "Impression numérique",
    description: "Affiche pour une course en montagne au-dessus de Sainte-Croix. Le tracé jaune suit la crête jusqu'au sommet.",
    alt: "Montagne stylisée et tracé jaune sur fond bleu pétrole, titre TRAIL DU CHASSERON",
    motif: "montagne", palette: ["#0E2A3B", "#F4D35E", "#EE964B", "#F4F1E8"], texte: ["TRAIL DU", "CHASSERON"]
  }
];

/* ---------- Génération des visuels ---------- */

const VARIANTES = ["l'affiche complète", "détail du motif", "l'affiche accrochée au mur", "détail du titre", "variante de couleur"];
const NB_IMAGES = VARIANTES.length;

function motifSVG(s, bg, a, b) {
  switch (s.motif) {
    case "cercle":
      return `<circle cx="330" cy="300" r="215" fill="${a}"/>
        <circle cx="395" cy="265" r="120" fill="${bg}"/>
        <g fill="${a}"><rect x="0" y="210" width="90" height="18"/><rect x="0" y="260" width="60" height="18"/><rect x="0" y="310" width="100" height="18"/><rect x="0" y="360" width="40" height="18"/></g>
        <circle cx="395" cy="265" r="34" fill="${b}"/>`;
    case "grille": {
      let g = "";
      for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
        const cx = 105 + x * 130, cy = 95 + y * 120, special = x === 2 && y === 1;
        g += `<circle cx="${cx}" cy="${cy}" r="44" fill="${special ? b : a}"/>`;
        if (special) g += `<path d="M${cx - 14} ${cy - 62} q 10 -16 0 -32 M${cx + 6} ${cy - 62} q 10 -16 0 -32" stroke="${a}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      }
      return g;
    }
    case "diagonales":
      return `<g transform="rotate(-24 300 300)"><rect x="-200" y="120" width="1000" height="34" fill="${b}"/><rect x="-200" y="200" width="1000" height="12" fill="${b}"/><rect x="-200" y="430" width="1000" height="22" fill="${b}"/></g>
        <circle cx="390" cy="300" r="150" fill="${a}"/>
        <path d="M240 300 h300 M390 150 v300 M285 195 q105 105 0 210 M495 195 q-105 105 0 210" stroke="${bg}" stroke-width="9" fill="none"/>`;
    case "arcs": {
      let g = "";
      const rot = [0, 90, 180, 270, 90, 0, 270, 180, 180, 270, 0, 90];
      for (let i = 0; i < 12; i++) {
        const x = 60 + (i % 3) * 160, y = 40 + Math.floor(i / 3) * 120;
        g += `<path d="M0 0 h150 a150 150 0 0 1 -150 110 z" transform="translate(${x + 75} ${y + 55}) rotate(${rot[i]}) translate(-75 -55)" fill="${i % 4 === 1 ? b : a}"/>`;
      }
      return g;
    }
    case "ondes": {
      let g = "";
      for (let i = 9; i > 0; i--) g += `<circle cx="300" cy="300" r="${i * 30}" fill="none" stroke="${i % 2 ? a : b}" stroke-width="${i % 3 === 0 ? 14 : 6}"/>`;
      return g + `<circle cx="300" cy="300" r="16" fill="${a}"/>`;
    }
    case "montagne":
      return `<path d="M0 520 L170 250 L250 360 L370 140 L600 520 Z" fill="${b}" opacity=".9"/>
        <path d="M60 470 L170 300 L245 400 L370 190 L470 330" stroke="${a}" stroke-width="10" fill="none" stroke-linejoin="round" stroke-dasharray="26 14"/>
        <circle cx="370" cy="190" r="16" fill="${a}"/>`;
    default:
      return "";
  }
}

function afficheSVG(s, inverse) {
  let [bg, a, b, ink] = s.palette;
  if (inverse) [bg, a] = [a, bg];
  if (inverse && s.motif !== "cercle") ink = s.palette[0];
  const lignes = s.texte.map((t, i) =>
    `<text x="40" y="${640 + i * 92}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${t.length > 7 ? 74 : 96}" letter-spacing="-3" fill="${ink}">${t}</text>`).join("");
  return `<rect width="600" height="800" fill="${bg}"/>${motifSVG(s, bg, a, b)}${lignes}
    <text x="560" y="772" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="${ink}" opacity=".8">LT DESIGN</text>`;
}

const cacheVisuels = new Map();

function visuel(s, i = 0) {
  const cle = s.id + i;
  if (cacheVisuels.has(cle)) return cacheVisuels.get(cle);
  let svg;
  if (i === 2) {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
      <rect width="600" height="800" fill="#D8D5CF"/><rect y="610" width="600" height="190" fill="#B9B4AB"/>
      <rect x="168" y="138" width="270" height="360" fill="#000" opacity=".18"/>
      <svg x="160" y="128" width="270" height="360" viewBox="0 0 600 800">${afficheSVG(s)}</svg></svg>`;
  } else {
    const vues = ["0 0 600 800", "120 60 420 560", "", "0 520 360 280", "0 0 600 800"];
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vues[i]}" preserveAspectRatio="xMidYMid slice">${afficheSVG(s, i === 4)}</svg>`;
  }
  const uri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.replace(/\s{2,}/g, " "));
  cacheVisuels.set(cle, uri);
  return uri;
}

function texteAlt(s, i = 0) {
  return i === 0 ? s.alt : `${s.titre}, ${VARIANTES[i]}`;
}
