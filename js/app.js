'use strict';
/*
 * Le chef d'orchestre : les réglages, les onglets, l'historique.
 *
 * Quatre onglets (Glossaire, Quiz, Carnet, Réglages), une fiche et un éditeur
 * qui s'ouvrent par-dessus. Ce module tient les réglages en mémoire (les autres
 * modules les lisent par `App.reglages`), les applique au document — langue,
 * thème, taille du texte —, aiguille le geste « retour » du téléphone, et
 * branche chaque écran une fois.
 */
(function (racine) {

  let reglages = Object.assign({}, Store.DEFAUTS);
  let vue = 'glossaire';
  const VUES = ['glossaire', 'quiz', 'carnet', 'reglages'];
  const TAILLES = [14.5, 16, 18, 20.5];

  /* Pose langue, thème et taille du texte sur le document.
   *
   * Le thème « automatique » retire l'attribut : c'est alors la préférence du
   * téléphone (prefers-color-scheme) qui décide. La taille se règle sur la
   * racine ; toute la feuille de style est en rem. Ces deux écritures passent
   * par le DOM et le CSSOM, pas par un attribut « style » — la politique de
   * sécurité de la page les accepte. */
  function appliquerReglages() {
    const html = document.documentElement;
    if (reglages.theme === 'clair' || reglages.theme === 'sombre') html.setAttribute('data-theme', reglages.theme);
    else html.removeAttribute('data-theme');
    html.style.fontSize = (TAILLES[reglages.taille] || 16) + 'px';
    if (I18n.langue !== reglages.langue) I18n.definir(reglages.langue);
    document.dispatchEvent(new CustomEvent('reglages-changes'));
  }

  async function ecrireReglage(cle, valeur) {
    reglages[cle] = valeur;
    try { await Store.ecrireReglage(cle, valeur); } catch (erreur) { /* navigation privée : on garde en mémoire */ }
    return valeur;
  }

  // ── Onglets ───────────────────────────────────────────────────────────────

  function aller(nom) {
    if (!VUES.includes(nom)) return;
    vue = nom;
    for (const v of VUES) {
      document.getElementById('vue-' + v).hidden = v !== nom;
    }
    for (const b of document.querySelectorAll('#onglets button')) {
      if (b.getAttribute('data-vue') === nom) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    }
    if (nom === 'quiz') Quiz.montrer();
    if (nom === 'carnet') Carnet.dessiner();
    if (nom === 'reglages') Reglages.dessiner();
    racine.scrollTo(0, 0);
  }

  // ── Le geste « retour » ───────────────────────────────────────────────────

  function surRetour(e) {
    /* Un recul que nous avons nous-mêmes provoqué, l'écran étant déjà fermé :
     * rien à défaire (voir Outils.reculer). */
    if (racine.reculsAttendus > 0) { racine.reculsAttendus -= 1; return; }
    const s = e.state || {};
    if (Editeur.ouvert && !s.editeur) Editeur.fermerSansHistorique();
    if (Fiche.ouverte) {
      if (s.fiche) Fiche.revenirA(s.fiche);
      else Fiche.fermerSansHistorique();
    }
  }

  function brancher(donnees) {
    reglages = Object.assign(reglages, donnees.reglages);
    I18n.definir(reglages.langue);
    appliquerReglages();

    Fiche.brancher();
    Editeur.brancher();
    Carnet.brancher();
    Quiz.brancher();
    Reglages.brancher({ manifeste: donnees.manifeste });
    Liste.brancher();

    for (const b of document.querySelectorAll('#onglets button')) {
      b.addEventListener('click', () => {
        if (b.getAttribute('data-vue') === vue) racine.scrollTo({ top: 0, behavior: 'smooth' });
        else aller(b.getAttribute('data-vue'));
      });
    }
    racine.addEventListener('popstate', surRetour);
    /* Un rechargement garde l'état de l'historique : on repart d'une entrée
     * neutre, sans quoi « retour » rouvrirait une fiche que rien n'affiche. */
    try { racine.history.replaceState(null, ''); } catch (erreur) { /* rien */ }

    // Depuis l'accueil de l'application, l'adresse « ?terme=commit » ouvre une fiche
    // (utile pour les essais et pour un partage précis).
    const demande = new URLSearchParams(racine.location.search).get('terme');
    if (demande && Glossaire.parId(demande)) Fiche.ouvrir(demande);
  }

  racine.App = {
    brancher, aller, appliquerReglages, ecrireReglage,
    get reglages() { return reglages; },
    get vue() { return vue; },
    /* La langue des définitions quand il en faut une seule (aperçus, quiz). */
    langueDef() { return reglages.definitions === 'les-deux' ? I18n.langue : reglages.definitions; },
  };

})(window);
