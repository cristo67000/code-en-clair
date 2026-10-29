'use strict';
/*
 * Schémas de la catégorie « Tests et qualité ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'qualite-pyramide': {
      k: 'dessin',
      h: 170,
      alt: ['La pyramide des tests : beaucoup de tests unitaires, moins d’intégration, très peu de bout en bout', 'The test pyramid: many unit tests, fewer integration tests, very few end-to-end'],
      d: [
        ['poly', [180, 8, 218, 54, 142, 54], { s: 'bad', t: 'E2E', tx: 180, ty: 38, sz: 10.5 }],
        ['poly', [142, 60, 218, 60, 244, 106, 116, 106], { s: 'warn', t: ['Intégration', 'Integration'], tx: 180, ty: 84, sz: 10.5 }],
        ['poly', [114, 112, 246, 112, 276, 160, 84, 160], { s: 'ok', t: ['Unitaires', 'Unit'], tx: 180, ty: 137, sz: 11.5 }],
        ['text', 236, 34, ['peu, lents,\nchers', 'few, slow,\ncostly'], { a: 's', sz: 10, s: 'bad', b: true }],
        ['text', 288, 136, ['nombreux,\nrapides,\nbon marché', 'many,\nfast,\ncheap'], { a: 's', sz: 10, s: 'ok', b: true }],
      ],
      anim: [
        { t: ['La base : beaucoup de tests unitaires. Rapides, précis, bon marché.', 'The base: many unit tests. Fast, precise, cheap.'], on: [2, 4] },
        { t: ['Au milieu : des tests d’intégration, moins nombreux.', 'In the middle: integration tests, fewer of them.'], on: [1] },
        { t: ['Au sommet : quelques tests de bout en bout. Lents, fragiles, mais ils voient ce que voit l’utilisateur.', 'At the top: a few end-to-end tests. Slow, brittle, but they see what the user sees.'], on: [0, 3] },
      ],
    },

    'qualite-tdd': {
      k: 'graphe',
      alt: ['Le cycle du TDD : rouge, vert, refactoring', 'The TDD cycle: red, green, refactor'],
      gy: 84,
      n: [
        { id: 'r', t: ['Rouge', 'Red'], sub: ['un test qui échoue', 'a failing test'], c: 0, r: 0, s: 'bad', w: 108, h: 52 },
        { id: 'v', t: ['Vert', 'Green'], sub: ['on le fait passer', 'make it pass'], c: 2, r: 0, s: 'ok', w: 108, h: 52 },
        { id: 'f', t: 'Refactoring', sub: ['on améliore', 'improve'], c: 1, r: 1, s: 'a', w: 112, h: 52, sz: 11 },
      ],
      e: [['r', 'v', '', 'bad'], ['v', 'f', '', 'ok'], ['f', 'r', ['répéter', 'repeat'], 'a']],
      anim: [
        { t: ['Écrire le test d’abord. Il échoue : rouge. Normal, le code n’existe pas encore.', 'Write the test first. It fails: red. Of course, the code does not exist yet.'], on: ['r'] },
        { t: ['Écrire le minimum pour le faire passer : vert.', 'Write the minimum to make it pass: green.'], on: ['r', 'v'], flux: [0] },
        { t: ['Améliorer le code sans casser le test : refactoring.', 'Improve the code without breaking the test: refactoring.'], on: ['v', 'f'], flux: [1] },
        { t: ['Et recommencer pour le cas suivant. Par petits pas.', 'And start again for the next case. In small steps.'], on: ['f', 'r'], flux: [2] },
      ],
    },

    'qualite-mock': {
      k: 'graphe',
      alt: ['En test, un mock remplace le vrai service que le code appelle en production', 'In a test, a mock replaces the real service the code calls in production'],
      gy: 76,
      n: [
        { id: 'c', t: ['Code testé', 'Code under test'], c: 0, r: 0.5, s: 'a', w: 100 },
        { id: 'v', t: ['Vrai service', 'Real service'], sub: ['lent, en réseau', 'slow, over the network'], c: 1, r: 0, f: 'cloud', s: 'mute', w: 112, h: 56, sz: 11 },
        { id: 'm', t: 'Mock', sub: ['réponses prévues', 'planned answers'], c: 1, r: 1, s: 'ok', w: 112, h: 50 },
      ],
      e: [['c', 'v', ['production', 'production'], 'mute dash'], ['c', 'm', 'test', 'ok']],
      anim: [
        { t: ['En production, le code appelle le vrai service : lent, en réseau, parfois payant.', 'In production, the code calls the real service: slow, over the network, sometimes paid.'], on: ['c', 'v'], flux: [0] },
        { t: ['En test, un mock prend sa place : il renvoie des réponses prévues et note comment on l’a appelé.', 'In a test, a mock takes its place: it returns planned answers and records how it was called.'], on: ['c', 'm'], flux: [1] },
      ],
    },

    'qualite-assertion': {
      k: 'dessin',
      h: 150,
      alt: ['Une assertion compare ce qu’on obtient à ce qu’on attend : égal, le test passe ; différent, il échoue', 'An assertion compares what you get with what you expect: equal, the test passes; different, it fails'],
      d: [
        ['rect', 8, 10, 66, 28, { s: 'v', t: 'expect(', mono: true, sz: 11, r: 4 }],
        ['rect', 78, 10, 84, 28, { s: 'a', t: 'carre(4)', mono: true, sz: 11, r: 4 }],
        ['rect', 166, 10, 72, 28, { s: 'v', t: ').toBe(', mono: true, sz: 11, r: 4 }],
        ['rect', 242, 10, 40, 28, { s: 'ok', t: '16', mono: true, sz: 11, r: 4 }],
        ['rect', 286, 10, 22, 28, { s: 'v', t: ')', mono: true, sz: 11, r: 4 }],
        ['text', 120, 58, ['ce qu’on obtient', 'what you get'], { s: 'a', sz: 10, b: true }],
        ['text', 262, 58, ['ce qu’on attend', 'what you expect'], { s: 'ok', sz: 10, b: true }],
        ['rect', 8, 80, 166, 28, { s: 'ok', t: ['✓ 16 = 16 : le test passe', '✓ 16 = 16: the test passes'], sz: 10, r: 4 }],
        ['rect', 186, 80, 166, 28, { s: 'bad', t: ['✗ 15 ≠ 16 : le test échoue', '✗ 15 ≠ 16: the test fails'], sz: 10, r: 4 }],
        ['text', 180, 134, ['En échec, le rapport montre les deux valeurs : attendu 16, obtenu 15.', 'On failure, the report shows both values: expected 16, got 15.'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['On appelle le code à tester : carre(4).', 'The code under test is called: carre(4).'], on: [0, 1, 5] },
        { t: ['On exige un résultat précis : 16.', 'An exact result is demanded: 16.'], on: [2, 3, 4, 6] },
        { t: ['Égal : rien à signaler. Différent : le test échoue et dit exactement quoi.', 'Equal: nothing to report. Different: the test fails and says exactly what.'], on: [7, 8, 9] },
      ],
    },

    'qualite-couverture': {
      k: 'dessin',
      h: 150,
      alt: ['La couverture : les lignes exécutées par les tests en vert, la ligne jamais exécutée en rouge', 'Coverage: the lines run by the tests in green, the line never run in red'],
      d: [
        ['rect', 8, 8, 212, 130, { s: 'mute', r: 8 }],
        ['rect', 16, 16, 196, 18, { s: 'ok', t: '1  function prix(q) {', mono: true, sz: 10, r: 3 }],
        ['rect', 16, 36, 196, 18, { s: 'ok', t: '2    if (q > 10) {', mono: true, sz: 10, r: 3 }],
        ['rect', 16, 56, 196, 18, { s: 'bad', t: '3      return q * 0.9;', mono: true, sz: 10, r: 3 }],
        ['rect', 16, 76, 196, 18, { s: 'ok', t: '4    }', mono: true, sz: 10, r: 3 }],
        ['rect', 16, 96, 196, 18, { s: 'ok', t: '5    return q;', mono: true, sz: 10, r: 3 }],
        ['rect', 16, 116, 196, 18, { s: 'ok', t: '6  }', mono: true, sz: 10, r: 3 }],
        ['text', 290, 40, ['5 lignes sur 6', '5 lines out of 6'], { sz: 12, b: true, s: 'a' }],
        ['text', 290, 60, '83 %', { sz: 20, b: true, mono: true, s: 'a' }],
        ['text', 290, 96, ['la ligne 3 n’a jamais\ntourné : aucun test\nn’a essayé q > 10', 'line 3 never ran:\nno test ever\ntried q > 10'], { sz: 9.5, s: 'bad', b: true }],
      ],
      anim: [
        { t: ['Les tests ont fait passer le programme par ces lignes : elles sont couvertes.', 'The tests made the program go through these lines: they are covered.'], on: [0, 1, 2, 4, 5, 6, 7, 8] },
        { t: ['La ligne 3, jamais : aucun test n’a appelé prix avec plus de 10. Si elle a un bug, personne ne le sait.', 'Line 3, never: no test called prix with more than 10. If it has a bug, nobody knows.'], on: [0, 3, 9] },
      ],
    },

    'qualite-regression': {
      k: 'commits',
      alt: ['Une régression : l’export marchait en v1.0 ; deux commits plus tard, il ne marche plus', 'A regression: export worked in v1.0; two commits later, it no longer does'],
      lanes: ['main'],
      c: [
        { i: 'A', l: 0, x: 0, s: 'ok' },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'], s: 'bad' },
      ],
      lab: [{ c: 'A', t: 'v1.0', s: 'tag' }, { c: 'A', t: ['l’export marche', 'export works'], s: 'ok' }, { c: 'C', t: ['régression', 'regression'], s: 'bad' }],
      anim: [
        { t: ['En v1.0, l’export fonctionne. Personne n’y touche.', 'In v1.0, export works. Nobody touches it.'], on: ['A'] },
        { t: ['Un commit modifie une fonction de formatage, utilisée ailleurs — par l’export aussi, sans que l’auteur le sache.', 'A commit changes a formatting function, used elsewhere — by export too, without the author knowing.'], on: ['A', 'B', 'C'], flux: ['B', 'C'] },
        { t: ['L’export est cassé : une régression. Un test automatique, lancé à chaque push, l’aurait attrapée avant la fusion.', 'Export is broken: a regression. An automated test, run on each push, would have caught it before the merge.'], on: ['C'] },
      ],
    },

    'qualite-debogage': {
      k: 'graphe',
      gy: 74,
      alt: ['Déboguer : reproduire, isoler, corriger, vérifier — et recommencer si ce n’est pas réglé', 'Debugging: reproduce, isolate, fix, verify — and start again if it is not solved'],
      n: [
        { id: 'r', t: ['Reproduire', 'Reproduce'], c: 0, r: 0, s: 'a', w: 100 },
        { id: 'i', t: ['Isoler', 'Isolate'], c: 1, r: 0, s: 'v', w: 100 },
        { id: 'c', t: ['Corriger', 'Fix'], c: 1, r: 1, s: 'ok', w: 100 },
        { id: 'v', t: ['Vérifier', 'Verify'], c: 0, r: 1, s: 'warn', w: 100 },
      ],
      e: [['r', 'i', '', 'a'], ['i', 'c', '', 'v'], ['c', 'v', '', 'ok'], ['v', 'r', ['pas réglé ?', 'not fixed?'], 'warn dash']],
      anim: [
        { t: ['Reproduire : trouver les gestes exacts qui font apparaître le bug, à coup sûr. Sans cela, on cherche à l’aveugle.', 'Reproduce: find the exact steps that make the bug appear, every time. Without that, you search blind.'], on: ['r'] },
        { t: ['Isoler : réduire. Quelle fonction ? Quelle ligne ? Quelle valeur ? Des console.log, un débogueur, un git bisect.', 'Isolate: narrow it down. Which function? Which line? Which value? console.log, a debugger, a git bisect.'], on: ['r', 'i'], flux: [0] },
        { t: ['Corriger la cause, pas le symptôme.', 'Fix the cause, not the symptom.'], on: ['i', 'c'], flux: [1] },
        { t: ['Vérifier : le bug a disparu, rien d’autre n’a cassé. Et écrire le test qui l’aurait attrapé.', 'Verify: the bug is gone, nothing else broke. And write the test that would have caught it.'], on: ['c', 'v', 'r'], flux: [2, 3] },
      ],
    },

    'qualite-log': {
      k: 'pile',
      lh: 32,
      alt: ['Les niveaux d’un journal, du plus bavard au plus grave : DEBUG, INFO, WARN, ERROR', 'Log levels, from chattiest to most serious: DEBUG, INFO, WARN, ERROR'],
      piles: [{
        t: ['Du plus bavard au plus grave', 'From chattiest to most serious'],
        layers: [
          { t: 'DEBUG', d: ['détails utiles pour développer', 'details useful while developing'], s: 'mute', mono: true },
          { t: 'INFO', d: ['ce qui se passe normalement', 'what normally happens'], s: 'a', mono: true },
          { t: 'WARN', d: ['bizarre, mais ça continue', 'odd, but still going'], s: 'warn', mono: true },
          { t: 'ERROR', d: ['quelque chose a échoué', 'something failed'], s: 'bad', mono: true },
        ],
      }],
      anim: [
        { t: ['En développement, on affiche tout, DEBUG compris : chaque requête, chaque valeur intermédiaire.', 'In development, everything is shown, DEBUG included: every request, every intermediate value.'], on: [0, 1, 2, 3] },
        { t: ['En production, à partir de INFO ou WARN : moins de bruit, moins de disque, et les erreurs restent visibles.', 'In production, from INFO or WARN up: less noise, less disk, and errors stay visible.'], on: [2, 3] },
      ],
    },

    'qualite-benchmark': {
      k: 'dessin',
      h: 152,
      alt: ['Un benchmark compare trois façons de sommer un million de nombres : 12, 18 et 21 millisecondes', 'A benchmark compares three ways of summing a million numbers: 12, 18 and 21 milliseconds'],
      d: [
        ['text', 8, 14, ['Sommer 1 million de nombres, 100 fois (médiane)', 'Summing 1 million numbers, 100 times (median)'], { a: 's', sz: 10.5, b: true, s: 'mute' }],
        ['text', 8, 38, 'for', { a: 's', mono: true, sz: 11 }],
        ['rect', 70, 26, 120, 18, { s: 'ok', r: 3 }],
        ['text', 196, 38, '12 ms', { a: 's', mono: true, sz: 10.5, s: 'ok', b: true }],
        ['text', 8, 66, 'forEach', { a: 's', mono: true, sz: 11 }],
        ['rect', 70, 54, 180, 18, { s: 'a', r: 3 }],
        ['text', 256, 66, '18 ms', { a: 's', mono: true, sz: 10.5, s: 'a', b: true }],
        ['text', 8, 94, 'reduce', { a: 's', mono: true, sz: 11 }],
        ['rect', 70, 82, 210, 18, { s: 'warn', r: 3 }],
        ['text', 286, 94, '21 ms', { a: 's', mono: true, sz: 10.5, s: 'warn', b: true }],
        ['text', 180, 126, ['Mêmes données, même machine, plusieurs fois : sinon le chiffre ne vaut rien.', 'Same data, same machine, several times: otherwise the number means nothing.'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['Trois écritures du même calcul, chronométrées dans les mêmes conditions.', 'Three ways of writing the same computation, timed under the same conditions.'], on: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { t: ['La boucle for gagne ici. Mais 9 ms d’écart sur un million d’éléments : souvent, la lisibilité compte plus.', 'The for loop wins here. But a 9 ms gap over a million items: readability often matters more.'], on: [1, 2, 3, 10] },
      ],
    },

    'qualite-profiling': {
      k: 'dessin',
      h: 122,
      alt: ['Le profilage montre où passe le temps d’une requête : surtout dans la base de données', 'Profiling shows where a request’s time goes: mostly in the database'],
      d: [
        ['text', 8, 14, ['Une requête de 400 ms : où passe le temps ?', 'A 400 ms request: where does the time go?'], { a: 's', sz: 10.5, b: true, s: 'mute' }],
        ['rect', 8, 24, 212, 26, { s: 'bad', t: ['requête SQL · 62 %', 'SQL query · 62 %'], sz: 10.5, r: 3 }],
        ['rect', 222, 24, 80, 26, { s: 'warn', t: ['rendu · 23 %', 'render · 23 %'], sz: 10, r: 3 }],
        ['rect', 304, 24, 48, 26, { s: 'mute', t: '15 %', sz: 10, r: 3 }],
        ['text', 8, 76, ['Optimiser le rendu gagnerait 10 % au mieux ; un index sur la requête peut en gagner 50.', 'Optimizing the render would gain 10 % at best; an index on the query may gain 50.'], { a: 's', sz: 10, s: 'mute', max: 344 }],
        ['text', 8, 108, ['Mesurer avant d’optimiser : l’intuition se trompe presque toujours d’endroit.', 'Measure before optimizing: intuition is almost always wrong about where.'], { a: 's', sz: 10, s: 'a', b: true, max: 344 }],
      ],
      anim: [
        { t: ['Le profileur découpe le temps par fonction : 62 % dans une seule requête SQL.', 'The profiler splits the time by function: 62 % in a single SQL query.'], on: [0, 1, 2, 3] },
        { t: ['C’est là qu’il faut agir. Optimiser ailleurs ne changerait presque rien.', 'That is where to act. Optimizing elsewhere would change almost nothing.'], on: [1, 4, 5] },
      ],
    },

    'qualite-idempotence': {
      k: 'graphe',
      alt: ['Une requête idempotente envoyée une ou dix fois laisse le serveur dans le même état', 'An idempotent request sent once or ten times leaves the server in the same state'],
      n: [
        { id: 'a', t: ['Requête\nPUT /notes/7', 'Request\nPUT /notes/7'], c: 0, r: 0.5, s: 'a', w: 108, sz: 11 },
        { id: 's', t: ['Serveur', 'Server'], c: 1, r: 0.5, s: 'v', w: 80 },
        { id: 'r', t: ['Note 7 =\n« bonjour »', 'Note 7 =\n“hello”'], c: 2, r: 0.5, s: 'ok', w: 100, sz: 11 },
      ],
      e: [['a', 's', ['1 fois', 'once'], 'a'], ['a', 's', ['10 fois', '10 times'], 'a dash'], ['s', 'r', ['même état', 'same state'], 'ok']],
      l: ['PUT et DELETE sont idempotents ; POST (créer) ne l’est pas : dix envois, dix créations.', 'PUT and DELETE are idempotent; POST (create) is not: ten sends, ten creations.'],
      anim: [
        { t: ['PUT /notes/7 avec « bonjour » : la note 7 vaut « bonjour ».', 'PUT /notes/7 with “hello”: note 7 is “hello”.'], on: ['a', 's', 'r'], flux: [0, 2] },
        { t: ['Le réseau a hoqueté, le client renvoie dix fois : la note 7 vaut toujours « bonjour ». Rien de cassé — on peut réessayer sans crainte.', 'The network hiccupped, the client resends ten times: note 7 is still “hello”. Nothing broken — retrying is safe.'], on: ['a', 's', 'r'], flux: [1, 2] },
      ],
    },

    'qualite-smoke': {
      k: 'graphe',
      gy: 66,
      alt: ['Après un déploiement, un smoke test vérifie l’essentiel avant d’aller plus loin', 'After a deployment, a smoke test checks the essentials before going further'],
      n: [
        { id: 'd', t: ['Déploiement', 'Deployment'], c: 0, r: 0.5, s: 'a', w: 100 },
        { id: 's', t: 'Smoke test', sub: ['démarre ? accueil ? connexion ?', 'starts? home page? login?'], c: 1, r: 0.5, f: 'diam', s: 'warn', w: 150, h: 70, sz: 11 },
        { id: 'o', t: ['On continue', 'Carry on'], c: 2, r: 0, s: 'ok', w: 96 },
        { id: 'x', t: ['On arrête tout', 'Stop everything'], c: 2, r: 1, s: 'bad', w: 110 },
      ],
      e: [['d', 's', '', 'a'], ['s', 'o', '✓', 'ok'], ['s', 'x', '✗', 'bad dash']],
      anim: [
        { t: ['La nouvelle version vient d’être déployée.', 'The new version has just been deployed.'], on: ['d', 's'], flux: [0] },
        { t: ['Trois vérifications d’une minute : l’application démarre, la page d’accueil s’affiche, on peut se connecter.', 'Three one-minute checks: the app starts, the home page shows, you can log in.'], on: ['s'] },
        { t: ['Tout fume normalement : on lance les tests longs. Sinon, inutile d’aller plus loin : on revient en arrière.', 'Smoke is normal: the long tests are run. Otherwise, no point going further: roll back.'], on: ['s', 'o', 'x'], flux: [1, 2] },
      ],
    },

  });
})(window);
