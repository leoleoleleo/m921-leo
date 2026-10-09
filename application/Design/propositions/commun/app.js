/* LT-design app : logique commune aux 3 propositions (JavaScript natif, sans framework). */
"use strict";

(() => {
  const FILTRES = [["tout", "Tout"], ["affiche", "Affiches"], ["identite", "Identités"], ["sport", "Sport design"]];
  const CLES = { favoris: "lt-favoris", vues: "lt-vues", badges: "lt-badges" };

  /* ---------- Stockage (le prototype marche aussi sans) ---------- */
  const stock = {
    lire(cle) { try { return JSON.parse(localStorage.getItem(cle)) || []; } catch { return []; } },
    ecrire(cle, valeur) { try { localStorage.setItem(cle, JSON.stringify([...valeur])); } catch { /* navigation privée */ } }
  };

  // ?reset remet le prototype à zéro (utile entre deux tests utilisateurs)
  if (new URLSearchParams(location.search).has("reset")) {
    try { Object.values(CLES).forEach(c => localStorage.removeItem(c)); } catch { /* rien à effacer */ }
    history.replaceState(null, "", location.pathname + location.hash);
  }

  const etat = {
    favoris: new Set(stock.lire(CLES.favoris)),
    vues: new Set(stock.lire(CLES.vues)),
    badgesRetires: new Set(stock.lire(CLES.badges)),
    filtre: "tout",
    premierAffichage: true
  };
  const sauver = () => {
    stock.ecrire(CLES.favoris, etat.favoris);
    stock.ecrire(CLES.vues, etat.vues);
    stock.ecrire(CLES.badges, etat.badgesRetires);
  };

  /* ---------- Outils ---------- */
  const $ = (sel, el = document) => el.querySelector(sel);
  const main = $("#contenu");
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dateLongue = iso => new Date(iso + "T12:00:00").toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" });
  const dateCourte = iso => new Date(iso + "T12:00:00").toLocaleDateString("fr-CH", { day: "numeric", month: "short" });
  const jour = iso => String(new Date(iso + "T12:00:00").getDate()).padStart(2, "0");
  const mois = iso => new Date(iso + "T12:00:00").toLocaleDateString("fr-CH", { month: "short" });
  const mouvementReduit = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  const icone = d => `<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
  const ICONES = {
    coeur: icone("M12 20.3s-7.4-4.5-9.2-9C1.6 8 3.6 4.6 7 4.6c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.4 3.4 4.2 6.7-1.8 4.5-9.2 9-9.2 9z"),
    partager: icone("M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"),
    retour: icone("M15 5l-7 7 7 7"),
    fermer: icone("M6 6l12 12M18 6L6 18"),
    precedent: icone("M15 5l-7 7 7 7"),
    suivant: icone("M9 5l7 7-7 7"),
    plus: icone("M12 6v12M6 12h12"),
    moins: icone("M6 12h12")
  };

  /* ---------- Toast (annonces) ---------- */
  const toast = $("#toast");
  let minuterieToast;
  function annoncer(message) {
    toast.textContent = message;
    toast.classList.add("est-visible");
    clearTimeout(minuterieToast);
    minuterieToast = setTimeout(() => toast.classList.remove("est-visible"), 2600);
  }

  /* ---------- Accueil et favoris ---------- */
  function carte(s, une) {
    const badge = s.nouveau && !etat.badgesRetires.has(s.id);
    return `<li class="sortie${une ? " sortie--une" : ""}" data-id="${s.id}">
      <a class="sortie-lien" href="#/sortie/${s.id}">
        <span class="sortie-image"><img src="${visuel(s)}" alt="" width="600" height="800"${une ? "" : ' loading="lazy"'}></span>
        <span class="sortie-titre">${esc(s.titre)}</span>
        <span class="sortie-meta">
          <span class="cat" data-cat="${s.categorie}">${CATEGORIES[s.categorie]}</span>
          <time class="sortie-date" datetime="${s.date}">${dateCourte(s.date)}</time>
        </span>
        <span class="sortie-num" aria-hidden="true">${s.numero}</span>
        <span class="sortie-jour" aria-hidden="true"><b>${jour(s.date)}</b> ${mois(s.date)}</span>
        ${badge ? '<span class="badge">Nouveau</span>' : ""}
        ${etat.favoris.has(s.id) ? `<span class="sortie-fav">${ICONES.coeur}<span class="visually-hidden">Dans tes favoris</span></span>` : ""}
      </a>
    </li>`;
  }

  function listeFiltree(favorisSeulement) {
    return SORTIES.filter(s =>
      (etat.filtre === "tout" || s.categorie === etat.filtre) &&
      (!favorisSeulement || etat.favoris.has(s.id)));
  }

  function htmlListe(favorisSeulement) {
    const liste = listeFiltree(favorisSeulement);
    if (!liste.length) {
      return favorisSeulement
        ? `<div class="vide"><p class="vide-titre">Pas encore de favori ici.</p>
             <p>Sur la fiche d'une sortie, touche « Ajouter aux favoris » pour la retrouver dans cette liste.</p>
             <a class="bouton bouton--secondaire" href="#/">Voir les dernières sorties</a></div>`
        : `<div class="vide"><p class="vide-titre">Aucune sortie dans cette catégorie.</p></div>`;
    }
    const une = !favorisSeulement && etat.filtre === "tout";
    return `<ol class="sorties">${liste.map((s, i) => carte(s, une && i === 0)).join("")}</ol>`;
  }

  function texteCompte(favorisSeulement) {
    const n = listeFiltree(favorisSeulement).length;
    return `${n} sortie${n > 1 ? "s" : ""}`;
  }

  function afficherAccueil(favorisSeulement) {
    document.title = (favorisSeulement ? "Mes favoris" : "Dernières sorties") + " | LT-design app";
    main.innerHTML = `
      <section class="accueil" aria-labelledby="titre-page">
        <h1 id="titre-page" class="titre-page" tabindex="-1">${favorisSeulement ? "Mes favoris" : "Dernières sorties"}</h1>
        <div class="filtres" role="group" aria-label="Filtrer par catégorie">
          ${FILTRES.map(([v, l]) => `<button type="button" class="filtre" data-filtre="${v}" aria-pressed="${etat.filtre === v}">${l}</button>`).join("")}
        </div>
        <p class="compte" id="compte" aria-live="polite">${texteCompte(favorisSeulement)}</p>
        <div class="liste" id="liste">${htmlListe(favorisSeulement)}</div>
      </section>`;

    main.querySelectorAll(".filtre").forEach(btn => btn.addEventListener("click", () => {
      etat.filtre = btn.dataset.filtre;
      main.querySelectorAll(".filtre").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      $("#liste").innerHTML = htmlListe(favorisSeulement);
      $("#compte").textContent = texteCompte(favorisSeulement);
      retirerBadgesVus();
    }));
    retirerBadgesVus();
  }

  // Une sortie déjà ouverte garde son badge un instant, puis il disparaît : elle est marquée comme vue.
  function retirerBadgesVus() {
    SORTIES.filter(s => s.nouveau && etat.vues.has(s.id) && !etat.badgesRetires.has(s.id)).forEach(s => {
      const badge = main.querySelector(`.sortie[data-id="${s.id}"] .badge`);
      if (!badge) return;
      setTimeout(() => {
        badge.classList.add("badge--sortie");
        setTimeout(() => badge.remove(), mouvementReduit() ? 0 : 400);
        etat.badgesRetires.add(s.id);
        sauver();
      }, 1600);
    });
  }

  /* ---------- Fiche sortie ---------- */
  function afficherFiche(s) {
    document.title = s.titre + " | LT-design app";
    etat.vues.add(s.id);
    sauver();
    main.innerHTML = `
      <div class="fiche">
        <nav class="fiche-nav" aria-label="Fil d'Ariane">
          <a class="retour" href="#/">${ICONES.retour}<span>Dernières sorties</span></a>
        </nav>
        <article class="fiche-article" aria-labelledby="titre-page">
          <div class="fiche-visuel">
            <button type="button" class="visuel-btn" data-image="0" aria-label="Agrandir le visuel : ${esc(s.alt)}">
              <img src="${visuel(s)}" alt="" width="600" height="800">
            </button>
          </div>
          <div class="fiche-corps">
            <p class="fiche-num">Sortie n° ${s.numero}</p>
            <h1 id="titre-page" class="fiche-titre" tabindex="-1">${esc(s.titre)}</h1>
            <dl class="fiche-infos">
              <div><dt>Catégorie</dt><dd><span class="cat" data-cat="${s.categorie}">${CATEGORIES[s.categorie]}</span></dd></div>
              <div><dt>Publiée le</dt><dd><time datetime="${s.date}">${dateLongue(s.date)}</time></dd></div>
              <div><dt>Format</dt><dd>${esc(s.format)}</dd></div>
              <div><dt>Technique</dt><dd>${esc(s.technique)}</dd></div>
            </dl>
            <p class="fiche-desc">${esc(s.description)}</p>
            <section class="galerie" aria-labelledby="galerie-titre">
              <div class="galerie-tete">
                <h2 id="galerie-titre" class="galerie-titre">Galerie</h2>
                <p class="galerie-compte">${NB_IMAGES} images</p>
              </div>
              <ul class="galerie-liste">
                ${Array.from({ length: NB_IMAGES }, (_, i) => `<li><button type="button" class="galerie-btn" data-image="${i}" aria-label="Ouvrir l'image ${i + 1} sur ${NB_IMAGES} : ${esc(VARIANTES[i])}">
                  <img src="${visuel(s, i)}" alt="" width="600" height="800" loading="lazy"></button></li>`).join("")}
              </ul>
            </section>
          </div>
        </article>
        <div class="actions">
          <button type="button" class="bouton btn-favori"></button>
          <button type="button" class="bouton btn-partager">${ICONES.partager}<span class="visually-hidden">Partager</span></button>
        </div>
      </div>`;

    const btnFavori = $(".btn-favori", main);
    const majFavori = () => {
      const dedans = etat.favoris.has(s.id);
      btnFavori.classList.toggle("est-favori", dedans);
      btnFavori.innerHTML = `${ICONES.coeur}<span>${dedans ? "Retirer des favoris" : "Ajouter aux favoris"}</span>`;
    };
    majFavori();
    btnFavori.addEventListener("click", () => {
      const ajout = !etat.favoris.has(s.id);
      ajout ? etat.favoris.add(s.id) : etat.favoris.delete(s.id);
      sauver();
      majFavori();
      annoncer(ajout ? "Ajoutée à tes favoris" : "Retirée de tes favoris");
    });

    $(".btn-partager", main).addEventListener("click", async () => {
      const url = location.href;
      if (navigator.share) {
        try { await navigator.share({ title: s.titre, text: `Nouvelle sortie LT Design : ${s.titre}`, url }); } catch { /* partage annulé */ }
        return;
      }
      try { await navigator.clipboard.writeText(url); annoncer("Lien copié"); }
      catch { annoncer("Copie impossible sur cet appareil"); }
    });

    main.querySelectorAll("[data-image]").forEach(btn =>
      btn.addEventListener("click", () => visionneuse.ouvrir(s, Number(btn.dataset.image), btn)));
  }

  /* ---------- Variante d'échec ---------- */
  function afficherErreur() {
    document.title = "Sortie introuvable | LT-design app";
    main.innerHTML = `
      <section class="erreur" aria-labelledby="titre-page">
        <h1 id="titre-page" class="titre-page" tabindex="-1">Cette sortie n'a pas pu être chargée</h1>
        <p>Le lien est peut-être incomplet, ou la sortie a été retirée. Vérifie ta connexion puis réessaie.</p>
        <div class="erreur-actions">
          <button type="button" class="bouton bouton--principal" id="reessayer">Réessayer</button>
          <a class="bouton bouton--secondaire" href="#/">Voir les dernières sorties</a>
        </div>
      </section>`;
    $("#reessayer").addEventListener("click", () => location.reload());
  }

  /* ---------- Visionneuse plein écran ---------- */
  const visionneuse = (() => {
    const dlg = $("#visionneuse");
    const img = $(".vis-img", dlg);
    const scene = $(".vis-scene", dlg);
    const titre = $("#vis-titre");
    const niveau = $(".vis-zoom", dlg);
    const ZOOMS = [1, 1.5, 2, 3];
    let sortie, index = 0, z = 0, declencheur;

    const majImage = () => {
      img.src = visuel(sortie, index);
      img.alt = texteAlt(sortie, index);
      titre.textContent = `Image ${index + 1} sur ${NB_IMAGES}`;
      majZoom(0);
    };
    const majZoom = nz => {
      z = Math.max(0, Math.min(ZOOMS.length - 1, nz));
      dlg.style.setProperty("--zoom", ZOOMS[z]);
      dlg.classList.toggle("est-zoome", z > 0);
      niveau.textContent = `${Math.round(ZOOMS[z] * 100)} %`;
      $('[data-vis="moins"]', dlg).disabled = z === 0;
      $('[data-vis="plus"]', dlg).disabled = z === ZOOMS.length - 1;
      requestAnimationFrame(() => {
        scene.scrollLeft = (scene.scrollWidth - scene.clientWidth) / 2;
        scene.scrollTop = (scene.scrollHeight - scene.clientHeight) / 2;
      });
    };
    const aller = pas => { index = (index + pas + NB_IMAGES) % NB_IMAGES; majImage(); };

    dlg.addEventListener("click", e => {
      const action = e.target.closest("[data-vis]")?.dataset.vis;
      if (action === "fermer") dlg.close();
      if (action === "precedent") aller(-1);
      if (action === "suivant") aller(1);
      if (action === "plus") majZoom(z + 1);
      if (action === "moins") majZoom(z - 1);
    });
    dlg.addEventListener("keydown", e => {
      if (z > 0 && e.target === scene) return; // flèches = déplacement dans l'image zoomée
      if (e.key === "ArrowLeft") { e.preventDefault(); aller(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); aller(1); }
      if (e.key === "+") majZoom(z + 1);
      if (e.key === "-") majZoom(z - 1);
    });
    // Glisser horizontalement change d'image (les boutons restent l'alternative à un seul pointeur)
    let depart = null;
    scene.addEventListener("pointerdown", e => { if (z === 0) depart = e.clientX; });
    scene.addEventListener("pointerup", e => {
      if (depart === null) return;
      const dx = e.clientX - depart;
      depart = null;
      if (Math.abs(dx) > 50) aller(dx < 0 ? 1 : -1);
    });
    dlg.addEventListener("close", () => {
      document.body.classList.remove("visionneuse-ouverte");
      if (declencheur) declencheur.focus();
      // Fermé avec le bouton ou Échap : on retire l'étape ajoutée à l'historique
      if (history.state && history.state.visionneuse) history.back();
    });
    // Le bouton retour du téléphone ferme le plein écran au lieu de quitter la fiche (test utilisateur, T3)
    window.addEventListener("popstate", () => { if (dlg.open) dlg.close(); });

    return {
      ouvrir(s, i, bouton) {
        sortie = s; index = i; declencheur = bouton;
        majImage();
        document.body.classList.add("visionneuse-ouverte");
        dlg.showModal();
        history.pushState({ visionneuse: true }, "");
        $('[data-vis="fermer"]', dlg).focus();
      }
    };
  })();

  /* ---------- Navigation ---------- */
  function router() {
    const [, vue, id] = location.hash.split("/");
    if ($("#visionneuse").open) $("#visionneuse").close();
    clearTimeout(minuterieToast);
    toast.classList.remove("est-visible");

    document.querySelectorAll(".lien-favoris").forEach(a =>
      vue === "favoris" ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));

    if (vue === "sortie") {
      const s = SORTIES.find(x => x.id === id);
      s ? afficherFiche(s) : afficherErreur();
    } else {
      afficherAccueil(vue === "favoris");
    }

    if (etat.premierAffichage) {
      etat.premierAffichage = false;
    } else {
      window.scrollTo(0, 0);
      $("#titre-page")?.focus();
    }
  }

  window.addEventListener("hashchange", router);
  router();
})();
