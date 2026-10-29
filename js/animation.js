'use strict';
/*
 * Les schémas animés : une figure qui se joue par étapes.
 *
 * Un schéma dit tout d'un coup ; une animation dit dans l'ordre. Pour « git
 * push », on veut voir la modification partir du dossier de travail, passer
 * par l'index, entrer dans le dépôt local, puis rejoindre le dépôt distant —
 * une étape à la fois, avec une phrase pour chacune.
 *
 * Une figure animée est une figure ordinaire (js/schemas/*.js) à laquelle on
 * ajoute un champ `anim` : la liste de ses étapes. Chaque étape dit ce qu'elle
 * allume (`on`), ce qui circule (`flux`) et ce qu'elle raconte (`t`) :
 *
 *     anim: [
 *       { t: ['Vous modifiez un fichier.', 'You change a file.'], on: ['w'] },
 *       { t: ['git add le copie dans l’index.', 'git add copies it to the index.'], on: ['w', 'i'], flux: [0] },
 *     ]
 *
 * Les adresses sont celles que pose js/schema.js (voir son en-tête) : l'id
 * d'un nœud, ou un nombre, qui désigne la flèche (graphe), le message
 * (séquence), la rangée (cases), la couche (pile), le nœud (arbre) ou la forme
 * (dessin) de ce rang. Ce qu'une étape n'allume pas s'estompe ; une étape sans
 * `on` ni `flux` montre tout, à plat. Sur un trait en flux, un point circule :
 * une animation SVG (SMIL), sans script ni minuterie, que le navigateur
 * dessine tout seul. Avec le réglage « réduire les animations », rien ne bouge
 * — les étapes se feuillettent quand même.
 *
 * Ce module dessine le lecteur sous la figure : lire/pause, précédent,
 * suivant, une pastille par étape, et la phrase de l'étape. La figure
 * elle-même se touche pour passer à la suite.
 */
