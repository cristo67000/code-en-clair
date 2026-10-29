'use strict';
/*
 * Schémas de la catégorie « Architecture et concepts ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'archi-api': {
      k: 'graphe',
      alt: ['Une API : l’application envoie une requête à l’interface, sans connaître l’intérieur du service', 'An API: the app sends a request to the interface, without knowing the service’s inner workings'],
      gy: 76,
      n: [
        { id: 'a', t: ['Votre\napplication', 'Your\napp'], c: 0, r: 0, s: 'a', w: 92 },
        { id: 'i', t: 'API', c: 1, r: 0, s: 'v', w: 78 },
        { id: 's', t: ['Service', 'Service'], sub: ['(boîte noire)', '(black box)'], c: 2, r: 0, f: 'db', s: 'mute', w: 96, h: 56 },
      ],
      e: [['a', 'i', ['requête', 'request'], 'a'], ['i', 'a', ['JSON', 'JSON'], 'ok dash'], ['i', 's', '', 'v']],
      anim: [
        { t: ['Votre application envoie une requête à l’API, dans la forme convenue.', 'Your app sends a request to the API, in the agreed form.'], on: ['a', 'i'], flux: [0] },
        { t: ['Derrière, le service fait ce qu’il veut : vous n’avez pas à le savoir.', 'Behind it, the service does whatever it does: you do not need to know.'], on: ['i', 's'], flux: [2] },
        { t: ['Il répond dans la forme convenue : du JSON. Le contrat, c’est l’API.', 'It answers in the agreed form: JSON. The contract is the API.'], on: ['i', 'a'], flux: [1] },
      ],
    },

    'archi-client-serveur': {
      k: 'graphe',
      alt: ['Le front-end (client) envoie des requêtes au back-end (serveur), qui interroge la base de données', 'The front-end (client) sends requests to the back-end (server), which queries the database'],
      gy: 84,
      n: [
        { id: 'f', t: 'Front-end', sub: ['navigateur, appli', 'browser, app'], c: 0, r: 0, s: 'a', w: 112, h: 50 },
        { id: 'b', t: 'Back-end', sub: ['le serveur', 'the server'], c: 1, r: 0, s: 'v', w: 112, h: 50 },
        { id: 'd', t: ['Base de données', 'Database'], c: 1, r: 1, f: 'db', s: 'ok', w: 112, h: 54 },
      ],
      e: [['f', 'b', ['requête', 'request'], 'a'], ['b', 'f', ['réponse', 'response'], 'v dash'], ['b', 'd', 'SQL', 'ok']],
      anim: [
        { t: ['Le client demande : « les notes de l’utilisateur 42 ».', 'The client asks: “the notes of user 42”.'], on: ['f', 'b'], flux: [0] },
        { t: ['Le serveur interroge la base de données.', 'The server queries the database.'], on: ['b', 'd'], flux: [2] },
        { t: ['Et répond au client, qui affiche.', 'And answers the client, which displays.'], on: ['b', 'f'], flux: [1] },
      ],
    },

    'archi-mvc': {
      k: 'graphe',
      alt: ['MVC : la vue affiche, le contrôleur reçoit les actions, le modèle garde les données', 'MVC: the view displays, the controller receives actions, the model holds the data'],
      gy: 92,
      n: [
        { id: 'v', t: ['Vue', 'View'], sub: ['ce qu’on voit', 'what you see'], c: 0, r: 0, s: 'a', w: 112, h: 50 },
        { id: 'c', t: ['Contrôleur', 'Controller'], sub: ['reçoit les actions', 'receives actions'], c: 2, r: 0, s: 'v', w: 118, h: 50, sz: 11 },
        { id: 'm', t: ['Modèle', 'Model'], sub: ['données + règles', 'data + rules'], c: 1, r: 1, s: 'ok', w: 118, h: 50 },
      ],
      e: [['v', 'c', ['actions', 'actions'], 'a'], ['c', 'm', ['met à jour', 'updates'], 'v'], ['m', 'v', ['notifie', 'notifies'], 'ok dash']],
      anim: [
        { t: ['Vous touchez un bouton dans la vue : le contrôleur reçoit l’action.', 'You press a button in the view: the controller receives the action.'], on: ['v', 'c'], flux: [0] },
        { t: ['Il met à jour le modèle : les données, selon les règles.', 'It updates the model: the data, according to the rules.'], on: ['c', 'm'], flux: [1] },
        { t: ['Le modèle prévient la vue, qui se redessine.', 'The model notifies the view, which redraws itself.'], on: ['m', 'v'], flux: [2] },
      ],
    },

    'archi-microservices': {
      k: 'graphe',
      alt: ['Un monolithe contient tout dans un programme ; des microservices sont de petits services qui communiquent', 'A monolith holds everything in one program; microservices are small services that communicate'],
      gy: 84,
      n: [
        { id: 'm', t: ['Un seul programme', 'A single program'], sub: ['clients · commandes · paiement', 'customers · orders · payment'], c: 1, r: 0, s: 'warn', w: 230, h: 50, sz: 11 },
        { id: 'u', t: ['Clients', 'Customers'], c: 0, r: 1, s: 'a', w: 86, sz: 10.5 },
        { id: 'o', t: ['Commandes', 'Orders'], c: 1, r: 1, s: 'v', w: 92, sz: 10.5 },
        { id: 'p', t: ['Paiement', 'Payment'], c: 2, r: 1, s: 'ok', w: 86, sz: 10.5 },
      ],
      e: [['u', 'o', '', 'a'], ['o', 'p', '', 'v']],
      g: [{ t: ['Monolithe', 'Monolith'], ids: ['m'] }, { t: 'Microservices', ids: ['u', 'o', 'p'] }],
    },

    'archi-cache': {
      k: 'sequence',
      lh: 46,
      alt: ['Un cache répond directement s’il a la donnée (hit), sinon il la demande au serveur (miss)', 'A cache answers directly if it has the data (hit), otherwise it asks the server (miss)'],
      a: ['Client', 'Cache', ['Serveur', 'Server']],
      s: ['a', 'warn', 'v'],
      m: [
        [0, 1, ['donnée A ?', 'data A?']],
        [1, 0, ['oui (hit) : immédiat', 'yes (hit): instant'], 'ok dash'],
        [0, 1, ['donnée B ?', 'data B?']],
        [1, 2, ['non (miss) : demande', 'no (miss): asks']],
        [2, 1, ['donnée B', 'data B'], 'dash'],
        [1, 0, ['B + copie gardée', 'B + copy kept'], 'ok dash'],
      ],
      anim: [
        { t: ['Le client demande A. Le cache l’a : réponse immédiate. Un hit.', 'The client asks for A. The cache has it: instant answer. A hit.'], flux: [0, 1] },
        { t: ['Il demande B. Le cache ne l’a pas : un miss. Il va la chercher au serveur.', 'It asks for B. The cache does not have it: a miss. It fetches it from the server.'], flux: [2, 3] },
        { t: ['Le serveur répond ; le cache garde une copie et la transmet. La prochaine fois, B sera un hit.', 'The server answers; the cache keeps a copy and passes it on. Next time, B will be a hit.'], flux: [4, 5] },
      ],
    },

    'archi-load-balancer': {
      k: 'graphe',
      alt: ['Un répartiteur de charge distribue les requêtes entre plusieurs serveurs et évite celui qui est en panne', 'A load balancer spreads requests over several servers and avoids the one that is down'],
      gy: 64,
      n: [
        { id: 'v', t: ['Visiteurs', 'Visitors'], c: 0, r: 1, f: 'cloud', s: 'info', w: 88, h: 50 },
        { id: 'l', t: ['Répartiteur', 'Load\nbalancer'], c: 1, r: 1, s: 'v', w: 92, sz: 11 },
        { id: 'a', t: ['Serveur 1', 'Server 1'], c: 2, r: 0, s: 'ok', w: 86, sz: 11 },
        { id: 'b', t: ['Serveur 2', 'Server 2'], sub: ['en panne', 'down'], c: 2, r: 1, s: 'bad', w: 86, h: 48, sz: 11 },
        { id: 'c', t: ['Serveur 3', 'Server 3'], c: 2, r: 2, s: 'ok', w: 86, sz: 11 },
      ],
      e: [['v', 'l', '', 'info'], ['l', 'a', '', 'ok'], ['l', 'b', '✗', 'bad dash'], ['l', 'c', '', 'ok']],
      anim: [
        { t: ['Toutes les requêtes arrivent au répartiteur.', 'All requests reach the load balancer.'], on: ['v', 'l'], flux: [0] },
        { t: ['Il les distribue entre les serveurs en bonne santé.', 'It spreads them over the healthy servers.'], on: ['l', 'a', 'c'], flux: [1, 3] },
        { t: ['Le serveur 2 ne répond plus : le répartiteur l’écarte. Les visiteurs ne remarquent rien.', 'Server 2 stops answering: the balancer leaves it out. Visitors notice nothing.'], on: ['l', 'b'], flux: [2] },
      ],
    },

    'archi-queue': {
      k: 'graphe',
      alt: ['Une file de messages relie des producteurs à des consommateurs qui traitent à leur rythme', 'A message queue links producers to consumers that process at their own pace'],
      gy: 66,
      n: [
        { id: 'p1', t: ['Producteur A', 'Producer A'], c: 0, r: 0, s: 'a', w: 92, sz: 11 },
        { id: 'p2', t: ['Producteur B', 'Producer B'], c: 0, r: 1, s: 'a', w: 92, sz: 11 },
        { id: 'q', t: ['File de\nmessages', 'Message\nqueue'], c: 1, r: 0.5, f: 'db', s: 'warn', w: 92, h: 60, sz: 11 },
        { id: 'c1', t: ['Consommateur 1', 'Consumer 1'], c: 2, r: 0, s: 'ok', w: 100, sz: 10.5 },
        { id: 'c2', t: ['Consommateur 2', 'Consumer 2'], c: 2, r: 1, s: 'ok', w: 100, sz: 10.5 },
      ],
      e: [['p1', 'q', '', 'a'], ['p2', 'q', '', 'a'], ['q', 'c1', '', 'ok'], ['q', 'c2', '', 'ok']],
      anim: [
        { t: ['Les producteurs déposent des messages dans la file, sans attendre qu’ils soient traités.', 'Producers drop messages in the queue, without waiting for them to be processed.'], on: ['p1', 'p2', 'q'], flux: [0, 1] },
        { t: ['La file les garde, dans l’ordre, même si personne n’est prêt.', 'The queue keeps them, in order, even if nobody is ready.'], on: ['q'] },
        { t: ['Les consommateurs les prennent à leur rythme. Un pic de commandes ne fait plus tomber le traitement.', 'Consumers take them at their own pace. A surge of orders no longer brings processing down.'], on: ['q', 'c1', 'c2'], flux: [2, 3] },
      ],
    },

    'archi-webhook': {
      k: 'sequence',
      lh: 46,
      alt: ['Un webhook : le service appelle votre adresse quand un événement survient', 'A webhook: the service calls your address when an event occurs'],
      a: [['Service\n(GitHub…)', 'Service\n(GitHub…)'], ['Votre\napplication', 'Your\napp']],
      s: ['v', 'a'],
      m: [
        [1, 0, ['enregistre l’adresse du webhook (une fois)', 'registers the webhook address (once)'], 'mute'],
        [0, 0, ['un événement survient (push)', 'an event occurs (push)'], 'warn'],
        [0, 1, 'POST /webhook + signature', 'a'],
        [1, 1, ['vérifie la signature', 'verifies the signature'], 'mute'],
        [1, 0, '200 OK', 'ok dash'],
      ],
      anim: [
        { t: ['Une fois pour toutes : vous donnez au service l’adresse à appeler.', 'Once and for all: you give the service the address to call.'], flux: [0] },
        { t: ['Un événement survient chez lui : un push.', 'An event happens on its side: a push.'], on: [1] },
        { t: ['Il appelle votre adresse, avec les détails et une signature.', 'It calls your address, with the details and a signature.'], flux: [2] },
        { t: ['Vous vérifiez la signature, traitez, répondez 200. Pas besoin d’interroger le service en boucle.', 'You verify the signature, process, answer 200. No need to poll the service in a loop.'], on: [3], flux: [4] },
      ],
    },

    'archi-observer': {
      k: 'graphe',
      alt: ['Un sujet prévient automatiquement tous ses observateurs quand il change', 'A subject automatically notifies all its observers when it changes'],
      gy: 64,
      n: [
        { id: 's', t: ['Sujet', 'Subject'], sub: ['change', 'changes'], c: 0, r: 1, s: 'v', w: 96, h: 48 },
        { id: 'a', t: ['Observateur A', 'Observer A'], c: 1, r: 0, s: 'ok', w: 112, sz: 11 },
        { id: 'b', t: ['Observateur B', 'Observer B'], c: 1, r: 1, s: 'ok', w: 112, sz: 11 },
        { id: 'c', t: ['Observateur C', 'Observer C'], c: 1, r: 2, s: 'ok', w: 112, sz: 11 },
      ],
      e: [['s', 'a', ['notifie', 'notifies'], 'ok'], ['s', 'b', '', 'ok'], ['s', 'c', '', 'ok']],
      anim: [
        { t: ['Le sujet change : un nouveau message arrive.', 'The subject changes: a new message arrives.'], on: ['s'] },
        { t: ['Il prévient tous les observateurs abonnés, sans savoir ce qu’ils en font : l’un affiche, l’autre compte, le troisième sauvegarde.', 'It notifies every subscribed observer, without knowing what they do with it: one displays, another counts, the third saves.'], on: ['s', 'a', 'b', 'c'], flux: [0, 1, 2] },
      ],
    },

    'archi-etats': {
      k: 'graphe',
      alt: ['Une machine à états : une commande passe de créée à payée, expédiée puis livrée, ou est annulée', 'A state machine: an order goes from created to paid, shipped then delivered, or is cancelled'],
      gy: 78,
      n: [
        { id: 'c', t: ['créée', 'created'], c: 0, r: 0, s: 'a', w: 76, f: 'pill' },
        { id: 'p', t: ['payée', 'paid'], c: 1, r: 0, s: 'a', w: 76, f: 'pill' },
        { id: 'e', t: ['expédiée', 'shipped'], c: 2, r: 0, s: 'a', w: 82, f: 'pill' },
        { id: 'l', t: ['livrée', 'delivered'], c: 2, r: 1, s: 'ok', w: 82, f: 'pill' },
        { id: 'x', t: ['annulée', 'cancelled'], c: 0.5, r: 1, s: 'bad', w: 92, f: 'pill' },
      ],
      e: [['c', 'p', ['payer', 'pay'], 'a'], ['p', 'e', ['expédier', 'ship'], 'a'], ['e', 'l', ['livrer', 'deliver'], 'ok'], ['c', 'x', '', 'bad dash'], ['p', 'x', '', 'bad dash']],
      anim: [
        { t: ['Une commande est créée.', 'An order is created.'], on: ['c'] },
        { t: ['Payer : elle passe à payée. Seules les transitions prévues sont possibles.', 'Pay: it becomes paid. Only the planned transitions are possible.'], on: ['c', 'p'], flux: [0] },
        { t: ['Expédiée, puis livrée.', 'Shipped, then delivered.'], on: ['p', 'e', 'l'], flux: [1, 2] },
        { t: ['Créée ou payée, elle peut être annulée. Expédiée, plus : l’état interdit la transition.', 'Created or paid, it can be cancelled. Once shipped, no longer: the state forbids the transition.'], on: ['c', 'p', 'x'], flux: [3, 4] },
      ],
    },

    'archi-cloud': {
      k: 'pile',
      lh: 26,
      entre: 16,
      alt: ['IaaS, PaaS, SaaS : à chaque étage, ce que vous gérez (en couleur) et ce que le fournisseur gère (en gris)', 'IaaS, PaaS, SaaS: at each level, what you manage (in color) and what the provider manages (in gray)'],
      piles: [
        { t: 'IaaS', layers: [{ t: ['Application', 'Application'], s: 'a', h: 26 }, { t: ['Données', 'Data'], s: 'a', h: 26 }, { t: 'Runtime', s: 'a', h: 26 }, { t: ['Système', 'System'], s: 'a', h: 26 }, { t: ['Serveur', 'Server'], s: 'mute', h: 26 }] },
        { t: 'PaaS', layers: [{ t: ['Application', 'Application'], s: 'a', h: 26 }, { t: ['Données', 'Data'], s: 'a', h: 26 }, { t: 'Runtime', s: 'mute', h: 26 }, { t: ['Système', 'System'], s: 'mute', h: 26 }, { t: ['Serveur', 'Server'], s: 'mute', h: 26 }] },
        { t: 'SaaS', layers: [{ t: ['Application', 'Application'], s: 'mute', h: 26 }, { t: ['Données', 'Data'], s: 'mute', h: 26 }, { t: 'Runtime', s: 'mute', h: 26 }, { t: ['Système', 'System'], s: 'mute', h: 26 }, { t: ['Serveur', 'Server'], s: 'mute', h: 26 }] },
      ],
      l: ['En couleur : ce que vous gérez. En gris : ce que le fournisseur gère. IaaS : une machine chez AWS · PaaS : Vercel, Heroku · SaaS : Gmail, Notion.', 'In color: what you manage. In gray: what the provider manages. IaaS: a machine at AWS · PaaS: Vercel, Heroku · SaaS: Gmail, Notion.'],
      anim: [
        { t: ['IaaS : vous louez une machine. Le système, le runtime, l’application : tout est à vous. Souple, mais tout est à faire.', 'IaaS: you rent a machine. The system, the runtime, the application: all yours. Flexible, but everything is up to you.'], on: [0, 1, 2, 3, 4] },
        { t: ['PaaS : vous déposez du code, la plateforme fait tourner. Plus de serveur à mettre à jour.', 'PaaS: you drop code, the platform runs it. No more server to update.'], on: ['p1l0', 'p1l1', 'p1l2', 'p1l3', 'p1l4'] },
        { t: ['SaaS : vous utilisez un logiciel fini, par abonnement. Rien à gérer — et rien à personnaliser au-delà de ce qui est prévu.', 'SaaS: you use a finished piece of software, by subscription. Nothing to manage — and nothing to customize beyond what is planned.'], on: ['p2l0', 'p2l1', 'p2l2', 'p2l3', 'p2l4'] },
      ],
    },

    'archi-endpoint': {
      k: 'dessin',
      h: 116,
      alt: ['Un endpoint : une méthode HTTP, le serveur de l’API, et le chemin de la ressource', 'An endpoint: an HTTP method, the API server, and the resource path'],
      d: [
        ['rect', 8, 12, 50, 28, { s: 'ok', t: 'GET', mono: true, sz: 11, r: 4 }],
        ['rect', 64, 12, 150, 28, { s: 'v', t: 'https://api.exemple.org', mono: true, sz: 9.5, r: 4 }],
        ['rect', 218, 12, 88, 28, { s: 'a', t: '/notes/42', mono: true, sz: 11, r: 4 }],
        ['text', 33, 58, ['méthode', 'method'], { s: 'ok', sz: 10, b: true }],
        ['text', 139, 58, ['serveur de l’API', 'API server'], { s: 'v', sz: 10, b: true }],
        ['text', 262, 58, ['endpoint : la note 42', 'endpoint: note 42'], { s: 'a', sz: 10, b: true }],
        ['text', 180, 96, ['Un endpoint = une adresse + une méthode. GET /notes liste, POST /notes crée, DELETE /notes/42 supprime.', 'An endpoint = an address + a method. GET /notes lists, POST /notes creates, DELETE /notes/42 deletes.'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['Le serveur de l’API : le même pour tous ses endpoints.', 'The API server: the same for all its endpoints.'], on: [1, 4] },
        { t: ['Le chemin désigne une ressource : la note numéro 42.', 'The path designates a resource: note number 42.'], on: [2, 5] },
        { t: ['La méthode dit quoi en faire : GET la lit, PUT la remplace, DELETE la supprime. Même chemin, trois endpoints.', 'The method says what to do with it: GET reads it, PUT replaces it, DELETE removes it. Same path, three endpoints.'], on: [0, 3, 6] },
      ],
    },

    'archi-framework': {
      k: 'graphe',
      alt: ['Un framework appelle votre code ; votre code se branche sur lui — l’inverse d’une bibliothèque', 'A framework calls your code; your code plugs into it — the opposite of a library'],
      n: [
        { id: 'f', t: 'Framework', sub: ['la structure, la boucle, le routage', 'the structure, the loop, the routing'], c: 0, r: 0.5, s: 'v', w: 150, h: 56 },
        { id: 'c', t: ['Votre code', 'Your code'], sub: ['des composants, des routes', 'components, routes'], c: 1, r: 0.5, s: 'a', w: 150, h: 56 },
      ],
      e: [['f', 'c', ['appelle', 'calls'], 'v'], ['c', 'f', ['se branche', 'plugs in'], 'a dash']],
      l: ['Une bibliothèque, vous l’appelez ; un framework, c’est lui qui vous appelle.', 'A library, you call it; a framework calls you.'],
      anim: [
        { t: ['Le framework fournit le squelette : il démarre, écoute, route, redessine. Vous n’écrivez pas cette boucle.', 'The framework provides the skeleton: it starts, listens, routes, redraws. You do not write that loop.'], on: ['f'] },
        { t: ['Vous remplissez les trous qu’il prévoit : un composant, une route, un gestionnaire. C’est lui qui les appelle au bon moment.', 'You fill the slots it provides: a component, a route, a handler. It calls them at the right time.'], on: ['f', 'c'], flux: [0, 1] },
      ],
    },

    'archi-full-stack': {
      k: 'pile',
      alt: ['Les étages d’une application : front-end, back-end, base de données, infrastructure', 'The layers of an application: front-end, back-end, database, infrastructure'],
      piles: [{
        t: ['Les étages d’une application', 'The layers of an application'],
        layers: [
          { t: 'Front-end', d: 'HTML · CSS · JavaScript · React', s: 'a' },
          { t: 'Back-end', d: ['API · Node, Python, Java', 'API · Node, Python, Java'], s: 'v' },
          { t: ['Base de données', 'Database'], d: 'SQL · NoSQL', s: 'ok' },
          { t: 'Infrastructure', d: ['serveurs · CI/CD · cloud', 'servers · CI/CD · cloud'], s: 'mute' },
        ],
      }],
      anim: [
        { t: ['Le front-end : ce que la personne voit et touche, dans le navigateur ou l’application.', 'The front-end: what the person sees and touches, in the browser or the app.'], on: [0] },
        { t: ['Le back-end et sa base : la logique, les règles, les données, sur le serveur.', 'The back-end and its database: the logic, the rules, the data, on the server.'], on: [1, 2] },
        { t: ['Full-stack : savoir intervenir à chaque étage. Pas tout maîtriser au même niveau — mais comprendre comment ils se parlent.', 'Full-stack: being able to work at every layer. Not mastering all equally — but understanding how they talk to each other.'], on: [0, 1, 2, 3] },
      ],
    },

    'archi-middleware': {
      k: 'graphe',
      gy: 66,
      alt: ['Une requête traverse une chaîne de middlewares — journal, authentification — avant d’atteindre la route', 'A request goes through a chain of middlewares — logging, authentication — before reaching the route'],
      n: [
        { id: 'r', t: ['Requête', 'Request'], c: 0, r: 0.5, s: 'a', w: 80 },
        { id: 'm1', t: ['Journal', 'Logging'], c: 1, r: 0, s: 'v', w: 84 },
        { id: 'm2', t: ['Authentification', 'Authentication'], c: 1, r: 1, s: 'warn', w: 112, sz: 10.5 },
        { id: 'h', t: ['Votre route', 'Your route'], c: 2, r: 0, s: 'ok', w: 92 },
        { id: 'x', t: ['401 refusé', '401 refused'], c: 2, r: 1, s: 'bad', w: 92 },
      ],
      e: [['r', 'm1', '', 'a'], ['m1', 'm2', '', 'v'], ['m2', 'h', '✓', 'ok'], ['m2', 'x', '✗', 'bad dash']],
      anim: [
        { t: ['La requête entre. Premier maillon : le journal note la méthode, le chemin, l’heure.', 'The request comes in. First link: the logger records the method, the path, the time.'], on: ['r', 'm1'], flux: [0] },
        { t: ['Deuxième maillon : l’authentification lit le jeton. Valide ? On passe au suivant.', 'Second link: authentication reads the token. Valid? On to the next one.'], on: ['m1', 'm2', 'h'], flux: [1, 2] },
        { t: ['Invalide ? Le middleware répond 401 lui-même ; votre route n’est jamais appelée. Chaque maillon fait une chose, et passe la main.', 'Invalid? The middleware answers 401 itself; your route is never called. Each link does one thing, and hands over.'], on: ['m2', 'x'], flux: [3] },
      ],
    },

    'archi-rest': {
      k: 'cases',
      alt: ['Une API REST : des ressources désignées par des chemins, des actions par des méthodes HTTP', 'A REST API: resources designated by paths, actions by HTTP methods'],
      rows: [
        { t: ['La collection : /notes', 'The collection: /notes'], cells: ['GET /notes', 'POST /notes'], s: ['ok', 'a'], cap: [['lister', 'list'], ['créer', 'create']], w: 120, sz: 11 },
        { t: ['Une note : /notes/42', 'One note: /notes/42'], cells: ['GET /notes/42', 'PUT /notes/42', 'DELETE /notes/42'], s: ['ok', 'v', 'bad'], cap: [['lire', 'read'], ['remplacer', 'replace'], ['supprimer', 'delete']], w: 106, sz: 9.5 },
      ],
      l: ['Des noms (les ressources), des verbes HTTP (les actions), du JSON, des codes de statut : c’est REST.', 'Nouns (the resources), HTTP verbs (the actions), JSON, status codes: that is REST.'],
      anim: [
        { t: ['/notes est la collection : GET la liste, POST y ajoute une note (le serveur choisit son numéro).', '/notes is the collection: GET lists it, POST adds a note to it (the server picks its number).'], on: [0] },
        { t: ['/notes/42 est une note précise : GET la lit, PUT la remplace, DELETE la supprime. Pas de /supprimerNote : le verbe est dans la méthode.', '/notes/42 is one specific note: GET reads it, PUT replaces it, DELETE removes it. No /deleteNote: the verb is in the method.'], on: [1] },
      ],
    },

    'archi-backup': {
      k: 'graphe',
      gy: 66,
      alt: ['La règle 3-2-1 : trois copies, sur deux supports, dont une ailleurs — et une restauration testée', 'The 3-2-1 rule: three copies, on two media, one of them elsewhere — and a tested restore'],
      n: [
        { id: 'd', t: ['Vos données', 'Your data'], c: 0, r: 0.5, s: 'a', w: 92 },
        { id: 'l', t: ['Copie locale\n(disque externe)', 'Local copy\n(external drive)'], c: 1, r: 0, s: 'ok', w: 118, sz: 10.5 },
        { id: 'c', t: ['Copie distante\n(cloud, autre lieu)', 'Off-site copy\n(cloud, elsewhere)'], c: 1, r: 1, s: 'v', w: 126, sz: 10.5 },
        { id: 't', t: ['Restauration\ntestée', 'Restore\ntested'], c: 2, r: 0.5, s: 'warn', w: 92, sz: 11 },
      ],
      e: [['d', 'l', '', 'ok'], ['d', 'c', '', 'v'], ['l', 't', '', 'warn dash'], ['c', 't', '', 'warn dash']],
      l: ['3-2-1 : trois copies, deux supports, une ailleurs. Une sauvegarde jamais restaurée n’existe pas.', '3-2-1: three copies, two media, one elsewhere. A backup never restored does not exist.'],
      anim: [
        { t: ['Une copie locale, rapide à faire et à restaurer : un disque externe, un NAS.', 'A local copy, quick to make and to restore: an external drive, a NAS.'], on: ['d', 'l'], flux: [0] },
        { t: ['Une copie ailleurs : un incendie, un vol, un rançongiciel emportent tout ce qui est au même endroit.', 'A copy elsewhere: a fire, a theft, ransomware take everything in the same place.'], on: ['d', 'c'], flux: [1] },
        { t: ['Et, de temps en temps, restaurer pour de vrai. Beaucoup de sauvegardes se révèlent vides le jour où on en a besoin.', 'And, every now and then, actually restore. Many backups turn out empty the day they are needed.'], on: ['l', 'c', 't'], flux: [2, 3] },
      ],
    },

    'archi-scalabilite': {
      k: 'dessin',
      h: 130,
      alt: ['Monter en charge verticalement, un serveur plus gros ; horizontalement, plus de serveurs', 'Scaling up vertically, a bigger server; horizontally, more servers'],
      d: [
        ['text', 96, 14, ['Verticale : plus gros', 'Vertical: bigger'], { sz: 11, b: true, s: 'a' }],
        ['rect', 30, 34, 52, 36, { s: 'mute', t: '2 CPU', sz: 9.5, r: 4 }],
        ['line', 88, 52, 114, 52, { s: 'a', arrow: 1 }],
        ['rect', 120, 24, 70, 56, { s: 'a', t: ['16 CPU\n64 Go', '16 CPU\n64 GB'], sz: 9.5, r: 4 }],
        ['text', 110, 102, ['simple, mais un plafond, et un seul point de panne', 'simple, but a ceiling, and a single point of failure'], { sz: 9, s: 'mute', max: 190 }],
        ['text', 282, 14, ['Horizontale : plus nombreux', 'Horizontal: more of them'], { sz: 11, b: true, s: 'ok' }],
        ['rect', 222, 34, 36, 36, { s: 'ok', t: '1', sz: 10, r: 4 }],
        ['rect', 264, 34, 36, 36, { s: 'ok', t: '2', sz: 10, r: 4 }],
        ['rect', 306, 34, 36, 36, { s: 'ok', t: '3', sz: 10, r: 4 }],
        ['text', 282, 102, ['sans limite, tolère les pannes, mais il faut répartir', 'no limit, tolerates failures, but needs balancing'], { sz: 9, s: 'mute', max: 150 }],
      ],
      anim: [
        { t: ['Verticale : on remplace le serveur par un plus puissant. Rien à changer dans le code — jusqu’au plus gros serveur qui existe.', 'Vertical: the server is replaced by a more powerful one. Nothing to change in the code — until the biggest server that exists.'], on: [0, 1, 2, 3, 4], flux: [2] },
        { t: ['Horizontale : on ajoute des serveurs identiques derrière un répartiteur. Sans plafond, et un serveur en panne n’arrête rien — à condition que l’application s’y prête.', 'Horizontal: identical servers are added behind a load balancer. No ceiling, and a failed server stops nothing — provided the app allows it.'], on: [5, 6, 7, 8, 9] },
      ],
    },

    'archi-sdk': {
      k: 'graphe',
      alt: ['Un SDK : une bibliothèque, des outils et une documentation pour parler à une plateforme', 'An SDK: a library, tools and documentation to talk to a platform'],
      n: [
        { id: 'v', t: ['Votre code', 'Your code'], c: 0, r: 0.5, s: 'a', w: 90 },
        { id: 's', t: 'SDK', sub: ['bibliothèque + outils + doc', 'library + tools + docs'], c: 1, r: 0.5, s: 'v', w: 130, h: 52 },
        { id: 'p', t: ['Plateforme\n(Android, Stripe…)', 'Platform\n(Android, Stripe…)'], c: 2, r: 0.5, s: 'ok', w: 110, sz: 10.5 },
      ],
      e: [['v', 's', ['appelle', 'calls'], 'a'], ['s', 'p', ['parle à', 'talks to'], 'v']],
      anim: [
        { t: ['Sans SDK, il faudrait écrire soi-même chaque requête à l’API, dans le bon format, avec la bonne authentification.', 'Without an SDK, you would write every API request yourself, in the right format, with the right authentication.'], on: ['v', 'p'] },
        { t: ['Le SDK fournit des fonctions prêtes (stripe.charges.create), des outils (émulateur, compilateur) et la doc. Votre code reste court.', 'The SDK provides ready-made functions (stripe.charges.create), tools (emulator, compiler) and the docs. Your code stays short.'], on: ['v', 's', 'p'], flux: [0, 1] },
      ],
    },

    'archi-serverless': {
      k: 'sequence',
      lh: 46,
      alt: ['Serverless : un événement arrive, le fournisseur démarre votre fonction, la fait répondre, puis l’éteint', 'Serverless: an event comes in, the provider starts your function, has it answer, then shuts it down'],
      a: [['Événement', 'Event'], ['Fournisseur', 'Provider'], ['Votre fonction', 'Your function']],
      s: ['a', 'v', 'ok'],
      m: [
        [0, 1, ['requête HTTP', 'HTTP request']],
        [1, 2, ['démarre et appelle (ms)', 'starts and calls (ms)'], 'a'],
        [2, 1, ['réponse', 'response'], 'ok dash'],
        [1, 1, ['éteint la fonction : zéro coût au repos', 'shuts the function down: zero cost when idle'], 'mute'],
      ],
      anim: [
        { t: ['Une requête, un fichier déposé, une minuterie : un événement arrive chez le fournisseur.', 'A request, a file dropped, a timer: an event arrives at the provider.'], flux: [0] },
        { t: ['Il démarre votre fonction, quelque part, en quelques millisecondes (ou quelques centaines : le démarrage à froid), et la fait répondre.', 'It starts your function, somewhere, in a few milliseconds (or a few hundred: the cold start), and has it answer.'], flux: [1, 2] },
        { t: ['Puis il l’éteint. Vous payez le temps d’exécution, pas un serveur qui attend. Aucune machine à gérer — et aucune à contrôler.', 'Then it shuts it down. You pay for execution time, not for a waiting server. No machine to manage — and none to control.'], on: [3] },
      ],
    },

    'archi-singleton': {
      k: 'graphe',
      gy: 60,
      alt: ['Un singleton : la classe ne fabrique qu’une instance, que tous les modules reçoivent', 'A singleton: the class builds only one instance, which every module receives'],
      n: [
        { id: 'c', t: ['Classe Config', 'Config class'], c: 0, r: 0.5, s: 'a', w: 104 },
        { id: 'i', t: ['L’unique instance', 'The single instance'], c: 1, r: 0.5, s: 'ok', w: 118, h: 50 },
        { id: 'a', t: 'Module A', c: 2, r: 0, s: 'mute', w: 80 },
        { id: 'b', t: 'Module B', c: 2, r: 1, s: 'mute', w: 80 },
      ],
      e: [['c', 'i', 'getInstance()', 'a'], ['a', 'i', '', 'mute dash'], ['b', 'i', '', 'mute dash']],
      l: ['Tous reçoivent le même objet. Pratique, mais c’est une variable globale déguisée : à utiliser avec parcimonie.', 'Everyone gets the same object. Handy, but it is a global variable in disguise: use sparingly.'],
      anim: [
        { t: ['Le premier appel à getInstance() crée l’objet ; les suivants rendent le même.', 'The first call to getInstance() creates the object; the following ones return the same.'], on: ['c', 'i'], flux: [0] },
        { t: ['Module A et module B partagent donc la même configuration. Mais un test qui veut sa propre configuration doit ruser : c’est le prix du singleton.', 'Module A and module B thus share the same configuration. But a test that wants its own configuration has to work around it: that is the price of the singleton.'], on: ['i', 'a', 'b'], flux: [1, 2] },
      ],
    },

    'archi-spof': {
      k: 'graphe',
      gy: 64,
      alt: ['Deux serveurs web, mais une seule base de données : si elle tombe, tout tombe', 'Two web servers, but a single database: if it goes down, everything goes down'],
      n: [
        { id: 'u', t: ['Visiteurs', 'Visitors'], c: 0, r: 0.5, f: 'cloud', s: 'info', w: 88, h: 50 },
        { id: 'w1', t: ['Serveur web 1', 'Web server 1'], c: 1, r: 0, s: 'ok', w: 100, sz: 11 },
        { id: 'w2', t: ['Serveur web 2', 'Web server 2'], c: 1, r: 1, s: 'ok', w: 100, sz: 11 },
        { id: 'b', t: ['Base de données\n(une seule)', 'Database\n(just one)'], c: 2, r: 0.5, f: 'db', s: 'bad', w: 110, h: 62, sz: 11 },
      ],
      e: [['u', 'w1', '', 'ok'], ['u', 'w2', '', 'ok'], ['w1', 'b', '', 'bad'], ['w2', 'b', '', 'bad']],
      anim: [
        { t: ['Deux serveurs web : si l’un tombe, l’autre sert les visiteurs. Bien.', 'Two web servers: if one goes down, the other serves the visitors. Good.'], on: ['u', 'w1', 'w2'], flux: [0, 1] },
        { t: ['Mais une seule base de données. Si elle tombe, les deux serveurs web n’ont plus rien à montrer : c’est le point de panne unique.', 'But a single database. If it goes down, the two web servers have nothing left to show: that is the single point of failure.'], on: ['w1', 'w2', 'b'], flux: [2, 3] },
        { t: ['Parade : une réplique prête à prendre le relais. Chercher les SPOF, c’est se demander : « et si celui-ci s’arrêtait ? »', 'Remedy: a replica ready to take over. Hunting SPOFs means asking: “what if this one stopped?”'], on: ['b'] },
      ],
    },

    'archi-licence': {
      k: 'cases',
      alt: ['Ce que permettent trois licences libres, et ce qu’implique l’absence de licence', 'What three open licenses allow, and what the absence of a license implies'],
      rows: [
        { t: ['Ce que permet la licence', 'What the license allows'], cells: ['MIT', 'Apache 2.0', 'GPL'], s: ['ok', 'ok', 'warn'], cap: [['tout, en citant l’auteur', 'anything, with credit'], ['idem, plus les brevets', 'same, plus patents'], ['les dérivés restent GPL', 'derivatives stay GPL']], w: 100, sz: 12, mono: false },
        { cells: [['Pas de licence', 'No license']], s: 'bad', w: 140, sz: 11, mono: false, cap: [['tous droits réservés : on ne peut rien en faire', 'all rights reserved: nothing may be done with it']] },
      ],
      anim: [
        { t: ['MIT et Apache : utilisez, modifiez, vendez, à condition de garder la mention d’origine. Les plus courantes.', 'MIT and Apache: use, modify, sell, provided the original notice is kept. The most common ones.'], on: ['r0:0', 'r0:1'] },
        { t: ['GPL : pareil, mais ce que vous en faites doit être publié sous GPL aussi. Le copyleft.', 'GPL: the same, but what you make from it must be published under the GPL too. Copyleft.'], on: ['r0:2'] },
        { t: ['Aucune licence : le code est public, mais le droit d’auteur s’applique entièrement. Lisible, pas réutilisable.', 'No license: the code is public, but copyright applies in full. Readable, not reusable.'], on: [1] },
      ],
    },

  });
})(window);
