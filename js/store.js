'use strict';
/*
 * Stockage local — IndexedDB.
 *
 * Rien ne sort de l'appareil : pas de compte, pas de serveur, pas de mesure
 * d'audience. Le glossaire lui-même n'est pas ici — il est dans le cache du
 * service worker, en fichier ; ici ne vit que ce qui appartient à la personne
 * qui s'en sert.
 *
 * Cinq magasins :
 *   reglages    une ligne par réglage
 *   notes       les notes ET les exemples de code que l'on ajoute à un terme
 *   perso       les termes qu'on a entrés soi-même
 *   suivi       par terme : favori, « à revoir », réponses justes et fausses
 *   historique  les termes récemment consultés
 *
 * ── Des références, jamais des copies ───────────────────────────────────────
 *
 * Une note, un favori, un suivi désignent leur terme par une référence :
 *
 *   commit          un terme du glossaire (son identifiant)
 *   perso:p-1a2b3c  un terme à soi, par son identifiant stable
 *
 * Le glossaire peut donc être enrichi ou corrigé dans une version suivante sans
 * rien perdre : les notes retrouvent leur terme par son identifiant.
 */
(function (racine) {

  // l'ancien nom de l'application ; le changer ferait perdre à chacun ses notes
  const NOM = 'code-en-clair';
  const VERSION = 1;
  let bd = null;

  function ouvrir() {
    if (bd) return Promise.resolve(bd);
    return new Promise((resoudre, rejeter) => {
      if (!racine.indexedDB) { rejeter(new Error('IndexedDB indisponible')); return; }
      const demande = indexedDB.open(NOM, VERSION);
      demande.onupgradeneeded = (e) => {
        const base = e.target.result;
        if (!base.objectStoreNames.contains('reglages')) {
          base.createObjectStore('reglages', { keyPath: 'cle' });
        }
        if (!base.objectStoreNames.contains('notes')) {
          const magasin = base.createObjectStore('notes', { keyPath: 'id' });
          magasin.createIndex('ref', 'ref', { unique: false });
          magasin.createIndex('modifie', 'modifie', { unique: false });
        }
        if (!base.objectStoreNames.contains('perso')) {
          const magasin = base.createObjectStore('perso', { keyPath: 'id' });
          magasin.createIndex('modifie', 'modifie', { unique: false });
        }
        if (!base.objectStoreNames.contains('suivi')) {
          base.createObjectStore('suivi', { keyPath: 'ref' });
        }
        if (!base.objectStoreNames.contains('historique')) {
          const magasin = base.createObjectStore('historique', { keyPath: 'ref' });
          magasin.createIndex('quand', 'quand', { unique: false });
        }
      };
      demande.onsuccess = () => {
        bd = demande.result;
        /* Un autre onglet qui demanderait une version supérieure resterait
         * bloqué tant que celui-ci garde la base ouverte. */
        bd.onversionchange = () => { bd.close(); bd = null; };
        resoudre(bd);
      };
      demande.onerror = () => rejeter(demande.error);
    });
  }

  function transaction(magasins, mode) {
    return ouvrir().then((base) => base.transaction(magasins, mode));
  }

  function promesse(requete) {
    return new Promise((resoudre, rejeter) => {
      requete.onsuccess = () => resoudre(requete.result);
      requete.onerror = () => rejeter(requete.error);
    });
  }

  /* Les opérations élémentaires sur un magasin, écrites une fois. */
  async function lire(magasin, cle_) {
    const t = await transaction([magasin], 'readonly');
    return promesse(t.objectStore(magasin).get(cle_));
  }
  async function ecrire(magasin, valeur) {
    const t = await transaction([magasin], 'readwrite');
    await promesse(t.objectStore(magasin).put(valeur));
    return valeur;
  }
  async function effacer(magasin, cle_) {
    const t = await transaction([magasin], 'readwrite');
    return promesse(t.objectStore(magasin).delete(cle_));
  }
  async function tout(magasin) {
    const t = await transaction([magasin], 'readonly');
    return promesse(t.objectStore(magasin).getAll());
  }
  async function vider(magasin) {
    const t = await transaction([magasin], 'readwrite');
    return promesse(t.objectStore(magasin).clear());
  }

  // ── Réglages ──────────────────────────────────────────────────────────────

  function langueDuTelephone() {
    const l = (racine.navigator.language || 'fr').toLowerCase();
    return l.startsWith('fr') ? 'fr' : 'en';
  }

  const DEFAUTS = {
    langue: langueDuTelephone(),   // langue de l'interface : 'fr' | 'en'
    definitions: 'les-deux',       // 'les-deux' | 'fr' | 'en'
    taille: 1,                     // 0 petit · 1 normal · 2 grand · 3 très grand
    theme: 'auto',                 // 'auto' | 'clair' | 'sombre'
    quizSens: 'mixte',             // 'mixte' | 'def-terme' | 'terme-def'
    quizLangue: 'interface',       // 'interface' | 'fr' | 'en' | 'mixte'
    quizNombre: 10,
    quizMode: 'qcm',               // 'qcm' (quatre choix) | 'cartes' (à retourner)
  };

  async function lireReglages() {
    const lignes = await tout('reglages');
    const valeurs = Object.assign({}, DEFAUTS);
    for (const ligne of lignes) valeurs[ligne.cle] = ligne.valeur;
    return valeurs;
  }

  function ecrireReglage(cle_, valeur) {
    return ecrire('reglages', { cle: cle_, valeur }).then(() => valeur);
  }

  // ── Notes et exemples ─────────────────────────────────────────────────────

  function notesDe(ref) {
    return transaction(['notes'], 'readonly')
      .then((t) => promesse(t.objectStore('notes').index('ref').getAll(ref)));
  }

  // ── Suivi d'un terme ──────────────────────────────────────────────────────

  function suiviVide(ref) {
    return { ref, favori: false, aRevoir: false, vu: 0, ok: 0, ko: 0, serie: 0, dernier: 0 };
  }

  async function lireSuivi(ref) {
    return (await lire('suivi', ref)) || suiviVide(ref);
  }

  /* Modifie le suivi d'un terme par une fonction, et l'écrit. Une ligne
   * devenue sans intérêt (rien de coché, jamais vu, jamais interrogé) est
   * supprimée : le magasin ne grossit pas pour rien. */
  async function modifierSuivi(ref, modification) {
    const t = await transaction(['suivi'], 'readwrite');
    const magasin = t.objectStore('suivi');
    const actuel = (await promesse(magasin.get(ref))) || suiviVide(ref);
    modification(actuel);
    if (!actuel.favori && !actuel.aRevoir && !actuel.vu && !actuel.ok && !actuel.ko) {
      await promesse(magasin.delete(ref));
    } else {
      await promesse(magasin.put(actuel));
    }
    return actuel;
  }

  // ── Historique de consultation ────────────────────────────────────────────

  const HISTORIQUE_MAX = 30;

  async function consulter(ref) {
    const t = await transaction(['historique'], 'readwrite');
    const magasin = t.objectStore('historique');
    await promesse(magasin.put({ ref, quand: Date.now() }));
    const lignes = await promesse(magasin.index('quand').getAll());
    for (const vieux of lignes.slice(0, Math.max(0, lignes.length - HISTORIQUE_MAX))) {
      magasin.delete(vieux.ref);
    }
  }

  async function historique() {
    const t = await transaction(['historique'], 'readonly');
    const lignes = await promesse(t.objectStore('historique').index('quand').getAll());
    return lignes.reverse();
  }

  racine.Store = {
    ouvrir, DEFAUTS,
    lireReglages, ecrireReglage,
    lireNote: (id) => lire('notes', id),
    ecrireNote: (note) => ecrire('notes', note),
    supprimerNote: (id) => effacer('notes', id),
    toutesLesNotes: () => tout('notes'),
    notesDe,
    lireTermePerso: (id) => lire('perso', id),
    ecrireTermePerso: (terme) => ecrire('perso', terme),
    supprimerTermePerso: (id) => effacer('perso', id),
    tousLesTermesPerso: () => tout('perso'),
    lireSuivi, modifierSuivi, tousLesSuivis: () => tout('suivi'),
    ecrireSuivi: (ligne) => ecrire('suivi', ligne),
    consulter, historique,
    effacerHistorique: () => vider('historique'),
    vider,
  };

})(window);
