'use strict';
/*
 * Sauvegarde : tout ce qui est à soi, dans un fichier, et retour.
 *
 * Rien ne quitte l'appareil de lui-même ; c'est précisément pourquoi il faut un
 * moyen de tout emporter en changeant de téléphone. Le fichier contient les
 * notes et les exemples, les termes ajoutés, le suivi (favoris, « à revoir »,
 * réponses au quiz) et les réglages — pas le glossaire, qui est dans
 * l'application.
 *
 * ── Recharger, c'est fusionner ─────────────────────────────────────────────
 *
 * Recharger un fichier n'efface rien. Chaque élément est rapproché de celui qui
 * porte le même identifiant, et c'est le plus récent qui l'emporte : une note
 * modifiée hier sur le téléphone n'est pas écrasée par la version de la
 * semaine dernière sur la tablette. Le bilan dit ce qui a été ajouté, mis à
 * jour ou laissé tel quel. Pour le suivi (un par terme), on garde le plus
 * avancé : les favoris s'additionnent, les compteurs prennent le plus grand.
 */
(function (racine) {

  const { element, bouton } = Outils;
  const { t, plur } = I18n;
  const FORMAT = 1;
  /* L'application s'appelait « Code en clair » : cette marque, écrite dans
   * chaque fichier de sauvegarde, garde l'ancien nom — la changer ferait
   * refuser toutes les sauvegardes déjà faites. */
  const APPLICATION = 'code-en-clair';

  async function exporter() {
    const [notes, perso, suivis, reglages] = await Promise.all([
      Store.toutesLesNotes(), Store.tousLesTermesPerso(), Store.tousLesSuivis(), Store.lireReglages(),
    ]);
    const donnees = {
      application: APPLICATION, format: FORMAT, date: new Date().toISOString(),
      reglages, notes, perso, suivis,
    };
    const texte = JSON.stringify(donnees, null, 1);
    const fichier = new Blob([texte], { type: 'application/json' });
    const nom = 'lexicode-' + new Date().toISOString().slice(0, 10) + '.json';
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(fichier);
    lien.download = nom;
    document.body.appendChild(lien);
    lien.click();
    setTimeout(() => { URL.revokeObjectURL(lien.href); lien.remove(); }, 1000);
    return { nom, octets: fichier.size, notes: notes.length, perso: perso.length, suivis: suivis.length };
  }

  function valide(d) {
    return !!d && d.application === APPLICATION && typeof d.format === 'number'
      && d.format <= FORMAT && Array.isArray(d.notes);
  }

  async function fusionner(d) {
    const bilan = { ajoutes: 0, misAJour: 0, inchanges: 0 };

    async function unir(liste, lire, ecrire, cle, date) {
      for (const x of liste || []) {
        if (!x || !x[cle]) continue;
        const present = await lire(x[cle]);
        if (!present) { await ecrire(x); bilan.ajoutes += 1; }
        else if ((date(x) || 0) > (date(present) || 0)) { await ecrire(x); bilan.misAJour += 1; }
        else bilan.inchanges += 1;
      }
    }
    await unir(d.notes, Store.lireNote, Store.ecrireNote, 'id', (n) => n.modifie);
    await unir(d.perso, Store.lireTermePerso, Store.ecrireTermePerso, 'id', (n) => n.modifie);

    for (const s of d.suivis || []) {
      if (!s || !s.ref) continue;
      const present = await Store.lireSuivi(s.ref);
      const fusion = {
        ref: s.ref,
        favori: !!(present.favori || s.favori),
        aRevoir: (s.dernier || 0) > (present.dernier || 0) ? !!s.aRevoir : !!present.aRevoir,
        vu: Math.max(present.vu || 0, s.vu || 0),
        ok: Math.max(present.ok || 0, s.ok || 0),
        ko: Math.max(present.ko || 0, s.ko || 0),
        serie: (s.dernier || 0) > (present.dernier || 0) ? (s.serie || 0) : (present.serie || 0),
        dernier: Math.max(present.dernier || 0, s.dernier || 0),
      };
      if (JSON.stringify(fusion) === JSON.stringify(present)) { bilan.inchanges += 1; continue; }
      await Store.ecrireSuivi(fusion);
      bilan.misAJour += 1;
    }
    await Editeur.recharger();
    document.dispatchEvent(new CustomEvent('perso-change'));
    document.dispatchEvent(new CustomEvent('notes-changees'));
    document.dispatchEvent(new CustomEvent('suivi-change'));
    return bilan;
  }

  function dessiner(zone) {
    zone.textContent = '';
    const ligne = element('div', 'ligne-boutons ligne-sauvegarde');
    const retour = element('p', 'discret retour-sauvegarde', '');
    retour.setAttribute('role', 'status');
    ligne.appendChild(bouton('bouton-discret', t('sauv.enregistrer'), async () => {
      try {
        const r = await exporter();
        retour.textContent = t('sauv.fichier', {
          nom: r.nom, taille: Outils.humain(r.octets, I18n.langue),
          notes: plur('sauv.notes', r.notes), termes: plur('sauv.termes', r.perso), suivis: plur('sauv.suivis', r.suivis),
        });
      } catch (e) {
        retour.textContent = t('sauv.echec', { detail: e && e.message ? e.message : e });
      }
    }));
    const choix = element('input');
    choix.type = 'file';
    choix.accept = 'application/json,.json';
    choix.hidden = true;
    choix.addEventListener('change', async () => {
      const fichier = choix.files && choix.files[0];
      choix.value = '';
      if (!fichier) return;
      try {
        const d = JSON.parse(await fichier.text());
        if (!valide(d)) throw new Error(t('sauv.pas-une-sauvegarde'));
        const b = await fusionner(d);
        retour.textContent = t('sauv.recharge', { ajoutes: b.ajoutes, maj: b.misAJour, inchanges: b.inchanges });
      } catch (e) {
        retour.textContent = t('sauv.impossible', { detail: e && e.message ? e.message : e });
      }
    });
    ligne.appendChild(bouton('bouton-discret', t('sauv.recharger'), () => choix.click()));
    zone.appendChild(ligne);
    zone.appendChild(choix);
    zone.appendChild(retour);
  }

  racine.Sauvegarde = { exporter, fusionner, valide, dessiner, FORMAT };

})(window);
