'use strict';
/*
 * Schémas de la catégorie « Langages et programmation ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'langage-portee': {
      k: 'dessin',
      h: 176,
      alt: ['Deux portées emboîtées : la fonction a sa propre variable a, distincte de la globale', 'Two nested scopes: the function has its own variable a, distinct from the global one'],
      d: [
        ['rect', 8, 8, 344, 160, { s: 'a', r: 10 }],
        ['text', 20, 24, ['Portée globale', 'Global scope'], { a: 's', s: 'a', sz: 11, b: true }],
        ['text', 20, 44, 'let a = "globale"', { a: 's', mono: true, sz: 11 }],
        ['rect', 30, 62, 300, 92, { s: 'v', r: 8 }],
        ['text', 42, 78, ['Portée de la fonction f', 'Scope of function f'], { a: 's', s: 'v', sz: 11, b: true }],
        ['text', 42, 98, 'let a = "locale"', { a: 's', mono: true, sz: 11 }],
        ['text', 42, 118, ['f voit sa propre a (« locale »)', 'f sees its own a (“locale”)'], { a: 's', s: 'mute', sz: 10.5 }],
        ['text', 42, 136, ['l’extérieur ne voit pas celle de f', 'the outside cannot see f’s'], { a: 's', s: 'mute', sz: 10.5 }],
      ],
    },

    'langage-closure': {
      k: 'graphe',
      alt: ['Une closure garde l’accès aux variables de l’endroit où elle est née', 'A closure keeps access to the variables of the place where it was born'],
      gy: 78,
      n: [
        { id: 'c', t: 'compteur()', sub: ['n = 0 (privé)', 'n = 0 (private)'], c: 0, r: 0, s: 'a', w: 130, h: 52, mono: true, sz: 11 },
        { id: 's', t: 'suivant', sub: ['la fonction retournée', 'the returned function'], c: 1, r: 0, s: 'v', w: 130, h: 52, mono: true, sz: 11 },
        { id: 'r', t: ['suivant() → 1\nsuivant() → 2', 'suivant() → 1\nsuivant() → 2'], c: 1, r: 1, s: 'ok', w: 130, mono: true, sz: 11 },
      ],
      e: [['c', 's', ['retourne', 'returns'], 'a'], ['s', 'c', ['se souvient de n', 'remembers n'], 'v dash'], ['s', 'r', '', 'ok']],
      anim: [
        { t: ['compteur() crée une variable n, invisible de l’extérieur.', 'compteur() creates a variable n, invisible from outside.'], on: ['c'] },
        { t: ['Elle retourne une fonction, suivant, née à l’intérieur.', 'It returns a function, suivant, born inside.'], on: ['c', 's'], flux: [0] },
        { t: ['suivant a gardé l’accès à n, même après la fin de compteur() : c’est la fermeture.', 'suivant kept access to n, even after compteur() has finished: that is the closure.'], on: ['s', 'c'], flux: [1] },
        { t: ['Chaque appel incrémente ce n privé : 1, puis 2.', 'Each call increments that private n: 1, then 2.'], on: ['s', 'r'], flux: [2] },
      ],
    },

    'langage-callback': {
      k: 'sequence',
      lh: 46,
      alt: ['Un callback est appelé plus tard, quand l’opération se termine', 'A callback is called later, when the operation finishes'],
      a: [['Votre code', 'Your code'], ['setTimeout', 'setTimeout']],
      s: ['a', 'warn'],
      m: [
        [0, 1, ['setTimeout(rappel, 3000)', 'setTimeout(callback, 3000)']],
        [0, 0, ['continue sans attendre', 'carries on without waiting'], 'mute'],
        [1, 0, ['3 s plus tard : appelle rappel()', '3 s later: calls callback()'], 'ok dash'],
      ],
      anim: [
        { t: ['Votre code confie une fonction à setTimeout : « rappelle-la dans 3 secondes ».', 'Your code hands a function to setTimeout: “call it back in 3 seconds”.'], flux: [0] },
        { t: ['Il n’attend pas : la suite s’exécute tout de suite.', 'It does not wait: what follows runs right away.'], on: [1] },
        { t: ['Trois secondes plus tard, setTimeout appelle la fonction. Un callback : une fonction appelée plus tard, par quelqu’un d’autre.', 'Three seconds later, setTimeout calls the function. A callback: a function called later, by someone else.'], flux: [2] },
      ],
    },

    'langage-promesse': {
      k: 'graphe',
      alt: ['Une promesse est en attente, puis tenue (then) ou rompue (catch)', 'A promise is pending, then fulfilled (then) or rejected (catch)'],
      gy: 72,
      n: [
        { id: 'p', t: 'pending', sub: ['en attente', 'waiting'], c: 0, r: 0.5, s: 'warn', w: 84, h: 46, mono: true, sz: 11 },
        { id: 'f', t: 'fulfilled', sub: ['tenue', 'kept'], c: 1, r: 0, s: 'ok', w: 90, h: 46, mono: true, sz: 11 },
        { id: 'r', t: 'rejected', sub: ['rompue', 'broken'], c: 1, r: 1, s: 'bad', w: 90, h: 46, mono: true, sz: 11 },
        { id: 't', t: '.then()', c: 2, r: 0, s: 'ok', w: 78, mono: true, sz: 11 },
        { id: 'c', t: '.catch()', c: 2, r: 1, s: 'bad', w: 78, mono: true, sz: 11 },
      ],
      e: [['p', 'f', 'resolve', 'ok'], ['p', 'r', 'reject', 'bad'], ['f', 't', '', 'ok'], ['r', 'c', '', 'bad']],
      anim: [
        { t: ['La promesse est créée : en attente. L’opération est en cours.', 'The promise is created: pending. The operation is under way.'], on: ['p'] },
        { t: ['Elle réussit : resolve. La promesse est tenue, le .then() reçoit la valeur.', 'It succeeds: resolve. The promise is fulfilled, the .then() receives the value.'], on: ['p', 'f', 't'], flux: [0, 2] },
        { t: ['Elle échoue : reject. La promesse est rompue, le .catch() reçoit l’erreur.', 'It fails: reject. The promise is rejected, the .catch() receives the error.'], on: ['p', 'r', 'c'], flux: [1, 3] },
      ],
    },

    'langage-event-loop': {
      k: 'graphe',
      alt: ['La boucle d’événements reprend les tâches en attente quand la pile d’appels est vide', 'The event loop takes waiting tasks when the call stack is empty'],
      gy: 92,
      n: [
        { id: 'p', t: ['Pile d’appels', 'Call stack'], c: 0, r: 0, s: 'a', w: 116 },
        { id: 'a', t: ['API du navigateur\ntimers, réseau', 'Browser APIs\ntimers, network'], c: 1, r: 0, s: 'info', w: 122, h: 48, sz: 11 },
        { id: 'q', t: ['File de tâches\ncallbacks prêts', 'Task queue\nready callbacks'], c: 1, r: 1, s: 'warn', w: 122, h: 48, sz: 11 },
        { id: 'l', t: ['Boucle\nd’événements', 'Event\nloop'], c: 0, r: 1, s: 'v', w: 116, h: 48 },
      ],
      e: [['p', 'a', ['délègue', 'hands off'], 'a'], ['a', 'q', ['terminé', 'done'], 'info'], ['q', 'l', ['prend', 'takes'], 'warn'], ['l', 'p', ['si vide', 'if empty'], 'v']],
      anim: [
        { t: ['La pile d’appels confie au navigateur ce qui prend du temps : un minuteur, une requête.', 'The call stack hands the browser what takes time: a timer, a request.'], on: ['p', 'a'], flux: [0] },
        { t: ['Quand c’est terminé, le callback est posé dans la file des tâches.', 'When it is done, the callback is put in the task queue.'], on: ['a', 'q'], flux: [1] },
        { t: ['La boucle d’événements surveille la file…', 'The event loop watches the queue…'], on: ['q', 'l'], flux: [2] },
        { t: ['…et, seulement quand la pile est vide, y pose le callback. Un calcul qui bloque la pile bloque tout.', '…and, only when the stack is empty, puts the callback on it. A computation that blocks the stack blocks everything.'], on: ['l', 'p'], flux: [3] },
      ],
    },

    'langage-boucle': {
      k: 'graphe',
      alt: ['Une boucle for : initialiser, tester, exécuter le corps, incrémenter, recommencer', 'A for loop: initialize, test, run the body, increment, repeat'],
      gy: 84,
      n: [
        { id: 's', t: 'i = 1', c: 0, r: 0, s: 'a', w: 78, mono: true },
        { id: 't', t: 'i ≤ 3 ?', c: 1, r: 0, f: 'diam', s: 'warn', w: 96, h: 52, mono: true },
        { id: 'f', t: ['fin', 'end'], c: 2, r: 0, s: 'mute', w: 70 },
        { id: 'b', t: ['afficher i', 'print i'], c: 1, r: 1, s: 'ok', w: 96, mono: true, sz: 11 },
        { id: 'i', t: 'i = i + 1', c: 0, r: 1, s: 'a', w: 90, mono: true, sz: 11 },
      ],
      e: [['s', 't', '', 'a'], ['t', 'f', ['non', 'no'], 'mute'], ['t', 'b', ['oui', 'yes'], 'ok'], ['b', 'i', '', 'ok'], ['i', 't', '', 'a dash']],
      anim: [
        { t: ['i = 1. Première question : i ≤ 3 ?', 'i = 1. First question: i ≤ 3?'], on: ['s', 't'], flux: [0] },
        { t: ['Oui : on exécute le corps, afficher i.', 'Yes: the body runs, print i.'], on: ['t', 'b'], flux: [2] },
        { t: ['i augmente de 1, et on repose la question.', 'i grows by 1, and the question is asked again.'], on: ['b', 'i', 't'], flux: [3, 4] },
        { t: ['Quand i vaut 4, la condition est fausse : fin. Le corps a tourné trois fois.', 'When i is 4, the condition is false: end. The body ran three times.'], on: ['t', 'f'], flux: [1] },
      ],
    },

    'langage-recursion': {
      k: 'pile',
      lh: 34,
      alt: ['La pile d’appels de factorielle(3) : chaque appel attend celui du dessus', 'The call stack of factorielle(3): each call waits for the one above'],
      piles: [{
        t: ['Pile d’appels — le plus récent en haut', 'Call stack — most recent on top'],
        layers: [
          { t: 'factorielle(1)', d: ['cas de base → 1', 'base case → 1'], s: 'ok', mono: true },
          { t: 'factorielle(2)', d: ['attend → 2 × 1 = 2', 'waiting → 2 × 1 = 2'], s: 'a', mono: true },
          { t: 'factorielle(3)', d: ['attend → 3 × 2 = 6', 'waiting → 3 × 2 = 6'], s: 'a', mono: true },
          { t: ['programme principal', 'main program'], s: 'mute' },
        ],
      }],
      anim: [
        { t: ['Le programme appelle factorielle(3). Elle a besoin de factorielle(2) : elle attend.', 'The program calls factorielle(3). It needs factorielle(2): it waits.'], on: [3, 2] },
        { t: ['factorielle(2) a besoin de factorielle(1) : elle attend aussi. La pile grandit.', 'factorielle(2) needs factorielle(1): it waits too. The stack grows.'], on: [2, 1] },
        { t: ['factorielle(1) est le cas de base : elle répond 1 sans rappeler personne.', 'factorielle(1) is the base case: it answers 1 without calling anyone.'], on: [0] },
        { t: ['Les appels se dépilent : 2 × 1 = 2, puis 3 × 2 = 6.', 'The calls unwind: 2 × 1 = 2, then 3 × 2 = 6.'], on: [1, 2] },
      ],
    },

    'langage-complexite': {
      k: 'dessin',
      h: 190,
      alt: ['Comment le temps grandit avec la taille n des données : O(1), O(log n), O(n), O(n²)', 'How time grows with data size n: O(1), O(log n), O(n), O(n²)'],
      d: [
        ['line', 36, 164, 344, 164, { arrow: 1 }],
        ['line', 36, 164, 36, 12, { arrow: 1 }],
        ['text', 190, 182, ['taille des données n →', 'data size n →'], { s: 'mute', sz: 10.5, b: true }],
        ['text', 44, 14, ['temps', 'time'], { a: 's', s: 'mute', sz: 10.5, b: true }],
        ['path', 'M36,148 L286,148', { s: 'ok' }],
        ['text', 294, 152, 'O(1)', { a: 's', s: 'ok', sz: 11, b: true, mono: true }],
        ['path', 'M36,146 C80,116 160,104 286,98', { s: 'info' }],
        ['text', 294, 101, 'O(log n)', { a: 's', s: 'info', sz: 10, b: true, mono: true }],
        ['path', 'M36,146 L286,60', { s: 'warn' }],
        ['text', 294, 60, 'O(n)', { a: 's', s: 'warn', sz: 11, b: true, mono: true }],
        ['path', 'M36,146 C140,142 220,110 272,22', { s: 'bad' }],
        ['text', 278, 20, 'O(n²)', { a: 's', s: 'bad', sz: 11, b: true, mono: true }],
      ],
    },

    'langage-pile': {
      k: 'dessin',
      h: 158,
      alt: ['Une pile : on empile et on dépile par le haut (dernier entré, premier sorti)', 'A stack: pushing and popping at the top (last in, first out)'],
      d: [
        ['rect', 130, 100, 100, 28, { s: 'mute', t: 'a', mono: true, sz: 12 }],
        ['rect', 130, 70, 100, 28, { s: 'a', t: 'b', mono: true, sz: 12 }],
        ['rect', 130, 40, 100, 28, { s: 'ok', t: 'c', mono: true, sz: 12 }],
        ['line', 30, 54, 124, 54, { s: 'ok', arrow: 1 }],
        ['text', 30, 40, "push('c')", { a: 's', mono: true, sz: 11, s: 'ok', b: true }],
        ['line', 236, 54, 330, 54, { s: 'a', arrow: 1 }],
        ['text', 330, 40, 'pop() → c', { a: 'e', mono: true, sz: 11, s: 'a', b: true }],
        ['text', 180, 152, ['dernier entré, premier sorti (LIFO)', 'last in, first out (LIFO)'], { sz: 11, s: 'mute', b: true }],
      ],
      anim: [
        { t: ['Deux éléments empilés : a, puis b par-dessus.', 'Two elements stacked: a, then b on top.'], on: [0, 1] },
        { t: ['push(\'c\') pose c au sommet.', 'push(\'c\') puts c on top.'], on: [0, 1, 2, 3, 4], flux: [3] },
        { t: ['pop() retire le sommet : c, le dernier entré. b et a attendent leur tour.', 'pop() removes the top: c, the last one in. b and a wait their turn.'], on: [2, 5, 6], flux: [5] },
      ],
    },

    'langage-file': {
      k: 'dessin',
      h: 128,
      alt: ['Une file : on ajoute à l’arrière et on retire à l’avant (premier entré, premier sorti)', 'A queue: adding at the back and removing at the front (first in, first out)'],
      d: [
        ['rect', 100, 36, 52, 32, { s: 'ok', t: '1', mono: true, sz: 12 }],
        ['rect', 156, 36, 52, 32, { s: 'a', t: '2', mono: true, sz: 12 }],
        ['rect', 212, 36, 52, 32, { s: 'a', t: '3', mono: true, sz: 12 }],
        ['line', 96, 52, 20, 52, { s: 'ok', arrow: 1 }],
        ['text', 10, 30, "shift() → 1", { a: 's', mono: true, sz: 10.5, s: 'ok', b: true }],
        ['line', 340, 52, 268, 52, { s: 'a', arrow: 1 }],
        ['text', 350, 30, "push(4)", { a: 'e', mono: true, sz: 10.5, s: 'a', b: true }],
        ['text', 130, 92, ['avant', 'front'], { sz: 10.5, s: 'mute' }],
        ['text', 240, 92, ['arrière', 'back'], { sz: 10.5, s: 'mute' }],
        ['text', 180, 120, ['premier entré, premier sorti (FIFO)', 'first in, first out (FIFO)'], { sz: 11, s: 'mute', b: true }],
      ],
      anim: [
        { t: ['Trois éléments dans la file, dans l’ordre d’arrivée.', 'Three elements in the queue, in order of arrival.'], on: [0, 1, 2] },
        { t: ['push(4) ajoute à l’arrière.', 'push(4) adds at the back.'], on: [5, 6], flux: [5] },
        { t: ['shift() retire à l’avant : 1, le premier entré. Une file d’attente.', 'shift() removes at the front: 1, the first one in. A waiting line.'], on: [0, 3, 4], flux: [3] },
      ],
    },

    'langage-liste-chainee': {
      k: 'graphe',
      alt: ['Une liste chaînée : chaque nœud contient une valeur et un lien vers le suivant', 'A linked list: each node holds a value and a link to the next one'],
      n: [
        { id: 'a', t: 'A', sub: '→', c: 0, r: 0, s: 'a', w: 56, h: 50, mono: true, sz: 14 },
        { id: 'b', t: 'B', sub: '→', c: 1, r: 0, s: 'a', w: 56, h: 50, mono: true, sz: 14 },
        { id: 'c', t: 'C', sub: '→', c: 2, r: 0, s: 'a', w: 56, h: 50, mono: true, sz: 14 },
        { id: 'd', t: 'null', c: 3, r: 0, s: 'mute', w: 56, mono: true, sz: 11 },
      ],
      e: [['a', 'b', '', 'a'], ['b', 'c', '', 'a'], ['c', 'd', '', 'a']],
      anim: [
        { t: ['On ne connaît que le premier nœud.', 'Only the first node is known.'], on: ['a'] },
        { t: ['Il contient sa valeur et l’adresse du suivant.', 'It holds its value and the address of the next one.'], on: ['a', 'b'], flux: [0] },
        { t: ['On suit les liens un par un jusqu’à null. Insérer au milieu est facile ; atteindre le dixième demande dix sauts.', 'You follow the links one by one until null. Inserting in the middle is easy; reaching the tenth takes ten hops.'], on: ['b', 'c', 'd'], flux: [1, 2] },
      ],
    },

    'langage-arbre': {
      k: 'arbre',
      alt: ['Un arbre binaire de recherche : plus petit à gauche, plus grand à droite', 'A binary search tree: smaller on the left, larger on the right'],
      racine: {
        t: '8', s: 'a', k: [
          { t: '3', s: 'v', k: [{ t: '1', s: 'ok' }, { t: '6', s: 'ok' }] },
          { t: '10', s: 'v', k: [{ t: '14', s: 'ok' }] },
        ],
      },
      l: ['Racine en haut, feuilles en bas. Chercher 6 : 8 → gauche, 3 → droite.', 'Root at the top, leaves at the bottom. Looking for 6: 8 → left, 3 → right.'],
      anim: [
        { t: ['On cherche 6. Racine : 8. 6 est plus petit : à gauche.', 'Looking for 6. Root: 8. 6 is smaller: go left.'], on: ['n0'] },
        { t: ['3. 6 est plus grand : à droite.', '3. 6 is larger: go right.'], on: ['n1'] },
        { t: ['6 : trouvé en trois comparaisons, sans regarder 1, 10 ni 14.', '6: found in three comparisons, without looking at 1, 10 or 14.'], on: ['n3'] },
      ],
    },

    'langage-graphe': {
      k: 'dessin',
      h: 170,
      alt: ['Un graphe : des sommets reliés par des arêtes', 'A graph: vertices joined by edges'],
      d: [
        ['line', 60, 50, 180, 34, { s: 'mute' }],
        ['line', 180, 34, 300, 64, { s: 'mute' }],
        ['line', 60, 50, 110, 128, { s: 'mute' }],
        ['line', 110, 128, 250, 140, { s: 'mute' }],
        ['line', 180, 34, 250, 140, { s: 'mute' }],
        ['line', 300, 64, 250, 140, { s: 'mute' }],
        ['circ', 60, 50, 16, { s: 'a', t: 'A', sz: 12 }],
        ['circ', 180, 34, 16, { s: 'a', t: 'B', sz: 12 }],
        ['circ', 300, 64, 16, { s: 'a', t: 'C', sz: 12 }],
        ['circ', 110, 128, 16, { s: 'a', t: 'D', sz: 12 }],
        ['circ', 250, 140, 16, { s: 'a', t: 'E', sz: 12 }],
        ['text', 82, 22, ['sommet', 'vertex'], { s: 'a', sz: 10.5, b: true, a: 's' }],
        ['text', 240, 84, ['arête', 'edge'], { s: 'mute', sz: 10.5, b: true, a: 's' }],
      ],
    },

    'langage-hachage': {
      k: 'dessin',
      h: 158,
      alt: ['Une table de hachage : la clé est transformée en numéro de case', 'A hash table: the key is turned into a slot number'],
      d: [
        ['rect', 10, 10, 70, 30, { s: 'a', t: '"git"', mono: true, sz: 12 }],
        ['line', 84, 25, 116, 25, { s: 'a', arrow: 1 }],
        ['rect', 120, 10, 130, 30, { s: 'v', t: 'hash("git") % 5 = 2', mono: true, sz: 9.5 }],
        ['text', 262, 30, ['la clé', 'the key'], { a: 's', s: 'mute', sz: 10 }],
        ['line', 185, 42, 185, 86, { s: 'v', arrow: 1 }],
        ['rect', 40, 90, 52, 30, { s: 'mute', t: '0', mono: true, sz: 11 }],
        ['rect', 96, 90, 52, 30, { s: 'mute', t: '1', mono: true, sz: 11 }],
        ['rect', 152, 90, 66, 30, { s: 'ok', t: ['valeur', 'value'], sz: 11 }],
        ['rect', 222, 90, 52, 30, { s: 'mute', t: '3', mono: true, sz: 11 }],
        ['rect', 278, 90, 52, 30, { s: 'mute', t: '4', mono: true, sz: 11 }],
        ['text', 185, 138, ['case 2 : accès immédiat, sans parcourir les autres', 'slot 2: immediate access, without scanning the others'], { sz: 10.5, s: 'mute', b: true }],
      ],
      anim: [
        { t: ['La clé : "git".', 'The key: "git".'], on: [0, 3] },
        { t: ['Une fonction de hachage la transforme en nombre, ramené au nombre de cases : 2.', 'A hash function turns it into a number, reduced to the number of slots: 2.'], on: [0, 1, 2], flux: [1] },
        { t: ['La valeur est rangée dans la case 2. Pour la retrouver : même calcul, même case, sans parcourir les autres.', 'The value is stored in slot 2. To find it again: same computation, same slot, without scanning the others.'], on: [2, 4, 7, 10], flux: [4] },
      ],
    },

    'langage-classe': {
      k: 'graphe',
      alt: ['Une classe est un plan ; chaque instance est un objet construit à partir de lui', 'A class is a blueprint; each instance is an object built from it'],
      gy: 84,
      n: [
        { id: 'c', t: ['Classe Chien', 'Dog class'], sub: ['le plan', 'the blueprint'], c: 1, r: 0, s: 'a', w: 130, h: 50 },
        { id: 'a', t: 'rex', sub: 'nom = "Rex"', c: 0, r: 1, s: 'ok', w: 108, h: 50, mono: true, sz: 11 },
        { id: 'b', t: 'fido', sub: 'nom = "Fido"', c: 2, r: 1, s: 'ok', w: 108, h: 50, mono: true, sz: 11 },
      ],
      e: [['c', 'a', 'new', 'a'], ['c', 'b', 'new', 'a']],
      anim: [
        { t: ['La classe Chien décrit ce qu’un chien a (un nom) et sait faire (aboyer).', 'The Dog class describes what a dog has (a name) and can do (bark).'], on: ['c'] },
        { t: ['new Chien("Rex") fabrique un objet selon ce plan.', 'new Chien("Rex") builds an object from that blueprint.'], on: ['c', 'a'], flux: [0] },
        { t: ['new Chien("Fido") en fabrique un autre. Même plan, données différentes.', 'new Chien("Fido") builds another. Same blueprint, different data.'], on: ['c', 'b'], flux: [1] },
      ],
    },

    'langage-heritage': {
      k: 'arbre',
      alt: ['Chien et Chat héritent de la classe mère Animal', 'Dog and Cat inherit from the parent class Animal'],
      w: 110,
      racine: {
        t: 'Animal\nmanger()', s: 'a', k: [{ t: 'Chien\naboyer()', s: 'ok' }, { t: 'Chat\nmiauler()', s: 'ok' }],
      },
      l: ['Les classes filles reçoivent manger() sans le réécrire.', 'The child classes receive manger() without rewriting it.'],
      anim: [
        { t: ['Animal définit manger().', 'Animal defines manger().'], on: ['n0'] },
        { t: ['Chien et Chat héritent : ils savent manger() sans le réécrire, et ajoutent chacun le leur.', 'Dog and Cat inherit: they know manger() without rewriting it, and each adds its own.'], on: ['n1', 'n2'] },
      ],
    },

    'langage-compilation': {
      k: 'graphe',
      alt: ['Compilation : traduire avant d’exécuter ; interprétation : lire et exécuter pas à pas', 'Compilation: translating before running; interpretation: reading and running step by step'],
      gy: 92,
      n: [
        { id: 'a', t: ['Code\nsource', 'Source\ncode'], c: 0, r: 0, s: 'a', w: 70 },
        { id: 'b', t: ['Compilateur', 'Compiler'], c: 1, r: 0, s: 'v', w: 74, sz: 9.5 },
        { id: 'c', t: ['Exécutable', 'Executable'], c: 2, r: 0, s: 'warn', w: 74, sz: 9.5 },
        { id: 'd', t: ['Processeur', 'Processor'], c: 3, r: 0, s: 'ok', w: 74, sz: 9.5 },
        { id: 'e', t: ['Code\nsource', 'Source\ncode'], c: 0, r: 1, s: 'a', w: 70 },
        { id: 'f', t: ['Interpréteur', 'Interpreter'], c: 1, r: 1, s: 'v', w: 74, sz: 9.5 },
        { id: 'g', t: ['Résultat', 'Result'], c: 2, r: 1, s: 'ok', w: 74, sz: 10.5 },
      ],
      e: [['a', 'b', '', 'a'], ['b', 'c', '', 'v'], ['c', 'd', '', 'warn'], ['e', 'f', '', 'a'], ['f', 'g', '', 'v']],
      g: [{ t: ['Compilé : traduit avant', 'Compiled: translated first'], ids: ['a', 'b', 'c', 'd'] }, { t: ['Interprété : lu et exécuté ligne à ligne', 'Interpreted: read and run line by line'], ids: ['e', 'f', 'g'] }],
      anim: [
        { t: ['Compilé : le compilateur traduit tout le source en exécutable, une fois pour toutes.', 'Compiled: the compiler translates the whole source into an executable, once and for all.'], on: ['a', 'b', 'c'], flux: [0, 1] },
        { t: ['Le processeur exécute ce fichier directement : rapide, mais à refaire pour chaque machine.', 'The processor runs that file directly: fast, but it has to be redone for each machine.'], on: ['c', 'd'], flux: [2] },
        { t: ['Interprété : l’interpréteur lit le source et l’exécute ligne à ligne, à chaque lancement.', 'Interpreted: the interpreter reads the source and runs it line by line, every time it starts.'], on: ['e', 'f', 'g'], flux: [3, 4] },
      ],
    },

    'main-fonction': {
      k: 'graphe',
      alt: ['Le système d’exploitation appelle main(), qui appelle le reste du programme', 'The operating system calls main(), which calls the rest of the program'],
      gy: 76,
      n: [
        { id: 'o', t: ['Système\nd’exploitation', 'Operating\nsystem'], c: 0, r: 0.5, s: 'mute', w: 96 },
        { id: 'm', t: 'main()', c: 1, r: 0.5, s: 'a', w: 82, mono: true },
        { id: 'a', t: 'lire()', c: 2, r: 0, s: 'ok', w: 78, mono: true },
        { id: 'b', t: 'calculer()', c: 2, r: 1, s: 'ok', w: 90, mono: true, sz: 11 },
      ],
      e: [['o', 'm', ['lance', 'starts'], 'a'], ['m', 'o', ['code 0', 'code 0'], 'ok dash'], ['m', 'a', '', 'ok'], ['m', 'b', '', 'ok']],
    },

    'langage-async-await': {
      k: 'sequence',
      lh: 46,
      alt: ['await suspend la fonction sans bloquer la page ; elle reprend quand la réponse arrive', 'await suspends the function without blocking the page; it resumes when the answer arrives'],
      a: [['Votre fonction\nasync', 'Your async\nfunction'], 'fetch()', ['Reste de la page', 'Rest of the page']],
      s: ['a', 'warn', 'ok'],
      m: [
        [0, 1, 'await fetch(url)'],
        [0, 2, ['rend la main', 'yields'], 'mute dash'],
        [2, 2, ['la page reste fluide', 'the page stays responsive'], 'ok'],
        [1, 0, ['réponse : la fonction reprend', 'answer: the function resumes'], 'ok dash'],
      ],
      anim: [
        { t: ['La fonction lance une requête et écrit await : « je reprendrai quand ce sera prêt ».', 'The function starts a request and writes await: “I will resume when it is ready”.'], flux: [0] },
        { t: ['Elle rend la main. Pendant l’attente, la page répond aux clics : rien n’est bloqué.', 'It yields. While waiting, the page answers clicks: nothing is blocked.'], flux: [1], on: [2] },
        { t: ['La réponse arrive : la fonction reprend à la ligne suivante, comme si elle n’était jamais partie.', 'The answer arrives: the function resumes at the next line, as if it had never left.'], flux: [3] },
      ],
    },

    'langage-fonction': {
      k: 'dessin',
      h: 176,
      alt: ['L’anatomie d’une fonction : mot-clé, nom, paramètres, corps avec return, puis un appel avec des arguments', 'The anatomy of a function: keyword, name, parameters, body with return, then a call with arguments'],
      d: [
        ['rect', 8, 10, 74, 28, { s: 'v', t: 'function', mono: true, sz: 11, r: 4 }],
        ['rect', 86, 10, 46, 28, { s: 'a', t: 'aire', mono: true, sz: 11, r: 4 }],
        ['rect', 136, 10, 136, 28, { s: 'warn', t: '(largeur, hauteur)', mono: true, sz: 10.5, r: 4 }],
        ['rect', 8, 44, 226, 28, { s: 'ok', t: '{ return largeur * hauteur; }', mono: true, sz: 10.5, r: 4 }],
        ['text', 45, 90, ['mot-clé', 'keyword'], { s: 'v', sz: 10, b: true }],
        ['text', 109, 90, ['nom', 'name'], { s: 'a', sz: 10, b: true }],
        ['text', 204, 90, ['paramètres', 'parameters'], { s: 'warn', sz: 10, b: true }],
        ['text', 8, 110, ['corps : ce qu’elle calcule ; return renvoie le résultat', 'body: what it computes; return hands back the result'], { a: 's', s: 'ok', sz: 10, b: true }],
        ['rect', 8, 128, 100, 28, { s: 'a', t: 'aire(3, 4)', mono: true, sz: 11, r: 4 }],
        ['text', 124, 146, '→ 12', { a: 's', mono: true, sz: 12, b: true, s: 'ok' }],
        ['text', 180, 146, ['arguments : 3 et 4', 'arguments: 3 and 4'], { a: 's', s: 'warn', sz: 10, b: true }],
        ['text', 180, 170, ['Définie une fois, appelée autant de fois qu’on veut.', 'Defined once, called as many times as you like.'], { s: 'mute', sz: 10 }],
      ],
      anim: [
        { t: ['function, puis un nom : la fonction aire existe, elle ne fait encore rien.', 'function, then a name: the aire function exists, it does nothing yet.'], on: [0, 1, 4, 5] },
        { t: ['Les paramètres : les noms que la fonction donne à ce qu’elle recevra.', 'The parameters: the names the function gives to what it will receive.'], on: [2, 6] },
        { t: ['Le corps : le calcul, et return pour rendre le résultat à qui a appelé.', 'The body: the computation, and return to hand the result back to the caller.'], on: [3, 7] },
        { t: ['L’appel : aire(3, 4). Les arguments 3 et 4 prennent la place de largeur et hauteur ; le résultat est 12.', 'The call: aire(3, 4). The arguments 3 and 4 take the place of largeur and hauteur; the result is 12.'], on: [8, 9, 10, 11] },
      ],
    },

    'langage-condition': {
      k: 'graphe',
      gy: 68,
      alt: ['Une condition : si le test est vrai, une branche ; sinon, l’autre ; puis le programme continue', 'A condition: if the test is true, one branch; otherwise, the other; then the program goes on'],
      n: [
        { id: 't', t: 'age >= 18 ?', c: 1, r: 0, f: 'diam', s: 'warn', w: 110, h: 54, mono: true, sz: 11 },
        { id: 'a', t: ['« majeur »', '“adult”'], c: 0, r: 1, s: 'ok', w: 90 },
        { id: 'b', t: ['« mineur »', '“minor”'], c: 2, r: 1, s: 'bad', w: 90 },
        { id: 'f', t: ['suite du programme', 'rest of the program'], c: 1, r: 2, s: 'mute', w: 140 },
      ],
      e: [['t', 'a', ['vrai', 'true'], 'ok'], ['t', 'b', ['faux', 'false'], 'bad'], ['a', 'f', '', 'mute'], ['b', 'f', '', 'mute']],
      anim: [
        { t: ['if (age >= 18) : le test donne vrai ou faux.', 'if (age >= 18): the test gives true or false.'], on: ['t'] },
        { t: ['Vrai : le bloc du if s’exécute.', 'True: the if block runs.'], on: ['t', 'a'], flux: [0] },
        { t: ['Faux : le bloc du else, s’il existe. Dans tous les cas, une seule des deux branches, puis la suite.', 'False: the else block, if there is one. Either way, only one of the two branches, then the rest.'], on: ['t', 'b', 'f'], flux: [1, 3] },
      ],
    },

    'langage-exception': {
      k: 'graphe',
      gy: 74,
      alt: ['try, throw, catch, finally : une erreur levée dans le try est attrapée par le catch ; finally s’exécute toujours', 'try, throw, catch, finally: an error thrown in the try is caught by the catch; finally always runs'],
      n: [
        { id: 't', t: 'try { … }', c: 0, r: 0, s: 'a', w: 96, mono: true, sz: 11 },
        { id: 'x', t: ['Erreur !\nthrow', 'Error!\nthrow'], c: 1, r: 0, s: 'bad', w: 90, mono: true, sz: 11 },
        { id: 'c', t: 'catch (e) { … }', c: 1, r: 1, s: 'warn', w: 120, mono: true, sz: 10.5 },
        { id: 'f', t: 'finally { … }', c: 0, r: 1, s: 'ok', w: 104, mono: true, sz: 10.5 },
      ],
      e: [['t', 'x', ['une erreur survient', 'an error occurs'], 'bad'], ['x', 'c', ['attrapée', 'caught'], 'warn'], ['c', 'f', '', 'ok'], ['t', 'f', ['pas d’erreur', 'no error'], 'ok dash']],
      anim: [
        { t: ['Le code du try s’exécute normalement…', 'The code in the try runs normally…'], on: ['t'] },
        { t: ['…jusqu’à ce qu’une erreur soit levée (throw) : le reste du try est abandonné.', '…until an error is thrown: the rest of the try is abandoned.'], on: ['t', 'x'], flux: [0] },
        { t: ['Le catch la reçoit dans e : on peut l’afficher, réessayer, ou la relancer.', 'The catch receives it in e: you can show it, retry, or rethrow it.'], on: ['x', 'c'], flux: [1] },
        { t: ['finally s’exécute dans tous les cas, erreur ou non : fermer un fichier, libérer une ressource.', 'finally runs in every case, error or not: closing a file, releasing a resource.'], on: ['c', 'f', 't'], flux: [2, 3] },
      ],
    },

    'langage-variable': {
      k: 'dessin',
      h: 160,
      alt: ['Une variable : un nom qui désigne une valeur en mémoire, et qu’on peut faire pointer vers une autre', 'A variable: a name that designates a value in memory, and that can be pointed at another'],
      d: [
        ['text', 65, 16, ['le nom (l’étiquette)', 'the name (the label)'], { sz: 10, s: 'a', b: true }],
        ['rect', 20, 28, 90, 34, { s: 'a', t: 'prix', mono: true, sz: 13, f: 'pill' }],
        ['line', 114, 45, 176, 45, { s: 'a', arrow: 1 }],
        ['rect', 180, 28, 80, 34, { s: 'ok', t: '42', mono: true, sz: 14 }],
        ['text', 220, 16, ['la valeur, en mémoire', 'the value, in memory'], { sz: 10, s: 'ok', b: true }],
        ['text', 352, 45, 'let prix = 42;', { a: 'e', mono: true, sz: 10, s: 'mute' }],
        ['rect', 180, 96, 80, 34, { s: 'warn', t: '45', mono: true, sz: 14 }],
        ['line', 114, 113, 176, 113, { s: 'warn', arrow: 1, dash: 1 }],
        ['text', 65, 113, ['même nom…', 'same name…'], { sz: 10, s: 'warn', b: true }],
        ['text', 352, 113, 'prix = 45;', { a: 'e', mono: true, sz: 10, s: 'mute' }],
        ['text', 180, 150, ['const au lieu de let : le nom ne peut plus changer de valeur.', 'const instead of let: the name can no longer change value.'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['let prix = 42 : on crée une étiquette, prix, et on la colle sur la valeur 42.', 'let prix = 42: a label, prix, is created and stuck on the value 42.'], on: [0, 1, 2, 3, 4, 5] },
        { t: ['prix = 45 : la même étiquette est décollée et recollée sur 45. Le nom reste, la valeur change.', 'prix = 45: the same label is peeled off and stuck on 45. The name stays, the value changes.'], on: [1, 6, 7, 8, 9], flux: [7] },
        { t: ['Avec const, ce second geste est interdit : le nom garde sa valeur pour toujours.', 'With const, that second move is forbidden: the name keeps its value for good.'], on: [10] },
      ],
    },

    'langage-type': {
      k: 'cases',
      alt: ['Quelques types de valeurs : nombre, chaîne, booléen, null, tableau, objet', 'A few value types: number, string, boolean, null, array, object'],
      rows: [
        { t: ['Quelques types', 'A few types'], cells: ['42', '"abc"', 'true', 'null', '[1, 2]', '{ a: 1 }'], s: ['ok', 'a', 'v', 'mute', 'warn', 'info'], cap: [['nombre', 'number'], ['chaîne', 'string'], ['booléen', 'boolean'], ['rien', 'nothing'], ['tableau', 'array'], ['objet', 'object']], w: 54, sz: 11 },
      ],
      l: ['Le type dit ce qu’on peut faire : 42 + 1 vaut 43, mais "42" + 1 vaut "421".', 'The type says what can be done: 42 + 1 is 43, but "42" + 1 is "421".'],
      anim: [
        { t: ['Un nombre et une chaîne se ressemblent à l’écran : 42 et "42". Pas pour le programme.', 'A number and a string look alike on screen: 42 and "42". Not for the program.'], on: ['r0:0', 'r0:1'] },
        { t: ['Un booléen ne vaut que vrai ou faux ; null dit « rien, exprès ».', 'A boolean is only true or false; null says “nothing, on purpose”.'], on: ['r0:2', 'r0:3'] },
        { t: ['Un tableau range des valeurs dans l’ordre ; un objet les range sous des noms.', 'An array stores values in order; an object stores them under names.'], on: ['r0:4', 'r0:5'] },
      ],
    },

    'langage-module': {
      k: 'graphe',
      gy: 70,
      alt: ['Un module n’expose que ce qu’il exporte ; un autre fichier l’importe ; le reste lui est invisible', 'A module only exposes what it exports; another file imports it; the rest is invisible to it'],
      n: [
        { id: 'a', t: 'maths.js', sub: 'export function carre', c: 0, r: 0, f: 'file', s: 'a', w: 150, h: 52, mono: true, sz: 11 },
        { id: 'p', t: ['privé', 'private'], sub: 'const PI = 3.14159', c: 0, r: 1, s: 'mute', w: 150, h: 50, dash: true, sz: 11 },
        { id: 'b', t: 'app.js', sub: "import { carre } from './maths.js'", c: 1, r: 0, f: 'file', s: 'ok', w: 160, h: 62, mono: true, sz: 11 },
      ],
      e: [['a', 'b', ['export → import', 'export → import'], 'a'], ['p', 'b', ['invisible', 'invisible'], 'mute dash sans']],
      anim: [
        { t: ['maths.js garde ses variables pour lui : par défaut, rien ne sort.', 'maths.js keeps its variables to itself: by default, nothing gets out.'], on: ['a', 'p'] },
        { t: ['export marque ce qu’il accepte de partager : la fonction carre.', 'export marks what it agrees to share: the carre function.'], on: ['a', 'b'], flux: [0] },
        { t: ['app.js l’importe par son nom. PI, non exporté, lui reste invisible : pas de variable globale, pas de collision.', 'app.js imports it by name. PI, not exported, stays invisible to it: no global variable, no collision.'], on: ['p', 'b'], flux: [1] },
      ],
    },

    'langage-garbage': {
      k: 'graphe',
      gy: 64,
      alt: ['Le ramasse-miettes garde les objets atteignables depuis les variables vivantes et libère les autres', 'The garbage collector keeps the objects reachable from live variables and frees the others'],
      n: [
        { id: 'r', t: ['Variables\nvivantes', 'Live\nvariables'], c: 0, r: 0.5, s: 'a', w: 96 },
        { id: 'x', t: ['Objet A', 'Object A'], c: 1, r: 0, s: 'ok', w: 86 },
        { id: 'y', t: ['Objet B', 'Object B'], c: 2, r: 0, s: 'ok', w: 86 },
        { id: 'z', t: ['Objet C', 'Object C'], sub: ['plus référencé', 'no longer referenced'], c: 1.5, r: 1, s: 'bad', w: 130, h: 50, dash: true },
      ],
      e: [['r', 'x', '', 'ok'], ['x', 'y', '', 'ok']],
      anim: [
        { t: ['A est référencé par une variable ; B est référencé par A. Tous deux sont atteignables.', 'A is referenced by a variable; B is referenced by A. Both are reachable.'], on: ['r', 'x', 'y'], flux: [0, 1] },
        { t: ['Plus rien ne mène à C : la variable qui le désignait a été réaffectée ou a disparu.', 'Nothing leads to C anymore: the variable that pointed to it was reassigned or is gone.'], on: ['z'] },
        { t: ['Le ramasse-miettes le libère, sans que vous ayez rien à faire. Une fuite, c’est un objet inutile qu’on oublie de lâcher.', 'The garbage collector frees it, without you doing anything. A leak is a useless object you forget to let go of.'], on: ['r', 'x', 'y'] },
      ],
    },

    'langage-thread': {
      k: 'dessin',
      h: 166,
      alt: ['Un processus contient deux threads qui s’exécutent en parallèle et partagent la même mémoire', 'A process holds two threads running in parallel and sharing the same memory'],
      d: [
        ['rect', 8, 8, 344, 150, { s: 'mute', r: 10 }],
        ['text', 20, 24, ['Processus (mémoire partagée)', 'Process (shared memory)'], { a: 's', sz: 11, b: true, s: 'mute' }],
        ['rect', 20, 40, 320, 40, { s: 'a', t: ['Thread 1 : interface, réagit aux clics', 'Thread 1: interface, reacts to clicks'], sz: 10.5, r: 6 }],
        ['rect', 20, 90, 320, 40, { s: 'v', t: ['Thread 2 : calcul long, en parallèle', 'Thread 2: long computation, in parallel'], sz: 10.5, r: 6 }],
        ['line', 20, 142, 340, 142, { s: 'mute', arrow: 1 }],
        ['text', 180, 154, ['temps →', 'time →'], { sz: 9.5, s: 'mute' }],
      ],
      anim: [
        { t: ['Un processus : un programme lancé, avec sa mémoire à lui.', 'A process: a running program, with its own memory.'], on: [0, 1] },
        { t: ['Dedans, plusieurs threads peuvent avancer en même temps : l’un s’occupe de l’écran…', 'Inside, several threads can move forward at the same time: one takes care of the screen…'], on: [2, 4, 5] },
        { t: ['…l’autre calcule. Ils partagent la mémoire : pratique, mais deux threads qui écrivent la même variable, c’est le bug le plus dur à trouver.', '…the other computes. They share memory: handy, but two threads writing the same variable is the hardest bug to find.'], on: [3, 4, 5] },
      ],
    },

    'langage-regex': {
      k: 'cases',
      alt: ['Une expression régulière découpée en morceaux : début, lettres, arobase, mot, point, fr, fin', 'A regular expression cut into pieces: start, letters, at sign, word, dot, fr, end'],
      rows: [
        { t: ['/^[a-z]+@\\w+\\.fr$/', '/^[a-z]+@\\w+\\.fr$/'], cells: ['^', '[a-z]+', '@', '\\w+', '\\.', 'fr', '$'], s: ['mute', 'a', 'v', 'a', 'warn', 'v', 'mute'], cap: [['début', 'start'], ['lettres ≥ 1', 'letters ≥ 1'], '@', ['mot ≥ 1', 'word ≥ 1'], ['un point', 'a dot'], 'fr', ['fin', 'end']], w: 46, sz: 12 },
      ],
      l: ['Reconnaît « zoe@exemple.fr » : un début, des lettres, un arobase, un mot, un point, fr, une fin.', 'Matches “zoe@exemple.fr”: a start, letters, an at sign, a word, a dot, fr, an end.'],
      anim: [
        { t: ['^ et $ : la chaîne entière doit correspondre, du début à la fin.', '^ and $: the whole string must match, from start to end.'], on: ['r0:0', 'r0:6'] },
        { t: ['[a-z]+ : une lettre minuscule, au moins une fois. \\w+ : des caractères de mot (lettres, chiffres, _).', '[a-z]+: a lowercase letter, at least once. \\w+: word characters (letters, digits, _).'], on: ['r0:1', 'r0:3'] },
        { t: ['\\. : un vrai point. Sans l’antislash, le point voudrait dire « n’importe quel caractère ».', '\\.: a real dot. Without the backslash, the dot would mean “any character”.'], on: ['r0:4'] },
        { t: ['@ et fr : des caractères ordinaires, pris tels quels.', '@ and fr: ordinary characters, taken as they are.'], on: ['r0:2', 'r0:5'] },
      ],
    },

    'langage-interface': {
      k: 'graphe',
      gy: 72,
      alt: ['Une interface décrit des méthodes ; plusieurs classes l’implémentent chacune à sa façon', 'An interface describes methods; several classes implement it, each in its own way'],
      n: [
        { id: 'i', t: ['Interface Forme', 'Shape interface'], sub: 'aire() · perimetre()', c: 1, r: 0, s: 'a', w: 150, h: 50, dash: true },
        { id: 'c', t: ['Cercle', 'Circle'], c: 0, r: 1, s: 'ok', w: 84 },
        { id: 'r', t: 'Rectangle', c: 1, r: 1, s: 'ok', w: 84 },
        { id: 't', t: 'Triangle', c: 2, r: 1, s: 'ok', w: 84 },
      ],
      e: [['c', 'i', ['implémente', 'implements'], 'ok dash'], ['r', 'i', '', 'ok dash'], ['t', 'i', '', 'ok dash']],
      l: ['Qui appelle aire() se moque de la forme réelle : chacune sait la calculer à sa façon.', 'Whoever calls aire() does not care which shape it really is: each one knows how to compute it its own way.'],
      anim: [
        { t: ['L’interface est un contrat : toute Forme sait répondre à aire() et perimetre(). Elle ne dit pas comment.', 'The interface is a contract: every Forme can answer aire() and perimetre(). It does not say how.'], on: ['i'] },
        { t: ['Chaque classe tient le contrat à sa manière : π r² pour le cercle, largeur × hauteur pour le rectangle.', 'Each class keeps the contract in its own way: π r² for the circle, width × height for the rectangle.'], on: ['i', 'c', 'r', 't'], flux: [0, 1, 2] },
      ],
    },

    'langage-pointeur': {
      k: 'dessin',
      h: 144,
      alt: ['Un pointeur contient une adresse ; à cette adresse se trouve la valeur', 'A pointer holds an address; at that address lies the value'],
      d: [
        ['rect', 14, 24, 80, 34, { s: 'a', t: 'p', mono: true, sz: 13 }],
        ['text', 54, 16, ['pointeur', 'pointer'], { sz: 10, s: 'a', b: true }],
        ['rect', 14, 62, 80, 20, { s: 'mute', t: '0x7f3a', mono: true, sz: 10, r: 3 }],
        ['line', 98, 41, 176, 41, { s: 'a', arrow: 1 }],
        ['text', 137, 30, ['désigne', 'points to'], { sz: 9.5, s: 'a', b: true }],
        ['rect', 180, 24, 90, 34, { s: 'ok', t: '42', mono: true, sz: 13 }],
        ['text', 225, 16, ['la valeur', 'the value'], { sz: 10, s: 'ok', b: true }],
        ['rect', 180, 62, 90, 20, { s: 'mute', t: ['adresse 0x7f3a', 'address 0x7f3a'], mono: true, sz: 9, r: 3 }],
        ['text', 180, 112, ['*p lit la valeur (42) ; p contient l’adresse (0x7f3a).', '*p reads the value (42); p holds the address (0x7f3a).'], { sz: 10.5, s: 'mute', b: true, max: 340 }],
        ['text', 180, 132, ['Deux pointeurs vers la même case : modifier par l’un, c’est modifier pour l’autre.', 'Two pointers to the same slot: changing through one changes it for the other.'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['p ne contient pas 42 : il contient l’adresse de la case où 42 se trouve.', 'p does not hold 42: it holds the address of the slot where 42 is.'], on: [0, 1, 2] },
        { t: ['Suivre le pointeur (*p) mène à la valeur. En JavaScript ou Python, les objets se passent ainsi, par référence, sans qu’on le voie.', 'Following the pointer (*p) leads to the value. In JavaScript or Python, objects are passed this way, by reference, without it showing.'], on: [3, 4, 5, 6, 7, 8], flux: [3] },
      ],
    },

    'langage-mutabilite': {
      k: 'cases',
      alt: ['Un tableau mutable change sur place ; une chaîne immuable ne change jamais, on en crée une autre', 'A mutable array changes in place; an immutable string never changes, a new one is made'],
      rows: [
        { t: ['Mutable : le tableau change sur place', 'Mutable: the array changes in place'], cells: ['[1, 2]', 'a.push(3)', '[1, 2, 3]'], s: ['a', 'warn', 'a'], w: 100, sz: 11 },
        { t: ['Immuable : la chaîne ne change jamais, on en obtient une autre', 'Immutable: the string never changes, you get another one'], cells: ['"ab"', 's.toUpperCase()', '"AB"'], s: ['ok', 'warn', 'v'], w: 104, sz: 10 },
      ],
      l: ['Avec const, c’est le lien qui est figé, pas le tableau : const a = [1]; a.push(2) marche très bien.', 'With const, the binding is frozen, not the array: const a = [1]; a.push(2) works just fine.'],
      anim: [
        { t: ['a.push(3) modifie le tableau lui-même : quiconque tient ce tableau voit maintenant trois éléments.', 'a.push(3) changes the array itself: whoever holds that array now sees three elements.'], on: [0] },
        { t: ['s.toUpperCase() ne touche pas à s : il renvoie une nouvelle chaîne. s vaut toujours "ab".', 's.toUpperCase() does not touch s: it returns a new string. s is still "ab".'], on: [1] },
      ],
    },

    'langage-algorithme': {
      k: 'graphe',
      alt: ['Un algorithme : une entrée, des étapes précises, une sortie — ici, trouver le plus grand nombre', 'An algorithm: an input, precise steps, an output — here, finding the largest number'],
      n: [
        { id: 'i', t: ['Entrée\n[3, 9, 2]', 'Input\n[3, 9, 2]'], c: 0, r: 0.5, s: 'a', w: 76, mono: true, sz: 11 },
        { id: 'a', t: ['Algorithme', 'Algorithm'], sub: ['1. max = premier\n2. si x > max : max = x\n3. renvoyer max', '1. max = first\n2. if x > max: max = x\n3. return max'], c: 1, r: 0.5, s: 'v', w: 150, h: 70 },
        { id: 'o', t: ['Sortie\n9', 'Output\n9'], c: 2, r: 0.5, s: 'ok', w: 70, mono: true, sz: 11 },
      ],
      e: [['i', 'a', '', 'a'], ['a', 'o', '', 'ok']],
      anim: [
        { t: ['L’entrée : une liste de nombres.', 'The input: a list of numbers.'], on: ['i'] },
        { t: ['Des étapes sans ambiguïté, que n’importe qui — ou n’importe quelle machine — peut suivre : on garde le plus grand vu jusqu’ici.', 'Unambiguous steps that anyone — or any machine — can follow: keep the largest seen so far.'], on: ['i', 'a'], flux: [0] },
        { t: ['La sortie : 9. Le même algorithme marche pour mille nombres ; c’est sa complexité qui dit combien de temps.', 'The output: 9. The same algorithm works for a thousand numbers; its complexity says how long.'], on: ['a', 'o'], flux: [1] },
      ],
    },

    'langage-operateur': {
      k: 'cases',
      alt: ['Les opérateurs : arithmétiques, de comparaison, logiques', 'Operators: arithmetic, comparison, logical'],
      rows: [
        { t: ['Arithmétique', 'Arithmetic'], cells: ['+', '-', '*', '/', '%', '**'], s: 'a', cap: [['plus', 'plus'], ['moins', 'minus'], ['fois', 'times'], ['divisé', 'divided'], ['reste', 'remainder'], ['puissance', 'power']], w: 44, sz: 14 },
        { t: ['Comparaison → vrai ou faux', 'Comparison → true or false'], cells: ['===', '!==', '<', '>', '<=', '>='], s: 'v', w: 44, sz: 12 },
        { t: ['Logique', 'Logic'], cells: ['&&', '||', '!'], s: 'ok', cap: [['et', 'and'], ['ou', 'or'], ['non', 'not']], w: 44, sz: 14 },
      ],
      anim: [
        { t: ['7 % 3 vaut 1 : le reste de la division. 2 ** 10 vaut 1024.', '7 % 3 is 1: the remainder of the division. 2 ** 10 is 1024.'], on: [0] },
        { t: ['=== compare valeur et type : 1 === "1" est faux. Préférez-le à ==, qui convertit en douce.', '=== compares value and type: 1 === "1" is false. Prefer it to ==, which quietly converts.'], on: [1] },
        { t: ['a && b : vrai si les deux ; a || b : vrai si l’un des deux ; !a : l’inverse.', 'a && b: true if both; a || b: true if either; !a: the opposite.'], on: [2] },
      ],
    },

  });
})(window);
