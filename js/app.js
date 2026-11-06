// s9 : filtres par catégorie, compteur et favoris de l'écran d'accueil (comme sur la maquette Nuit).
// s11 : vous collerez ici la recette fetch (e3-3).
// Ne créez pas un deuxième fichier JS. Ne passez pas en type="module".

(function () {
  "use strict";

  // ---------- Les éléments de la page ----------
  const cartes = Array.from(document.querySelectorAll(".carte"));
  const filtres = document.querySelector(".filtres");
  const boutonsFiltre = Array.from(document.querySelectorAll(".filtre"));
  const compte = document.getElementById("compte");
  const vide = document.getElementById("vide");
  const titre = document.getElementById("titre-page");
  const intro = document.getElementById("intro-texte");
  const lienFavoris = document.querySelector(".lien-favoris");

  // Ces éléments n'ont de sens qu'avec JavaScript : ils sont cachés dans le HTML et on les montre ici.
  filtres.hidden = false;
  lienFavoris.hidden = false;
  document.querySelectorAll(".carte-favori").forEach(function (bouton) { bouton.hidden = false; });

  // ---------- Les favoris, gardés dans le navigateur ----------
  const CLE = "lt-favoris";

  function lireFavoris() {
    try {
      return new Set(JSON.parse(localStorage.getItem(CLE)) || []);
    } catch (erreur) {
      return new Set(); // navigation privée ou stockage bloqué : on repart d'une liste vide
    }
  }

  function enregistrerFavoris() {
    try {
      localStorage.setItem(CLE, JSON.stringify(Array.from(favoris)));
    } catch (erreur) {
      // le favori reste actif jusqu'à la fermeture de la page
    }
  }

  const favoris = lireFavoris();
  let filtreActif = "tout";

  // ---------- Affichage ----------
  function vueFavoris() {
    return location.hash === "#favoris";
  }

  function mettreAJour() {
    const seulementFavoris = vueFavoris();
    let visibles = 0;

    cartes.forEach(function (carte) {
      const id = carte.dataset.id;
      const bonneCategorie = filtreActif === "tout" || carte.dataset.categorie === filtreActif;
      const bonFavori = !seulementFavoris || favoris.has(id);
      carte.hidden = !(bonneCategorie && bonFavori);
      if (!carte.hidden) visibles++;

      const coeur = carte.querySelector(".carte-favori");
      coeur.setAttribute("aria-pressed", String(favoris.has(id)));
    });

    compte.textContent = visibles === 0 ? "Aucune sortie" : visibles + (visibles > 1 ? " sorties" : " sortie");
    vide.hidden = !(seulementFavoris && visibles === 0);

    titre.textContent = seulementFavoris ? "Mes favoris" : "Dernières sorties";
    intro.textContent = seulementFavoris
      ? "Les sorties que tu as gardées avec le cœur."
      : "Les nouveaux projets de LT Design, du plus récent au plus ancien.";
    document.title = (seulementFavoris ? "Mes favoris" : "Dernières sorties") + " | LT-design app";
    if (seulementFavoris) lienFavoris.setAttribute("aria-current", "page");
    else lienFavoris.removeAttribute("aria-current");
  }

  // ---------- Filtres ----------
  boutonsFiltre.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      filtreActif = bouton.dataset.filtre;
      boutonsFiltre.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === bouton));
      });
      mettreAJour();
    });
  });

  // ---------- Cœur sur chaque carte ----------
  cartes.forEach(function (carte) {
    const coeur = carte.querySelector(".carte-favori");
    coeur.addEventListener("click", function () {
      const id = carte.dataset.id;
      if (favoris.has(id)) favoris.delete(id);
      else favoris.add(id);
      enregistrerFavoris();
      mettreAJour();
    });
  });

  // ---------- Passage entre « Dernières sorties » et « Mes favoris » ----------
  window.addEventListener("hashchange", function () {
    if (location.hash === "#contenu") return; // lien « Aller au contenu »
    mettreAJour();
    titre.focus();
  });

  // Le lien « Voir toutes les sorties » de l'état vide revient à la liste complète
  vide.querySelector("a").addEventListener("click", function (evenement) {
    evenement.preventDefault();
    history.pushState(null, "", location.pathname);
    mettreAJour();
    titre.focus();
  });
  window.addEventListener("popstate", mettreAJour);

  mettreAJour();
})();
