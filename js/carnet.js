'use strict';
/*
 * L'onglet « Carnet » : tout ce qui est à soi, rangé en cinq rubriques.
 *
 *   Favoris     les termes marqués d'une étoile
 *   À revoir    les termes ratés au quiz ou marqués à la main
 *   Notes       les notes écrites sur les termes
 *   Exemples    les exemples de code ajoutés aux termes
 *   Mes termes  les termes qu'on a ajoutés soi-même au glossaire
 *
 * Chaque ligne ouvre la fiche du terme concerné ; pour une note ou un exemple,
 * la fiche s'ouvre au niveau de « Mes notes ».
 */
(function (racine) {

  const { element, bouton } = Outils;
  const { t } = I18n;

  const RUBRIQUES = ['favoris', 'a-revoir', 'notes', 'exemples', 'termes'];
  const etat = { rubrique: 'favoris', filtre: '' };
  let el = {};

  function appartient(ref) {
    return Glossaire.parId(ref);
  }

  function ligneTerme(terme, sous) {
    const b = element('button', 'terme-ligne cat-' + terme.c);
    b.type = 'button';
    const tete = element('span', 'terme-ligne-tete');
    tete.appendChild(element('span', 'point-cat'));
    tete.appendChild(element('span', 'terme-mot', terme.n));
    if (terme.perso) tete.appendChild(element('span', 'pastille', t('perso.pastille')));
    b.appendChild(tete);
    const texte = sous === undefined ? Glossaire.apercu(terme, App.reglages.definitions === 'les-deux' ? I18n.langue : App.reglages.definitions) : sous;
    if (texte) b.appendChild(element('span', 'apercu', texte));
    b.addEventListener('click', () => Fiche.ouvrir(terme.id));
    return b;
  }

  function ligneNote(note) {
    const terme = appartient(note.ref);
    const b = element('button', 'terme-ligne note-ligne' + (terme ? ' cat-' + terme.c : ''));
    b.type = 'button';
    const tete = element('span', 'terme-ligne-tete');
    tete.appendChild(element('span', 'point-cat'));
    tete.appendChild(element('span', 'terme-mot', terme ? terme.n : t('carnet.terme-disparu')));
    if (note.titre) tete.appendChild(element('span', 'note-titre-court', note.titre));
    b.appendChild(tete);
    const extrait = note.type === 'exemple' ? (note.code || '') : (note.texte || '');
    b.appendChild(element('span', 'apercu' + (note.type === 'exemple' ? ' apercu-code' : ''), extrait.replace(/\s+/g, ' ').slice(0, 140)));
    b.appendChild(element('span', 'discret note-date', Outils.dateLisible(note.modifie, I18n.langue)));
    b.addEventListener('click', () => { if (terme) Fiche.ouvrir(terme.id, { defiler: 'notes' }); });
    return b;
  }

  /* Le nombre d'éléments de chaque rubrique, sur son bouton : on voit d'un
   * coup d'œil où il y a quelque chose. */
  async function compter() {
    try {
      const [suivis, notes] = await Promise.all([Store.tousLesSuivis(), Store.toutesLesNotes()]);
      const nombres = {
        favoris: suivis.filter((s) => s.favori && appartient(s.ref)).length,
        'a-revoir': suivis.filter((s) => s.aRevoir && appartient(s.ref)).length,
        notes: notes.filter((n) => n.type === 'note').length,
        exemples: notes.filter((n) => n.type === 'exemple').length,
        termes: Glossaire.termes.filter((x) => x.perso).length,
      };
      for (const b of el.onglets.querySelectorAll('button')) {
        const n = nombres[b.getAttribute('data-rubrique')] || 0;
        const case_ = b.querySelector('.nombre-rubrique');
        case_.textContent = n ? String(n) : '';
        case_.hidden = !n;
      }
    } catch (erreur) { /* sans magasin, pas de compte */ }
  }

  async function dessiner() {
    const rub = etat.rubrique;
    el.contenu.textContent = '';
    for (const b of el.onglets.querySelectorAll('button')) {
      b.setAttribute('aria-pressed', b.getAttribute('data-rubrique') === rub ? 'true' : 'false');
    }
    compter();
    const filtre = Outils.normaliser(etat.filtre);
    const bonne = (texte) => !filtre || Outils.normaliser(texte).includes(filtre);
    let lignes = [];

    try {
      if (rub === 'favoris' || rub === 'a-revoir') {
        const suivis = await Store.tousLesSuivis();
        const termes = suivis.filter((s) => (rub === 'favoris' ? s.favori : s.aRevoir))
          .map((s) => appartient(s.ref)).filter(Boolean)
          .filter((x) => bonne(x.n + ' ' + (x.al || []).join(' ')));
        termes.sort((a, b) => a.cleNue.localeCompare(b.cleNue, 'en'));
        lignes = termes.map((x) => ligneTerme(x));
      } else if (rub === 'notes' || rub === 'exemples') {
        const notes = (await Store.toutesLesNotes()).filter((n) => n.type === (rub === 'notes' ? 'note' : 'exemple'));
        notes.sort((a, b) => b.modifie - a.modifie);
        for (const n of notes) {
          const terme = appartient(n.ref);
          if (bonne((terme ? terme.n : '') + ' ' + (n.titre || '') + ' ' + (n.texte || '') + ' ' + (n.code || ''))) lignes.push(ligneNote(n));
        }
      } else {
        const perso = Glossaire.termes.filter((x) => x.perso).filter((x) => bonne(x.n));
        el.contenu.appendChild(bouton('bouton-principal', '＋ ' + t('carnet.ajouter-terme'), () => Editeur.ouvrir({ type: 'terme' })));
        lignes = perso.map((x) => ligneTerme(x));
      }
    } catch (erreur) {
      lignes = [];
    }

    if (!lignes.length) {
      el.contenu.appendChild(element('p', 'vide discret', filtre ? t('carnet.rien') : t('carnet.vide.' + rub)));
      return;
    }
    const groupe = element('div', 'groupe');
    for (const l of lignes) groupe.appendChild(l);
    el.contenu.appendChild(groupe);
  }

  function brancher() {
    el = {
      onglets: document.getElementById('carnet-onglets'),
      filtre: document.getElementById('carnet-filtre'),
      contenu: document.getElementById('carnet-contenu'),
    };
    for (const b of el.onglets.querySelectorAll('button')) {
      b.addEventListener('click', () => {
        etat.rubrique = b.getAttribute('data-rubrique');
        dessiner();
      });
    }
    el.filtre.addEventListener('input', () => { etat.filtre = el.filtre.value; dessiner(); });
    for (const evt of ['suivi-change', 'notes-changees', 'perso-change', 'langue-changee']) {
      document.addEventListener(evt, () => { if (App.vue === 'carnet') dessiner(); });
    }
  }

  racine.Carnet = { brancher, dessiner, RUBRIQUES };

})(window);
