'use strict';
/*
 * L'onglet « Réglages » : langue, définitions affichées, taille du texte,
 * thème, raccourcis clavier, sauvegarde, installation, mise à jour, à propos.
 *
 * L'écran est redessiné en entier à chaque changement de langue : tous ses
 * textes sont écrits ici, en JavaScript, et il n'y a pas d'autre moyen de les
 * garder d'accord avec la langue choisie.
 */
(function (racine) {

  const { element, bouton } = Outils;
  const { t } = I18n;
  let zone = null;
  let infos = { version: '…', manifeste: null };

  function segments(valeurs, actuelle, action, libelle) {
    const g = element('div', 'segments');
    g.setAttribute('role', 'group');
    for (const v of valeurs) {
      const b = bouton('', libelle(v), () => action(v));
      b.setAttribute('aria-pressed', String(v) === String(actuelle) ? 'true' : 'false');
      g.appendChild(b);
    }
    return g;
  }

  function bloc(titre) {
    const b = element('section', 'bloc');
    b.appendChild(element('h3', null, titre));
    return b;
  }

  async function changer(cle, valeur) {
    await App.ecrireReglage(cle, valeur);
    App.appliquerReglages();
    dessiner();
  }

  async function dessiner() {
    if (!zone) return;
    const r = App.reglages;
    zone.textContent = '';
    zone.appendChild(element('h2', null, t('reg.titre')));

    // Langue de l'interface et définitions affichées
    const langues = bloc(t('reg.langue'));
    langues.appendChild(segments(['fr', 'en'], r.langue, (v) => changer('langue', v), (v) => t('reg.langue.' + v)));
    langues.appendChild(element('h4', null, t('reg.definitions')));
    langues.appendChild(segments(['les-deux', 'fr', 'en'], r.definitions, (v) => changer('definitions', v), (v) => t('reg.definitions.' + v)));
    langues.appendChild(element('p', 'discret', t('reg.definitions.aide')));
    zone.appendChild(langues);

    // Affichage
    const affichage = bloc(t('reg.affichage'));
    affichage.appendChild(element('h4', null, t('reg.taille')));
    affichage.appendChild(segments([0, 1, 2, 3], r.taille, (v) => changer('taille', v), (v) => t('reg.taille.' + v)));
    affichage.appendChild(element('h4', null, t('reg.theme')));
    affichage.appendChild(segments(['auto', 'clair', 'sombre'], r.theme, (v) => changer('theme', v), (v) => t('reg.theme.' + v)));
    zone.appendChild(affichage);

    // Le clavier — sur un ordinateur seulement (voir app.css)
    const clavier = bloc(t('reg.clavier'));
    clavier.classList.add('seulement-clavier');
    const mac = /Mac|iPhone|iPad/.test(racine.navigator.platform || racine.navigator.userAgent);
    const raccourcis = element('dl', 'raccourcis');
    for (const [touches, cle] of [
      [['/', mac ? '⌘ K' : 'Ctrl K'], 'reg.clavier.chercher'],
      [['↑', '↓'], 'reg.clavier.parcourir'],
      [[t('reg.clavier.entree')], 'reg.clavier.ouvrir'],
      [[t('reg.clavier.echap')], 'reg.clavier.fermer'],
      [['1 – 4', t('reg.clavier.entree')], 'reg.clavier.repondre'],
      [[t('reg.clavier.espace'), '←', '→'], 'reg.clavier.cartes'],
    ]) {
      const dt = element('dt');
      for (const k of touches) dt.appendChild(element('kbd', 'raccourci-touche', k));
      raccourcis.appendChild(dt);
      raccourcis.appendChild(element('dd', null, t(cle)));
    }
    clavier.appendChild(raccourcis);
    zone.appendChild(clavier);

    // Sauvegarde
    const sauv = bloc(t('reg.sauvegarde'));
    sauv.appendChild(element('p', 'discret', t('reg.sauvegarde.aide')));
    const zoneSauv = element('div');
    sauv.appendChild(zoneSauv);
    Sauvegarde.dessiner(zoneSauv);
    sauv.appendChild(bouton('lien-discret', t('reg.effacer-historique'), async () => {
      await Store.effacerHistorique().catch(() => {});
      Outils.annoncer(t('reg.historique-efface'));
      document.dispatchEvent(new CustomEvent('fiche-fermee'));
    }));
    zone.appendChild(sauv);

    // Installation
    const inst = bloc(t('reg.installer'));
    const zoneInst = element('div');
    inst.appendChild(zoneInst);
    zone.appendChild(inst);
    Installer.dessinerInstallation(inst, zoneInst);

    // Partage
    const part = bloc(t('reg.partager'));
    const zonePart = element('div');
    part.appendChild(zonePart);
    zone.appendChild(part);
    Installer.dessinerPartage(zonePart);

    // À propos
    const ap = bloc(t('reg.apropos'));
    const m = infos.manifeste;
    ap.appendChild(element('p', 'discret', t('reg.version', {
      version: (MiseAJour.version || infos.version), date: m ? Outils.dateLisible(m.construit, I18n.langue) : '…',
      n: m ? m.termes : '…', s: m ? m.schemas : '…',
    })));
    const ligne = element('div', 'ligne-maj');
    const etatMaj = element('span', 'discret', '');
    ligne.appendChild(bouton('bouton-discret', t('reg.maj.verifier'), async () => {
      etatMaj.textContent = '…';
      const resultat = await MiseAJour.verifier(true);
      const cles = { prete: 'reg.maj.prete', 'en-cours': 'reg.maj.encours', 'a-jour': 'reg.maj.a-jour', echec: 'reg.maj.echec', 'sans-service-worker': 'reg.maj.sans-sw', 'trop-tot': 'reg.maj.a-jour' };
      etatMaj.textContent = t(cles[resultat] || 'reg.maj.a-jour');
    }));
    ligne.appendChild(etatMaj);
    ap.appendChild(ligne);
    ap.appendChild(element('p', 'discret', t('reg.apropos.texte')));
    const lien = element('a', null, t('reg.confidentialite'));
    lien.href = 'confidentialite.html';
    const p = element('p');
    p.appendChild(lien);
    ap.appendChild(p);
    zone.appendChild(ap);
  }

  function brancher(donnees) {
    zone = document.getElementById('reglages-contenu');
    infos = Object.assign(infos, donnees || {});
    document.addEventListener('langue-changee', () => { if (App.vue === 'reglages') dessiner(); });
    dessiner();
    Installer.surChangement(() => { if (App.vue === 'reglages') dessiner(); });
  }

  racine.Reglages = { brancher, dessiner };

})(window);