(function (racine) {

  const { element, bouton, svg } = Outils;

  /* L'adresse d'un nombre, selon le genre de la figure. */
  const PREFIXES = { graphe: 'e', commits: 'c', cases: 'r', pile: 'l', sequence: 'm', arbre: 'n', dessin: 'd' };
  const DUREE = 2800;            // ms par étape en lecture automatique
  const actifs = new Set();      // les lecteurs en cours, pour les arrêter d'un coup

  function tr(valeur, langue) {
    if (Array.isArray(valeur)) return (langue === 'en' ? valeur[1] : valeur[0]) || valeur[0] || '';
    return valeur === undefined || valeur === null ? '' : String(valeur);
  }

  function t(cle, variables) {
    return racine.I18n ? racine.I18n.t(cle, variables) : cle;
  }

  function mouvementReduit() {
    try { return racine.matchMedia && racine.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  function icone(d) {
    const s = svg('svg', { class: 'icone', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' });
    s.appendChild(svg('path', { d }));
    return s;
  }
  const LIRE = 'M8 5.5v13l10-6.5z';
  const PAUSE = 'M8 5.5v13M16 5.5v13';

  /* Un point qui circule le long d'un trait : un cercle et son animateMotion. */
  function point(d, style, duree, retard) {
    const c = svg('circle', { r: 4.5, class: 'dpt dpt-' + (style || 'n') });
    const m = svg('animateMotion', {
      dur: duree + 's', repeatCount: 'indefinite', path: d, begin: (retard || 0) + 's', calcMode: 'paced',
    });
    c.appendChild(m);
    return c;
  }

  /* Monte un lecteur sous `dessin` (le SVG) dans `figure`, pour la figure
   * `spec` : renvoie une poignée { aller, suivant, precedent, lire, arreter }. */
  function monter(figure, dessin, spec, langue) {
    const etapes = spec.anim;
    if (!Array.isArray(etapes) || !etapes.length) return null;
    const prefixe = PREFIXES[spec.k] || 'd';
    const adresses = (liste) => (liste || []).map((x) => (typeof x === 'number' ? prefixe + x : String(x)));
    const reduit = mouvementReduit();
    const etat = { i: 0, lecture: false, minuterie: null, manquants: [], allumes: 0 };

    // ── Le lecteur ──────────────────────────────────────────────────────────
    const barre = element('div', 'anim-barre');
    barre.setAttribute('role', 'group');
    barre.setAttribute('aria-label', t('anim.aria'));
    const lire = bouton('anim-lire', '', () => (etat.lecture ? pause() : jouer()));
    lire.appendChild(icone(LIRE));
    const prec = bouton('anim-prec', '‹', () => aller(etat.i - 1, true));
    prec.setAttribute('aria-label', t('anim.precedent'));
    const points = element('ol', 'anim-points');
    const pastilles = etapes.map((e, i) => {
      const li = element('li');
      const b = bouton('', '', () => aller(i, true));
      b.setAttribute('aria-label', t('anim.etape', { n: i + 1, total: etapes.length }));
      li.appendChild(b);
      points.appendChild(li);
      return b;
    });
    const suiv = bouton('anim-suiv', '›', () => aller(etat.i + 1, true));
    suiv.setAttribute('aria-label', t('anim.suivant'));
    const compte = element('span', 'anim-compte');
    barre.appendChild(lire);
    barre.appendChild(prec);
    barre.appendChild(points);
    barre.appendChild(suiv);
    barre.appendChild(compte);
    const texte = element('p', 'anim-texte');
    texte.setAttribute('aria-live', 'polite');
    const numero = element('span', 'anim-num');
    const phrase = element('span', 'anim-phrase');
    texte.appendChild(numero);
    texte.appendChild(phrase);
    dessin.after(barre, texte);
    figure.classList.add('anime');
    dessin.classList.add('cliquable');
    dessin.addEventListener('click', () => aller(etat.i + 1, true));
    barre.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); aller(etat.i + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); aller(etat.i - 1, true); }
    });

    // ── Une étape ───────────────────────────────────────────────────────────
    function appliquer() {
      const etape = etapes[etat.i] || {};
      const on = adresses(etape.on);
      const flux = adresses(etape.flux);
      const neutre = !etape.on && !etape.flux;
      for (const n of dessin.querySelectorAll('.a-on, .a-flux')) n.classList.remove('a-on', 'a-flux');
      for (const p of dessin.querySelectorAll('.dpt')) p.remove();
      dessin.classList.toggle('anime', !neutre);
      etat.allumes = 0;
      if (!neutre) {
        for (const adresse of on.concat(flux)) {
          const cibles = dessin.querySelectorAll('[data-a="' + adresse + '"], [data-c="' + adresse + '"]');
          if (!cibles.length) etat.manquants.push(adresse);
          for (const c of cibles) {
            c.classList.add('a-on');
            etat.allumes += 1;
            // une case allumée allume sa rangée, sinon elle resterait estompée avec elle
            let parent = c.parentNode;
            while (parent && parent !== dessin) {
              if (parent.hasAttribute && parent.hasAttribute('data-a')) parent.classList.add('a-on');
              parent = parent.parentNode;
            }
          }
        }
        flux.forEach((adresse, k) => {
          for (const c of dessin.querySelectorAll('[data-a="' + adresse + '"]')) {
            c.classList.add('a-flux');
            const d = c.getAttribute('data-d');
            if (d && !reduit) dessin.appendChild(point(d, c.getAttribute('data-s'), etape.dur || 1.5, -k * 0.35));
          }
        });
      }
      numero.textContent = (etat.i + 1) + '/' + etapes.length;
      phrase.textContent = tr(etape.t, langue);
      compte.textContent = (etat.i + 1) + '/' + etapes.length;
      pastilles.forEach((b, i) => {
        if (i === etat.i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.classList.toggle('vue', i < etat.i);
      });
      texte.classList.remove('change');
      void texte.offsetWidth;
      texte.classList.add('change');
    }

    function aller(i, manuel) {
      etat.i = ((i % etapes.length) + etapes.length) % etapes.length;
      if (manuel && etat.lecture) pause();
      appliquer();
    }

    // ── Lecture automatique ─────────────────────────────────────────────────
    function tic() {
      if (!etat.lecture) return;
      if (!figure.isConnected) { arreter(); return; }
      if (etat.i >= etapes.length - 1) { pause(); return; }
      aller(etat.i + 1);
      etat.minuterie = setTimeout(tic, spec.animDur || DUREE);
    }

    function jouer() {
      if (etat.i >= etapes.length - 1) aller(0);
      etat.lecture = true;
      lire.textContent = '';
      lire.appendChild(icone(PAUSE));
      lire.setAttribute('aria-label', t('anim.pause'));
      lire.classList.add('en-cours');
      etat.minuterie = setTimeout(tic, spec.animDur || DUREE);
    }

    function pause() {
      etat.lecture = false;
      if (etat.minuterie) clearTimeout(etat.minuterie);
      etat.minuterie = null;
      lire.textContent = '';
      lire.appendChild(icone(LIRE));
      lire.setAttribute('aria-label', t('anim.lire'));
      lire.classList.remove('en-cours');
    }

    function arreter() {
      pause();
      actifs.delete(poignee);
    }

    const poignee = {
      aller, arreter, jouer, pause,
      suivant: () => aller(etat.i + 1, true),
      precedent: () => aller(etat.i - 1, true),
      get etape() { return etat.i; },
      get total() { return etapes.length; },
      get manquants() { return etat.manquants; },
      get allumes() { return etat.allumes; },
      get lecture() { return etat.lecture; },
    };
    actifs.add(poignee);
    pause();
    appliquer();
    return poignee;
  }

  /* Arrête toutes les lectures en cours : la fiche se redessine ou se ferme. */
  function arreterTout() {
    for (const p of Array.from(actifs)) p.arreter();
  }

  racine.Animation = { monter, arreterTout, DUREE };

})(window);
