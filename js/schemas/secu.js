'use strict';
/*
 * Schémas de la catégorie « Sécurité et cryptographie ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'secu-hash': {
      k: 'graphe',
      alt: ['Une fonction de hachage : un texte donne toujours la même empreinte, une majuscule la change entièrement', 'A hash function: a text always gives the same fingerprint, one capital letter changes it entirely'],
      gy: 66,
      n: [
        { id: 'a', t: '"Bonjour"', c: 0, r: 0, s: 'a', w: 92, mono: true, sz: 11 },
        { id: 'b', t: '"bonjour"', c: 0, r: 1, s: 'a', w: 92, mono: true, sz: 11 },
        { id: 'f', t: ['Fonction\nSHA-256', 'Function\nSHA-256'], c: 1, r: 0.5, s: 'v', w: 92, h: 50 },
        { id: 'x', t: '9172e8ee…', sub: ['64 chiffres hex', '64 hex digits'], c: 2, r: 0, s: 'ok', w: 104, h: 48, mono: true, sz: 11 },
        { id: 'y', t: '2cb4b143…', sub: ['64 chiffres hex', '64 hex digits'], c: 2, r: 1, s: 'warn', w: 104, h: 48, mono: true, sz: 11 },
      ],
      e: [['a', 'f', '', 'a'], ['b', 'f', '', 'a'], ['f', 'x', '', 'ok'], ['f', 'y', '', 'warn']],
      l: ['Une seule lettre change, l’empreinte est totalement différente. Impossible de remonter au texte.', 'One letter changes, the fingerprint is completely different. There is no way back to the text.'],
      anim: [
        { t: ['« Bonjour » entre, une empreinte de 64 chiffres sort. Toujours la même pour la même entrée.', '“Bonjour” goes in, a 64-digit fingerprint comes out. Always the same for the same input.'], on: ['a', 'f', 'x'], flux: [0, 2] },
        { t: ['Une majuscule en moins : l’empreinte n’a plus rien à voir.', 'One capital letter less: the fingerprint has nothing in common anymore.'], on: ['b', 'f', 'y'], flux: [1, 3] },
        { t: ['Impossible de remonter de l’empreinte au texte. C’est pour cela qu’on hache les mots de passe.', 'There is no way back from the fingerprint to the text. That is why passwords are hashed.'], on: ['x', 'y'] },
      ],
    },

    'secu-chiffrement': {
      k: 'graphe',
      alt: ['Le chiffrement transforme un texte lisible en texte illisible avec une clé, et inversement', 'Encryption turns readable text into unreadable text with a key, and back'],
      haut: 30,
      bas: 26,
      n: [
        { id: 'c', t: ['Texte\nclair', 'Plain\ntext'], c: 0, r: 0, s: 'a', w: 100 },
        { id: 'h', t: ['Texte\nchiffré', 'Encrypted\ntext'], c: 1, r: 0, s: 'warn', w: 100 },
      ],
      e: [['c', 'h', ['chiffrer\n(clé)', 'encrypt\n(key)'], 'a'], ['h', 'c', ['déchiffrer\n(clé)', 'decrypt\n(key)'], 'ok dash']],
      l: ['Contrairement à un hash, le chemin de retour existe — pour qui a la clé.', 'Unlike a hash, the way back exists — for whoever holds the key.'],
      anim: [
        { t: ['Avec la clé, le texte clair devient un texte chiffré, illisible.', 'With the key, the plain text becomes encrypted text, unreadable.'], on: ['c', 'h'], flux: [0] },
        { t: ['Avec la même clé (symétrique) ou la clé jumelle (asymétrique), on retrouve le texte clair.', 'With the same key (symmetric) or the twin key (asymmetric), the plain text comes back.'], on: ['h', 'c'], flux: [1] },
      ],
    },

    'secu-asymetrique': {
      k: 'graphe',
      alt: ['Chiffrer avec la clé publique de Bob : lui seul peut déchiffrer avec sa clé privée', 'Encrypt with Bob’s public key: only he can decrypt with his private key'],
      gy: 76,
      n: [
        { id: 'k', t: ['Clé publique de Bob', 'Bob’s public key'], sub: ['connue de tous', 'known to everyone'], c: 1, r: 0, s: 'info', w: 138, h: 48 },
        { id: 'a', t: 'Alice', c: 0, r: 1, s: 'a', w: 78 },
        { id: 'm', t: ['Message\nchiffré', 'Encrypted\nmessage'], c: 1, r: 1, f: 'file', s: 'warn', w: 92 },
        { id: 'b', t: 'Bob', sub: ['sa clé privée', 'his private key'], c: 2, r: 1, s: 'ok', w: 96, h: 50 },
      ],
      e: [['k', 'a', ['sert à chiffrer', 'used to encrypt'], 'info dash'], ['a', 'm', '', 'a'], ['m', 'b', ['déchiffre', 'decrypts'], 'ok']],
      anim: [
        { t: ['Bob publie sa clé publique : tout le monde peut l’avoir.', 'Bob publishes his public key: anyone can have it.'], on: ['k'] },
        { t: ['Alice s’en sert pour chiffrer son message.', 'Alice uses it to encrypt her message.'], on: ['k', 'a'], flux: [0] },
        { t: ['Le message chiffré voyage. Seule la clé privée de Bob, qu’il n’a jamais partagée, peut le déchiffrer.', 'The encrypted message travels. Only Bob’s private key, which he never shared, can decrypt it.'], on: ['a', 'm', 'b'], flux: [1, 2] },
      ],
    },

    'secu-signature': {
      k: 'sequence',
      lh: 46,
      alt: ['Signer avec la clé privée, vérifier avec la clé publique', 'Sign with the private key, verify with the public key'],
      a: [['Auteur', 'Author'], ['Destinataire', 'Recipient']],
      s: ['a', 'v'],
      m: [
        [0, 0, ['calcule le hash du document', 'hashes the document'], 'mute'],
        [0, 0, ['le signe avec sa clé privée', 'signs it with the private key'], 'a'],
        [0, 1, ['document + signature', 'document + signature']],
        [1, 1, ['recalcule le hash, vérifie avec la clé publique', 'rehashes, verifies with the public key'], 'ok'],
      ],
      anim: [
        { t: ['L’auteur calcule l’empreinte du document.', 'The author computes the document’s hash.'], on: [0] },
        { t: ['Il chiffre cette empreinte avec sa clé privée : c’est la signature.', 'They encrypt that hash with their private key: that is the signature.'], on: [1] },
        { t: ['Le document et la signature partent ensemble.', 'The document and the signature travel together.'], flux: [2] },
        { t: ['Le destinataire recalcule l’empreinte et déchiffre la signature avec la clé publique : si les deux coïncident, c’est bien l’auteur, et rien n’a changé.', 'The recipient recomputes the hash and decrypts the signature with the public key: if the two match, it really is the author, and nothing has changed.'], on: [3] },
      ],
    },

    'secu-certificat': {
      k: 'arbre',
      alt: ['La chaîne de confiance : autorité racine, autorité intermédiaire, certificat du site', 'The chain of trust: root authority, intermediate authority, site certificate'],
      racine: {
        t: ['Autorité\nracine', 'Root\nauthority'], s: 'a', k: [{
          t: ['Autorité\nintermédiaire', 'Intermediate\nauthority'], s: 'v', k: [{ t: 'exemple.org', s: 'ok' }, { t: 'autre.fr', s: 'ok' }],
        }],
      },
      l: ['Le navigateur connaît la racine ; chaque maillon signe le suivant.', 'The browser knows the root; each link signs the next one.'],
      anim: [
        { t: ['Le navigateur fait confiance à quelques autorités racines, livrées avec lui.', 'The browser trusts a few root authorities that ship with it.'], on: ['n0'] },
        { t: ['Une racine signe le certificat d’une autorité intermédiaire.', 'A root signs the certificate of an intermediate authority.'], on: ['n0', 'n1'] },
        { t: ['L’intermédiaire signe celui de exemple.org. Le navigateur remonte la chaîne jusqu’à une racine qu’il connaît.', 'The intermediate signs exemple.org’s. The browser walks the chain up to a root it knows.'], on: ['n1', 'n2'] },
      ],
    },

    'secu-token': {
      k: 'sequence',
      lh: 44,
      alt: ['Après la connexion, le serveur remet un jeton que le client présente à chaque requête', 'After login, the server hands out a token that the client presents with each request'],
      a: [['Client', 'Client'], ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, ['identifiant + mot de passe', 'username + password']],
        [1, 0, ['jeton (token)', 'token'], 'ok dash'],
        [0, 1, ['requête + jeton dans l’en-tête', 'request + token in the header'], 'a'],
        [1, 1, ['vérifie le jeton', 'checks the token'], 'mute'],
        [1, 0, ['données', 'data'], 'dash'],
      ],
      anim: [
        { t: ['Une seule fois : identifiant et mot de passe.', 'Just once: username and password.'], flux: [0] },
        { t: ['Le serveur remet un jeton : une chaîne qui vous représente, pour un temps.', 'The server hands out a token: a string that stands for you, for a while.'], flux: [1] },
        { t: ['Chaque requête suivante porte le jeton dans son en-tête Authorization.', 'Every following request carries the token in its Authorization header.'], flux: [2] },
        { t: ['Le serveur vérifie le jeton, et répond. Le mot de passe n’a plus voyagé.', 'The server checks the token, and answers. The password never travelled again.'], on: [3], flux: [4] },
      ],
    },

    'secu-jwt': {
      k: 'dessin',
      h: 124,
      alt: ['Un JWT : en-tête, charge utile et signature, séparés par des points', 'A JWT: header, payload and signature, separated by dots'],
      d: [
        ['rect', 6, 10, 108, 28, { s: 'a', t: 'eyJhbGciOi…', mono: true, sz: 10.5, r: 4 }],
        ['text', 120, 30, '.', { sz: 16, b: true }],
        ['rect', 126, 10, 108, 28, { s: 'v', t: 'eyJzdWIiOi…', mono: true, sz: 10.5, r: 4 }],
        ['text', 240, 30, '.', { sz: 16, b: true }],
        ['rect', 246, 10, 108, 28, { s: 'ok', t: 'SflKxwRJSM…', mono: true, sz: 10.5, r: 4 }],
        ['line', 60, 40, 60, 56, { s: 'a', arrow: 1 }],
        ['line', 180, 40, 180, 56, { s: 'v', arrow: 1 }],
        ['line', 300, 40, 300, 56, { s: 'ok', arrow: 1 }],
        ['text', 60, 70, ['en-tête', 'header'], { s: 'a', sz: 11, b: true }],
        ['text', 60, 86, '{"alg":"HS256"}', { mono: true, sz: 9, s: 'mute' }],
        ['text', 180, 70, ['charge utile', 'payload'], { s: 'v', sz: 11, b: true }],
        ['text', 180, 86, '{"sub":"42"}', { mono: true, sz: 9, s: 'mute' }],
        ['text', 300, 70, ['signature', 'signature'], { s: 'ok', sz: 11, b: true }],
        ['text', 300, 86, ['garantit l’intégrité', 'guarantees integrity'], { sz: 9, s: 'mute' }],
        ['text', 180, 114, ['Base64 → lisible par tous · signé, pas chiffré', 'Base64 → readable by all · signed, not encrypted'], { sz: 10.5, s: 'warn', b: true }],
      ],
    },

    'secu-oauth': {
      k: 'sequence',
      lh: 52,
      alt: ['OAuth : l’application obtient un jeton du service sans jamais connaître votre mot de passe', 'OAuth: the app gets a token from the service without ever knowing your password'],
      a: [['Vous', 'You'], ['Application', 'App'], ['Service\n(GitHub…)', 'Service\n(GitHub…)']],
      s: ['a', 'v', 'ok'],
      m: [
        [0, 1, ['« Se connecter avec… »', '“Sign in with…”']],
        [1, 2, ['redirige vers le service', 'redirects to the service'], 'mute'],
        [0, 2, ['vous vous connectez et acceptez', 'you log in and accept'], 'ok'],
        [2, 1, ['code d’autorisation', 'authorization code'], 'dash'],
        [1, 2, ['code contre jeton', 'code for token'], 'a'],
        [2, 1, ['jeton d’accès', 'access token'], 'ok dash'],
      ],
      anim: [
        { t: ['Vous choisissez « Se connecter avec GitHub ».', 'You choose “Sign in with GitHub”.'], flux: [0] },
        { t: ['L’application vous envoie chez GitHub ; vous vous y connectez et acceptez ce qu’elle demande.', 'The app sends you to GitHub; you log in there and accept what it asks for.'], flux: [1, 2] },
        { t: ['GitHub renvoie l’application avec un code d’autorisation.', 'GitHub sends the app back with an authorization code.'], flux: [3] },
        { t: ['L’application échange ce code contre un jeton d’accès. Elle n’a jamais vu votre mot de passe.', 'The app trades that code for an access token. It never saw your password.'], flux: [4, 5] },
      ],
    },

    'secu-2fa': {
      k: 'graphe',
      alt: ['Deux preuves de nature différente pour se connecter', 'Two proofs of different kinds to log in'],
      gy: 84,
      n: [
        { id: 'a', t: ['Ce que vous\nsavez', 'What you\nknow'], sub: ['mot de passe', 'password'], c: 0, r: 0, s: 'a', w: 96, h: 56 },
        { id: 'b', t: ['Ce que vous\navez', 'What you\nhave'], sub: ['téléphone, clé', 'phone, key'], c: 1, r: 0, s: 'v', w: 96, h: 56 },
        { id: 'c', t: ['Ce que vous\nêtes', 'What you\nare'], sub: ['empreinte', 'fingerprint'], c: 2, r: 0, s: 'mute', w: 96, h: 56 },
        { id: 'o', t: ['Accès accordé', 'Access granted'], c: 0.5, r: 1, s: 'ok', w: 130 },
      ],
      e: [['a', 'o', '+', 'a'], ['b', 'o', '', 'v']],
      l: ['Deux facteurs de familles différentes : un mot de passe volé ne suffit plus.', 'Two factors from different families: a stolen password is no longer enough.'],
    },

    'secu-session': {
      k: 'sequence',
      lh: 44,
      alt: ['La session : le serveur remet un identifiant en cookie et le retrouve à chaque requête', 'The session: the server hands out an identifier as a cookie and finds it again on each request'],
      a: [['Navigateur', 'Browser'], ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'POST /connexion'],
        [1, 0, 'Set-Cookie: session=abc123', 'ok dash'],
        [0, 1, 'GET /profil · Cookie: session=abc123', 'a'],
        [1, 0, ['200 (votre profil)', '200 (your profile)'], 'dash'],
      ],
      anim: [
        { t: ['Vous vous connectez.', 'You log in.'], flux: [0] },
        { t: ['Le serveur crée une session et vous en remet l’identifiant dans un cookie.', 'The server creates a session and hands you its identifier in a cookie.'], flux: [1] },
        { t: ['Le navigateur renvoie ce cookie à chaque requête, tout seul.', 'The browser sends that cookie back with every request, on its own.'], flux: [2] },
        { t: ['Le serveur retrouve votre session et vous reconnaît.', 'The server finds your session and recognizes you.'], flux: [3] },
      ],
    },

    'secu-xss': {
      k: 'sequence',
      lh: 46,
      alt: ['XSS : le script d’un attaquant s’exécute dans la page d’une victime', 'XSS: an attacker’s script runs in a victim’s page'],
      a: [['Attaquant', 'Attacker'], ['Site', 'Site'], ['Victime', 'Victim']],
      s: ['bad', 'n', 'a'],
      m: [
        [0, 1, ['commentaire piégé <script>', 'booby-trapped comment <script>'], 'bad'],
        [2, 1, ['ouvre la page', 'opens the page']],
        [1, 2, ['page + script piégé', 'page + trapped script'], 'bad dash'],
        [2, 2, ['exécute le script', 'runs the script'], 'bad'],
        [2, 0, ['jeton volé', 'stolen token'], 'bad'],
      ],
      anim: [
        { t: ['L’attaquant poste un commentaire qui contient un <script>.', 'The attacker posts a comment containing a <script>.'], flux: [0] },
        { t: ['Le site l’affiche tel quel à chaque visiteur, script compris.', 'The site displays it as is to every visitor, script included.'], flux: [1, 2] },
        { t: ['Le navigateur de la victime exécute ce script comme s’il venait du site.', 'The victim’s browser runs that script as if it came from the site.'], on: [3] },
        { t: ['Il envoie son cookie de session à l’attaquant. Parade : échapper tout ce qu’on affiche, et une CSP.', 'It sends her session cookie to the attacker. Defense: escape everything you display, and a CSP.'], flux: [4] },
      ],
    },

    'secu-csrf': {
      k: 'sequence',
      lh: 48,
      alt: ['CSRF : une page piégée fait envoyer à votre navigateur une requête vers un site où vous êtes connecté', 'CSRF: a trapped page makes your browser send a request to a site where you are logged in'],
      a: [['Vous', 'You'], ['Banque', 'Bank'], ['Site\npiégé', 'Trapped\nsite']],
      s: ['a', 'ok', 'bad'],
      m: [
        [0, 1, ['vous êtes connecté (cookie)', 'you are logged in (cookie)'], 'ok'],
        [0, 2, ['vous visitez une page piégée', 'you visit a trapped page']],
        [2, 0, ['formulaire caché', 'hidden form'], 'bad dash'],
        [0, 1, ['virement + cookie ajouté seul', 'transfer + cookie added automatically'], 'bad'],
      ],
      anim: [
        { t: ['Vous êtes connecté à votre banque : un cookie le prouve.', 'You are logged in to your bank: a cookie proves it.'], flux: [0] },
        { t: ['Un autre onglet ouvre une page piégée, qui contient un formulaire caché visant la banque.', 'Another tab opens a trapped page, which holds a hidden form aimed at the bank.'], flux: [1, 2] },
        { t: ['Le navigateur l’envoie en y ajoutant le cookie, comme toujours. Parade : un jeton anti-CSRF, des cookies SameSite.', 'The browser submits it, adding the cookie as always. Defense: an anti-CSRF token, SameSite cookies.'], flux: [3] },
      ],
    },

    'secu-injection': {
      k: 'dessin',
      h: 214,
      alt: ['Une injection SQL par concaténation, et la parade par requête paramétrée', 'An SQL injection by concatenation, and the defense with a parameterized query'],
      d: [
        ['text', 8, 12, ['Concaténation (dangereux)', 'Concatenation (dangerous)'], { a: 's', s: 'bad', sz: 11, b: true }],
        ['rect', 8, 22, 344, 26, { s: 'bad', t: "SELECT * FROM users WHERE nom = '' OR '1'='1'", mono: true, sz: 9.2, r: 4 }],
        ['text', 8, 66, ['La saisie « \' OR \'1\'=\'1 » est devenue du SQL : toute la table est renvoyée.', 'The input “\' OR \'1\'=\'1” has turned into SQL: the whole table is returned.'], { a: 's', sz: 10, s: 'mute', max: 340 }],
        ['line', 8, 104, 352, 104, { s: 'g', dash: 1 }],
        ['text', 8, 122, ['Requête paramétrée (sûr)', 'Parameterized query (safe)'], { a: 's', s: 'ok', sz: 11, b: true }],
        ['rect', 8, 132, 190, 26, { s: 'ok', t: 'WHERE nom = ?', mono: true, sz: 11, r: 4 }],
        ['text', 208, 149, '+', { sz: 15, b: true }],
        ['rect', 222, 132, 130, 26, { s: 'warn', t: "' OR '1'='1", mono: true, sz: 10, r: 4 }],
        ['text', 8, 184, ['La saisie reste une simple valeur : aucun utilisateur ne porte ce nom.', 'The input stays a mere value: no user has that name.'], { a: 's', sz: 10, s: 'mute', max: 340 }],
      ],
    },

    'secu-sandbox': {
      k: 'graphe',
      alt: ['Dans une sandbox, l’application n’accède qu’à ce qu’on lui a explicitement autorisé', 'In a sandbox, the app only reaches what it was explicitly granted'],
      gy: 60,
      n: [
        { id: 'a', t: ['Application', 'App'], c: 0, r: 1, s: 'a', w: 100 },
        { id: 'f', t: ['Vos fichiers', 'Your files'], c: 1, r: 0, s: 'bad', w: 130 },
        { id: 'c', t: ['La caméra', 'The camera'], c: 1, r: 1, s: 'bad', w: 130 },
        { id: 'i', t: ['Internet', 'Internet'], c: 1, r: 2, s: 'ok', w: 130 },
      ],
      e: [['a', 'f', '✗', 'bad dash'], ['a', 'c', '✗', 'bad dash'], ['a', 'i', ['permission', 'permission'], 'ok']],
      g: [{ t: 'Sandbox', ids: ['a'] }],
      anim: [
        { t: ['L’application tourne dans une sandbox : un bac à sable fermé.', 'The app runs in a sandbox: a closed box.'], on: ['a'] },
        { t: ['Fichiers, caméra : refusés par défaut.', 'Files, camera: refused by default.'], on: ['a', 'f', 'c'], flux: [0, 1] },
        { t: ['Internet : accordé, parce que vous l’avez autorisé. Chaque accès est une permission explicite.', 'Internet: granted, because you allowed it. Every access is an explicit permission.'], on: ['a', 'i'], flux: [2] },
      ],
    },

    'langage-tokens': {
      k: 'cases',
      alt: ['La ligne « let prix = 42; » découpée en cinq tokens', 'The line “let prix = 42;” cut into five tokens'],
      rows: [
        { t: 'let prix = 42;', cells: ['let', 'prix', '=', '42', ';'], s: ['v', 'a', 'warn', 'ok', 'mute'], cap: [['mot-clé', 'keyword'], ['nom', 'name'], ['opérateur', 'operator'], ['nombre', 'number'], ['ponctuation', 'punctuation']], w: 64, sz: 13 },
      ],
    },

    'ia-token': {
      k: 'cases',
      alt: ['Un texte découpé en tokens : des fragments de mots, chacun avec un numéro', 'A text cut into tokens: word fragments, each with a number'],
      rows: [
        { t: ['« Tokens are pieces of words »', '“Tokens are pieces of words”'], cells: ['Tok', 'ens', '␣are', '␣pieces', '␣of', '␣words'], s: ['a', 'a', 'v', 'v', 'v', 'v'], cap: ['12', '9021', '527', '9863', '315', '4476'], w: 56, sz: 11 },
      ],
      l: ['Illustration : le découpage réel dépend du modèle. ␣ marque une espace.', 'Illustration: the actual split depends on the model. ␣ marks a space.'],
    },

    'secu-authentification': {
      k: 'graphe',
      gy: 76,
      alt: ['L’authentification prouve qui vous êtes ; l’autorisation vérifie ce que vous avez le droit de faire', 'Authentication proves who you are; authorization checks what you are allowed to do'],
      n: [
        { id: 'u', t: ['Vous', 'You'], c: 0, r: 0.5, s: 'a', w: 70 },
        { id: 'n', t: ['Authentification', 'Authentication'], sub: ['qui êtes-vous ?', 'who are you?'], c: 1, r: 0, s: 'v', w: 130, h: 50, sz: 11 },
        { id: 'z', t: ['Autorisation', 'Authorization'], sub: ['qu’avez-vous le droit de faire ?', 'what may you do?'], c: 1, r: 1, s: 'warn', w: 130, h: 60, sz: 11 },
        { id: 'r', t: ['Ressource', 'Resource'], c: 2, r: 0.5, s: 'ok', w: 86 },
      ],
      e: [['u', 'n', ['mot de passe, 2FA', 'password, 2FA'], 'a'], ['n', 'z', ['identité prouvée', 'identity proven'], 'v'], ['z', 'r', ['droit vérifié', 'right checked'], 'ok']],
      anim: [
        { t: ['Authentification : prouver que vous êtes bien zoe@exemple.org. Mot de passe, code à usage unique, clé d’accès.', 'Authentication: proving you really are zoe@exemple.org. Password, one-time code, passkey.'], on: ['u', 'n'], flux: [0] },
        { t: ['Autorisation : maintenant qu’on sait qui vous êtes, avez-vous le droit de supprimer ce projet ? Rôles, permissions.', 'Authorization: now that we know who you are, may you delete this project? Roles, permissions.'], on: ['n', 'z'], flux: [1] },
        { t: ['Les deux ensemble ouvrent la ressource. Authentifié ne veut pas dire autorisé : 401 pour l’un, 403 pour l’autre.', 'Both together open the resource. Authenticated does not mean authorized: 401 for one, 403 for the other.'], on: ['z', 'r'], flux: [2] },
      ],
    },

    'secu-checksum': {
      k: 'graphe',
      gy: 66,
      alt: ['Une somme de contrôle : on calcule l’empreinte du fichier reçu et on la compare à celle annoncée', 'A checksum: the fingerprint of the received file is computed and compared with the published one'],
      n: [
        { id: 'f', t: ['Fichier\ntéléchargé', 'Downloaded\nfile'], c: 0, r: 0.5, f: 'file', s: 'a', w: 92 },
        { id: 'h', t: 'SHA-256', c: 1, r: 0.5, s: 'v', w: 80, mono: true, sz: 11 },
        { id: 'x', t: ['Empreinte\ncalculée', 'Computed\nhash'], c: 2, r: 0, s: 'ok', w: 96, sz: 11 },
        { id: 'y', t: ['Empreinte\nannoncée', 'Published\nhash'], c: 2, r: 1, s: 'info', w: 96, sz: 11 },
      ],
      e: [['f', 'h', '', 'a'], ['h', 'x', '', 'v'], ['x', 'y', ['identiques ?', 'identical?'], 'ok double']],
      anim: [
        { t: ['Vous téléchargez un installeur. Le site publie, à côté, son empreinte SHA-256.', 'You download an installer. The site publishes its SHA-256 fingerprint next to it.'], on: ['f', 'y'] },
        { t: ['sha256sum fichier : votre ordinateur calcule l’empreinte de ce qu’il a vraiment reçu.', 'sha256sum file: your computer computes the fingerprint of what it actually received.'], on: ['f', 'h', 'x'], flux: [0, 1] },
        { t: ['Identiques : le fichier est intact. Un seul octet changé en route, et elles diffèrent entièrement.', 'Identical: the file is intact. A single byte changed on the way, and they differ entirely.'], on: ['x', 'y'], flux: [2] },
      ],
    },

    'secu-salage': {
      k: 'cases',
      alt: ['Sans sel, deux mots de passe identiques donnent la même empreinte ; avec un sel par compte, des empreintes différentes', 'Without salt, two identical passwords give the same hash; with a salt per account, different hashes'],
      rows: [
        { t: ['Sans sel : même mot de passe, même empreinte', 'No salt: same password, same hash'], cells: ['"azerty"', '→', '5c6a…'], s: ['a', '', 'bad'], w: 100, sz: 11, espace: 4 },
        { cells: ['"azerty"', '→', '5c6a…'], s: ['a', '', 'bad'], w: 100, sz: 11 },
        { sep: ['avec un sel aléatoire par compte', 'with a random salt per account'], s: 'ok' },
        { cells: ['"azerty"+"x9!k"', '→', 'e41b…'], s: ['ok', '', 'ok'], w: 100, sz: 9.5, espace: 4 },
        { cells: ['"azerty"+"q2#m"', '→', '907f…'], s: ['ok', '', 'ok'], w: 100, sz: 9.5 },
      ],
      l: ['Le sel est stocké en clair à côté de l’empreinte : il n’est pas secret, il est unique.', 'The salt is stored in the clear next to the hash: it is not secret, it is unique.'],
      anim: [
        { t: ['Deux comptes avec le mot de passe « azerty » : sans sel, deux empreintes identiques. Qui en casse une les casse toutes.', 'Two accounts with the password “azerty”: without salt, two identical hashes. Whoever cracks one cracks them all.'], on: [0, 1] },
        { t: ['Avec un sel différent par compte, ajouté avant le hachage, les empreintes n’ont plus rien en commun.', 'With a different salt per account, added before hashing, the hashes have nothing in common anymore.'], on: [2, 3, 4] },
        { t: ['Les tables précalculées d’empreintes (rainbow tables) deviennent inutiles. bcrypt, scrypt, Argon2 le font pour vous.', 'Precomputed hash tables (rainbow tables) become useless. bcrypt, scrypt, Argon2 do this for you.'], on: [3, 4] },
      ],
    },

    'secu-api-key': {
      k: 'sequence',
      lh: 52,
      alt: ['Une clé d’API accompagne chaque requête ; le service la reconnaît, compte et facture', 'An API key goes with each request; the service recognizes it, counts and bills'],
      a: [['Votre serveur', 'Your server'], ['API météo', 'Weather API']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'GET /meteo?ville=Lyon\nX-Api-Key: sk_live_7f…'],
        [1, 1, ['clé connue ? quota restant ?', 'known key? quota left?'], 'warn'],
        [1, 0, ['200 + données, comptées sur cette clé', '200 + data, counted against that key'], 'ok dash'],
        ['note', 0, 1, ['La clé reste côté serveur, dans une variable d’environnement : jamais dans le code du navigateur, jamais sur GitHub.', 'The key stays server-side, in an environment variable: never in browser code, never on GitHub.']],
      ],
      anim: [
        { t: ['Chaque requête porte la clé, dans un en-tête.', 'Every request carries the key, in a header.'], flux: [0] },
        { t: ['Le service sait qui appelle, compte les appels, applique le quota.', 'The service knows who is calling, counts the calls, applies the quota.'], on: [1] },
        { t: ['Il répond. Quiconque possède la clé est vous : elle se garde comme un mot de passe, et se révoque si elle fuit.', 'It answers. Whoever holds the key is you: keep it like a password, and revoke it if it leaks.'], flux: [2], on: [3] },
      ],
    },

    'secu-moindre-privilege': {
      k: 'graphe',
      gy: 58,
      alt: ['Moindre privilège : le service de miniatures peut lire les images et écrire les miniatures, pas supprimer la base', 'Least privilege: the thumbnail service may read images and write thumbnails, not delete the database'],
      n: [
        { id: 's', t: ['Service de\nminiatures', 'Thumbnail\nservice'], c: 0, r: 1, s: 'a', w: 96, sz: 11 },
        { id: 'r', t: ['lire les images', 'read images'], c: 1, r: 0, s: 'ok', w: 140 },
        { id: 'w', t: ['écrire les miniatures', 'write thumbnails'], c: 1, r: 1, s: 'ok', w: 140 },
        { id: 'd', t: ['supprimer la base', 'delete the database'], c: 1, r: 2, s: 'bad', w: 140 },
      ],
      e: [['s', 'r', '✓', 'ok'], ['s', 'w', '✓', 'ok'], ['s', 'd', '✗', 'bad dash']],
      anim: [
        { t: ['Le service n’a que les droits dont son travail a besoin : lire des images, écrire des miniatures.', 'The service has only the rights its job needs: read images, write thumbnails.'], on: ['s', 'r', 'w'], flux: [0, 1] },
        { t: ['Compromis par une faille, il ne peut toujours que cela. Un compte « admin partout » aurait tout emporté.', 'Compromised through a flaw, it still can only do that. An “admin everywhere” account would have taken everything.'], on: ['s', 'd'], flux: [2] },
      ],
    },

    'secu-secret': {
      k: 'graphe',
      gy: 66,
      alt: ['Le secret vit dans un fichier .env sur la machine, lu par le programme ; jamais dans le code poussé sur GitHub', 'The secret lives in a .env file on the machine, read by the program; never in the code pushed to GitHub'],
      n: [
        { id: 'c', t: ['Code\n(sur GitHub)', 'Code\n(on GitHub)'], c: 0, r: 0, f: 'file', s: 'a', w: 100 },
        { id: 'e', t: ['.env\n(sur la machine)', '.env\n(on the machine)'], c: 0, r: 1, f: 'file', s: 'warn', w: 110 },
        { id: 'p', t: ['Programme', 'Program'], c: 1, r: 0.5, s: 'v', w: 90 },
        { id: 'k', t: 'API_KEY=sk_…', c: 2, r: 0.5, s: 'bad', w: 100, mono: true, sz: 10 },
      ],
      e: [['c', 'p', '', 'a'], ['e', 'p', 'process.env', 'warn'], ['p', 'k', ['utilise', 'uses'], 'v']],
      anim: [
        { t: ['Le code est public, ou le sera : il ne doit contenir aucun secret.', 'The code is public, or will be: it must contain no secret.'], on: ['c', 'p'], flux: [0] },
        { t: ['Le secret est dans .env, sur la machine, ignoré par Git. Le programme le lit à son lancement, par l’environnement.', 'The secret is in .env, on the machine, ignored by Git. The program reads it at startup, through the environment.'], on: ['e', 'p', 'k'], flux: [1, 2] },
        { t: ['Un secret poussé par erreur est compromis pour toujours, même effacé du commit suivant : on le révoque et on en crée un autre.', 'A secret pushed by mistake is compromised for good, even if erased in the next commit: revoke it and create another.'], on: ['k'] },
      ],
    },

  });
})(window);
