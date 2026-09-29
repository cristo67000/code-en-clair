'use strict';
/*
 * L'onglet « Glossaire » : la recherche, les catégories, la liste A → Z.
 *
 * Sans requête, on voit le terme du jour, les termes récemment consultés, puis
 * tout le glossaire dans l'ordre alphabétique, regroupé par lettre, avec une
 * réglette de lettres sur le bord pour y sauter. Avec une requête, la liste
 * devient des résultats classés par pertinence : le terme lui-même d'abord,
 * puis ses variantes, puis ceux dont la définition contient les mots tapés.
 * Ce qui a été trouvé est surligné, et quand un terme l'a été par un autre nom
 * (« hachage » pour Hash), ce nom est montré à côté : on comprend pourquoi il
 * est là. Rien du tout ? On propose les termes à une faute de frappe près.
 *
 * Les catégories sont des filtres : « Git et GitHub » ne montre que les termes
 * de Git, et la recherche ne cherche alors que là.
 *
 * Au clavier : « / » ou Ctrl+K pour chercher (voir app.js), ↓ pour descendre
 * dans les résultats, ↑ pour remonter jusqu'au champ, Entrée ouvre le terme
 * quand la requête le désigne sans ambiguïté, Échap efface.
 */
(function (racine) {

  const { element, bouton } = Outils;
  const { t } = I18n;

  const etat = { cat: null, q: '', suivis: new Map(), jeton: 0, lettres: [] };
  let el = {};
  let minuterie = null;

  function langueApercu() {
    const d = App.reglages.definitions;
    return d === 'les-deux' ? I18n.langue : d;
  }

  async function chargerSuivis() {
    try {
      const lignes = await Store.tousLesSuivis();
      etat.suivis = new Map(lignes.map((l) => [l.ref, l]));
    } catch (erreur) {
      etat.suivis = new Map();
    }
  }

  // ── Une ligne de résultat ─────────────────────────────────────────────────

  function ligne(terme, via, requete) {
    const b = element('button', 'terme-ligne cat-' + terme.c);
    b.type = 'button';
    b.setAttribute('data-ref', terme.id);
    const tete = element('span', 'terme-ligne-tete');
    tete.appendChild(element('span', 'point-cat'));
    const mot = element('span', 'terme-mot');
    if (requete && via !== 'texte') mot.appendChild(Outils.surligner(terme.n, requete));
    else mot.textContent = terme.n;
    tete.appendChild(mot);
    if (requete && via && via !== 'texte') {
      const nom = Glossaire.graphie(terme, via);
      if (nom && nom !== terme.n) {
        const alias = element('span', 'via-alias');
        alias.appendChild(Outils.surligner(nom, requete));
        tete.appendChild(alias);
      }
    }
    const suivi = etat.suivis.get(terme.id);
    if (terme.perso) tete.appendChild(element('span', 'pastille', t('perso.pastille')));
    if (suivi && suivi.favori) {
      const f = element('span', 'marque-favori', '★');
      f.setAttribute('title', t('favori.pastille'));
      tete.appendChild(f);
    }
    if (suivi && suivi.aRevoir) {
      const f = element('span', 'marque-revoir', '⚑');
      f.setAttribute('title', t('a-revoir.pastille'));
      tete.appendChild(f);
    }
    if (via === 'texte') tete.appendChild(element('span', 'via', t('via.texte')));
    b.appendChild(tete);
    const apercu = Glossaire.apercu(terme, langueApercu());
    if (apercu) {
      const s = element('span', 'apercu');
      if (requete && via === 'texte') s.appendChild(Outils.surligner(apercu, requete));
      else s.textContent = apercu;
      b.appendChild(s);
    }
    b.addEventListener('click', () => Fiche.ouvrir(terme.id));
    return b;
  }

  // ── Filtres ───────────────────────────────────────────────────────────────

  function dessinerFiltres() {
    el.filtres.textContent = '';
    const langue = I18n.langue === 'en' ? 'en' : 'fr';
    const tous = bouton('filtre' + (etat.cat ? '' : ' actif'), t('filtre.tous'), () => choisirCat(null));
    tous.setAttribute('aria-pressed', etat.cat ? 'false' : 'true');
    el.filtres.appendChild(tous);
    for (const cat of Glossaire.categories) {
      const b = bouton('filtre cat-' + cat.id + (etat.cat === cat.id ? ' actif' : ''), '', () => choisirCat(etat.cat === cat.id ? null : cat.id));
      b.appendChild(element('span', 'point-cat'));
      b.appendChild(document.createTextNode(cat[langue]));
      b.setAttribute('aria-pressed', etat.cat === cat.id ? 'true' : 'false');
      el.filtres.appendChild(b);
    }
  }

  function choisirCat(id) {
    etat.cat = id;
    dessinerFiltres();
    dessinerAccueil();
    dessiner();
    if (id) {
      const actif = el.filtres.querySelector('.filtre.actif');
      if (actif && actif.scrollIntoView) actif.scrollIntoView({ inline: 'center', block: 'nearest' });
    }
  }

  // ── Accueil : le terme du jour et les récents ─────────────────────────────

  async function dessinerAccueil() {
    /* Plusieurs événements demandent ce dessin presque en même temps (langue,
     * réglages, fermeture d'une fiche) et il attend le magasin : sans ce
     * jeton, deux dessins se croisent et la rubrique apparaît en double. */
    etat.jeton += 1;
    const jeton = etat.jeton;
    el.duJour.textContent = '';
    const jour = Glossaire.termeDuJour();
    if (jour && !etat.cat) {
      const carte = element('button', 'carte-du-jour cat-' + jour.c);
      carte.type = 'button';
      carte.appendChild(element('p', 'du-jour-titre', t('du-jour')));
      const mot = element('p', 'du-jour-mot');
      mot.appendChild(element('span', 'terme-mot', jour.n));
      carte.appendChild(mot);
      carte.appendChild(element('p', 'du-jour-def', Glossaire.apercu(jour, langueApercu())));
      carte.addEventListener('click', () => Fiche.ouvrir(jour.id));
      el.duJour.appendChild(carte);
      el.duJour.hidden = false;
    } else {
      el.duJour.hidden = true;
    }
    let recents = [];
    try { recents = await Store.historique(); } catch (erreur) { recents = []; }
    if (jeton !== etat.jeton) return;
    el.recents.textContent = '';
    const termes = recents.map((r) => Glossaire.parId(r.ref)).filter(Boolean).filter((x) => !etat.cat || x.c === etat.cat).slice(0, 12);
    if (termes.length) {
      const tete = element('div', 'rubrique-ligne');
      tete.appendChild(element('h3', 'rubrique', t('recents')));
      tete.appendChild(bouton('lien-discret', t('recents.effacer'), async () => {
        await Store.effacerHistorique().catch(() => {});
        dessinerAccueil();
      }));
      el.recents.appendChild(tete);
      const rang = element('div', 'voisins');
      for (const x of termes) {
        const b = bouton('voisin cat-' + x.c, x.n, () => Fiche.ouvrir(x.id));
        rang.appendChild(b);
      }
      el.recents.appendChild(rang);
    }
  }

  // ── La réglette des lettres ───────────────────────────────────────────────

  /* Comme dans les contacts d'un téléphone : on touche une lettre, ou on fait
   * glisser le doigt le long de la réglette, et la liste suit ; une bulle
   * montre en grand la lettre sous le doigt. Au clavier, ce sont des boutons. */
  function dessinerIndex(lettres) {
    etat.lettres = lettres;
    el.index.textContent = '';
    el.index.hidden = lettres.length < 4;
    el.vue.classList.toggle('avec-index', !el.index.hidden);
    el.index.style.setProperty('--n', String(lettres.length));
    for (const l of lettres) {
      const b = bouton('', l, () => sauterA(l));
      b.setAttribute('data-lettre', l);
      el.index.appendChild(b);
    }
  }

  function sauterA(lettre) {
    const entete = document.getElementById('lettre-' + (lettre === '#' ? 'autres' : lettre));
    const groupe = entete && entete.nextElementSibling;
    if (!groupe) return;
    // l'en-tête de lettre colle sous la recherche : on vise son groupe
    const haut = groupe.getBoundingClientRect().top + racine.scrollY - entete.offsetHeight - el.recherche.offsetHeight;
    racine.scrollTo(0, Math.max(0, Math.round(haut)));
  }

  let glisse = false;
  let derniere = null;

  function lettreSous(y) {
    const r = el.index.getBoundingClientRect();
    const n = etat.lettres.length;
    const i = Math.min(n - 1, Math.max(0, Math.floor(((y - r.top) / r.height) * n)));
    return etat.lettres[i];
  }

  function surIndex(e) {
    if (e.type === 'pointerdown') {
      glisse = true;
      derniere = null;
      try { el.index.setPointerCapture(e.pointerId); } catch (erreur) { /* rien */ }
      el.index.classList.add('actif');
    }
    if (!glisse) return;
    if (e.type === 'pointerup' || e.type === 'pointercancel') {
      glisse = false;
      el.index.classList.remove('actif');
      el.bulle.hidden = true;
      return;
    }
    e.preventDefault();
    const l = lettreSous(e.clientY);
    el.bulle.textContent = l;
    el.bulle.style.top = e.clientY + 'px';
    el.bulle.hidden = false;
    if (l !== derniere) { derniere = l; sauterA(l); }
  }

  // ── Dessin de la liste ────────────────────────────────────────────────────

  function dessiner() {
    const q = etat.q.trim();
    el.liste.textContent = '';
    el.rien.hidden = true;
    el.accueil.hidden = !!q;
    el.hasard.hidden = !!q;

    if (!q) {
      const termes = Glossaire.termes.filter((x) => !etat.cat || x.c === etat.cat);
      el.compte.textContent = I18n.plur('compte.termes', termes.length);
      const lettres = [];
      let groupe = null;
      for (const terme of termes) {
        if (terme.lettre !== lettres[lettres.length - 1]) {
          const lettre = terme.lettre;
          lettres.push(lettre);
          const entete = element('h3', 'lettre', lettre === '#' ? t('lettre.autres') : lettre);
          entete.id = 'lettre-' + (lettre === '#' ? 'autres' : lettre);
          el.liste.appendChild(entete);
          groupe = element('div', 'groupe');
          el.liste.appendChild(groupe);
        }
        groupe.appendChild(ligne(terme));
      }
      dessinerIndex(lettres);
      suivreDefilement();
      if (!termes.length) el.liste.appendChild(element('p', 'vide', t('carnet.rien')));
      return;
    }

    dessinerIndex([]);
    const trouves = Glossaire.chercher(q, { cat: etat.cat });
    el.compte.textContent = I18n.plur('compte.termes', trouves.length);
    if (!trouves.length) {
      el.rien.hidden = false;
      el.rienAjouter.textContent = t('rien.ajouter', { q: q.length > 30 ? q.slice(0, 30) + '…' : q });
      el.rienAjouter.hidden = false;
      dessinerSuggestions(q);
      return;
    }
    const groupe = element('div', 'groupe');
    for (const { terme, via } of trouves.slice(0, 120)) groupe.appendChild(ligne(terme, via, q));
    el.liste.appendChild(groupe);
  }

  /* Rien trouvé : les termes à une faute de frappe près, et, si un filtre de
   * catégorie est posé, de quoi chercher partout d'un geste. */
  function dessinerSuggestions(q) {
    el.suggestionsListe.textContent = '';
    const ailleurs = etat.cat ? Glossaire.chercher(q).length : 0;
    if (ailleurs) {
      el.suggestionsListe.appendChild(bouton('bouton-discret partout', t('rien.partout', { n: ailleurs }), () => choisirCat(null)));
    }
    for (const x of Glossaire.suggerer(q, { cat: etat.cat })) {
      el.suggestionsListe.appendChild(bouton('voisin cat-' + x.c, x.n, () => Fiche.ouvrir(x.id)));
    }
    el.suggestions.hidden = !el.suggestionsListe.childNodes.length;
  }

  function surSaisie() {
    etat.q = el.q.value;
    el.vider.hidden = !etat.q;
    el.raccourci.hidden = !!etat.q;
    if (minuterie) clearTimeout(minuterie);
    minuterie = setTimeout(dessiner, 80);
  }

  function vider() {
    el.q.value = '';
    surSaisie();
  }

  /* Entrée ouvre le terme quand la requête le désigne sans hésitation : un
   * seul résultat, ou le nom exact. Sinon elle range le clavier du téléphone,
   * pour laisser voir les résultats. */
  function surToucheRecherche(e) {
    if (e.key === 'Enter') {
      const q = el.q.value.trim();
      const trouves = q ? Glossaire.chercher(q, { cat: etat.cat }) : [];
      el.q.blur();
      if (trouves.length === 1 || (trouves.length && trouves[0].note === 100)) Fiche.ouvrir(trouves[0].terme.id);
    } else if (e.key === 'ArrowDown') {
      const premiere = el.liste.querySelector('.terme-ligne');
      if (premiere) { e.preventDefault(); premiere.focus(); }
    } else if (e.key === 'Escape') {
      if (el.q.value) { e.preventDefault(); vider(); } else el.q.blur();
    }
  }

  function surToucheListe(e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const lignes = Array.from(el.liste.querySelectorAll('.terme-ligne'));
    const i = lignes.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === 'ArrowUp' && i === 0) { el.q.focus(); return; }
    const voisine = lignes[i + (e.key === 'ArrowDown' ? 1 : -1)];
    if (voisine) voisine.focus();
  }

  function focaliser() {
    el.q.focus();
    el.q.select();
  }

  function auHasard() {
    const vus = new Set(Array.from(etat.suivis.values()).filter((s) => s.vu).map((s) => s.ref));
    const terme = Glossaire.auHasard({ cat: etat.cat, dejaVus: vus });
    if (terme) Fiche.ouvrir(terme.id);
  }

  /* La recherche colle en haut de l'écran ; les en-têtes de lettre collent
   * juste dessous. Sa hauteur change avec la taille du texte : on la mesure. */
  function mesurerRecherche() {
    const h = el.recherche.offsetHeight;
    if (h) el.vue.style.setProperty('--haut-recherche', h + 'px');
  }

  /* Une ombre sous la recherche quand elle colle ; la réglette n'apparaît
   * qu'une fois dans la liste — sur l'accueil, elle couvrirait le terme du jour. */
  function suivreDefilement() {
    if (el.vue.hidden) return;
    el.recherche.classList.toggle('colle', racine.scrollY > el.vue.offsetTop + 4);
    el.index.classList.toggle('visible', el.liste.getBoundingClientRect().top < racine.innerHeight * 0.45);
  }

  async function rafraichir() {
    await chargerSuivis();
    dessiner();
  }

  async function brancher() {
    el = {
      vue: document.getElementById('vue-glossaire'),
      recherche: document.getElementById('bloc-recherche'),
      q: document.getElementById('q'),
      vider: document.getElementById('q-vider'),
      raccourci: document.getElementById('q-raccourci'),
      filtres: document.getElementById('filtres'),
      accueil: document.getElementById('accueil'),
      duJour: document.getElementById('du-jour'),
      recents: document.getElementById('recents'),
      compte: document.getElementById('compte'),
      hasard: document.getElementById('b-hasard'),
      liste: document.getElementById('liste'),
      index: document.getElementById('index-lettres'),
      bulle: document.getElementById('index-bulle'),
      rien: document.getElementById('rien'),
      suggestions: document.getElementById('suggestions'),
      suggestionsListe: document.getElementById('suggestions-liste'),
      rienAjouter: document.getElementById('b-ajouter-depuis-recherche'),
    };
    el.q.addEventListener('input', surSaisie);
    el.q.addEventListener('keydown', surToucheRecherche);
    el.liste.addEventListener('keydown', surToucheListe);
    el.vider.addEventListener('click', () => { vider(); el.q.focus(); });
    el.hasard.addEventListener('click', auHasard);
    el.rienAjouter.addEventListener('click', () => Editeur.ouvrir({ type: 'terme', nom: etat.q.trim() }));
    for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) el.index.addEventListener(type, surIndex);

    if (racine.ResizeObserver) new ResizeObserver(mesurerRecherche).observe(el.recherche);
    racine.addEventListener('scroll', suivreDefilement, { passive: true });

    document.addEventListener('langue-changee', () => { dessinerFiltres(); dessinerAccueil(); dessiner(); });
    document.addEventListener('reglages-changes', () => { dessinerAccueil(); dessiner(); mesurerRecherche(); });
    document.addEventListener('suivi-change', rafraichir);
    document.addEventListener('perso-change', () => { dessiner(); dessinerAccueil(); });
    document.addEventListener('fiche-fermee', () => { dessinerAccueil(); });
    document.addEventListener('vue-changee', suivreDefilement);

    await chargerSuivis();
    dessinerFiltres();
    await dessinerAccueil();
    dessiner();
    mesurerRecherche();
  }

  racine.Liste = { brancher, rafraichir, choisirCat, dessiner, focaliser, sauterA };

})(window);
