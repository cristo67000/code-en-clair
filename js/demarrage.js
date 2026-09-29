'use strict';
/*
 * Amorçage : réglages, glossaire, termes à soi, service worker.
 *
 * Le service worker est enregistré en dernier, une fois l'application à
 * l'écran : il sert au deuxième lancement, pas au premier, et le retarder
 * évite de disputer la bande passante aux fichiers dont l'affichage a besoin
 * tout de suite. Son enregistrement est confié à `MiseAJour`, qui surveille
 * l'arrivée d'une version et se charge de l'annoncer.
 */
(function () {

  async function demarrer() {
    const ecran = document.getElementById('demarrage');

    let reglages;
    try {
      reglages = await Store.lireReglages();
    } catch (erreur) {
      // Une navigation privée peut refuser IndexedDB : on ouvre quand même le
      // glossaire, sans mémoire.
      reglages = Object.assign({}, Store.DEFAUTS);
    }
    I18n.definir(reglages.langue);

    let manifeste = null;
    try {
      const reponse = await fetch('data/manifeste.json');
      if (!reponse.ok) throw new Error('manifeste : ' + reponse.status);
      manifeste = await reponse.json();
      await Glossaire.charger(manifeste);
      await Editeur.recharger().catch(() => {});
      App.brancher({ reglages, manifeste });
      ecran.classList.add('parti');
      setTimeout(() => { ecran.hidden = true; }, 300);
    } catch (erreur) {
      ecran.textContent = '';
      ecran.appendChild(Outils.element('p', null, I18n.t('demarrage.echec')));
      ecran.appendChild(Outils.element('p', 'discret',
        String(erreur && erreur.message ? erreur.message : erreur)));
      ecran.appendChild(Outils.bouton('bouton-discret', I18n.t('reessayer'), () => location.reload()));
      return;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then((enregistrement) => MiseAJour.surveiller(enregistrement))
        .catch((erreur) => console.warn('Lexicode : service worker non installé —', erreur));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();

})();
