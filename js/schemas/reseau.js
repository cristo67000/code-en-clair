'use strict';
/*
 * Schémas de la catégorie « Réseau et HTTP ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'reseau-requete-reponse': {
      k: 'sequence',
      alt: ['Un échange HTTP : le navigateur envoie une requête, le serveur répond', 'An HTTP exchange: the browser sends a request, the server answers'],
      a: [['Navigateur', 'Browser'], ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'GET /page.html'],
        [1, 0, '200 OK + HTML', 'ok dash'],
        [0, 1, 'GET /style.css'],
        [1, 0, '200 OK + CSS', 'ok dash'],
        ['note', 0, 1, ['Chaque échange est indépendant : le serveur ne se souvient de rien.', 'Each exchange is independent: the server remembers nothing.']],
      ],
      anim: [
        { t: ['Le navigateur demande la page.', 'The browser asks for the page.'], flux: [0] },
        { t: ['Le serveur répond : 200 OK, et le HTML.', 'The server answers: 200 OK, and the HTML.'], flux: [1] },
        { t: ['Le HTML mentionne une feuille de style : nouvelle requête, nouvelle réponse.', 'The HTML mentions a stylesheet: new request, new response.'], flux: [2, 3] },
        { t: ['Chaque échange est indépendant : HTTP est sans état. Les cookies servent à s’en souvenir quand même.', 'Each exchange is independent: HTTP is stateless. Cookies are how it remembers anyway.'], on: [4] },
      ],
    },

    'reseau-tls': {
      k: 'sequence',
      lh: 42,
      alt: ['La poignée de main TLS : négociation, certificat, échange de clés, puis données chiffrées', 'The TLS handshake: negotiation, certificate, key exchange, then encrypted data'],
      a: [['Navigateur', 'Browser'], ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, ['Bonjour + algorithmes', 'Hello + algorithms']],
        [1, 0, ['Choix + certificat', 'Choice + certificate'], 'dash'],
        [0, 0, ['vérifie le certificat', 'checks the certificate'], 'warn'],
        [0, 1, ['échange de clés', 'key exchange']],
        [1, 0, ['prêt', 'ready'], 'dash'],
        [0, 1, ['données chiffrées (HTTP)', 'encrypted data (HTTP)'], 'ok'],
      ],
      anim: [
        { t: ['Le navigateur se présente et liste les algorithmes qu’il connaît.', 'The browser introduces itself and lists the algorithms it knows.'], flux: [0] },
        { t: ['Le serveur en choisit un et envoie son certificat.', 'The server picks one and sends its certificate.'], flux: [1] },
        { t: ['Le navigateur vérifie le certificat : signé par une autorité connue, pour ce domaine, pas expiré.', 'The browser checks the certificate: signed by a known authority, for this domain, not expired.'], on: [2] },
        { t: ['Les deux conviennent d’une clé de session que personne d’autre ne connaît.', 'The two agree on a session key nobody else knows.'], flux: [3, 4] },
        { t: ['Tout le HTTP qui suit est chiffré avec cette clé : c’est le S de HTTPS.', 'All the HTTP that follows is encrypted with that key: that is the S in HTTPS.'], flux: [5] },
      ],
    },

    'reseau-dns': {
      k: 'sequence',
      lh: 44,
      alt: ['Le DNS traduit un nom de domaine en adresse IP avant la requête', 'DNS translates a domain name into an IP address before the request'],
      a: [['Navigateur', 'Browser'], ['Serveur DNS', 'DNS server'], ['Serveur web', 'Web server']],
      s: ['a', 'warn', 'v'],
      m: [
        [0, 1, ['IP de exemple.org ?', 'IP of example.org?']],
        [1, 0, '93.184.216.34', 'ok dash'],
        [0, 2, 'GET / → 93.184.216.34'],
        [2, 0, '200 OK', 'ok dash'],
      ],
      anim: [
        { t: ['« exemple.org » n’est pas une adresse : le navigateur demande au DNS laquelle se cache derrière.', '“exemple.org” is not an address: the browser asks DNS which one is behind it.'], flux: [0] },
        { t: ['Réponse : 93.184.216.34. Le navigateur la garde en cache un moment.', 'Answer: 93.184.216.34. The browser caches it for a while.'], flux: [1] },
        { t: ['Il peut maintenant parler au serveur web, par son adresse IP.', 'It can now talk to the web server, by its IP address.'], flux: [2, 3] },
      ],
    },

    'reseau-url': {
      k: 'dessin',
      h: 100,
      alt: ['Les parties d’une URL : protocole, domaine, port, chemin, paramètres, ancre', 'The parts of a URL: protocol, domain, port, path, parameters, anchor'],
      d: [
        ['rect', 6, 8, 40, 26, { s: 'a', t: 'https', mono: true, sz: 9.5, r: 4 }],
        ['text', 53, 25, '://', { mono: true, sz: 9.5, s: 'mute' }],
        ['rect', 60, 8, 96, 26, { s: 'v', t: 'www.exemple.org', mono: true, sz: 9.5, r: 4 }],
        ['rect', 156, 8, 40, 26, { s: 'warn', t: ':8080', mono: true, sz: 9.5, r: 4 }],
        ['rect', 196, 8, 68, 26, { s: 'ok', t: '/blog/post', mono: true, sz: 9.5, r: 4 }],
        ['rect', 264, 8, 56, 26, { s: 'info', t: '?lang=fr', mono: true, sz: 9.5, r: 4 }],
        ['rect', 320, 8, 38, 26, { s: 'mute', t: '#avis', mono: true, sz: 9.5, r: 4 }],
        ['line', 26, 36, 26, 46, { s: 'a' }],
        ['text', 26, 55, ['protocole', 'protocol'], { s: 'a', sz: 10, b: true }],
        ['line', 108, 36, 108, 46, { s: 'v' }],
        ['text', 108, 55, ['domaine', 'domain'], { s: 'v', sz: 10, b: true }],
        ['line', 176, 36, 176, 64, { s: 'warn' }],
        ['text', 176, 73, 'port', { s: 'warn', sz: 10, b: true }],
        ['line', 230, 36, 230, 46, { s: 'ok' }],
        ['text', 230, 55, ['chemin', 'path'], { s: 'ok', sz: 10, b: true }],
        ['line', 292, 36, 292, 64, { s: 'info' }],
        ['text', 292, 73, ['paramètres', 'parameters'], { s: 'info', sz: 10, b: true }],
        ['line', 339, 36, 339, 46, { s: 'mute' }],
        ['text', 336, 55, ['ancre', 'anchor'], { s: 'mute', sz: 10, b: true }],
      ],
      anim: [
        { t: ['Le protocole : comment parler au serveur. https chiffre l’échange.', 'The protocol: how to talk to the server. https encrypts the exchange.'], on: [0, 7, 8] },
        { t: ['Le domaine : quel serveur. Le DNS le traduit en adresse IP.', 'The domain: which server. DNS translates it into an IP address.'], on: [2, 9, 10] },
        { t: ['Le port, souvent sous-entendu : 443 pour https, 80 pour http.', 'The port, usually implied: 443 for https, 80 for http.'], on: [3, 11, 12] },
        { t: ['Le chemin : quelle ressource sur ce serveur.', 'The path: which resource on that server.'], on: [4, 13, 14] },
        { t: ['Les paramètres, après « ? » : des précisions, nom=valeur, séparées par « & ».', 'The parameters, after “?”: details, name=value, separated by “&”.'], on: [5, 15, 16] },
        { t: ['L’ancre, après « # » : un endroit dans la page. Le navigateur la garde pour lui, le serveur ne la voit jamais.', 'The anchor, after “#”: a place in the page. The browser keeps it to itself, the server never sees it.'], on: [6, 17, 18] },
      ],
    },

    'reseau-statuts': {
      k: 'pile',
      lh: 32,
      alt: ['Les cinq familles de codes de statut HTTP', 'The five families of HTTP status codes'],
      piles: [{
        layers: [
          { t: '1xx', d: ['information', 'informational'], s: 'mute' },
          { t: '2xx', d: ['réussite · 200 OK', 'success · 200 OK'], s: 'ok' },
          { t: '3xx', d: ['redirection · 301 déplacé', 'redirection · 301 moved'], s: 'info' },
          { t: '4xx', d: ['erreur du client · 404 introuvable', 'client error · 404 not found'], s: 'warn' },
          { t: '5xx', d: ['erreur du serveur · 500', 'server error · 500'], s: 'bad' },
        ],
      }],
      anim: [
        { t: ['2xx : tout va bien. 200 OK, 201 créé, 204 rien à renvoyer.', '2xx: all is well. 200 OK, 201 created, 204 nothing to return.'], on: [1] },
        { t: ['3xx : allez voir ailleurs. 301 déplacé pour toujours, 304 pas modifié (votre cache est bon).', '3xx: look elsewhere. 301 moved for good, 304 not modified (your cache is fine).'], on: [2] },
        { t: ['4xx : la faute au client. 400 malformée, 401 non authentifié, 403 interdit, 404 introuvable, 429 trop de requêtes.', '4xx: the client’s fault. 400 malformed, 401 not authenticated, 403 forbidden, 404 not found, 429 too many requests.'], on: [3] },
        { t: ['5xx : la faute au serveur. 500 erreur interne, 502 mauvaise passerelle, 503 indisponible.', '5xx: the server’s fault. 500 internal error, 502 bad gateway, 503 unavailable.'], on: [4] },
      ],
    },

    'reseau-proxy': {
      k: 'graphe',
      alt: ['Un proxy direct sert un réseau ; un proxy inverse protège des serveurs', 'A forward proxy serves a network; a reverse proxy shields servers'],
      gy: 80,
      n: [
        { id: 'a', t: ['Votre\nréseau', 'Your\nnetwork'], c: 0, r: 0, s: 'a', w: 82 },
        { id: 'b', t: ['Proxy', 'Proxy'], c: 1, r: 0, s: 'v', w: 82 },
        { id: 'c', t: 'Internet', c: 2, r: 0, f: 'cloud', s: 'info', w: 88, h: 48 },
        { id: 'd', t: ['Visiteurs', 'Visitors'], c: 0, r: 1, f: 'cloud', s: 'info', w: 88, h: 48 },
        { id: 'e', t: ['Proxy\ninverse', 'Reverse\nproxy'], c: 1, r: 1, s: 'v', w: 82 },
        { id: 'f', t: ['Vos\nserveurs', 'Your\nservers'], c: 2, r: 1, s: 'ok', w: 82 },
      ],
      e: [['a', 'b', '', 'a'], ['b', 'c', '', 'v'], ['d', 'e', '', 'info'], ['e', 'f', '', 'v']],
      g: [{ t: ['Proxy direct', 'Forward proxy'], ids: ['a', 'b', 'c'] }, { t: ['Proxy inverse', 'Reverse proxy'], ids: ['d', 'e', 'f'] }],
      anim: [
        { t: ['Proxy direct : les machines d’un réseau sortent par lui. Il filtre, met en cache, masque leur adresse.', 'Forward proxy: the machines of a network go out through it. It filters, caches, hides their address.'], on: ['a', 'b', 'c'], flux: [0, 1] },
        { t: ['Proxy inverse : les visiteurs ne voient que lui. Derrière, il répartit, chiffre (TLS), protège vos serveurs.', 'Reverse proxy: visitors only see it. Behind it, it balances, encrypts (TLS), shields your servers.'], on: ['d', 'e', 'f'], flux: [2, 3] },
      ],
    },

    'reseau-cdn': {
      k: 'graphe',
      alt: ['Un CDN copie les fichiers sur des serveurs proches des visiteurs', 'A CDN copies files onto servers close to the visitors'],
      gy: 74,
      n: [
        { id: 'o', t: ['Serveur d’origine', 'Origin server'], c: 1, r: 0, f: 'db', s: 'v', w: 124, h: 52 },
        { id: 'p', t: ['CDN\nParis', 'CDN\nParis'], c: 0, r: 1, s: 'a', w: 84 },
        { id: 't', t: ['CDN\nTokyo', 'CDN\nTokyo'], c: 2, r: 1, s: 'a', w: 84 },
        { id: 'v', t: ['Visiteur\nen France', 'Visitor\nin France'], c: 0, r: 2, s: 'ok', w: 92 },
        { id: 'w', t: ['Visiteur\nau Japon', 'Visitor\nin Japan'], c: 2, r: 2, s: 'ok', w: 92 },
      ],
      e: [['o', 'p', ['copie', 'copy'], 'v dash'], ['o', 't', ['copie', 'copy'], 'v dash'], ['p', 'v', '', 'a'], ['t', 'w', '', 'a']],
      anim: [
        { t: ['Vos fichiers sont sur un serveur d’origine, quelque part.', 'Your files are on an origin server, somewhere.'], on: ['o'] },
        { t: ['Le CDN en garde des copies sur des serveurs partout dans le monde.', 'The CDN keeps copies of them on servers all over the world.'], on: ['o', 'p', 't'], flux: [0, 1] },
        { t: ['Chaque visiteur est servi par le plus proche : moins de latence, et l’origine respire.', 'Each visitor is served by the nearest one: less latency, and the origin can breathe.'], on: ['p', 'v', 't', 'w'], flux: [2, 3] },
      ],
    },

    'reseau-cache': {
      k: 'sequence',
      lh: 54,
      alt: ['Le cache HTTP : premier téléchargement avec ETag, puis revalidation en 304', 'HTTP cache: first download with an ETag, then revalidation with a 304'],
      a: [['Navigateur', 'Browser'], ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'GET /app.js'],
        [1, 0, '200 OK · ETag: "abc"', 'ok dash'],
        [0, 0, ['garde une copie', 'keeps a copy'], 'mute'],
        [0, 1, 'GET /app.js · If-None-Match: "abc"'],
        [1, 0, ['304 Not Modified (sans corps)', '304 Not Modified (no body)'], 'a dash'],
      ],
      anim: [
        { t: ['Premier téléchargement : le serveur envoie le fichier et son ETag, une empreinte de cette version.', 'First download: the server sends the file and its ETag, a fingerprint of that version.'], flux: [0, 1] },
        { t: ['Le navigateur garde une copie.', 'The browser keeps a copy.'], on: [2] },
        { t: ['Plus tard, il redemande le fichier en précisant l’ETag qu’il possède.', 'Later, it asks for the file again, stating the ETag it holds.'], flux: [3] },
        { t: ['Pas modifié : 304, sans corps. Le navigateur réutilise sa copie. Quelques octets au lieu du fichier entier.', 'Not modified: 304, no body. The browser reuses its copy. A few bytes instead of the whole file.'], flux: [4] },
      ],
    },

    'reseau-osi': {
      k: 'pile',
      lh: 30,
      entre: 30,
      alt: ['Les sept couches du modèle OSI face aux quatre couches de TCP/IP', 'The seven layers of the OSI model next to the four layers of TCP/IP'],
      piles: [
        {
          t: 'OSI',
          layers: [
            { t: ['7 Application', '7 Application'], s: 'a' },
            { t: ['6 Présentation', '6 Presentation'], s: 'a' },
            { t: ['5 Session', '5 Session'], s: 'a' },
            { t: ['4 Transport', '4 Transport'], s: 'v' },
            { t: ['3 Réseau', '3 Network'], s: 'ok' },
            { t: ['2 Liaison', '2 Data link'], s: 'warn' },
            { t: ['1 Physique', '1 Physical'], s: 'warn' },
          ],
        },
        {
          t: 'TCP/IP',
          layers: [
            { t: ['Application', 'Application'], d: 'HTTP · DNS', s: 'a', h: 94 },
            { t: ['Transport', 'Transport'], d: 'TCP · UDP', s: 'v', h: 30 },
            { t: 'Internet', d: 'IP', s: 'ok', h: 30 },
            { t: ['Accès réseau', 'Network access'], d: 'Ethernet · Wi-Fi', s: 'warn', h: 64 },
          ],
        },
      ],
    },

    'reseau-ip-port': {
      k: 'dessin',
      h: 132,
      alt: ['Une adresse IP désigne la machine, un port désigne le programme : 192.168.1.42:8080', 'An IP address designates the machine, a port designates the program: 192.168.1.42:8080'],
      d: [
        ['rect', 40, 14, 150, 30, { s: 'a', t: '192.168.1.42', mono: true, sz: 13, r: 6 }],
        ['text', 196, 34, ':', { mono: true, sz: 16, b: true }],
        ['rect', 206, 14, 70, 30, { s: 'warn', t: '8080', mono: true, sz: 13, r: 6 }],
        ['text', 115, 62, ['adresse IP : quelle machine', 'IP address: which machine'], { s: 'a', sz: 10, b: true }],
        ['text', 241, 62, ['port : quel\nprogramme', 'port: which\nprogram'], { s: 'warn', sz: 10, b: true }],
        ['text', 180, 104, ['IPv4 : quatre nombres de 0 à 255 · IPv6 : 2001:db8::1', 'IPv4: four numbers from 0 to 255 · IPv6: 2001:db8::1'], { sz: 10, s: 'mute', max: 340 }],
        ['text', 180, 122, '80 http · 443 https · 22 ssh · 5432 PostgreSQL', { mono: true, sz: 9.5, s: 'mute' }],
      ],
      anim: [
        { t: ['L’adresse IP : l’immeuble. Elle désigne une machine sur le réseau.', 'The IP address: the building. It designates a machine on the network.'], on: [0, 3, 5] },
        { t: ['Le port : l’appartement. Sur cette machine, plusieurs programmes écoutent ; le port dit lequel.', 'The port: the apartment. On that machine, several programs are listening; the port says which one.'], on: [1, 2, 4, 6] },
      ],
    },

    'reseau-latence-debit': {
      k: 'dessin',
      h: 150,
      alt: ['La bande passante est la largeur du tuyau ; la latence est le temps que met le premier octet à arriver', 'Bandwidth is the width of the pipe; latency is the time the first byte takes to arrive'],
      d: [
        ['rect', 20, 30, 320, 36, { s: 'a', r: 18 }],
        ['text', 180, 52, ['bande passante : la largeur du tuyau (Mbit/s)', 'bandwidth: the width of the pipe (Mbit/s)'], { sz: 10, b: true }],
        ['line', 20, 90, 340, 90, { s: 'warn', arrow: 1 }],
        ['text', 180, 108, ['latence : le temps du premier octet, aller-retour (ms)', 'latency: the time of the first byte, round trip (ms)'], { sz: 10, s: 'warn', b: true, max: 330 }],
        ['text', 180, 138, ['Fibre : énorme débit, 5 ms. Satellite : bon débit, 600 ms. Un jeu en ligne préfère la fibre.', 'Fiber: huge bandwidth, 5 ms. Satellite: good bandwidth, 600 ms. An online game prefers fiber.'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['Bande passante : combien de données passent par seconde. Un gros tuyau télécharge un film vite.', 'Bandwidth: how much data gets through per second. A wide pipe downloads a movie fast.'], on: [0, 1] },
        { t: ['Latence : combien de temps avant que la première goutte arrive. Un tuyau long et vide reste lent à réagir, si large soit-il.', 'Latency: how long before the first drop arrives. A long, empty pipe stays slow to react, however wide.'], on: [2, 3, 4], flux: [2] },
      ],
    },

    'reseau-localhost': {
      k: 'graphe',
      alt: ['localhost : le navigateur parle à un serveur sur la même machine ; rien ne sort vers Internet', 'localhost: the browser talks to a server on the same machine; nothing goes out to the Internet'],
      n: [
        { id: 'a', t: ['Votre navigateur', 'Your browser'], c: 0, r: 0.5, s: 'a', w: 104 },
        { id: 's', t: ['Votre serveur\nde dev', 'Your dev\nserver'], sub: ':8210', c: 1, r: 0.5, s: 'ok', w: 96, h: 56 },
        { id: 'i', t: 'Internet', c: 2, r: 0.5, f: 'cloud', s: 'mute', w: 88, h: 50 },
      ],
      e: [['a', 's', 'http://localhost:8210', 'a'], ['s', 'i', ['rien ne sort', 'nothing goes out'], 'mute dash sans']],
      l: ['localhost = 127.0.0.1 : la machine elle-même. Personne d’autre ne peut y accéder.', 'localhost = 127.0.0.1: the machine itself. Nobody else can reach it.'],
      anim: [
        { t: ['Le serveur de développement écoute sur le port 8210 de votre propre machine.', 'The dev server listens on port 8210 of your own machine.'], on: ['s'] },
        { t: ['Le navigateur lui parle par l’adresse de bouclage : la requête ne quitte jamais l’ordinateur. Pas de HTTPS nécessaire, pas de visiteur possible.', 'The browser talks to it through the loopback address: the request never leaves the computer. No HTTPS needed, no visitor possible.'], on: ['a', 's', 'i'], flux: [0] },
      ],
    },

    'reseau-methodes': {
      k: 'pile',
      lh: 30,
      alt: ['Les méthodes HTTP et leur sens : GET lit, POST crée, PUT remplace, PATCH modifie, DELETE supprime', 'HTTP methods and their meaning: GET reads, POST creates, PUT replaces, PATCH modifies, DELETE deletes'],
      piles: [{
        layers: [
          { t: 'GET', d: ['lire, sans rien changer', 'read, change nothing'], s: 'ok', mono: true },
          { t: 'POST', d: ['créer, envoyer un formulaire', 'create, submit a form'], s: 'a', mono: true },
          { t: 'PUT', d: ['remplacer en entier', 'replace entirely'], s: 'v', mono: true },
          { t: 'PATCH', d: ['modifier en partie', 'modify in part'], s: 'v', mono: true },
          { t: 'DELETE', d: ['supprimer', 'delete'], s: 'bad', mono: true },
        ],
      }],
      anim: [
        { t: ['GET : « donne-moi ». Sans effet, on peut le répéter, le mettre en cache, le mettre en favori.', 'GET: “give me”. No side effect, can be repeated, cached, bookmarked.'], on: [0] },
        { t: ['POST : « voici quelque chose de nouveau ». Deux envois, deux créations : jamais en favori.', 'POST: “here is something new”. Two sends, two creations: never bookmarked.'], on: [1] },
        { t: ['PUT remplace tout, PATCH ne touche que les champs envoyés, DELETE supprime. Avec une adresse, cela fait une API REST.', 'PUT replaces everything, PATCH only touches the fields sent, DELETE removes. With an address, that makes a REST API.'], on: [2, 3, 4] },
      ],
    },

    'reseau-paquet': {
      k: 'cases',
      alt: ['Un paquet : un en-tête et des données ; un gros message est découpé en plusieurs paquets qui voyagent séparément', 'A packet: a header and data; a big message is cut into several packets that travel separately'],
      rows: [
        { t: ['Un paquet IP', 'An IP packet'], cells: [['en-tête', 'header'], ['données', 'data']], s: ['a', 'ok'], w: 150, mono: false, sz: 12, cap: [['de, vers, numéro, taille', 'from, to, number, size'], ['un morceau du message', 'a piece of the message']] },
        { sep: ['découpé en paquets', 'cut into packets'] },
        { cells: ['#1', '#2', '#3', '#4'], s: ['ok', 'ok', 'warn', 'ok'], w: 60, sz: 12, cap: ['', '', ['en retard', 'late'], ''] },
      ],
      l: ['Chaque paquet voyage seul, parfois par un autre chemin ; TCP les remet dans l’ordre à l’arrivée.', 'Each packet travels alone, sometimes along another route; TCP puts them back in order on arrival.'],
      anim: [
        { t: ['L’en-tête est l’enveloppe : adresse d’origine, adresse de destination, numéro d’ordre, taille.', 'The header is the envelope: source address, destination address, sequence number, size.'], on: ['r0:0'] },
        { t: ['Les données : un morceau du message, quelques centaines d’octets.', 'The data: a piece of the message, a few hundred bytes.'], on: ['r0:1'] },
        { t: ['Une page web, c’est des centaines de paquets. Le #3 arrive après le #4 ? TCP attend et remet tout dans l’ordre.', 'A web page is hundreds of packets. #3 arrives after #4? TCP waits and puts everything back in order.'], on: [1, 2] },
      ],
    },

    'reseau-firewall': {
      k: 'graphe',
      gy: 66,
      alt: ['Un pare-feu laisse passer le port 443 vers le serveur web et bloque le port 5432 de la base', 'A firewall lets port 443 through to the web server and blocks the database’s port 5432'],
      n: [
        { id: 'i', t: 'Internet', c: 0, r: 0.5, f: 'cloud', s: 'mute', w: 88, h: 50 },
        { id: 'f', t: ['Pare-feu', 'Firewall'], sub: ['règles par port', 'rules per port'], c: 1, r: 0.5, s: 'warn', w: 96, h: 52 },
        { id: 'a', t: ['Serveur web\n:443', 'Web server\n:443'], c: 2, r: 0, s: 'ok', w: 96, sz: 11 },
        { id: 'b', t: ['Base de données\n:5432', 'Database\n:5432'], c: 2, r: 1, s: 'bad', w: 110, sz: 11 },
      ],
      e: [['i', 'f', '', 'mute'], ['f', 'a', ['443 : autorisé', '443: allowed'], 'ok'], ['f', 'b', ['5432 : bloqué', '5432: blocked'], 'bad dash']],
      anim: [
        { t: ['Tout ce qui vient d’Internet passe d’abord par le pare-feu.', 'Everything coming from the Internet first goes through the firewall.'], on: ['i', 'f'], flux: [0] },
        { t: ['Le port 443 (HTTPS) est ouvert : les visiteurs atteignent le serveur web.', 'Port 443 (HTTPS) is open: visitors reach the web server.'], on: ['f', 'a'], flux: [1] },
        { t: ['Le port 5432 est fermé de l’extérieur : seule la machine du serveur web peut parler à la base.', 'Port 5432 is closed from outside: only the web server’s machine can talk to the database.'], on: ['f', 'b'], flux: [2] },
      ],
    },

    'reseau-tcp-udp': {
      k: 'sequence',
      lh: 42,
      alt: ['TCP ouvre une connexion par une poignée de main en trois temps ; UDP envoie directement, sans accusé', 'TCP opens a connection with a three-way handshake; UDP sends directly, without acknowledgement'],
      a: ['Client', ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'SYN'],
        [1, 0, 'SYN-ACK', 'dash'],
        [0, 1, 'ACK', 'ok'],
        ['note', 0, 1, ['TCP : poignée de main, accusés de réception, remise dans l’ordre. Fiable, un peu plus lent.', 'TCP: handshake, acknowledgements, reordering. Reliable, a bit slower.']],
        [0, 1, ['UDP : envoi direct, sans accusé', 'UDP: sent directly, no acknowledgement'], 'warn'],
        [0, 1, ['encore un ; perdu ? tant pis', 'another one; lost? too bad'], 'warn dash'],
      ],
      anim: [
        { t: ['TCP : « on parle ? » — « d’accord, on parle ? » — « d’accord ». Trois messages avant le premier octet utile.', 'TCP: “shall we talk?” — “fine, shall we?” — “fine”. Three messages before the first useful byte.'], flux: [0, 1, 2] },
        { t: ['Ensuite chaque paquet est accusé ; un perdu est renvoyé. Le web, le courrier, Git : tout ce qui doit arriver entier.', 'Then every packet is acknowledged; a lost one is resent. The web, email, Git: everything that must arrive whole.'], on: [3] },
        { t: ['UDP : on envoie, point. Un paquet perdu n’est jamais renvoyé. La visio, le jeu en ligne : mieux vaut une image manquante qu’une image en retard.', 'UDP: you send, full stop. A lost packet is never resent. Video calls, online games: a missing frame beats a late one.'], flux: [4, 5] },
      ],
    },

    'reseau-timeout': {
      k: 'sequence',
      lh: 44,
      alt: ['Un délai d’attente : le serveur ne répond pas, le client abandonne après 5 secondes', 'A timeout: the server does not answer, the client gives up after 5 seconds'],
      a: ['Client', ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, ['requête', 'request']],
        [1, 1, ['… ne répond pas …', '… no answer …'], 'mute'],
        [0, 0, ['5 s écoulées : abandon', '5 s elapsed: give up'], 'bad'],
        [0, 0, ['réessayer, ou prévenir', 'retry, or tell the user'], 'warn'],
      ],
      anim: [
        { t: ['La requête part. Le serveur est surchargé, ou le réseau coupé : rien ne revient.', 'The request goes out. The server is overloaded, or the network is down: nothing comes back.'], flux: [0], on: [1] },
        { t: ['Sans limite, le client attendrait pour toujours. Avec un délai de 5 s, il abandonne et sait qu’il a échoué.', 'Without a limit, the client would wait forever. With a 5 s timeout, it gives up and knows it failed.'], on: [2] },
        { t: ['Réessayer un peu plus tard, ou prévenir la personne. Choisir le délai : trop court, de fausses pannes ; trop long, des écrans figés.', 'Retry a bit later, or tell the person. Picking the delay: too short, false failures; too long, frozen screens.'], on: [3] },
      ],
    },

    'reseau-vpn': {
      k: 'graphe',
      gy: 70,
      alt: ['Un VPN : un tunnel chiffré entre votre appareil et le serveur VPN, qui ressort ensuite sur Internet', 'A VPN: an encrypted tunnel between your device and the VPN server, which then goes out to the Internet'],
      n: [
        { id: 'a', t: ['Votre appareil', 'Your device'], c: 0, r: 0.5, s: 'a', w: 100 },
        { id: 't', t: ['Tunnel chiffré', 'Encrypted tunnel'], c: 1, r: 0.5, f: 'pill', s: 'v', w: 110 },
        { id: 'v', t: ['Serveur VPN', 'VPN server'], c: 2, r: 0, s: 'ok', w: 92 },
        { id: 'i', t: 'Internet', c: 1, r: 1, f: 'cloud', s: 'mute', w: 88, h: 50 },
      ],
      e: [['a', 't', '', 'a'], ['t', 'v', '', 'v'], ['v', 'i', ['en clair, avec l’IP du VPN', 'in the clear, with the VPN’s IP'], 'ok']],
      l: ['Entre vous et le serveur VPN, personne ne lit ni ne voit où vous allez. Au-delà, c’est Internet normal.', 'Between you and the VPN server, nobody reads or sees where you go. Beyond it, it is the normal Internet.'],
      anim: [
        { t: ['Tout votre trafic est chiffré et envoyé au serveur VPN, par un tunnel.', 'All your traffic is encrypted and sent to the VPN server, through a tunnel.'], on: ['a', 't', 'v'], flux: [0, 1] },
        { t: ['Le Wi-Fi du café et votre fournisseur d’accès ne voient qu’un flux chiffré vers une seule adresse.', 'The café’s Wi-Fi and your ISP only see an encrypted stream to a single address.'], on: ['t'] },
        { t: ['Le serveur VPN déchiffre et ressort sur Internet avec sa propre adresse. Les sites visités voient le VPN, pas vous — mais le VPN, lui, voit tout.', 'The VPN server decrypts and goes out to the Internet with its own address. The sites you visit see the VPN, not you — but the VPN sees everything.'], on: ['v', 'i'], flux: [2] },
      ],
    },

    'reseau-header': {
      k: 'dessin',
      h: 190,
      alt: ['Les en-têtes d’une requête HTTP puis ceux de sa réponse', 'The headers of an HTTP request, then those of its response'],
      d: [
        ['text', 8, 14, ['Requête', 'Request'], { a: 's', sz: 10.5, b: true, s: 'a' }],
        ['rect', 8, 22, 344, 74, { s: 'a', r: 6 }],
        ['text', 18, 40, 'GET /notes HTTP/1.1', { a: 's', mono: true, sz: 10.5, b: true }],
        ['text', 18, 56, 'Host: api.exemple.org', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 72, 'Accept: application/json', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 88, 'Authorization: Bearer eyJ…', { a: 's', mono: true, sz: 10.5 }],
        ['text', 8, 116, ['Réponse', 'Response'], { a: 's', sz: 10.5, b: true, s: 'ok' }],
        ['rect', 8, 124, 344, 58, { s: 'ok', r: 6 }],
        ['text', 18, 142, 'HTTP/1.1 200 OK', { a: 's', mono: true, sz: 10.5, b: true }],
        ['text', 18, 158, 'Content-Type: application/json', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 174, 'Cache-Control: max-age=60', { a: 's', mono: true, sz: 10.5 }],
      ],
      anim: [
        { t: ['La première ligne : la méthode, le chemin, la version.', 'The first line: the method, the path, the version.'], on: [0, 1, 2] },
        { t: ['Puis des en-têtes, « Nom: valeur » : pour quel serveur, quel format je veux, qui je suis.', 'Then headers, “Name: value”: for which server, which format I want, who I am.'], on: [1, 3, 4, 5] },
        { t: ['La réponse a les siens : le statut, le type du contenu, combien de temps le garder en cache. Le corps vient après une ligne vide.', 'The response has its own: the status, the content type, how long to cache it. The body comes after a blank line.'], on: [6, 7, 8, 9, 10] },
      ],
    },

    'reseau-github-pages': {
      k: 'graphe',
      alt: ['GitHub Pages : un push sur la branche main, et le site statique est publié à l’adresse du compte', 'GitHub Pages: a push to the main branch, and the static site is published at the account’s address'],
      n: [
        { id: 'l', t: ['Dépôt local', 'Local repo'], c: 0, r: 0.5, f: 'db', s: 'ok', w: 92, h: 50 },
        { id: 'g', t: ['GitHub\nbranche main', 'GitHub\nmain branch'], c: 1, r: 0.5, f: 'cloud', s: 'v', w: 112, h: 56 },
        { id: 'p', t: ['Site publié', 'Published site'], sub: 'compte.github.io', c: 2, r: 0.5, s: 'a', w: 118, h: 52, sz: 11 },
      ],
      e: [['l', 'g', 'git push', 'ok'], ['g', 'p', ['Pages déploie\n(1 à 2 min)', 'Pages deploys\n(1 to 2 min)'], 'a']],
      anim: [
        { t: ['Vous poussez des fichiers HTML, CSS, JS sur la branche main.', 'You push HTML, CSS, JS files to the main branch.'], on: ['l', 'g'], flux: [0] },
        { t: ['GitHub Pages les sert tels quels, en HTTPS, à l’adresse de votre compte. Pas de serveur à gérer — et pas de code côté serveur possible.', 'GitHub Pages serves them as is, over HTTPS, at your account’s address. No server to manage — and no server-side code possible.'], on: ['g', 'p'], flux: [1] },
      ],
    },

    'reseau-ping': {
      k: 'sequence',
      lh: 40,
      alt: ['ping envoie un petit message et mesure le temps de la réponse', 'ping sends a small message and measures the response time'],
      a: [['Vous', 'You'], 'exemple.org'],
      s: ['a', 'v'],
      m: [
        [0, 1, 'echo request'],
        [1, 0, 'echo reply · 23 ms', 'ok dash'],
        [0, 1, 'echo request'],
        [1, 0, 'echo reply · 24 ms', 'ok dash'],
        ['note', 0, 1, ['ping dit si la machine répond et en combien de temps ; pas si son site marche.', 'ping tells whether the machine answers and how fast; not whether its site works.']],
      ],
      anim: [
        { t: ['Un petit paquet part, le même revient : 23 ms aller-retour. C’est la latence.', 'A small packet goes out, the same one comes back: 23 ms round trip. That is latency.'], flux: [0, 1] },
        { t: ['Répété chaque seconde. Des temps qui varient beaucoup, ou des réponses manquantes : un réseau qui souffre.', 'Repeated every second. Times that vary a lot, or missing replies: a network in trouble.'], flux: [2, 3], on: [4] },
      ],
    },

    'reseau-rate-limit': {
      k: 'cases',
      alt: ['Limite de débit : cinq requêtes par minute acceptées, la sixième refusée avec le code 429', 'Rate limit: five requests per minute accepted, the sixth refused with status 429'],
      rows: [
        { t: ['Limite : 5 requêtes par minute', 'Limit: 5 requests per minute'], cells: ['1', '2', '3', '4', '5', '6'], s: ['ok', 'ok', 'ok', 'ok', 'ok', 'bad'], cap: ['', '', '', '', '', '429'], w: 44, sz: 13 },
      ],
      l: ['La sixième reçoit 429 Too Many Requests, souvent avec Retry-After : attendre, puis réessayer.', 'The sixth one gets 429 Too Many Requests, often with Retry-After: wait, then retry.'],
      anim: [
        { t: ['Cinq requêtes dans la minute : acceptées.', 'Five requests within the minute: accepted.'], on: ['r0:0', 'r0:1', 'r0:2', 'r0:3', 'r0:4'] },
        { t: ['La sixième : 429. Le service se protège d’un script emballé ou d’une attaque. Un bon client lit Retry-After et patiente.', 'The sixth: 429. The service protects itself from a runaway script or an attack. A good client reads Retry-After and waits.'], on: ['r0:5'] },
      ],
    },

  });
})(window);
