'use strict';
/*
 * Schémas de la catégorie « Outils et construction ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'outils-npm': {
      k: 'graphe',
      alt: ['npm install lit package.json puis télécharge les dépendances dans node_modules', 'npm install reads package.json then downloads the dependencies into node_modules'],
      gy: 72,
      n: [
        { id: 'p', t: 'package.json', sub: ['ce qu’il faut', 'what is needed'], c: 0, r: 0.5, f: 'file', s: 'v', w: 106, h: 52, mono: true, sz: 10 },
        { id: 'n', t: 'npm install', c: 1, r: 0.5, s: 'a', w: 90, mono: true, sz: 10.5 },
        { id: 'm', t: 'node_modules/', sub: ['le code téléchargé', 'the downloaded code'], c: 2, r: 0, s: 'ok', w: 110, h: 50, mono: true, sz: 10 },
        { id: 'l', t: 'package-lock.json', sub: ['versions exactes', 'exact versions'], c: 2, r: 1, f: 'file', s: 'warn', w: 116, h: 50, mono: true, sz: 9.5 },
      ],
      e: [['p', 'n', '', 'v'], ['n', 'm', '', 'ok'], ['n', 'l', '', 'warn']],
      anim: [
        { t: ['package.json liste ce dont le projet a besoin : « vitest ^2.0 ».', 'package.json lists what the project needs: “vitest ^2.0”.'], on: ['p'] },
        { t: ['npm install le lit…', 'npm install reads it…'], on: ['p', 'n'], flux: [0] },
        { t: ['…télécharge chaque paquet et ses propres dépendances dans node_modules/…', '…downloads each package and its own dependencies into node_modules/…'], on: ['n', 'm'], flux: [1] },
        { t: ['…et note dans package-lock.json la version exacte obtenue, pour que tout le monde ait la même.', '…and writes the exact version obtained into package-lock.json, so that everyone gets the same.'], on: ['n', 'l'], flux: [2] },
      ],
    },

    'outils-build': {
      k: 'graphe',
      alt: ['Le build transforme les sources en fichiers prêts à publier', 'The build turns the sources into files ready to publish'],
      n: [
        { id: 's', t: 'src/', sub: ['vos sources', 'your sources'], c: 0, r: 0, s: 'a', w: 92, h: 50, mono: true },
        { id: 'b', t: ['Build', 'Build'], sub: ['assemble · minifie', 'bundles · minifies'], c: 1, r: 0, s: 'v', w: 100, h: 50 },
        { id: 'd', t: 'dist/', sub: ['prêt à publier', 'ready to publish'], c: 2, r: 0, s: 'ok', w: 96, h: 50, mono: true },
      ],
      e: [['s', 'b', '', 'a'], ['b', 'd', '', 'v']],
      anim: [
        { t: ['Vos sources : lisibles, commentées, en dizaines de fichiers.', 'Your sources: readable, commented, in dozens of files.'], on: ['s'] },
        { t: ['Le build les assemble, les traduit, les minifie.', 'The build bundles, translates and minifies them.'], on: ['s', 'b'], flux: [0] },
        { t: ['dist/ contient le résultat : peu de fichiers, compacts, prêts à publier. On ne les édite jamais à la main.', 'dist/ holds the result: few files, compact, ready to publish. They are never edited by hand.'], on: ['b', 'd'], flux: [1] },
      ],
    },

    'outils-transpilation': {
      k: 'graphe',
      alt: ['Un transpileur traduit du code moderne vers un code que tous les navigateurs comprennent', 'A transpiler translates modern code into code every browser understands'],
      n: [
        { id: 'a', t: ['TypeScript\nJS moderne', 'TypeScript\nmodern JS'], c: 0, r: 0, s: 'a', w: 98 },
        { id: 'b', t: ['Transpileur', 'Transpiler'], sub: 'Babel · tsc', c: 1, r: 0, s: 'v', w: 100, h: 50, sz: 11 },
        { id: 'c', t: ['JavaScript\ncompatible', 'Compatible\nJavaScript'], c: 2, r: 0, s: 'ok', w: 98 },
      ],
      e: [['a', 'b', '', 'a'], ['b', 'c', '', 'v']],
      anim: [
        { t: ['Du TypeScript, ou du JavaScript tout récent.', 'TypeScript, or brand-new JavaScript.'], on: ['a'] },
        { t: ['Le transpileur traduit : il retire les types, réécrit les syntaxes nouvelles.', 'The transpiler translates: it strips the types, rewrites the new syntax.'], on: ['a', 'b'], flux: [0] },
        { t: ['Du JavaScript que tous les navigateurs visés comprennent.', 'JavaScript that every targeted browser understands.'], on: ['b', 'c'], flux: [1] },
      ],
    },

    'outils-source-map': {
      k: 'graphe',
      alt: ['La source map relie une erreur dans le code minifié à la ligne du code d’origine', 'The source map links an error in the minified code to the line in the original code'],
      gy: 84,
      n: [
        { id: 's', t: 'app.js', sub: ['ce que vous écrivez', 'what you write'], c: 0, r: 0, s: 'a', w: 118, h: 50, mono: true },
        { id: 'm', t: 'app.min.js', sub: ['erreur en 1:4812', 'error at 1:4812'], c: 1, r: 0, s: 'bad', w: 118, h: 50, mono: true },
        { id: 'c', t: 'app.min.js.map', sub: ['la carte', 'the map'], c: 1, r: 1, f: 'file', s: 'v', w: 128, h: 50, mono: true, sz: 10 },
        { id: 'r', t: ['app.js ligne 42', 'app.js line 42'], sub: ['ce que vous voyez', 'what you see'], c: 0, r: 1, s: 'ok', w: 118, h: 50, sz: 11 },
      ],
      e: [['s', 'm', ['build', 'build'], 'a'], ['m', 'c', ['produit', 'produces'], 'v dash'], ['c', 'r', ['retrouve', 'finds'], 'ok']],
      anim: [
        { t: ['Le build minifie app.js en app.min.js : une seule ligne, des noms d’une lettre.', 'The build minifies app.js into app.min.js: a single line, one-letter names.'], on: ['s', 'm'], flux: [0] },
        { t: ['Une erreur survient en production : « ligne 1, colonne 4812 ». Illisible.', 'An error happens in production: “line 1, column 4812”. Unreadable.'], on: ['m'] },
        { t: ['Le build avait aussi produit une carte : quelle position du minifié vient de quelle ligne du source.', 'The build had also produced a map: which position in the minified file comes from which line of the source.'], on: ['m', 'c'], flux: [1] },
        { t: ['Les DevTools la lisent : l’erreur est dans app.js, ligne 42.', 'The DevTools read it: the error is in app.js, line 42.'], on: ['c', 'r'], flux: [2] },
      ],
    },

    'outils-ci-cd': {
      k: 'graphe',
      alt: ['La chaîne CI/CD : chaque push déclenche build, tests puis déploiement', 'The CI/CD chain: each push triggers build, tests then deployment'],
      gy: 84,
      n: [
        { id: 'p', t: 'push', c: 0, r: 0, s: 'a', w: 66, mono: true, sz: 11 },
        { id: 'b', t: 'build', c: 1, r: 0, s: 'info', w: 66, mono: true, sz: 11 },
        { id: 't', t: ['tests', 'tests'], c: 2, r: 0, s: 'warn', w: 66, mono: true, sz: 11 },
        { id: 'd', t: ['déploie', 'deploy'], c: 3, r: 0, s: 'ok', w: 70, mono: true, sz: 11 },
        { id: 'x', t: ['Échec : on prévient', 'Failure: you are told'], c: 2, r: 1, s: 'bad', w: 130, sz: 10.5 },
      ],
      e: [['p', 'b', '', 'a'], ['b', 't', '', 'info'], ['t', 'd', '✓', 'ok'], ['t', 'x', '✗', 'bad dash']],
      anim: [
        { t: ['Un push déclenche la chaîne : le serveur de CI construit le projet.', 'A push triggers the chain: the CI server builds the project.'], on: ['p', 'b'], flux: [0] },
        { t: ['Il lance tous les tests.', 'It runs all the tests.'], on: ['b', 't'], flux: [1] },
        { t: ['Un test échoue : la chaîne s’arrête et vous prévient. Rien n’est déployé.', 'A test fails: the chain stops and tells you. Nothing is deployed.'], on: ['t', 'x'], flux: [3] },
        { t: ['Tout passe : la nouvelle version est déployée. Sans intervention humaine.', 'Everything passes: the new version is deployed. With no human intervention.'], on: ['t', 'd'], flux: [2] },
      ],
    },

    'outils-docker': {
      k: 'pile',
      lh: 32,
      entre: 26,
      alt: ['Machine virtuelle : un système invité complet ; conteneur : le noyau de l’hôte est partagé', 'Virtual machine: a full guest system; container: the host’s kernel is shared'],
      piles: [
        {
          t: ['Machine virtuelle', 'Virtual machine'],
          layers: [
            { t: ['Application', 'App'], s: 'a', h: 30 },
            { t: ['Bibliothèques', 'Libraries'], s: 'a', h: 30 },
            { t: ['Système invité', 'Guest OS'], s: 'warn', h: 30 },
            { t: ['Hyperviseur', 'Hypervisor'], s: 'v', h: 30 },
            { t: ['Matériel', 'Hardware'], s: 'mute', h: 30 },
          ],
        },
        {
          t: 'Docker',
          layers: [
            { t: ['Application', 'App'], s: 'a', h: 38 },
            { t: ['Bibliothèques', 'Libraries'], s: 'a', h: 38 },
            { t: 'Docker', s: 'v', h: 38 },
            { t: ['Système hôte (noyau partagé)', 'Host OS (shared kernel)'], s: 'ok', h: 30 },
            { t: ['Matériel', 'Hardware'], s: 'mute', h: 30 },
          ],
        },
      ],
    },

    'outils-environnements': {
      k: 'graphe',
      alt: ['Le code passe du développement au staging puis à la production', 'Code moves from development to staging then to production'],
      n: [
        { id: 'd', t: ['Développement', 'Development'], sub: ['votre machine', 'your machine'], c: 0, r: 0, s: 'info', w: 98, h: 52, sz: 10.5 },
        { id: 's', t: 'Staging', sub: ['une copie pour valider', 'a copy to validate'], c: 1, r: 0, s: 'warn', w: 98, h: 52, sz: 10.5 },
        { id: 'p', t: 'Production', sub: ['vrais utilisateurs', 'real users'], c: 2, r: 0, s: 'ok', w: 98, h: 52, sz: 10.5 },
      ],
      e: [['d', 's', '', 'info'], ['s', 'p', '', 'warn']],
      anim: [
        { t: ['Sur votre machine : vous développez, cassez, réparez.', 'On your machine: you develop, break, fix.'], on: ['d'] },
        { t: ['Sur le staging, une copie de la production : on vérifie dans de vraies conditions.', 'On staging, a copy of production: things are checked under real conditions.'], on: ['d', 's'], flux: [0] },
        { t: ['En production : les vrais utilisateurs. On n’y déploie que ce qui a passé le staging.', 'In production: real users. Only what passed staging is deployed there.'], on: ['s', 'p'], flux: [1] },
      ],
    },

    'outils-semver': {
      k: 'cases',
      alt: ['Un numéro de version MAJEUR.MINEUR.CORRECTIF', 'A MAJOR.MINOR.PATCH version number'],
      rows: [
        { cells: ['2', '.', '4', '.', '1'], s: ['bad', '', 'warn', '', 'ok'], cap: [['majeur', 'major'], '', ['mineur', 'minor'], '', ['correctif', 'patch']], w: 54, h: 44, sz: 24 },
        { sep: '' },
        { cells: [['casse la\ncompatibilité', 'breaks\ncompatibility'], ['ajoute,\nsans casser', 'adds,\nwithout breaking'], ['corrige,\nrien d’autre', 'fixes,\nnothing else']], s: ['bad', 'warn', 'ok'], w: 100, h: 44, sz: 10.5, mono: false },
      ],
      anim: [
        { t: ['2.4.1 → 2.4.2 : un correctif. Rien ne change pour qui l’utilise.', '2.4.1 → 2.4.2: a patch. Nothing changes for whoever uses it.'], on: ['r0:4', 'r2:2'] },
        { t: ['2.4.1 → 2.5.0 : une nouveauté, compatible. Ce qui marchait marche encore.', '2.4.1 → 2.5.0: a new feature, compatible. What worked still works.'], on: ['r0:2', 'r2:1'] },
        { t: ['2.4.1 → 3.0.0 : quelque chose casse. Lisez le changelog avant de mettre à jour.', '2.4.1 → 3.0.0: something breaks. Read the changelog before updating.'], on: ['r0:0', 'r2:0'] },
      ],
    },

    'outils-lint': {
      k: 'graphe',
      alt: ['Un linter lit le code sans l’exécuter et signale les erreurs probables', 'A linter reads the code without running it and flags likely mistakes'],
      n: [
        { id: 'c', t: ['Votre code', 'Your code'], c: 0, r: 0.5, f: 'file', s: 'a', w: 90 },
        { id: 'l', t: 'Lint', sub: 'ESLint · Ruff', c: 1, r: 0.5, s: 'v', w: 90, h: 50 },
        { id: 'w', t: ['Avertissements', 'Warnings'], sub: ['variable inutilisée\n== au lieu de ===', 'unused variable\n== instead of ==='], c: 2, r: 0.5, s: 'warn', w: 124, h: 64, sz: 11 },
      ],
      e: [['c', 'l', ['lit, sans exécuter', 'reads, without running'], 'a'], ['l', 'w', '', 'warn']],
      anim: [
        { t: ['Le linter lit le code comme un relecteur, sans le lancer : il connaît des centaines de règles.', 'The linter reads the code like a reviewer, without running it: it knows hundreds of rules.'], on: ['c', 'l'], flux: [0] },
        { t: ['Il signale ce qui est louche : une variable jamais lue, un == trompeur, un import oublié. Dans l’éditeur, avant même d’enregistrer.', 'It flags what looks wrong: a variable never read, a misleading ==, a forgotten import. In the editor, before you even save.'], on: ['l', 'w'], flux: [1] },
      ],
    },

    'outils-debugger': {
      k: 'dessin',
      h: 148,
      alt: ['Un débogueur en pause sur un point d’arrêt, avec les variables du moment', 'A debugger paused on a breakpoint, with the variables of the moment'],
      d: [
        ['rect', 8, 8, 200, 130, { s: 'mute', r: 8 }],
        ['text', 40, 28, '1  let total = 0;', { a: 's', mono: true, sz: 10.5 }],
        ['text', 40, 48, '2  for (const p of prix) {', { a: 's', mono: true, sz: 10.5 }],
        ['circ', 24, 66, 5, { s: 'bad' }],
        ['rect', 34, 56, 168, 20, { s: 'warn', r: 3 }],
        ['text', 40, 68, '3    total += p;', { a: 's', mono: true, sz: 10.5, b: true }],
        ['text', 40, 88, '4  }', { a: 's', mono: true, sz: 10.5 }],
        ['text', 40, 108, '5  return total;', { a: 's', mono: true, sz: 10.5 }],
        ['text', 108, 128, ['⏸ en pause, ligne 3', '⏸ paused, line 3'], { sz: 9.5, s: 'warn', b: true }],
        ['rect', 218, 8, 134, 130, { s: 'a', r: 8 }],
        ['text', 228, 26, 'Variables', { a: 's', sz: 10.5, b: true, s: 'a' }],
        ['text', 228, 48, 'total = 12', { a: 's', mono: true, sz: 10.5 }],
        ['text', 228, 66, 'p = 7', { a: 's', mono: true, sz: 10.5 }],
        ['text', 228, 84, 'prix = [5, 7, 3]', { a: 's', mono: true, sz: 10 }],
        ['text', 228, 114, ['▶ continuer · ↷ pas à pas', '▶ continue · ↷ step over'], { a: 's', sz: 9, s: 'mute' }],
      ],
      anim: [
        { t: ['Un point d’arrêt (le rond rouge) sur la ligne 3 : « arrête-toi ici ».', 'A breakpoint (the red dot) on line 3: “stop here”.'], on: [0, 1, 2, 3, 5, 6, 7] },
        { t: ['Le programme s’exécute et se fige en arrivant là. On lit les variables : total vaut déjà 12, p vaut 7.', 'The program runs and freezes when it gets there. You read the variables: total is already 12, p is 7.'], on: [3, 4, 5, 8, 9, 10, 11, 12, 13] },
        { t: ['Pas à pas : une ligne à la fois, en regardant les valeurs changer. Plus précis qu’un console.log.', 'Step by step: one line at a time, watching the values change. More precise than a console.log.'], on: [4, 5, 14] },
      ],
    },

    'outils-lockfile': {
      k: 'graphe',
      alt: ['package.json dit « 2.x » ; le lockfile note la version exacte installée, 2.1.8', 'package.json says “2.x”; the lockfile records the exact version installed, 2.1.8'],
      n: [
        { id: 'p', t: 'package.json', sub: '"vitest": "^2.0.0"', c: 0, r: 0.5, f: 'file', s: 'v', w: 118, h: 54, mono: true, sz: 10 },
        { id: 'i', t: 'npm install', c: 1, r: 0.5, s: 'a', w: 88, mono: true, sz: 10.5 },
        { id: 'l', t: 'package-lock.json', sub: '"vitest": "2.1.8"', c: 2, r: 0.5, f: 'file', s: 'warn', w: 124, h: 54, mono: true, sz: 9.5 },
      ],
      e: [['p', 'i', ['intention', 'intent'], 'v'], ['i', 'l', ['résultat exact', 'exact result'], 'warn']],
      l: ['Le lockfile se versionne avec le projet : chacun, et la CI, installe exactement les mêmes versions.', 'The lockfile is versioned with the project: everyone, and the CI, installs exactly the same versions.'],
      anim: [
        { t: ['package.json exprime une intention : « vitest, version 2 ou plus, mais pas 3 ».', 'package.json expresses an intent: “vitest, version 2 or above, but not 3”.'], on: ['p', 'i'], flux: [0] },
        { t: ['npm install choisit une version précise et la note dans le lockfile. La prochaine fois, c’est celle-là, pour tout le monde.', 'npm install picks an exact version and records it in the lockfile. Next time, that is the one, for everyone.'], on: ['i', 'l'], flux: [1] },
      ],
    },

    'outils-monorepo': {
      k: 'arbre',
      mode: 'liste',
      alt: ['Un monorepo : plusieurs applications et paquets partagés dans un seul dépôt', 'A monorepo: several apps and shared packages in a single repository'],
      racine: {
        t: 'mon-projet/', d: true, k: [
          { t: 'apps/', d: true, c: ['les applications', 'the applications'], k: [{ t: 'web/', d: true, s: 'ok' }, { t: 'mobile/', d: true, s: 'ok' }] },
          { t: 'packages/', d: true, c: ['le code partagé', 'the shared code'], k: [{ t: 'ui/', d: true, s: 'v' }, { t: 'utils/', d: true, s: 'v' }] },
          { t: 'package.json', c: ['workspaces : apps/*, packages/*', 'workspaces: apps/*, packages/*'], cs: 'a' },
        ],
      },
      anim: [
        { t: ['Deux applications, un site et une appli mobile, dans le même dépôt.', 'Two applications, a site and a mobile app, in the same repository.'], on: ['n1', 'n2', 'n3'] },
        { t: ['Elles partagent des paquets internes : les composants d’interface, les utilitaires. Une correction profite aux deux d’un coup.', 'They share internal packages: the interface components, the utilities. A fix benefits both at once.'], on: ['n4', 'n5', 'n6'] },
        { t: ['Les workspaces du package.json racine relient tout : un seul npm install, un seul historique Git.', 'The root package.json workspaces tie it all together: one npm install, one Git history.'], on: ['n0', 'n7'] },
      ],
    },

    'outils-hmr': {
      k: 'sequence',
      lh: 46,
      alt: ['Rechargement à chaud : le fichier enregistré est recompilé seul et remplacé dans la page sans la recharger', 'Hot module replacement: the saved file is recompiled alone and swapped into the page without reloading it'],
      a: [['Éditeur', 'Editor'], ['Serveur de dev', 'Dev server'], ['Navigateur', 'Browser']],
      s: ['a', 'v', 'ok'],
      m: [
        [0, 1, ['fichier enregistré', 'file saved']],
        [1, 1, ['recompile ce module seul', 'recompiles that module only'], 'warn'],
        [1, 2, ['nouveau module (WebSocket)', 'new module (WebSocket)'], 'ok'],
        [2, 2, ['remplace sans recharger : l’état reste', 'swaps without reloading: state is kept'], 'ok'],
      ],
      anim: [
        { t: ['Vous enregistrez Bouton.js. Le serveur de développement le voit tout de suite.', 'You save Bouton.js. The dev server sees it right away.'], flux: [0] },
        { t: ['Il ne reconstruit que ce module, en quelques millisecondes.', 'It rebuilds only that module, in a few milliseconds.'], on: [1] },
        { t: ['Il l’envoie au navigateur, qui le remplace dans la page : le formulaire à moitié rempli le reste.', 'It sends it to the browser, which swaps it into the page: the half-filled form stays half-filled.'], flux: [2], on: [3] },
      ],
    },

    'outils-minification': {
      k: 'dessin',
      h: 168,
      alt: ['Le même code avant et après minification : espaces, retours à la ligne et noms longs disparaissent', 'The same code before and after minification: spaces, line breaks and long names disappear'],
      d: [
        ['text', 8, 14, ['Avant : 48 octets, lisible', 'Before: 48 bytes, readable'], { a: 's', sz: 10.5, b: true, s: 'mute' }],
        ['rect', 8, 22, 344, 58, { s: 'a', r: 6 }],
        ['text', 20, 40, 'function addition(a, b) {', { a: 's', mono: true, sz: 11 }],
        ['text', 20, 56, '  return a + b;', { a: 's', mono: true, sz: 11 }],
        ['text', 20, 72, '}', { a: 's', mono: true, sz: 11 }],
        ['line', 180, 86, 180, 104, { s: 'v', arrow: 1 }],
        ['text', 196, 98, ['minifier', 'minify'], { a: 's', sz: 10, s: 'v', b: true }],
        ['text', 8, 120, ['Après : 27 octets, pour la machine', 'After: 27 bytes, for the machine'], { a: 's', sz: 10.5, b: true, s: 'mute' }],
        ['rect', 8, 128, 344, 30, { s: 'ok', r: 6 }],
        ['text', 20, 146, 'function n(a,b){return a+b}', { a: 's', mono: true, sz: 11 }],
      ],
      anim: [
        { t: ['Le code source : indenté, des noms parlants, des retours à la ligne. Pour les humains.', 'The source code: indented, meaningful names, line breaks. For humans.'], on: [0, 1, 2, 3, 4] },
        { t: ['Minifié : même comportement, presque moitié moins d’octets à télécharger. Illisible, mais on ne le lit pas : la source map s’en charge.', 'Minified: same behavior, almost half the bytes to download. Unreadable, but nobody reads it: the source map takes care of that.'], on: [5, 6, 7, 8, 9], flux: [5] },
      ],
    },

    'outils-nodejs': {
      k: 'pile',
      alt: ['Node.js : votre script, l’API de Node, le moteur V8, le système', 'Node.js: your script, Node’s API, the V8 engine, the system'],
      piles: [{
        layers: [
          { t: ['Votre script', 'Your script'], d: 'serveur.js', s: 'a' },
          { t: 'Node.js', d: ['API : fichiers, réseau, processus, modules', 'API: files, network, processes, modules'], s: 'v' },
          { t: 'V8', d: ['le moteur JavaScript de Chrome', 'Chrome’s JavaScript engine'], s: 'warn' },
          { t: ['Système d’exploitation', 'Operating system'], s: 'mute' },
        ],
      }],
      l: ['Le même langage que dans le navigateur, mais avec les fichiers et le réseau — et sans DOM.', 'The same language as in the browser, but with files and the network — and without a DOM.'],
      anim: [
        { t: ['node serveur.js : votre fichier est lu et exécuté, hors de tout navigateur.', 'node serveur.js: your file is read and run, outside any browser.'], on: [0] },
        { t: ['Node fournit ce que le navigateur ne donne pas : lire un fichier, ouvrir un port, lancer un processus.', 'Node provides what the browser does not: read a file, open a port, launch a process.'], on: [1] },
        { t: ['Sous le capot, V8 exécute le JavaScript — le même moteur que Chrome.', 'Under the hood, V8 runs the JavaScript — the same engine as Chrome.'], on: [2, 3] },
      ],
    },

    'outils-package-json': {
      k: 'arbre',
      mode: 'liste',
      alt: ['Les clés principales d’un package.json : nom, version, scripts, dépendances', 'The main keys of a package.json: name, version, scripts, dependencies'],
      racine: {
        t: 'package.json', d: true, k: [
          { t: '"name": "lexicode"', c: ['le nom du paquet', 'the package name'] },
          { t: '"version": "1.2.0"', c: ['semver', 'semver'] },
          { t: '"scripts"', d: true, c: ['npm run …', 'npm run …'], k: [{ t: '"test": "vitest"' }, { t: '"build": "vite build"' }] },
          { t: '"dependencies"', d: true, c: ['en production', 'in production'], k: [{ t: '"express": "^5.0.0"' }] },
          { t: '"devDependencies"', d: true, c: ['pour développer', 'for development'], k: [{ t: '"vitest": "^2.0.0"' }] },
        ],
      },
      anim: [
        { t: ['Le nom et la version : l’identité du paquet.', 'The name and the version: the package’s identity.'], on: ['n1', 'n2'] },
        { t: ['scripts : des raccourcis. npm run build lance ce qui est écrit sous "build".', 'scripts: shortcuts. npm run build runs what is written under "build".'], on: ['n3', 'n4', 'n5'] },
        { t: ['dependencies : nécessaires pour tourner. devDependencies : seulement pour développer et tester.', 'dependencies: needed to run. devDependencies: only to develop and test.'], on: ['n6', 'n7', 'n8', 'n9'] },
      ],
    },

    'outils-release': {
      k: 'graphe',
      alt: ['Une release : un tag sur un commit, des notes de version, des fichiers à télécharger', 'A release: a tag on a commit, release notes, files to download'],
      n: [
        { id: 't', t: 'tag v1.2.0', c: 0, r: 0.5, f: 'pill', s: 'warn', w: 96, mono: true, sz: 11 },
        { id: 'r', t: 'Release', sub: ['notes + fichiers', 'notes + files'], c: 1, r: 0.5, s: 'a', w: 104, h: 52 },
        { id: 'u', t: ['Utilisateurs', 'Users'], c: 2, r: 0.5, f: 'cloud', s: 'ok', w: 96, h: 50 },
      ],
      e: [['t', 'r', '', 'warn'], ['r', 'u', ['téléchargent', 'download'], 'ok']],
      anim: [
        { t: ['Un commit précis reçoit un tag : v1.2.0. C’est ce code-là, et pas un autre.', 'An exact commit gets a tag: v1.2.0. That code, and no other.'], on: ['t'] },
        { t: ['Sur GitHub, la release y ajoute des notes (ce qui change) et des fichiers prêts à l’emploi : installeur, archive, APK.', 'On GitHub, the release adds notes (what changes) and ready-to-use files: installer, archive, APK.'], on: ['t', 'r', 'u'], flux: [0, 1] },
      ],
    },

  });
})(window);
