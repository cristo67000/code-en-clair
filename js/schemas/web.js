'use strict';
/*
 * Schémas de la catégorie « Web et navigateur ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'web-trois-langages': {
      k: 'pile',
      alt: ['Les trois langages du web : HTML pour le contenu, CSS pour l’apparence, JavaScript pour le comportement', 'The web’s three languages: HTML for content, CSS for appearance, JavaScript for behavior'],
      piles: [{
        t: ['Une page web = trois couches', 'A web page = three layers'],
        layers: [
          { t: 'JavaScript', d: ['comportement : clics, données, animations', 'behavior: clicks, data, animations'], s: 'warn' },
          { t: 'CSS', d: ['apparence : couleurs, polices, mise en page', 'appearance: colors, fonts, layout'], s: 'v' },
          { t: 'HTML', d: ['structure : titres, textes, liens, images', 'structure: headings, text, links, images'], s: 'a' },
        ],
      }],
      anim: [
        { t: ['HTML d’abord : la structure. Un titre, un paragraphe, un bouton.', 'HTML first: the structure. A heading, a paragraph, a button.'], on: [2] },
        { t: ['CSS par-dessus : les couleurs, les polices, la place de chaque chose.', 'CSS on top: the colors, the fonts, where everything goes.'], on: [1] },
        { t: ['JavaScript enfin : ce qui se passe quand on touche le bouton.', 'JavaScript last: what happens when the button is pressed.'], on: [0] },
      ],
    },

    'web-dom': {
      k: 'arbre',
      alt: ['Le DOM : une page HTML représentée sous forme d’arbre', 'The DOM: an HTML page represented as a tree'],
      racine: {
        t: 'html', s: 'a', k: [
          { t: 'head', s: 'v', k: [{ t: 'title', s: 'ok' }] },
          { t: 'body', s: 'v', k: [{ t: 'h1', s: 'ok' }, { t: 'p', s: 'ok', k: [{ t: 'a', s: 'ok' }] }] },
        ],
      },
      l: ['Chaque balise devient un nœud que JavaScript peut lire et modifier.', 'Each tag becomes a node that JavaScript can read and modify.'],
      anim: [
        { t: ['Tout part de l’élément html.', 'Everything starts from the html element.'], on: ['n0'] },
        { t: ['head contient ce qui ne s’affiche pas : le titre de l’onglet, les liens vers le CSS.', 'head holds what is not displayed: the tab title, the links to the CSS.'], on: ['n1', 'n2'] },
        { t: ['body contient ce qui s’affiche. Chaque balise est un nœud que JavaScript peut lire, modifier, supprimer.', 'body holds what is displayed. Each tag is a node JavaScript can read, modify, remove.'], on: ['n3', 'n4', 'n5', 'n6'] },
      ],
    },

    'web-headless': {
      k: 'graphe',
      alt: ['Un navigateur headless est piloté par un script, sans fenêtre visible', 'A headless browser is driven by a script, with no visible window'],
      n: [
        { id: 's', t: ['Votre script\n(Playwright…)', 'Your script\n(Playwright…)'], c: 0, r: 0, s: 'a', w: 116 },
        { id: 'c', t: ['Chrome\nheadless', 'Headless\nChrome'], c: 1, r: 0, s: 'v', w: 116, dash: true },
        { id: 'p', t: ['Page web\nchargée', 'Web page\nloaded'], c: 1, r: 1, s: 'info', w: 116 },
        { id: 'r', t: ['Résultat :\ncapture, PDF, test', 'Result:\nscreenshot, PDF, test'], c: 0, r: 1, s: 'ok', w: 116 },
      ],
      e: [['s', 'c', ['pilote', 'drives'], 'a'], ['c', 'p', ['charge et exécute', 'loads and runs'], 'v'], ['p', 'r', ['rendu', 'output'], 'ok']],
      l: ['Le navigateur est bien là, mais sans fenêtre : personne ne le regarde.', 'The browser is really there, just with no window: nobody looks at it.'],
      anim: [
        { t: ['Votre script lance Chrome sans fenêtre et le pilote.', 'Your script launches Chrome without a window and drives it.'], on: ['s', 'c'], flux: [0] },
        { t: ['Chrome charge la page et exécute son JavaScript, exactement comme pour une personne.', 'Chrome loads the page and runs its JavaScript, exactly as it would for a person.'], on: ['c', 'p'], flux: [1] },
        { t: ['Le script récupère ce qu’il voulait : une capture, un PDF, un résultat de test.', 'The script collects what it wanted: a screenshot, a PDF, a test result.'], on: ['p', 'r'], flux: [2] },
      ],
    },

    'web-service-worker': {
      k: 'graphe',
      alt: ['Le service worker s’interpose entre la page et le réseau et peut répondre depuis le cache', 'The service worker sits between the page and the network and can answer from the cache'],
      gy: 72,
      n: [
        { id: 'p', t: 'Page', c: 1, r: 0, s: 'a', w: 100 },
        { id: 's', t: 'Service worker', c: 1, r: 1, s: 'v', w: 118, h: 42 },
        { id: 'c', t: 'Cache', c: 0, r: 2, f: 'db', s: 'ok', w: 90, h: 48 },
        { id: 'r', t: ['Réseau', 'Network'], c: 2, r: 2, f: 'cloud', s: 'info', w: 96, h: 52 },
      ],
      e: [['p', 's', ['requête', 'request'], 'a'], ['s', 'c', ['en cache ?', 'cached?'], 'ok'], ['s', 'r', ['sinon', 'if not'], 'info dash']],
      anim: [
        { t: ['La page demande un fichier. Le service worker intercepte la requête.', 'The page requests a file. The service worker intercepts the request.'], on: ['p', 's'], flux: [0] },
        { t: ['Il regarde d’abord dans le cache : si le fichier y est, il le renvoie aussitôt, même sans réseau.', 'It looks in the cache first: if the file is there, it returns it at once, even without a network.'], on: ['s', 'c'], flux: [1] },
        { t: ['Sinon, il le demande au réseau — et peut en garder une copie pour la prochaine fois.', 'Otherwise, it asks the network — and may keep a copy for next time.'], on: ['s', 'r'], flux: [2] },
      ],
    },

    'web-sw-cycle': {
      k: 'graphe',
      alt: ['Le cycle de vie d’un service worker : installation, attente, activation', 'A service worker’s lifecycle: install, wait, activate'],
      gy: 66,
      n: [
        { id: 'i', t: 'installing', c: 0, r: 0, s: 'a', mono: true, w: 106, sz: 11 },
        { id: 'w', t: 'waiting', c: 1, r: 0, s: 'warn', mono: true, w: 106, sz: 11 },
        { id: 'a', t: 'activating', c: 1, r: 1, s: 'v', mono: true, w: 106, sz: 11 },
        { id: 'd', t: 'activated', c: 1, r: 2, s: 'ok', mono: true, w: 106, sz: 11 },
        { id: 'x', t: 'redundant', c: 0, r: 1, s: 'mute', mono: true, w: 106, sz: 11 },
      ],
      e: [['i', 'w', ['install', 'install'], 'a'], ['w', 'a', ['skipWaiting', 'skipWaiting'], 'warn'], ['a', 'd', ['activate', 'activate'], 'v'], ['i', 'x', ['échec', 'failure'], 'bad dash']],
      l: ['« waiting » dure tant que des pages utilisent encore l’ancienne version, sauf skipWaiting().', '“waiting” lasts as long as pages still use the old version, unless skipWaiting() is called.'],
      anim: [
        { t: ['installing : le navigateur télécharge le nouveau script et remplit son cache.', 'installing: the browser downloads the new script and fills its cache.'], on: ['i'] },
        { t: ['Si un fichier manque, l’installation échoue : le worker devient redundant, l’ancien reste.', 'If a file is missing, installation fails: the worker becomes redundant, the old one stays.'], on: ['i', 'x'], flux: [3] },
        { t: ['waiting : la nouvelle version attend que les pages de l’ancienne soient fermées…', 'waiting: the new version waits for the old version’s pages to be closed…'], on: ['i', 'w'], flux: [0] },
        { t: ['…ou que skipWaiting() soit appelé, par exemple quand vous acceptez « Mettre à jour ».', '…or for skipWaiting() to be called, for instance when you accept “Update”.'], on: ['w', 'a'], flux: [1] },
        { t: ['activated : elle prend la main, supprime les vieux caches, et répond aux pages.', 'activated: it takes over, deletes the old caches, and answers the pages.'], on: ['a', 'd'], flux: [2] },
      ],
    },

    'web-pwa': {
      k: 'graphe',
      alt: ['Une PWA repose sur trois piliers : HTTPS, un manifeste, un service worker', 'A PWA rests on three pillars: HTTPS, a manifest, a service worker'],
      gy: 84,
      n: [
        { id: 'h', t: 'HTTPS', c: 0, r: 0, s: 'info', w: 98 },
        { id: 'm', t: ['Manifeste', 'Manifest'], c: 1, r: 0, s: 'v', w: 98 },
        { id: 's', t: ['Service\nworker', 'Service\nworker'], c: 2, r: 0, s: 'warn', w: 98 },
        { id: 'p', t: ['PWA installable\net hors ligne', 'Installable\noffline PWA'], c: 1, r: 1, s: 'ok', w: 150 },
      ],
      e: [['h', 'p', '', 'info'], ['m', 'p', '', 'v'], ['s', 'p', '', 'warn']],
      anim: [
        { t: ['HTTPS : sans connexion sûre, pas de service worker.', 'HTTPS: without a secure connection, no service worker.'], on: ['h'] },
        { t: ['Le manifeste : nom, icône, couleur, plein écran — ce qu’il faut pour l’écran d’accueil.', 'The manifest: name, icon, color, full screen — what the home screen needs.'], on: ['m'] },
        { t: ['Le service worker : les fichiers en cache, l’application marche sans réseau.', 'The service worker: files in the cache, the app works without a network.'], on: ['s'] },
        { t: ['Les trois réunis : le navigateur propose d’installer l’application.', 'All three together: the browser offers to install the app.'], on: ['h', 'm', 's', 'p'], flux: [0, 1, 2] },
      ],
    },

    'web-manifest': {
      k: 'graphe',
      alt: ['Le navigateur lit le manifeste pour installer l’application avec son nom et son icône', 'The browser reads the manifest to install the app with its name and icon'],
      n: [
        { id: 'f', t: 'manifest\n.webmanifest', c: 0, r: 0, f: 'file', s: 'v', w: 94, h: 50, mono: true, sz: 9.5 },
        { id: 'n', t: ['Navigateur', 'Browser'], c: 1, r: 0, s: 'a', w: 82, sz: 11 },
        { id: 'e', t: ['Écran d’accueil', 'Home screen'], sub: ['nom · icône\nplein écran', 'name · icon\nfull screen'], c: 2, r: 0, s: 'ok', w: 98, h: 58, sz: 10.5 },
      ],
      e: [['f', 'n', '', 'v'], ['n', 'e', '', 'ok']],
      anim: [
        { t: ['Un fichier JSON à côté de la page : name, icons, start_url, display.', 'A JSON file next to the page: name, icons, start_url, display.'], on: ['f'] },
        { t: ['La page le déclare par <link rel="manifest"> ; le navigateur le lit.', 'The page declares it with <link rel="manifest">; the browser reads it.'], on: ['f', 'n'], flux: [0] },
        { t: ['Il sait alors quelle icône poser sur l’écran d’accueil et comment ouvrir l’application : en plein écran.', 'It then knows which icon to put on the home screen and how to open the app: full screen.'], on: ['n', 'e'], flux: [1] },
      ],
    },

    'web-csp': {
      k: 'graphe',
      alt: ['Avec la politique default-src « self », seul ce qui vient du même site est accepté', 'With the default-src “self” policy, only what comes from the same site is accepted'],
      gy: 62,
      n: [
        { id: 'p', t: ['Page', 'Page'], sub: "default-src 'self'", c: 0, r: 1, s: 'a', w: 118, h: 52 },
        { id: 'a', t: ['script du même site', 'script from the same site'], c: 1, r: 0, s: 'ok', w: 158 },
        { id: 'b', t: ['script d’un autre site', 'script from another site'], c: 1, r: 1, s: 'bad', w: 158 },
        { id: 'c', t: ['script écrit dans le HTML', 'script written inline in HTML'], c: 1, r: 2, s: 'bad', w: 158 },
      ],
      e: [['p', 'a', '✓', 'ok'], ['p', 'b', '✗', 'bad'], ['p', 'c', '✗', 'bad']],
      anim: [
        { t: ['La page annonce sa politique : default-src \'self\'.', 'The page announces its policy: default-src \'self\'.'], on: ['p'] },
        { t: ['Un script hébergé sur le même site : accepté.', 'A script hosted on the same site: accepted.'], on: ['p', 'a'], flux: [0] },
        { t: ['Un script venu d’un autre site : bloqué, même si le HTML le demande.', 'A script from another site: blocked, even if the HTML asks for it.'], on: ['p', 'b'], flux: [1] },
        { t: ['Un script écrit dans le HTML lui-même : bloqué aussi. Un attaquant qui injecte du HTML n’exécute rien.', 'A script written inline in the HTML: blocked too. An attacker who injects HTML runs nothing.'], on: ['p', 'c'], flux: [2] },
      ],
    },

    'web-cors': {
      k: 'sequence',
      lh: 44,
      alt: ['CORS : le navigateur demande au serveur s’il autorise l’origine de la page', 'CORS: the browser asks the server whether it allows the page’s origin'],
      a: [['Navigateur\nmon-site.org', 'Browser\nmy-site.org'], ['Serveur\napi.exemple.org', 'Server\napi.example.org']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'OPTIONS · Origin: mon-site.org'],
        [1, 0, 'Access-Control-Allow-Origin: mon-site.org', 'ok dash'],
        [0, 1, 'GET /données', 'a'],
        [1, 0, '200 OK + données', 'ok dash'],
        ['note', 0, 1, ['Sans l’en-tête d’autorisation, le navigateur bloque la lecture de la réponse.', 'Without the permission header, the browser blocks reading the response.']],
      ],
      anim: [
        { t: ['La page de mon-site.org veut lire api.exemple.org : le navigateur demande d’abord la permission, en précisant l’origine de la page.', 'The page on mon-site.org wants to read api.exemple.org: the browser first asks for permission, stating the page’s origin.'], flux: [0] },
        { t: ['Le serveur répond : cette origine est autorisée.', 'The server answers: this origin is allowed.'], flux: [1] },
        { t: ['La vraie requête part, et la page peut lire la réponse.', 'The real request goes out, and the page may read the response.'], flux: [2, 3] },
        { t: ['Sans cet en-tête, la requête partirait quand même — mais le navigateur refuserait de montrer la réponse à la page.', 'Without that header, the request would still go out — but the browser would refuse to show the response to the page.'], on: [4] },
      ],
    },

    'web-flexbox': {
      k: 'dessin',
      h: 190,
      alt: ['Trois valeurs de justify-content : flex-start, center, space-between', 'Three justify-content values: flex-start, center, space-between'],
      d: [
        ['text', 10, 14, 'justify-content: flex-start', { a: 's', mono: true, sz: 10.5, s: 'mute', b: true }],
        ['rect', 10, 24, 340, 36, { s: 'mute', r: 6 }],
        ['rect', 16, 30, 56, 24, { s: 'a', t: '1', r: 4 }],
        ['rect', 80, 30, 56, 24, { s: 'a', t: '2', r: 4 }],
        ['rect', 144, 30, 56, 24, { s: 'a', t: '3', r: 4 }],
        ['text', 10, 82, 'justify-content: center', { a: 's', mono: true, sz: 10.5, s: 'mute', b: true }],
        ['rect', 10, 92, 340, 36, { s: 'mute', r: 6 }],
        ['rect', 88, 98, 56, 24, { s: 'v', t: '1', r: 4 }],
        ['rect', 152, 98, 56, 24, { s: 'v', t: '2', r: 4 }],
        ['rect', 216, 98, 56, 24, { s: 'v', t: '3', r: 4 }],
        ['text', 10, 150, 'justify-content: space-between', { a: 's', mono: true, sz: 10.5, s: 'mute', b: true }],
        ['rect', 10, 160, 340, 36, { s: 'mute', r: 6 }],
        ['rect', 16, 166, 56, 24, { s: 'ok', t: '1', r: 4 }],
        ['rect', 152, 166, 56, 24, { s: 'ok', t: '2', r: 4 }],
        ['rect', 288, 166, 56, 24, { s: 'ok', t: '3', r: 4 }],
      ],
    },

    'web-clone': {
      k: 'graphe',
      alt: ['Un clone web : un outil suit les liens d’un site et en copie chaque fichier', 'A web clone: a tool follows a site’s links and copies each file'],
      n: [
        { id: 's', t: ['Site web', 'Website'], c: 0, r: 0, f: 'cloud', s: 'v', w: 98, h: 56 },
        { id: 'o', t: ['Outil', 'Tool'], sub: 'wget · HTTrack', c: 1, r: 0, s: 'a', w: 92, h: 52 },
        { id: 'c', t: ['Copie\nlocale', 'Local\ncopy'], c: 2, r: 0, f: 'db', s: 'ok', w: 84, h: 62 },
      ],
      e: [['o', 's', '', 'a'], ['s', 'o', '', 'v dash'], ['o', 'c', '', 'ok']],
    },

    'web-cookie': {
      k: 'sequence',
      lh: 42,
      alt: ['Le serveur dépose un cookie ; le navigateur le renvoie ensuite à chaque requête', 'The server sets a cookie; the browser then sends it back with every request'],
      a: [['Navigateur', 'Browser'], ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'GET /'],
        [1, 0, 'Set-Cookie: theme=sombre', 'ok dash'],
        [0, 0, ['garde le cookie', 'keeps the cookie'], 'mute'],
        [0, 1, 'GET /page · Cookie: theme=sombre', 'a'],
        [1, 0, ['page en thème sombre', 'page in dark theme'], 'dash'],
      ],
      anim: [
        { t: ['Première visite : le navigateur demande la page.', 'First visit: the browser asks for the page.'], flux: [0] },
        { t: ['Le serveur répond avec un en-tête Set-Cookie : « souviens-toi de ça ».', 'The server answers with a Set-Cookie header: “remember this”.'], flux: [1] },
        { t: ['Le navigateur range le cookie, pour ce site seulement.', 'The browser stores the cookie, for this site only.'], on: [2] },
        { t: ['À chaque requête suivante vers ce site, il le renvoie de lui-même : le serveur vous reconnaît.', 'With every following request to this site, it sends it back by itself: the server recognizes you.'], flux: [3, 4] },
      ],
    },

    'web-evenement': {
      k: 'graphe',
      gy: 62,
      alt: ['Un clic sur un bouton crée un événement qui remonte vers ses parents, où un écouteur le reçoit', 'A click on a button creates an event that bubbles up to its parents, where a listener receives it'],
      n: [
        { id: 'u', t: ['Vous\n(clic)', 'You\n(click)'], c: 0, r: 1, s: 'a', w: 80 },
        { id: 'd', t: '<body>', c: 1, r: 0, s: 'mute', w: 100, mono: true },
        { id: 'f', t: '<form>', c: 1, r: 1, s: 'v', w: 100, mono: true },
        { id: 'b', t: '<button>', c: 1, r: 2, s: 'a', w: 100, mono: true },
        { id: 'h', t: ['Écouteur', 'Listener'], sub: 'addEventListener', c: 2, r: 1, s: 'ok', w: 110, h: 50 },
      ],
      e: [['u', 'b', 'click', 'a'], ['b', 'f', ['remonte', 'bubbles'], 'v'], ['f', 'd', '', 'v dash'], ['f', 'h', ['déclenche', 'fires'], 'ok']],
      anim: [
        { t: ['Vous cliquez : le navigateur crée un événement click sur le bouton.', 'You click: the browser creates a click event on the button.'], on: ['u', 'b'], flux: [0] },
        { t: ['L’événement remonte (bubbling) : bouton, formulaire, body, document.', 'The event bubbles up: button, form, body, document.'], on: ['b', 'f', 'd'], flux: [1, 2] },
        { t: ['Un écouteur posé sur le formulaire le reçoit au passage : une seule fonction pour tous ses boutons.', 'A listener on the form receives it on the way: one function for all its buttons.'], on: ['f', 'h'], flux: [3] },
      ],
    },

    'web-localstorage': {
      k: 'cases',
      alt: ['localStorage : des clés et des valeurs, toujours du texte, propres à un site', 'localStorage: keys and values, always text, specific to a site'],
      rows: [
        { t: ['Clé → valeur (toujours du texte)', 'Key → value (always text)'], cells: ['theme', '"sombre"'], s: ['a', 'ok'], w: 130, sz: 12, cap: [['clé', 'key'], ['valeur', 'value']] },
        { cells: ['langue', '"fr"'], s: ['a', 'ok'], w: 130, sz: 12, espace: 6 },
        { cells: ['notes', '"[{…}]"'], s: ['a', 'warn'], w: 130, sz: 12, cap: ['', ['objet → JSON.stringify', 'object → JSON.stringify']] },
      ],
      l: ['Propre à l’origine du site, conservé après fermeture, environ 5 Mo. Pour plus, ou pour des objets : IndexedDB.', 'Specific to the site’s origin, kept after closing, about 5 MB. For more, or for objects: IndexedDB.'],
      anim: [
        { t: ['localStorage.setItem("theme", "sombre") : une clé, une valeur.', 'localStorage.setItem("theme", "sombre"): a key, a value.'], on: [0] },
        { t: ['Tout est texte : un objet doit être sérialisé en JSON avant d’entrer, et reparsé en sortant.', 'Everything is text: an object must be serialized to JSON on the way in, and parsed again on the way out.'], on: [2] },
      ],
    },

    'web-navigateur': {
      k: 'pile',
      alt: ['Les étages d’un navigateur : interface, moteur de rendu, moteur JavaScript, réseau et stockage, système', 'A browser’s layers: interface, rendering engine, JavaScript engine, network and storage, system'],
      piles: [{
        layers: [
          { t: ['Interface', 'Interface'], d: ['onglets, barre d’adresse, favoris', 'tabs, address bar, bookmarks'], s: 'a' },
          { t: ['Moteur de rendu', 'Rendering engine'], d: ['HTML + CSS → pixels : Blink, WebKit, Gecko', 'HTML + CSS → pixels: Blink, WebKit, Gecko'], s: 'v' },
          { t: ['Moteur JavaScript', 'JavaScript engine'], d: 'V8 · JavaScriptCore · SpiderMonkey', s: 'warn' },
          { t: ['Réseau et stockage', 'Network and storage'], d: 'HTTP · cache · cookies · IndexedDB', s: 'ok' },
          { t: ['Système d’exploitation', 'Operating system'], s: 'mute' },
        ],
      }],
      anim: [
        { t: ['Vous tapez une adresse : l’interface la transmet.', 'You type an address: the interface passes it on.'], on: [0] },
        { t: ['La couche réseau va chercher le HTML, le CSS, les images — ou les sort du cache.', 'The network layer fetches the HTML, the CSS, the images — or takes them from the cache.'], on: [3] },
        { t: ['Le moteur de rendu transforme HTML et CSS en pixels ; le moteur JavaScript exécute les scripts qui modifient la page.', 'The rendering engine turns HTML and CSS into pixels; the JavaScript engine runs the scripts that change the page.'], on: [1, 2] },
      ],
    },

    'web-spa': {
      k: 'graphe',
      gy: 84,
      alt: ['Site classique : chaque clic recharge une page entière ; SPA : une seule page, JavaScript demande des données', 'Classic site: every click reloads a whole page; SPA: a single page, JavaScript asks for data'],
      n: [
        { id: 's', t: ['Site classique', 'Classic site'], sub: ['chaque clic : une page entière', 'every click: a whole page'], c: 0, r: 0, s: 'mute', w: 160, h: 50 },
        { id: 'v', t: ['Serveur', 'Server'], c: 1, r: 0.5, f: 'cloud', s: 'v', w: 92, h: 52 },
        { id: 'a', t: 'SPA', sub: ['une page, JavaScript redessine', 'one page, JavaScript redraws'], c: 0, r: 1, s: 'a', w: 160, h: 50 },
      ],
      e: [['s', 'v', 'GET /page2.html', 'mute'], ['a', 'v', 'GET /api/… (JSON)', 'a']],
      anim: [
        { t: ['Site classique : à chaque clic, le navigateur demande une page entière et la redessine de zéro.', 'Classic site: on every click, the browser asks for a whole page and redraws it from scratch.'], on: ['s', 'v'], flux: [0] },
        { t: ['SPA : une seule page, chargée une fois. JavaScript demande des données (JSON) et ne met à jour que ce qui change.', 'SPA: a single page, loaded once. JavaScript asks for data (JSON) and updates only what changes.'], on: ['a', 'v'], flux: [1] },
        { t: ['Plus fluide à l’usage ; mais la première ouverture est plus lourde, et le routage est à la charge de l’application.', 'Smoother in use; but the first opening is heavier, and routing is the app’s job.'], on: ['a'] },
      ],
    },

    'web-websocket': {
      k: 'sequence',
      lh: 40,
      alt: ['WebSocket : après une poignée de main HTTP, la connexion reste ouverte et les deux côtés envoient quand ils veulent', 'WebSocket: after an HTTP handshake, the connection stays open and both sides send whenever they want'],
      a: [['Navigateur', 'Browser'], ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'GET /chat · Upgrade: websocket'],
        [1, 0, '101 Switching Protocols', 'ok dash'],
        [0, 1, ['message', 'message'], 'a'],
        [1, 0, ['message, sans requête', 'message, no request'], 'a dash'],
        [1, 0, ['encore un', 'another one'], 'a dash'],
        [0, 1, ['fermeture', 'close'], 'mute'],
      ],
      anim: [
        { t: ['Cela commence par une requête HTTP qui demande à « monter » en WebSocket.', 'It starts with an HTTP request asking to “upgrade” to WebSocket.'], flux: [0] },
        { t: ['Le serveur accepte : 101. À partir de là, ce n’est plus du HTTP.', 'The server accepts: 101. From there on, it is no longer HTTP.'], flux: [1] },
        { t: ['La connexion reste ouverte. Le serveur peut pousser des messages sans qu’on lui ait rien demandé : chat, cours de bourse, jeu.', 'The connection stays open. The server can push messages without being asked: chat, stock prices, games.'], flux: [2, 3, 4] },
        { t: ['L’un des deux ferme. Entre-temps, aucune requête répétée : un seul tuyau, dans les deux sens.', 'One of the two closes. In between, no repeated requests: a single pipe, both ways.'], flux: [5] },
      ],
    },

    'web-worker': {
      k: 'sequence',
      lh: 44,
      alt: ['Un web worker fait un calcul lourd dans un autre fil ; la page reste fluide et reçoit le résultat par message', 'A web worker does heavy work in another thread; the page stays responsive and gets the result by message'],
      a: [['Page\n(fil principal)', 'Page\n(main thread)'], ['Worker\n(autre fil)', 'Worker\n(other thread)']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'postMessage(données)'],
        [1, 1, ['calcul lourd', 'heavy computation'], 'warn'],
        [0, 0, ['reste fluide', 'stays responsive'], 'ok'],
        [1, 0, 'postMessage(résultat)', 'ok dash'],
      ],
      anim: [
        { t: ['La page confie les données au worker par postMessage : copie, pas de mémoire partagée.', 'The page hands the data to the worker with postMessage: a copy, no shared memory.'], flux: [0] },
        { t: ['Le worker calcule dans son propre fil. Il n’a pas accès au DOM.', 'The worker computes in its own thread. It has no access to the DOM.'], on: [1] },
        { t: ['Pendant ce temps, la page répond aux clics et aux défilements.', 'Meanwhile, the page keeps responding to clicks and scrolling.'], on: [2] },
        { t: ['Le résultat revient par message ; la page l’affiche.', 'The result comes back by message; the page displays it.'], flux: [3] },
      ],
    },

    'web-lazy': {
      k: 'dessin',
      h: 216,
      alt: ['Chargement paresseux : seules les images visibles sont téléchargées, celles sous l’écran attendent le défilement', 'Lazy loading: only the visible images are downloaded, those below the screen wait for scrolling'],
      d: [
        ['rect', 120, 8, 120, 200, { s: 'mute', r: 10 }],
        ['rect', 132, 20, 96, 40, { s: 'ok', t: ['image 1 · chargée', 'image 1 · loaded'], sz: 9 }],
        ['rect', 132, 66, 96, 40, { s: 'ok', t: ['image 2 · chargée', 'image 2 · loaded'], sz: 9 }],
        ['line', 110, 116, 250, 116, { s: 'warn', dash: 1 }],
        ['text', 300, 112, ['bas de\nl’écran', 'bottom of\nthe screen'], { s: 'warn', sz: 9.5, b: true }],
        ['rect', 132, 126, 96, 34, { s: 'mute', dash: 1, t: ['image 3 · attend', 'image 3 · waits'], sz: 9 }],
        ['rect', 132, 166, 96, 34, { s: 'mute', dash: 1, t: ['image 4 · attend', 'image 4 · waits'], sz: 9 }],
        ['text', 60, 62, 'loading="lazy"', { mono: true, sz: 9.5, s: 'a', b: true }],
        ['text', 60, 150, ['chargées au\ndéfilement', 'loaded on\nscroll'], { sz: 9.5, s: 'mute' }],
      ],
      anim: [
        { t: ['La page s’ouvre : seules les images visibles sont téléchargées.', 'The page opens: only the visible images are downloaded.'], on: [0, 1, 2, 7] },
        { t: ['Celles qui sont sous le bas de l’écran attendent.', 'Those below the bottom of the screen wait.'], on: [3, 4, 5, 6] },
        { t: ['Vous faites défiler : elles se chargent juste avant d’apparaître. Moins de données au départ, ouverture plus rapide.', 'You scroll: they load just before appearing. Less data up front, faster opening.'], on: [5, 6, 8] },
      ],
    },

    'web-responsive': {
      k: 'dessin',
      h: 186,
      alt: ['La même page : une colonne sur un téléphone, trois colonnes sur un ordinateur', 'The same page: one column on a phone, three columns on a desktop'],
      d: [
        ['rect', 14, 14, 88, 150, { s: 'mute', r: 8 }],
        ['rect', 22, 24, 72, 22, { s: 'a', t: 'A', sz: 10 }],
        ['rect', 22, 50, 72, 22, { s: 'v', t: 'B', sz: 10 }],
        ['rect', 22, 76, 72, 22, { s: 'ok', t: 'C', sz: 10 }],
        ['text', 58, 178, ['téléphone : 1 colonne', 'phone: 1 column'], { sz: 9.5, s: 'mute', b: true }],
        ['rect', 130, 14, 220, 110, { s: 'mute', r: 8 }],
        ['rect', 140, 24, 62, 90, { s: 'a', t: 'A', sz: 10 }],
        ['rect', 208, 24, 62, 90, { s: 'v', t: 'B', sz: 10 }],
        ['rect', 276, 24, 64, 90, { s: 'ok', t: 'C', sz: 10 }],
        ['text', 240, 138, ['ordinateur : 3 colonnes', 'desktop: 3 columns'], { sz: 9.5, s: 'mute', b: true }],
        ['text', 240, 160, '@media (min-width: 48rem) { … }', { mono: true, sz: 9.5, s: 'a' }],
      ],
      anim: [
        { t: ['Écran étroit : les blocs s’empilent, une seule colonne, texte lisible sans zoom.', 'Narrow screen: the blocks stack up, a single column, text readable without zooming.'], on: [0, 1, 2, 3, 4] },
        { t: ['Écran large : une media query réorganise les mêmes blocs en colonnes. Même HTML, autre CSS.', 'Wide screen: a media query rearranges the same blocks into columns. Same HTML, different CSS.'], on: [5, 6, 7, 8, 9, 10] },
      ],
    },

    'web-cache-api': {
      k: 'graphe',
      alt: ['L’API Cache : une page ou un service worker y range des réponses HTTP entières et les retrouve plus tard', 'The Cache API: a page or a service worker stores whole HTTP responses in it and finds them again later'],
      n: [
        { id: 'p', t: ['Page ou\nservice worker', 'Page or\nservice worker'], c: 0, r: 0.5, s: 'a', w: 100 },
        { id: 'c', t: 'Cache Storage', sub: 'caches.open("v2")', c: 1, r: 0.5, f: 'db', s: 'ok', w: 120, h: 60 },
        { id: 'f', t: ['Réponses HTTP\nentières', 'Whole HTTP\nresponses'], c: 2, r: 0.5, f: 'file', s: 'v', w: 100 },
      ],
      e: [['p', 'c', 'put', 'a'], ['c', 'p', 'match', 'ok dash'], ['c', 'f', '', 'v sans']],
      anim: [
        { t: ['cache.put(requête, réponse) : la réponse entière, en-têtes compris, est rangée sous l’adresse demandée.', 'cache.put(request, response): the whole response, headers included, is stored under the requested address.'], on: ['p', 'c', 'f'], flux: [0] },
        { t: ['cache.match(requête) la retrouve, sans réseau. C’est ce qu’utilise un service worker pour servir hors ligne.', 'cache.match(request) finds it again, with no network. That is what a service worker uses to serve offline.'], on: ['c', 'p'], flux: [1] },
      ],
    },

  });
})(window);
