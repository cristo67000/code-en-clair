'use strict';
/*
 * Schémas de la catégorie « Android et mobile ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'mobile-webview': {
      k: 'pile',
      alt: ['Une application hybride : le code de l’application, une WebView, le moteur web, Android', 'A hybrid app: the app’s code, a WebView, the web engine, Android'],
      piles: [{
        t: ['Une application qui affiche du web', 'An app that displays web content'],
        layers: [
          { t: ['Application', 'App'], d: ['votre code (Kotlin, Java)', 'your code (Kotlin, Java)'], s: 'a' },
          { t: 'WebView', d: ['le composant qui affiche des pages', 'the component that displays pages'], s: 'v' },
          { t: ['Moteur web', 'Web engine'], d: 'Chromium : HTML · CSS · JavaScript', s: 'warn' },
          { t: 'Android', d: ['le système', 'the system'], s: 'mute' },
        ],
      }],
    },

    'mobile-apk-aab': {
      k: 'graphe',
      alt: ['Vous envoyez un AAB ; Google Play en tire un APK adapté à chaque appareil', 'You upload an AAB; Google Play derives a tailored APK for each device'],
      gy: 76,
      n: [
        { id: 'a', t: 'AAB', sub: ['un seul paquet', 'one package'], c: 0, r: 0.5, f: 'file', s: 'a', w: 90, h: 52, mono: true },
        { id: 'p', t: 'Google Play', c: 1, r: 0.5, f: 'cloud', s: 'v', w: 96, h: 56, sz: 11 },
        { id: 'x', t: ['APK\ntéléphone', 'APK\nphone'], c: 2, r: 0, s: 'ok', w: 90 },
        { id: 'y', t: ['APK\ntablette', 'APK\ntablet'], c: 2, r: 1, s: 'ok', w: 90 },
      ],
      e: [['a', 'p', ['envoi', 'upload'], 'a'], ['p', 'x', '', 'ok'], ['p', 'y', '', 'ok']],
      anim: [
        { t: ['Vous construisez un seul AAB : tout le code, toutes les ressources, toutes les langues.', 'You build a single AAB: all the code, all the resources, all the languages.'], on: ['a'] },
        { t: ['Vous l’envoyez à Google Play.', 'You upload it to Google Play.'], on: ['a', 'p'], flux: [0] },
        { t: ['À chaque installation, Play en tire un APK sur mesure : la langue, la densité d’écran, le processeur de cet appareil.', 'On each installation, Play derives a tailored APK: the language, the screen density, the processor of that device.'], on: ['p', 'x', 'y'], flux: [1, 2] },
      ],
    },

    'mobile-twa': {
      k: 'graphe',
      alt: ['Une TWA : l’application Android ouvre votre site dans Chrome, en plein écran, après vérification', 'A TWA: the Android app opens your site in Chrome, full screen, after verification'],
      gy: 88,
      n: [
        { id: 'p', t: 'Play Store', c: 0, r: 0, s: 'v', w: 104 },
        { id: 'a', t: ['Application\nAndroid (TWA)', 'Android app\n(TWA)'], c: 0, r: 1, s: 'a', w: 108 },
        { id: 'c', t: ['Chrome\nplein écran', 'Chrome\nfull screen'], c: 1, r: 1, s: 'info', w: 108 },
        { id: 's', t: ['Votre site\n(PWA)', 'Your site\n(PWA)'], c: 1, r: 0, f: 'cloud', s: 'ok', w: 108, h: 54 },
      ],
      e: [['p', 'a', ['installe', 'installs'], 'v'], ['a', 'c', ['ouvre', 'opens'], 'a'], ['c', 's', ['charge', 'loads'], 'info'], ['s', 'a', 'assetlinks.json', 'ok dash']],
      anim: [
        { t: ['Le Play Store installe une petite application Android.', 'The Play Store installs a small Android app.'], on: ['p', 'a'], flux: [0] },
        { t: ['Elle ne contient presque rien : elle ouvre Chrome, en plein écran.', 'It contains almost nothing: it opens Chrome, full screen.'], on: ['a', 'c'], flux: [1] },
        { t: ['Chrome charge votre site : la PWA fait tout le travail.', 'Chrome loads your site: the PWA does all the work.'], on: ['c', 's'], flux: [2] },
        { t: ['La barre d’adresse disparaît seulement si le site déclare l’application dans assetlinks.json.', 'The address bar disappears only if the site declares the app in assetlinks.json.'], on: ['s', 'a'], flux: [3] },
      ],
    },

    'mobile-assetlinks': {
      k: 'sequence',
      lh: 50,
      alt: ['Chrome vérifie que le site déclare bien l’application avant de masquer la barre d’adresse', 'Chrome checks that the site really declares the app before hiding the address bar'],
      a: [['Application', 'App'], 'Chrome', ['Votre site', 'Your site']],
      s: ['a', 'info', 'ok'],
      m: [
        [0, 1, ['ouvre le site', 'opens the site']],
        [1, 2, ['GET /.well-known/\nassetlinks.json', 'GET /.well-known/\nassetlinks.json']],
        [2, 1, ['paquet + empreinte\nSHA-256', 'package + SHA-256\nfingerprint'], 'ok dash'],
        [1, 1, ['correspond ?', 'matches?'], 'warn'],
        [1, 0, ['plein écran', 'full screen'], 'ok dash'],
      ],
      anim: [
        { t: ['L’application ouvre le site.', 'The app opens the site.'], flux: [0] },
        { t: ['Chrome va lire /.well-known/assetlinks.json sur ce site.', 'Chrome goes to read /.well-known/assetlinks.json on that site.'], flux: [1] },
        { t: ['Le fichier dit : « l’application de ce nom, signée avec cette empreinte, est à moi ».', 'The file says: “the app with this name, signed with this fingerprint, is mine”.'], flux: [2] },
        { t: ['Si l’empreinte correspond à celle de l’application installée : plein écran. Sinon, Chrome garde sa barre d’adresse.', 'If the fingerprint matches the installed app’s: full screen. Otherwise, Chrome keeps its address bar.'], on: [3], flux: [4] },
      ],
    },

    'mobile-signature': {
      k: 'graphe',
      alt: ['Vous signez l’AAB avec la clé d’importation ; Google le signe de nouveau avec sa clé avant de l’installer', 'You sign the AAB with the upload key; Google signs it again with its key before installing it'],
      gy: 80,
      n: [
        { id: 'k', t: 'Keystore', sub: ['clé d’importation', 'upload key'], c: 0, r: 0, s: 'warn', w: 100, h: 50 },
        { id: 'a', t: ['AAB signé', 'Signed AAB'], c: 1, r: 0, f: 'file', s: 'a', w: 92 },
        { id: 'p', t: 'Google Play', sub: ['clé de Google', 'Google’s key'], c: 2, r: 0, f: 'cloud', s: 'v', w: 100, h: 58, sz: 11 },
        { id: 'x', t: ['APK signé\npar Google', 'APK signed\nby Google'], c: 2, r: 1, s: 'ok', w: 100 },
        { id: 'u', t: ['Téléphone', 'Phone'], c: 1, r: 1, s: 'ok', w: 92 },
      ],
      e: [['k', 'a', ['signe', 'signs'], 'warn'], ['a', 'p', ['envoi', 'upload'], 'a'], ['p', 'x', ['resigne', 'resigns'], 'v'], ['x', 'u', ['installe', 'installs'], 'ok']],
      anim: [
        { t: ['Votre keystore signe l’AAB avec la clé d’importation.', 'Your keystore signs the AAB with the upload key.'], on: ['k', 'a'], flux: [0] },
        { t: ['Google vérifie cette signature à la réception.', 'Google verifies that signature on receipt.'], on: ['a', 'p'], flux: [1] },
        { t: ['Puis il signe lui-même les APK qu’il distribue, avec la clé de l’application, qu’il garde.', 'Then it signs the APKs it distributes itself, with the app signing key, which it keeps.'], on: ['p', 'x'], flux: [2] },
        { t: ['Le téléphone vérifie cette signature-là : une mise à jour doit venir du même signataire.', 'The phone verifies that signature: an update must come from the same signer.'], on: ['x', 'u'], flux: [3] },
      ],
    },

    'mobile-gradle': {
      k: 'graphe',
      alt: ['Gradle transforme le code et les ressources en APK de test ou en AAB de publication', 'Gradle turns code and resources into a test APK or a release AAB'],
      gy: 80,
      n: [
        { id: 's', t: ['Code +\nressources', 'Code +\nresources'], c: 0, r: 0.5, s: 'a', w: 92 },
        { id: 'g', t: 'Gradle', c: 1, r: 0.5, s: 'v', w: 84 },
        { id: 'a', t: ['APK de test', 'Test APK'], c: 2, r: 0, s: 'ok', w: 92 },
        { id: 'b', t: ['AAB pour\nGoogle Play', 'AAB for\nGoogle Play'], c: 2, r: 1, s: 'ok', w: 92 },
      ],
      e: [['s', 'g', '', 'a'], ['g', 'a', 'debug', 'ok'], ['g', 'b', 'release', 'ok']],
      l: ['assembleDebug produit un APK de test ; bundleRelease produit l’AAB à envoyer à Google Play.', 'assembleDebug produces a test APK; bundleRelease produces the AAB to upload to Google Play.'],
      anim: [
        { t: ['Gradle lit vos sources et vos ressources.', 'Gradle reads your sources and your resources.'], on: ['s', 'g'], flux: [0] },
        { t: ['assembleDebug : un APK de test, à installer directement.', 'assembleDebug: a test APK, to install directly.'], on: ['g', 'a'], flux: [1] },
        { t: ['bundleRelease : l’AAB signé, à envoyer à Google Play.', 'bundleRelease: the signed AAB, to upload to Google Play.'], on: ['g', 'b'], flux: [2] },
      ],
    },

    'mobile-activity': {
      k: 'graphe',
      gy: 72,
      alt: ['Le cycle de vie d’une activité Android : onCreate, onStart, onResume, puis onPause, onStop, onDestroy', 'The lifecycle of an Android activity: onCreate, onStart, onResume, then onPause, onStop, onDestroy'],
      n: [
        { id: 'c', t: 'onCreate', c: 0, r: 0, s: 'a', w: 90, mono: true, sz: 10.5 },
        { id: 's', t: 'onStart', c: 1, r: 0, s: 'a', w: 90, mono: true, sz: 10.5 },
        { id: 'r', t: 'onResume', c: 2, r: 0, s: 'ok', w: 90, mono: true, sz: 10.5 },
        { id: 'p', t: 'onPause', c: 2, r: 1, s: 'warn', w: 90, mono: true, sz: 10.5 },
        { id: 'o', t: 'onStop', c: 1, r: 1, s: 'warn', w: 90, mono: true, sz: 10.5 },
        { id: 'd', t: 'onDestroy', c: 0, r: 1, s: 'bad', w: 90, mono: true, sz: 10.5 },
      ],
      e: [['c', 's', '', 'a'], ['s', 'r', '', 'a'], ['r', 'p', ['quitte', 'leaves'], 'warn'], ['p', 'r', ['revient', 'returns'], 'ok dash'], ['p', 'o', '', 'warn'], ['o', 'd', '', 'bad'], ['o', 's', ['relancée', 'restarted'], 'ok dash']],
      anim: [
        { t: ['L’écran se crée (onCreate), devient visible (onStart), puis interactif (onResume).', 'The screen is created (onCreate), becomes visible (onStart), then interactive (onResume).'], on: ['c', 's', 'r'], flux: [0, 1] },
        { t: ['Un appel, une autre application : onPause. L’écran est encore visible, mais plus au premier plan.', 'A call, another app: onPause. The screen is still visible, but no longer in front.'], on: ['r', 'p'], flux: [2] },
        { t: ['Plus visible du tout : onStop. Android peut alors le détruire (onDestroy) pour récupérer de la mémoire.', 'Not visible at all: onStop. Android may then destroy it (onDestroy) to reclaim memory.'], on: ['p', 'o', 'd'], flux: [4, 5] },
        { t: ['Quand l’utilisateur revient : onResume, ou onStart si l’écran avait été stoppé. Sauvegardez l’état avant onStop !', 'When the user comes back: onResume, or onStart if the screen had been stopped. Save state before onStop!'], on: ['p', 'r', 'o', 's'], flux: [3, 6] },
      ],
    },

    'mobile-adb': {
      k: 'graphe',
      alt: ['adb relie l’ordinateur au téléphone pour installer, lancer et observer une application', 'adb links the computer to the phone to install, launch and watch an app'],
      n: [
        { id: 'o', t: ['Ordinateur', 'Computer'], c: 0, r: 0.5, s: 'a', w: 90 },
        { id: 'a', t: 'adb', sub: 'USB · Wi-Fi', c: 1, r: 0.5, s: 'v', w: 80, h: 50, mono: true },
        { id: 't', t: ['Téléphone\n(débogage USB)', 'Phone\n(USB debugging)'], c: 2, r: 0.5, s: 'ok', w: 110, sz: 11 },
      ],
      e: [['o', 'a', 'adb install app.apk', 'a'], ['a', 't', '', 'v'], ['t', 'a', 'logcat', 'ok dash']],
      anim: [
        { t: ['Le débogage USB activé sur le téléphone, adb devient le pont : installer un APK, lancer une activité, copier un fichier.', 'With USB debugging enabled on the phone, adb becomes the bridge: install an APK, launch an activity, copy a file.'], on: ['o', 'a', 't'], flux: [0, 1] },
        { t: ['Dans l’autre sens, adb logcat fait remonter le journal du téléphone : les messages, les plantages, en direct.', 'The other way, adb logcat streams the phone’s log back: messages, crashes, live.'], on: ['t', 'a', 'o'], flux: [2] },
      ],
    },

    'mobile-intent': {
      k: 'graphe',
      gy: 66,
      alt: ['Une application émet un intent ; Android choisit l’application capable d’y répondre', 'An app sends an intent; Android picks the app able to handle it'],
      n: [
        { id: 'a', t: ['Votre\napplication', 'Your\napp'], c: 0, r: 0.5, s: 'a', w: 90 },
        { id: 'i', t: 'Intent', sub: 'ACTION_SEND · texte', c: 1, r: 0.5, f: 'pill', s: 'warn', w: 110, h: 50 },
        { id: 'x', t: ['Messagerie', 'Messaging'], c: 2, r: 0, s: 'ok', w: 92 },
        { id: 'y', t: ['E-mail', 'Email'], c: 2, r: 1, s: 'ok', w: 92 },
      ],
      e: [['a', 'i', 'startActivity', 'a'], ['i', 'x', ['Android choisit', 'Android picks'], 'warn'], ['i', 'y', '', 'warn']],
      anim: [
        { t: ['Votre application veut partager un texte. Elle ne nomme personne : elle décrit l’action, ACTION_SEND.', 'Your app wants to share a text. It names nobody: it describes the action, ACTION_SEND.'], on: ['a', 'i'], flux: [0] },
        { t: ['Android cherche qui sait faire cela, et propose le choix : messagerie, e-mail…', 'Android looks for whoever can do that, and offers the choice: messaging, email…'], on: ['i', 'x', 'y'], flux: [1, 2] },
        { t: ['Un intent explicite, lui, nomme l’écran à ouvrir : c’est ainsi qu’on passe d’une activité à l’autre dans sa propre application.', 'An explicit intent names the screen to open: that is how you go from one activity to another in your own app.'], on: ['a', 'i'] },
      ],
    },

    'mobile-permission': {
      k: 'sequence',
      lh: 46,
      alt: ['Une permission Android se demande à l’usage : le système pose la question à la personne', 'An Android permission is requested at use time: the system asks the person'],
      a: [['Application', 'App'], 'Android', ['Vous', 'You']],
      s: ['a', 'v', 'ok'],
      m: [
        [0, 1, 'requestPermissions(CAMERA)'],
        [1, 2, ['« Autoriser l’accès à la caméra ? »', '“Allow access to the camera?”']],
        [2, 1, ['Autoriser / Refuser', 'Allow / Deny'], 'warn dash'],
        [1, 0, ['résultat', 'result'], 'ok dash'],
        ['note', 0, 2, ['Les permissions dangereuses (caméra, position, contacts) se demandent à l’usage, pas à l’installation, et se retirent dans les réglages.', 'Dangerous permissions (camera, location, contacts) are requested at use time, not at install, and can be revoked in settings.']],
      ],
      anim: [
        { t: ['L’application a besoin de la caméra, maintenant : elle le demande au système.', 'The app needs the camera, now: it asks the system.'], flux: [0] },
        { t: ['Android, pas l’application, pose la question. L’application ne peut ni la déguiser ni la forcer.', 'Android, not the app, asks the question. The app can neither disguise nor force it.'], flux: [1, 2] },
        { t: ['Le résultat revient à l’application, qui doit prévoir le refus : une autre voie, ou une explication.', 'The result goes back to the app, which must plan for a refusal: another way, or an explanation.'], flux: [3], on: [4] },
      ],
    },

    'mobile-sdk': {
      k: 'cases',
      alt: ['Les trois niveaux d’API d’un projet Android : minSdk, targetSdk, compileSdk', 'The three API levels of an Android project: minSdk, targetSdk, compileSdk'],
      rows: [
        { t: ['Niveaux d’API Android', 'Android API levels'], cells: ['minSdk 26', 'targetSdk 35', 'compileSdk 35'], s: ['warn', 'ok', 'a'], cap: [['le plus ancien accepté', 'oldest supported'], ['celui pour lequel on a testé', 'the one tested against'], ['dont on connaît l’API', 'the API compiled with']], w: 108, h: 34, sz: 11, mono: false },
      ],
      l: ['Google Play exige un targetSdk récent ; minSdk fixe la part d’appareils compatibles (26 = Android 8, 2017).', 'Google Play requires a recent targetSdk; minSdk sets the share of compatible devices (26 = Android 8, 2017).'],
      anim: [
        { t: ['minSdk : en dessous, le Play Store ne propose même pas l’application. Plus bas = plus d’appareils, plus de contraintes.', 'minSdk: below it, the Play Store does not even offer the app. Lower = more devices, more constraints.'], on: ['r0:0'] },
        { t: ['targetSdk : « j’ai testé avec les règles de cette version ». Android adapte son comportement en conséquence.', 'targetSdk: “I tested with this version’s rules”. Android adapts its behavior accordingly.'], on: ['r0:1'] },
        { t: ['compileSdk : la version dont le compilateur connaît les API. On peut compiler avec 35 et tourner sur 26, en vérifiant à l’exécution.', 'compileSdk: the version whose APIs the compiler knows. You can compile with 35 and run on 26, checking at runtime.'], on: ['r0:2'] },
      ],
    },

    'mobile-versioncode': {
      k: 'cases',
      alt: ['versionCode monte d’un entier à chaque publication ; versionName est le texte montré aux gens', 'versionCode goes up by an integer on each release; versionName is the text shown to people'],
      rows: [
        { t: 'versionCode', cells: ['12', '13', '14'], s: ['mute', 'mute', 'ok'], cap: [['publié', 'published'], ['publié', 'published'], ['nouveau : +1', 'new: +1']], w: 70, sz: 14 },
        { t: 'versionName', cells: ['1.1.0', '1.1.1', '1.2.0'], s: ['mute', 'mute', 'ok'], w: 70, sz: 12 },
      ],
      l: ['Google Play n’accepte un AAB que si son versionCode est plus grand que le précédent ; versionName est libre.', 'Google Play only accepts an AAB whose versionCode is larger than the previous one; versionName is free-form.'],
      anim: [
        { t: ['versionCode : un entier, pour la machine. Il ne fait que monter : 12, 13, 14.', 'versionCode: an integer, for the machine. It only ever goes up: 12, 13, 14.'], on: [0] },
        { t: ['versionName : un texte, pour les humains, en général en semver. Les deux changent ensemble à chaque publication.', 'versionName: text, for humans, usually semver. Both change together with each release.'], on: [1] },
      ],
    },

  });
})(window);
