'use strict';
/*
 * L'onglet « Glossaire » : la recherche, les catégories, la liste A → Z.
 *
 * Sans requête, on voit le terme du jour, les termes récemment consultés, puis
 * tout le glossaire dans l'ordre alphabétique, regroupé par lettre. Avec une
 * requête, la liste devient des résultats classés par pertinence : le terme
 * lui-même d'abord, puis ses variantes, puis ceux dont la définition contient
 * les mots tapés.
 *
 * Les catégories sont des filtres : « Git et GitHub » ne montre que les termes
 * de Git, et la recherche ne cherche alors que là.
 */
(function (racine) {

  const { element, bouton } = Outils;
  const { t } = I18n;

  const etat = { cat: null, q: '', suivis: new Map(), jeton: 0 };
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

  function ligne(terme, via) {
    const b = element('button', 'terme-ligne cat-' + terme.c);
    b.type = 'button';
    b.setAttribute('data-ref', terme.id);
    const tete = element('span', 'terme-ligne-tete');
    tete.appendChild(element('span', 'point-cat'));
    tete.appendChild(element('span', 'terme-mot', terme.n));
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
    if (apercu) b.appendChild(element('span', 'apercu', apercu));
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

  // ── Dessin de la liste ────────────────────────────────────────────────────

  function dessiner() {
    const q = etat.q.trim();
    el.liste.textContent = '';
    el.rien.hidden = true;
    el.accueil.hidden = !!q;

    if (!q) {
      const termes = Glossaire.termes.filter((x) => !etat.cat || x.c === etat.cat);
      el.compte.textContent = I18n.plur('compte.termes', termes.length);
      let lettre = null;
      let groupe = null;
      for (const terme of termes) {
        if (terme.lettre !== lettre) {
          lettre = terme.lettre;
          const entete = element('h3', 'lettre', lettre === '#' ? t('lettre.autres') : lettre);
          entete.id = 'lettre-' + (lettre === '#' ? 'autres' : lettre);
          el.liste.appendChild(entete);
          groupe = element('div', 'groupe');
          el.liste.appendChild(groupe);
        }
        groupe.appendChild(ligne(terme));
      }
      if (!termes.length) el.liste.appendChild(element('p', 'vide', t('carnet.rien')));
      return;
    }

    const trouves = Glossaire.chercher(q, { cat: etat.cat });
    el.compte.textContent = I18n.plur('compte.termes', trouves.length);
    if (!trouves.length) {
      el.rien.hidden = false;
      el.rienAjouter.textContent = t('rien.ajouter', { q: q.length > 30 ? q.slice(0, 30) + '…' : q });
      el.rienAjouter.hidden = false;
      return;
    }
    const groupe = element('div', 'groupe');
    for (const { terme, via } of trouves.slice(0, 120)) groupe.appendChild(ligne(terme, via));
    el.liste.appendChild(groupe);
  }

  function surSaisie() {
    etat.q = el.q.value;
    el.vider.hidden = !etat.q;
    if (minuterie) clearTimeout(minuterie);
    minuterie = setTimeout(dessiner, 80);
  }

  async function rafraichir() {
    await chargerSuivis();
    dessiner();
  }

  async function brancher() {
    el = {
      q: document.getElementById('q'),
      vider: document.getElementById('q-vider'),
      filtres: document.getElementById('filtres'),
      accueil: document.getElementById('accueil'),
      duJour: document.getElementById('du-jour'),
      recents: document.getElementById('recents'),
      compte: document.getElementById('compte'),
      liste: document.getElementById('liste'),
      rien: document.getElementById('rien'),
      rienAjouter: document.getElementById('b-ajouter-depuis-recherche'),
    };
    el.q.addEventListener('input', surSaisie);
    el.q.addEventListener('keydown', (e) => { if (e.key === 'Enter') el.q.blur(); });
    el.vider.addEventListener('click', () => { el.q.value = ''; surSaisie(); el.q.focus(); });
    el.rienAjouter.addEventListener('click', () => Editeur.ouvrir({ type: 'terme', nom: etat.q.trim() }));

    document.addEventListener('langue-changee', () => { dessinerFiltres(); dessinerAccueil(); dessiner(); });
    document.addEventListener('reglages-changes', () => { dessinerAccueil(); dessiner(); });
    document.addEventListener('suivi-change', rafraichir);
    document.addEventListener('perso-change', () => { dessiner(); dessinerAccueil(); });
    document.addEventListener('fiche-fermee', () => { dessinerAccueil(); });

    await chargerSuivis();
    dessinerFiltres();
    await dessinerAccueil();
    dessiner();
  }

  racine.Liste = { brancher, rafraichir, choisirCat, dessiner };

})(window);
