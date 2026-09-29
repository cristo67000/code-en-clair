'use strict';
/*
 * Installer l'application, et la partager.
 *
 * Une application web installable l'est déjà techniquement — le navigateur
 * propose « Ajouter à l'écran d'accueil » quelque part dans son menu. Encore
 * faut-il le savoir. D'où un bouton explicite, dans trois cas :
 *
 *   Android, Chrome, Edge   `beforeinstallprompt` est émis ; on le retient et
 *                           on le déclenche au clic.
 *   iOS, Safari             rien ne se déclenche par programme ; on explique
 *                           le geste : Partager, puis « Sur l'écran d'accueil ».
 *   déjà installée          on n'affiche rien — c'est aussi le cas dans
 *                           l'application du Play Store, qui s'ouvre en plein
 *                           écran comme une application installée.
 */
(function (racine) {

  const { element, bouton } = Outils;
  const { t } = I18n;
  const ADRESSE = 'https://cristo67000.github.io/code-en-clair/';

  let invite = null;
  let ecouteur = null;

  function estInstallee() {
    return racine.matchMedia('(display-mode: standalone)').matches
      || racine.matchMedia('(display-mode: fullscreen)').matches
      || racine.navigator.standalone === true;
  }

  function estApple() {
    const ua = racine.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua)
      || (/Macintosh/.test(ua) && racine.navigator.maxTouchPoints > 1);
  }

  function prevenir() { if (ecouteur) ecouteur(); }

  racine.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    invite = e;
    prevenir();
  });

  racine.addEventListener('appinstalled', () => {
    invite = null;
    prevenir();
  });

  /* Remplit `zone` et cache le bloc `bloc` quand il n'y a rien à proposer. */
  function dessinerInstallation(bloc, zone) {
    zone.textContent = '';
    if (estInstallee()) { bloc.hidden = true; return; }

    if (invite) {
      bloc.hidden = false;
      zone.appendChild(element('p', 'discret', t('reg.installer.aide')));
      const b = bouton('bouton-principal', t('reg.installer.bouton'), async () => {
        b.disabled = true;
        try {
          invite.prompt();
          const choix = await invite.userChoice;
          if (choix && choix.outcome === 'accepted') invite = null;
        } catch (erreur) {
          invite = null;
        }
        prevenir();
      });
      zone.appendChild(b);
      return;
    }

    if (estApple()) {
      bloc.hidden = false;
      const marche = element('ol', 'marche-a-suivre');
      for (const cle of ['reg.installer.ios-1', 'reg.installer.ios-2', 'reg.installer.ios-3']) {
        marche.appendChild(element('li', null, t(cle)));
      }
      zone.appendChild(marche);
      return;
    }
    bloc.hidden = true;
  }

  function dessinerPartage(zone) {
    zone.textContent = '';
    const retour = element('p', 'discret retour-partage', '');
    retour.hidden = true;
    zone.appendChild(bouton('bouton-discret', t('reg.partager.bouton'), async () => {
      const contenu = { title: t('app.nom'), text: t('reg.partager.texte'), url: ADRESSE };
      if (racine.navigator.share) {
        try { await racine.navigator.share(contenu); return; } catch (erreur) {
          if (erreur && erreur.name === 'AbortError') return;
        }
      }
      try {
        await racine.navigator.clipboard.writeText(ADRESSE);
        retour.textContent = t('reg.partager.copie');
      } catch (erreur) {
        retour.textContent = ADRESSE;
      }
      retour.hidden = false;
    }));
    zone.appendChild(element('p', 'adresse-partage', ADRESSE));
    zone.appendChild(retour);
  }

  racine.Installer = {
    dessinerInstallation, dessinerPartage, estInstallee, estApple, ADRESSE,
    surChangement: (f) => { ecouteur = f; },
  };

})(window);
