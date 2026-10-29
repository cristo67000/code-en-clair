'use strict';
/*
 * Schémas de la catégorie « Bases de données ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'bdd-table': {
      k: 'dessin',
      h: 158,
      alt: ['Une table : des colonnes (les champs) et des lignes (les enregistrements)', 'A table: columns (fields) and rows (records)'],
      d: [
        ['text', 110, 12, ['colonne : un champ, un type', 'column: a field, a type'], { s: 'a', sz: 10, b: true }],
        ['rect', 10, 22, 50, 26, { s: 'warn', t: 'id', mono: true, sz: 11, r: 3 }],
        ['rect', 60, 22, 100, 26, { s: 'a', t: 'nom', mono: true, sz: 11, r: 3 }],
        ['rect', 160, 22, 130, 26, { s: 'a', t: ['catégorie', 'category'], mono: true, sz: 11, r: 3 }],
        ['rect', 10, 48, 50, 26, { s: 'mute', t: '1', mono: true, sz: 11, r: 3 }],
        ['rect', 60, 48, 100, 26, { s: 'mute', t: 'amend', mono: true, sz: 11, r: 3 }],
        ['rect', 160, 48, 130, 26, { s: 'mute', t: 'git', mono: true, sz: 11, r: 3 }],
        ['rect', 10, 74, 50, 26, { s: 'mute', t: '2', mono: true, sz: 11, r: 3 }],
        ['rect', 60, 74, 100, 26, { s: 'mute', t: 'hash', mono: true, sz: 11, r: 3 }],
        ['rect', 160, 74, 130, 26, { s: 'mute', t: 'secu', mono: true, sz: 11, r: 3 }],
        ['rect', 10, 100, 50, 26, { s: 'mute', t: '3', mono: true, sz: 11, r: 3 }],
        ['rect', 60, 100, 100, 26, { s: 'mute', t: 'dom', mono: true, sz: 11, r: 3 }],
        ['rect', 160, 100, 130, 26, { s: 'mute', t: 'web', mono: true, sz: 11, r: 3 }],
        ['text', 296, 91, ['← ligne', '← row'], { a: 's', sz: 10, s: 'mute', b: true }],
        ['text', 35, 142, ['clé primaire', 'primary key'], { s: 'warn', sz: 10, b: true }],
      ],
    },

    'bdd-jointure': {
      k: 'dessin',
      h: 156,
      alt: ['Une jointure : la colonne terme_id de la table notes désigne l’id d’une ligne de la table termes', 'A join: the terme_id column of the notes table designates the id of a row in the termes table'],
      d: [
        ['text', 70, 12, 'termes', { mono: true, sz: 11, b: true, s: 'a' }],
        ['text', 280, 12, 'notes', { mono: true, sz: 11, b: true, s: 'v' }],
        ['rect', 10, 20, 40, 22, { s: 'warn', t: 'id', mono: true, sz: 10, r: 2 }],
        ['rect', 50, 20, 86, 22, { s: 'a', t: 'nom', mono: true, sz: 10, r: 2 }],
        ['rect', 10, 44, 40, 24, { s: 'mute', t: '1', mono: true, sz: 10.5, r: 2 }],
        ['rect', 50, 44, 86, 24, { s: 'mute', t: 'git', mono: true, sz: 10.5, r: 2 }],
        ['rect', 10, 68, 40, 24, { s: 'mute', t: '2', mono: true, sz: 10.5, r: 2 }],
        ['rect', 50, 68, 86, 24, { s: 'mute', t: 'shell', mono: true, sz: 10.5, r: 2 }],
        ['rect', 10, 92, 40, 24, { s: 'mute', t: '3', mono: true, sz: 10.5, r: 2 }],
        ['rect', 50, 92, 86, 24, { s: 'mute', t: 'web', mono: true, sz: 10.5, r: 2 }],
        ['rect', 210, 20, 64, 22, { s: 'warn', t: 'terme_id', mono: true, sz: 9, r: 2 }],
        ['rect', 274, 20, 76, 22, { s: 'v', t: 'texte', mono: true, sz: 10, r: 2 }],
        ['rect', 210, 44, 64, 24, { s: 'mute', t: '1', mono: true, sz: 10.5, r: 2 }],
        ['rect', 274, 44, 76, 24, { s: 'mute', t: 'amend', mono: true, sz: 9.5, r: 2 }],
        ['rect', 210, 68, 64, 24, { s: 'mute', t: '1', mono: true, sz: 10.5, r: 2 }],
        ['rect', 274, 68, 76, 24, { s: 'mute', t: 'stash', mono: true, sz: 9.5, r: 2 }],
        ['rect', 210, 92, 64, 24, { s: 'mute', t: '3', mono: true, sz: 10.5, r: 2 }],
        ['rect', 274, 92, 76, 24, { s: 'mute', t: 'dom', mono: true, sz: 9.5, r: 2 }],
        ['line', 206, 56, 140, 56, { s: 'warn', dash: 1, arrow: 1 }],
        ['line', 206, 80, 140, 58, { s: 'warn', dash: 1, arrow: 1 }],
        ['line', 206, 104, 140, 104, { s: 'warn', dash: 1, arrow: 1 }],
        ['text', 180, 142, ['clé étrangère terme_id → id', 'foreign key terme_id → id'], { s: 'warn', sz: 10.5, b: true }],
      ],
    },

    'bdd-index': {
      k: 'arbre',
      alt: ['Un index oriente vers la bonne ligne sans lire toute la table', 'An index points to the right row without reading the whole table'],
      racine: {
        t: ['index\nsur nom', 'index\non name'], s: 'warn', k: [
          { t: 'A–F', s: 'v', k: [{ t: ['ligne\n8', 'row\n8'], s: 'ok' }] },
          { t: 'G–M', s: 'v', k: [{ t: ['ligne\n3', 'row\n3'], s: 'ok' }] },
          { t: 'N–Z', s: 'v', k: [{ t: ['ligne\n21', 'row\n21'], s: 'ok' }] },
        ],
      },
      l: ['Comme l’index d’un livre : on saute à la bonne page au lieu de tout lire.', 'Like a book’s index: you jump to the right page instead of reading everything.'],
      anim: [
        { t: ['Chercher « hash » : sans index, il faudrait lire toutes les lignes.', 'Looking for “hash”: without an index, every row would have to be read.'], on: ['n0'] },
        { t: ['L’index sur nom sait que H est dans G–M.', 'The index on name knows that H is in G–M.'], on: ['n0', 'n3'] },
        { t: ['Il désigne directement la ligne 3. Quelques sauts au lieu d’un parcours complet.', 'It points straight to row 3. A few hops instead of a full scan.'], on: ['n3', 'n4'] },
      ],
    },

    'bdd-transaction': {
      k: 'sequence',
      lh: 40,
      alt: ['Une transaction : tout est validé ensemble par COMMIT, ou annulé par ROLLBACK', 'A transaction: everything is committed together by COMMIT, or cancelled by ROLLBACK'],
      a: [['Application', 'Application'], ['Base de données', 'Database']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'BEGIN'],
        [0, 1, ['compte 1 : − 100', 'account 1: − 100']],
        [0, 1, ['compte 2 : + 100', 'account 2: + 100']],
        [0, 1, 'COMMIT', 'ok'],
        ['note', 0, 1, ['Si une étape échoue : ROLLBACK — rien n’est modifié.', 'If a step fails: ROLLBACK — nothing is changed.']],
      ],
      anim: [
        { t: ['BEGIN : une transaction commence.', 'BEGIN: a transaction starts.'], flux: [0] },
        { t: ['Deux écritures : débiter un compte, créditer l’autre.', 'Two writes: debit one account, credit the other.'], flux: [1, 2] },
        { t: ['COMMIT : les deux sont validées ensemble, d’un coup.', 'COMMIT: both are committed together, at once.'], flux: [3] },
        { t: ['Si la seconde échoue, ROLLBACK annule la première : l’argent ne disparaît pas en route.', 'If the second one fails, ROLLBACK undoes the first: the money does not vanish on the way.'], on: [4] },
      ],
    },

    'bdd-migration': {
      k: 'cases',
      alt: ['Des migrations numérotées, appliquées dans l’ordre', 'Numbered migrations, applied in order'],
      rows: [
        { cells: [['001\ncréer termes', '001\ncreate terms'], ['002\najouter alias', '002\nadd alias'], ['003\nindex sur nom', '003\nindex on name']], s: ['ok', 'ok', 'warn'], cap: [['appliquée', 'applied'], ['appliquée', 'applied'], ['à appliquer', 'to apply']], w: 104, h: 46, sz: 11, mono: false },
      ],
      anim: [
        { t: ['001 a créé la table termes.', '001 created the termes table.'], on: ['r0:0'] },
        { t: ['002 a ajouté une colonne alias. Chaque migration est appliquée une fois, dans l’ordre.', '002 added an alias column. Each migration is applied once, in order.'], on: ['r0:1'] },
        { t: ['003 est nouvelle : au prochain déploiement, l’outil l’applique et note qu’elle l’est.', '003 is new: on the next deployment, the tool applies it and records that it did.'], on: ['r0:2'] },
      ],
    },

    'bdd-crud': {
      k: 'graphe',
      alt: ['CRUD : créer, lire, modifier, supprimer des données', 'CRUD: create, read, update, delete data'],
      gy: 62,
      n: [
        { id: 'd', t: ['Données', 'Data'], c: 1, r: 1, f: 'db', s: 'v', w: 96, h: 54 },
        { id: 'c', t: 'Create', sub: 'INSERT · POST', c: 1, r: 0, s: 'ok', w: 104, h: 44, sz: 11 },
        { id: 'r', t: 'Read', sub: 'SELECT · GET', c: 2, r: 1, s: 'a', w: 100, h: 44, sz: 11 },
        { id: 'u', t: 'Update', sub: 'UPDATE · PATCH', c: 1, r: 2, s: 'warn', w: 104, h: 44, sz: 11 },
        { id: 'x', t: 'Delete', sub: 'DELETE', c: 0, r: 1, s: 'bad', w: 92, h: 44, sz: 11 },
      ],
      e: [['c', 'd', '', 'ok'], ['d', 'r', '', 'a'], ['u', 'd', '', 'warn'], ['x', 'd', '', 'bad']],
      anim: [
        { t: ['Create : INSERT en SQL, POST en HTTP.', 'Create: INSERT in SQL, POST in HTTP.'], on: ['c', 'd'], flux: [0] },
        { t: ['Read : SELECT, GET.', 'Read: SELECT, GET.'], on: ['d', 'r'], flux: [1] },
        { t: ['Update : UPDATE, PUT ou PATCH.', 'Update: UPDATE, PUT or PATCH.'], on: ['u', 'd'], flux: [2] },
        { t: ['Delete : DELETE. Quatre verbes, et presque toute application tient dedans.', 'Delete: DELETE. Four verbs, and almost any application fits in them.'], on: ['x', 'd'], flux: [3] },
      ],
    },

    'bdd-acid': {
      k: 'cases',
      alt: ['Les quatre lettres d’ACID : atomicité, cohérence, isolation, durabilité', 'The four letters of ACID: atomicity, consistency, isolation, durability'],
      rows: [
        { cells: ['A', 'C', 'I', 'D'], s: ['a', 'v', 'ok', 'warn'], cap: [['Atomicité', 'Atomicity'], ['Cohérence', 'Consistency'], ['Isolation', 'Isolation'], ['Durabilité', 'Durability']], w: 70, sz: 22, espace: 4 },
        { cells: [['tout ou rien', 'all or nothing'], ['règles respectées', 'rules kept'], ['sans se gêner', 'no interference'], ['survit à la panne', 'survives a crash']], s: ['a', 'v', 'ok', 'warn'], w: 78, h: 40, sz: 9.5, mono: false },
      ],
      anim: [
        { t: ['Atomicité : un virement, c’est deux écritures. Soit les deux, soit aucune.', 'Atomicity: a transfer is two writes. Either both, or none.'], on: ['r0:0', 'r1:0'] },
        { t: ['Cohérence : avant comme après, les règles de la base sont vraies (un solde ne devient pas négatif si c’est interdit).', 'Consistency: before as after, the database’s rules hold (a balance does not go negative if that is forbidden).'], on: ['r0:1', 'r1:1'] },
        { t: ['Isolation : deux transactions en même temps ne voient pas les demi-résultats l’une de l’autre.', 'Isolation: two transactions at the same time do not see each other’s half-results.'], on: ['r0:2', 'r1:2'] },
        { t: ['Durabilité : une fois validé, c’est écrit sur le disque. Une coupure de courant ne l’efface pas.', 'Durability: once committed, it is on disk. A power cut does not erase it.'], on: ['r0:3', 'r1:3'] },
      ],
    },

    'bdd-cle-valeur': {
      k: 'cases',
      alt: ['Une base clé-valeur : chaque clé donne directement sa valeur', 'A key-value store: each key leads straight to its value'],
      rows: [
        { t: ['Clé → valeur', 'Key → value'], cells: ['user:42', '{"nom":"Zoé"}'], s: ['a', 'ok'], w: 130, sz: 11, espace: 6 },
        { cells: ['session:abc', '42'], s: ['a', 'ok'], w: 130, sz: 11, espace: 6 },
        { cells: ['compteur', '1 203'], s: ['a', 'ok'], w: 130, sz: 11 },
      ],
      l: ['GET user:42 : une clé, une réponse immédiate, sans requête à écrire. Redis, Memcached, localStorage.', 'GET user:42: one key, an instant answer, no query to write. Redis, Memcached, localStorage.'],
      anim: [
        { t: ['On demande la clé user:42…', 'You ask for the key user:42…'], on: ['r0:0'] },
        { t: ['…et on obtient sa valeur, telle quelle. Pas de jointure, pas de schéma : rapide, simple, et limité à cela.', '…and you get its value, as is. No join, no schema: fast, simple, and limited to that.'], on: ['r0:0', 'r0:1'] },
      ],
    },

    'bdd-nosql': {
      k: 'pile',
      entre: 30,
      alt: ['Relationnel : des tables, un schéma fixe, SQL ; NoSQL : des documents imbriqués, un schéma souple, une API propre', 'Relational: tables, a fixed schema, SQL; NoSQL: nested documents, a flexible schema, its own API'],
      piles: [
        {
          t: ['Relationnel', 'Relational'],
          layers: [
            { t: ['Tables', 'Tables'], d: ['lignes, colonnes, jointures', 'rows, columns, joins'], s: 'a' },
            { t: ['Schéma fixe', 'Fixed schema'], d: ['chaque colonne a un type', 'every column has a type'], s: 'v' },
            { t: 'SQL', d: 'PostgreSQL · MySQL · SQLite', s: 'ok' },
          ],
        },
        {
          t: 'NoSQL',
          layers: [
            { t: 'Documents', d: ['du JSON imbriqué', 'nested JSON'], s: 'a' },
            { t: ['Schéma souple', 'Flexible schema'], d: ['chaque document est libre', 'every document is free'], s: 'v' },
            { t: ['API propre', 'Own API'], d: 'MongoDB · Redis · Firestore', s: 'ok' },
          ],
        },
      ],
      anim: [
        { t: ['Relationnel : une commande et ses lignes sont dans deux tables, reliées par une clé. SQL les rejoint.', 'Relational: an order and its lines are in two tables, linked by a key. SQL joins them.'], on: [0, 1, 2] },
        { t: ['NoSQL document : la commande et ses lignes sont un seul document JSON. Pas de jointure, mais des doublons possibles.', 'Document NoSQL: the order and its lines are a single JSON document. No join, but possible duplicates.'], on: ['p1l0', 'p1l1', 'p1l2'] },
      ],
    },

    'bdd-orm': {
      k: 'graphe',
      alt: ['Un ORM traduit les objets du programme en lignes de table, et les lignes en objets', 'An ORM translates the program’s objects into table rows, and rows into objects'],
      n: [
        { id: 'o', t: ['Objet\nUtilisateur', 'User\nobject'], c: 0, r: 0.5, s: 'a', w: 96 },
        { id: 'm', t: 'ORM', sub: 'Prisma · SQLAlchemy', c: 1, r: 0.5, s: 'v', w: 104, h: 50 },
        { id: 't', t: ['Table\nutilisateurs', 'users\ntable'], c: 2, r: 0.5, f: 'db', s: 'ok', w: 96, h: 58 },
      ],
      e: [['o', 'm', 'user.save()', 'a'], ['m', 't', 'INSERT INTO …', 'v'], ['t', 'm', ['lignes', 'rows'], 'ok dash'], ['m', 'o', ['objets', 'objects'], 'ok dash']],
      anim: [
        { t: ['Vous appelez user.save() : l’ORM écrit l’INSERT ou l’UPDATE à votre place.', 'You call user.save(): the ORM writes the INSERT or UPDATE for you.'], on: ['o', 'm', 't'], flux: [0, 1] },
        { t: ['Vous demandez des utilisateurs : l’ORM lit les lignes et vous rend des objets avec leurs méthodes.', 'You ask for users: the ORM reads the rows and hands you objects with their methods.'], on: ['t', 'm', 'o'], flux: [2, 3] },
      ],
    },

    'bdd-sql': {
      k: 'dessin',
      h: 126,
      alt: ['L’anatomie d’une requête SELECT : quelles colonnes, quelle table, quelles lignes, dans quel ordre', 'The anatomy of a SELECT query: which columns, which table, which rows, in what order'],
      d: [
        ['rect', 6, 10, 64, 28, { s: 'a', t: 'SELECT', mono: true, sz: 10.5, r: 4 }],
        ['rect', 74, 10, 86, 28, { s: 'ok', t: 'nom, ville', mono: true, sz: 10.5, r: 4 }],
        ['rect', 164, 10, 46, 28, { s: 'a', t: 'FROM', mono: true, sz: 10.5, r: 4 }],
        ['rect', 214, 10, 70, 28, { s: 'v', t: 'clients', mono: true, sz: 10.5, r: 4 }],
        ['rect', 6, 46, 60, 28, { s: 'a', t: 'WHERE', mono: true, sz: 10.5, r: 4 }],
        ['rect', 70, 46, 124, 28, { s: 'warn', t: "ville = 'Lyon'", mono: true, sz: 10.5, r: 4 }],
        ['rect', 198, 46, 88, 28, { s: 'a', t: 'ORDER BY', mono: true, sz: 10.5, r: 4 }],
        ['rect', 290, 46, 46, 28, { s: 'info', t: 'nom', mono: true, sz: 10.5, r: 4 }],
        ['text', 117, 96, ['quelles colonnes', 'which columns'], { s: 'ok', sz: 10, b: true }],
        ['text', 249, 96, ['quelle table', 'which table'], { s: 'v', sz: 10, b: true }],
        ['text', 132, 114, ['quelles lignes', 'which rows'], { s: 'warn', sz: 10, b: true }],
        ['text', 313, 114, ['dans quel ordre', 'in what order'], { s: 'info', sz: 10, b: true }],
      ],
      anim: [
        { t: ['FROM clients : la table où chercher.', 'FROM clients: the table to search.'], on: [2, 3, 9] },
        { t: ['WHERE ville = \'Lyon\' : on ne garde que les lignes qui remplissent la condition.', 'WHERE ville = \'Lyon\': only the rows that meet the condition are kept.'], on: [4, 5, 10] },
        { t: ['SELECT nom, ville : de ces lignes, on ne renvoie que ces colonnes.', 'SELECT nom, ville: from those rows, only these columns are returned.'], on: [0, 1, 8] },
        { t: ['ORDER BY nom : triées par nom. On décrit le résultat voulu, pas la façon de l’obtenir.', 'ORDER BY nom: sorted by name. You describe the result you want, not how to get it.'], on: [6, 7, 11] },
      ],
    },

    'bdd-normalisation': {
      k: 'dessin',
      h: 190,
      alt: ['Avant normalisation, la ville est répétée à chaque client ; après, elle est écrite une fois dans sa propre table', 'Before normalization, the city is repeated for each customer; after, it is written once in its own table'],
      d: [
        ['text', 8, 12, ['Avant : la ville est répétée', 'Before: the city is repeated'], { a: 's', s: 'bad', sz: 10.5, b: true }],
        ['rect', 8, 20, 60, 22, { s: 'a', t: 'nom', mono: true, sz: 10, r: 3 }],
        ['rect', 68, 20, 60, 22, { s: 'a', t: 'ville', mono: true, sz: 10, r: 3 }],
        ['rect', 128, 20, 70, 22, { s: 'a', t: ['code', 'zip'], mono: true, sz: 10, r: 3 }],
        ['rect', 8, 42, 60, 22, { s: 'mute', t: 'Zoé', mono: true, sz: 10, r: 3 }],
        ['rect', 68, 42, 60, 22, { s: 'bad', t: 'Lyon', mono: true, sz: 10, r: 3 }],
        ['rect', 128, 42, 70, 22, { s: 'bad', t: '69000', mono: true, sz: 10, r: 3 }],
        ['rect', 8, 64, 60, 22, { s: 'mute', t: 'Léo', mono: true, sz: 10, r: 3 }],
        ['rect', 68, 64, 60, 22, { s: 'bad', t: 'Lyon', mono: true, sz: 10, r: 3 }],
        ['rect', 128, 64, 70, 22, { s: 'bad', t: '69000', mono: true, sz: 10, r: 3 }],
        ['text', 212, 50, ['← la même ville, deux fois :\n   une faute à corriger deux fois', '← the same city, twice:\n   a typo to fix twice'], { a: 's', s: 'bad', sz: 9.5 }],
        ['line', 8, 98, 352, 98, { s: 'g', dash: 1 }],
        ['text', 8, 114, ['Après : chaque fait une seule fois', 'After: each fact only once'], { a: 's', s: 'ok', sz: 10.5, b: true }],
        ['rect', 8, 122, 60, 22, { s: 'a', t: 'nom', mono: true, sz: 10, r: 3 }],
        ['rect', 68, 122, 70, 22, { s: 'warn', t: 'ville_id', mono: true, sz: 9.5, r: 3 }],
        ['rect', 8, 144, 60, 22, { s: 'mute', t: 'Zoé', mono: true, sz: 10, r: 3 }],
        ['rect', 68, 144, 70, 22, { s: 'mute', t: '1', mono: true, sz: 10, r: 3 }],
        ['rect', 8, 166, 60, 22, { s: 'mute', t: 'Léo', mono: true, sz: 10, r: 3 }],
        ['rect', 68, 166, 70, 22, { s: 'mute', t: '1', mono: true, sz: 10, r: 3 }],
        ['rect', 200, 122, 36, 22, { s: 'warn', t: 'id', mono: true, sz: 10, r: 3 }],
        ['rect', 236, 122, 56, 22, { s: 'a', t: 'ville', mono: true, sz: 10, r: 3 }],
        ['rect', 292, 122, 62, 22, { s: 'a', t: ['code', 'zip'], mono: true, sz: 10, r: 3 }],
        ['rect', 200, 144, 36, 22, { s: 'mute', t: '1', mono: true, sz: 10, r: 3 }],
        ['rect', 236, 144, 56, 22, { s: 'ok', t: 'Lyon', mono: true, sz: 10, r: 3 }],
        ['rect', 292, 144, 62, 22, { s: 'ok', t: '69000', mono: true, sz: 10, r: 3 }],
        ['line', 142, 155, 196, 155, { s: 'warn', dash: 1, arrow: 1 }],
        ['line', 142, 177, 196, 157, { s: 'warn', dash: 1, arrow: 1 }],
      ],
      anim: [
        { t: ['Deux clients de Lyon : la ville et son code postal sont écrits deux fois. Si le code change, il faut corriger partout.', 'Two customers in Lyon: the city and its zip code are written twice. If the code changes, every row must be fixed.'], on: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { t: ['Normalisé : les villes ont leur table, chaque client ne garde qu’un numéro de ville.', 'Normalized: cities get their own table, each customer only keeps a city number.'], on: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
        { t: ['La clé étrangère ville_id relie les deux. Un fait, un seul endroit : plus de contradiction possible.', 'The foreign key ville_id links the two. One fact, one place: no contradiction possible anymore.'], on: [14, 16, 18, 19, 22, 25, 26], flux: [25, 26] },
      ],
    },

    'bdd-indexeddb': {
      k: 'graphe',
      gy: 60,
      alt: ['IndexedDB : la base du navigateur, avec ses magasins d’objets, accessible par transactions', 'IndexedDB: the browser’s database, with its object stores, accessed through transactions'],
      n: [
        { id: 'p', t: 'Page', c: 0, r: 0.5, s: 'a', w: 80 },
        { id: 'i', t: 'IndexedDB', sub: ['la base du navigateur', 'the browser’s database'], c: 1, r: 0.5, f: 'db', s: 'v', w: 118, h: 62 },
        { id: 's1', t: 'notes', c: 2, r: 0, s: 'ok', w: 80, mono: true },
        { id: 's2', t: 'suivis', c: 2, r: 1, s: 'ok', w: 80, mono: true },
      ],
      e: [['p', 'i', ['transaction', 'transaction'], 'a double'], ['i', 's1', '', 'v sans'], ['i', 's2', '', 'v sans']],
      l: ['Des magasins d’objets, des index, des transactions. Persistant, propre au site, disponible hors ligne — c’est là que vivent vos notes.', 'Object stores, indexes, transactions. Persistent, specific to the site, available offline — that is where your notes live.'],
      anim: [
        { t: ['Une base par site, avec des magasins d’objets : ici notes et suivis. On y range des objets entiers, pas seulement du texte.', 'One database per site, with object stores: here notes and suivis. Whole objects are stored there, not just text.'], on: ['i', 's1', 's2'] },
        { t: ['La page lit et écrit par transactions, de façon asynchrone : des mégaoctets sans bloquer l’écran.', 'The page reads and writes through transactions, asynchronously: megabytes without freezing the screen.'], on: ['p', 'i'], flux: [0] },
      ],
    },

  });
})(window);
