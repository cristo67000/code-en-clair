'use strict';
/*
 * L'éditeur : le panneau où l'on écrit une note, un exemple de code, ou un
 * terme à soi.
 *
 * Trois formulaires dans un même panneau plein écran :
 *
 *   note     un titre facultatif et un texte libre
 *   exemple  un langage, du code, un commentaire facultatif — le code est
 *            affiché en chasse fixe, coloré, copiable, et jamais interprété
 *   terme    un terme absent du glossaire : son nom, sa catégorie, sa
 *            définition en français et/ou en anglais, ses autres graphies
 *
 * Comme la fiche, le panneau prend une entrée de l'historique : le geste
 * « retour » d'Android le ferme et ramène à la fiche, sans rien enregistrer.
 */
(function (racine) {

  const { element, bouton } = Outils;
  const { t } = I18n;

  const etat = { ouvert: false, demande: null, confirmation: false };
  let conteneur = null;
  let corps = null;

  function champ(titre, aide, saisie, id) {
    const c = element('div', 'champ');
    const etiquette = element('label', 'champ-titre', titre);
    if (id) etiquette.setAttribute('for', id);
    c.appendChild(etiquette);
    c.appendChild(saisie);
    if (aide) c.appendChild(element('span', 'champ-aide', aide));
    return c;
  }

  function saisieTexte(id, valeur, options) {
    const opt = options || {};
    const s = element(opt.lignes ? 'textarea' : 'input', 'saisie-texte' + (opt.mono ? ' saisie-code' : ''));
    s.id = id;
    if (opt.lignes) s.rows = opt.lignes; else s.type = 'text';
    s.value = valeur || '';
    s.autocapitalize = 'off';
    s.autocomplete = 'off';
    s.spellcheck = !opt.mono;
    if (opt.mono) s.setAttribute('autocorrect', 'off');
    if (opt.maxlength) s.maxLength = opt.maxlength;
    return s;
  }

  function choix(id, options, valeur) {
    const s = element('select', 'saisie-texte');
    s.id = id;
    for (const [v, libelle] of options) {
      const o = element('option', null, libelle);
      o.value = v;
      if (v === valeur) o.selected = true;
      s.appendChild(o);
    }
    return s;
  }

  // ── Ouverture ─────────────────────────────────────────────────────────────

  /* demande : { type: 'note' | 'exemple', ref }  pour créer
   *           { type: 'note' | 'exemple', note }  pour modifier
   *           { type: 'terme' }  ou  { type: 'terme', id }  ou { type: 'terme', nom } */
  async function ouvrir(demande) {
    etat.demande = demande;
    etat.confirmation = false;
    if (!etat.ouvert) {
      etat.ouvert = true;
      conteneur.hidden = false;
      document.body.classList.add('panneau-ouvert');
      try { racine.history.pushState({ editeur: true, fiche: Fiche.profondeur }, ''); } catch (erreur) { /* rien */ }
    }
    await dessiner();
    conteneur.scrollTop = 0;
    const premier = corps.querySelector('textarea, input');
    if (premier) setTimeout(() => premier.focus({ preventScroll: true }), 60);
  }

  function fermerSansHistorique() {
    etat.ouvert = false;
    etat.demande = null;
    conteneur.hidden = true;
    document.body.classList.remove('panneau-ouvert');
  }

  function fermer() {
    if (!etat.ouvert) return;
    fermerSansHistorique();
    Outils.reculer(1);
  }

  // ── Formulaires ───────────────────────────────────────────────────────────

  async function dessiner() {
    const d = etat.demande;
    corps.textContent = '';
    if (!d) return;
    const modif = d.type === 'terme' ? !!d.id : !!d.note;
    const titres = {
      note: modif ? 'editeur.note-modifier' : 'editeur.note',
      exemple: modif ? 'editeur.exemple-modifier' : 'editeur.exemple',
      terme: modif ? 'editeur.terme-modifier' : 'editeur.terme',
    };
    const tete = element('div', 'fiche-tete');
    tete.appendChild(element('h2', 'editeur-titre', t(titres[d.type])));
    tete.appendChild(element('span', 'espace'));
    const x = bouton('fiche-fermer', '✕', fermer);
    x.setAttribute('aria-label', t('editeur.annuler'));
    tete.appendChild(x);
    corps.appendChild(tete);

    const erreur = element('p', 'erreur', '');
    erreur.setAttribute('role', 'alert');
    erreur.hidden = true;
    const montrerErreur = (message) => { erreur.textContent = message; erreur.hidden = !message; };
    const form = element('div', 'formulaire');

    let lire;                       // renvoie l'objet à enregistrer, ou null
    let enregistrer;                // écrit dans le magasin
    let supprimer = null;

    if (d.type === 'terme') {
      const existant = d.id ? await Store.lireTermePerso(d.id) : null;
      const sNom = saisieTexte('e-nom', existant ? existant.nom : (d.nom || ''), { mono: true, maxlength: 60 });
      form.appendChild(champ(t('editeur.nom'), t('editeur.nom-aide'), sNom, 'e-nom'));
      const options = Glossaire.categories.map((c) => [c.id, c[I18n.langue === 'en' ? 'en' : 'fr']]);
      options.push(['autre', t('cat.autre')]);
      const sCat = choix('e-cat', options, existant ? existant.cat : 'autre');
      form.appendChild(champ(t('editeur.categorie'), '', sCat, 'e-cat'));
      const sFr = saisieTexte('e-fr', existant ? existant.fr : '', { lignes: 4 });
      form.appendChild(champ(t('editeur.def-fr'), t('editeur.def-aide'), sFr, 'e-fr'));
      const sEn = saisieTexte('e-en', existant ? existant.en : '', { lignes: 4 });
      form.appendChild(champ(t('editeur.def-en'), '', sEn, 'e-en'));
      const sAl = saisieTexte('e-al', existant ? (existant.alias || []).join(', ') : '', { mono: true });
      form.appendChild(champ(t('editeur.alias'), t('editeur.alias-aide'), sAl, 'e-al'));

      lire = () => {
        const nom = sNom.value.trim();
        const fr = sFr.value.trim();
        const en = sEn.value.trim();
        if (!nom) { montrerErreur(t('editeur.erreur-nom')); sNom.focus(); return null; }
        if (!fr && !en) { montrerErreur(t('editeur.erreur-def')); sFr.focus(); return null; }
        const norme = Outils.normaliser(nom);
        const doublon = Glossaire.integres.find((x) => x.cle === norme || x.cleNue === norme);
        if (doublon) { montrerErreur(t('editeur.erreur-doublon', { nom: doublon.n })); return null; }
        const maintenant = Date.now();
        return {
          id: existant ? existant.id : Outils.identifiant('p'),
          nom, cat: sCat.value, fr, en,
          alias: sAl.value.split(',').map((s) => s.trim()).filter(Boolean),
          cree: existant ? existant.cree : maintenant, modifie: maintenant,
        };
      };
      enregistrer = async (objet) => {
        await Store.ecrireTermePerso(objet);
        await recharger();
        document.dispatchEvent(new CustomEvent('perso-change'));
      };
      if (existant) {
        supprimer = async () => {
          const notes = await Store.notesDe('perso:' + existant.id);
          await Store.supprimerTermePerso(existant.id);
          for (const n of notes) await Store.supprimerNote(n.id);
          await Store.modifierSuivi('perso:' + existant.id, (s) => { s.favori = false; s.aRevoir = false; s.vu = 0; s.ok = 0; s.ko = 0; });
          await recharger();
          document.dispatchEvent(new CustomEvent('perso-change'));
          document.dispatchEvent(new CustomEvent('notes-changees'));
          document.dispatchEvent(new CustomEvent('suivi-change'));
          // le terme n'existe plus : on referme aussi sa fiche, et l'entrée
          // d'historique du panneau avec elle
          fermerSansHistorique();
          Fiche.fermer(1);
        };
      }
    } else {
      const terme = Glossaire.parId(d.note ? d.note.ref : d.ref);
      if (terme) form.appendChild(element('p', 'editeur-pour', t('editeur.pour', { terme: terme.n })));
      const note = d.note || null;
      const sTitre = saisieTexte('e-titre', note ? note.titre : '', { maxlength: 80 });
      form.appendChild(champ(t('editeur.titre'), '', sTitre, 'e-titre'));
      if (d.type === 'note') {
        const sTexte = saisieTexte('e-texte', note ? note.texte : '', { lignes: 7 });
        form.appendChild(champ(t('editeur.texte'), t('editeur.texte-aide'), sTexte, 'e-texte'));
        lire = () => {
          const texte = sTexte.value.trim();
          if (!texte) { montrerErreur(t('editeur.erreur-texte')); sTexte.focus(); return null; }
          const maintenant = Date.now();
          return {
            id: note ? note.id : Outils.identifiant('n'), ref: note ? note.ref : d.ref, type: 'note',
            titre: sTitre.value.trim(), texte, cree: note ? note.cree : maintenant, modifie: maintenant,
          };
        };
      } else {
        const langages = Surlignage.LANGAGES.map((l) => [l, l === 'text' ? t('langage.text') : Surlignage.NOMS[l]]);
        const sLang = choix('e-langage', langages, note ? note.langage : 'bash');
        form.appendChild(champ(t('editeur.langage'), '', sLang, 'e-langage'));
        const sCode = saisieTexte('e-code', note ? note.code : '', { lignes: 9, mono: true });
        form.appendChild(champ(t('editeur.code'), '', sCode, 'e-code'));
        const sCom = saisieTexte('e-com', note ? note.texte : '', { lignes: 3 });
        form.appendChild(champ(t('editeur.commentaire'), '', sCom, 'e-com'));
        lire = () => {
          const code = sCode.value.replace(/\s+$/, '');
          if (!code.trim()) { montrerErreur(t('editeur.erreur-code')); sCode.focus(); return null; }
          const maintenant = Date.now();
          return {
            id: note ? note.id : Outils.identifiant('n'), ref: note ? note.ref : d.ref, type: 'exemple',
            titre: sTitre.value.trim(), langage: sLang.value, code, texte: sCom.value.trim(),
            cree: note ? note.cree : maintenant, modifie: maintenant,
          };
        };
      }
      enregistrer = async (objet) => {
        await Store.ecrireNote(objet);
        document.dispatchEvent(new CustomEvent('notes-changees'));
      };
      if (note) {
        supprimer = async () => {
          const copie = Object.assign({}, note);
          await Store.supprimerNote(note.id);
          document.dispatchEvent(new CustomEvent('notes-changees'));
          fermer();
          Outils.annoncer(t('mes.supprime'), async () => {
            await Store.ecrireNote(copie);
            document.dispatchEvent(new CustomEvent('notes-changees'));
          }, t('mes.annuler'));
        };
      }
    }

    form.appendChild(erreur);
    const pied = element('div', 'pied-formulaire');
    const ligne = element('div', 'ligne-boutons');
    ligne.appendChild(bouton('bouton-principal', t('editeur.enregistrer'), async () => {
      montrerErreur('');
      const objet = lire();
      if (!objet) return;
      try {
        await enregistrer(objet);
        fermer();
        Outils.annoncer(t('editeur.enregistre'));
      } catch (e) {
        montrerErreur(t('editeur.echec', { detail: e && e.message ? e.message : e }));
      }
    }));
    ligne.appendChild(bouton('bouton-discret', t('editeur.annuler'), fermer));
    pied.appendChild(ligne);
    if (supprimer) {
      const b = bouton('lien-discret supprimer', t('editeur.supprimer'), async () => {
        if (!etat.confirmation) {
          etat.confirmation = true;
          b.textContent = t('editeur.confirmer-supprimer');
          setTimeout(() => { etat.confirmation = false; b.textContent = t('editeur.supprimer'); }, 4000);
          return;
        }
        try { await supprimer(); } catch (e) { montrerErreur(t('editeur.echec', { detail: e && e.message ? e.message : e })); }
      });
      pied.appendChild(b);
    }
    form.appendChild(pied);
    corps.appendChild(form);
  }

  /* Recharge les termes à soi dans l'index de recherche. */
  async function recharger() {
    const perso = await Store.tousLesTermesPerso().catch(() => []);
    Glossaire.reconstruire(perso);
  }

  function brancher() {
    conteneur = document.getElementById('editeur');
    corps = document.getElementById('editeur-contenu');
    document.addEventListener('langue-changee', () => { if (etat.ouvert) dessiner(); });
  }

  racine.Editeur = {
    brancher, ouvrir, fermer, fermerSansHistorique, recharger,
    get ouvert() { return etat.ouvert; },
  };

})(window);
