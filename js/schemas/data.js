'use strict';
/*
 * Schémas de la catégorie « Données et encodage ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'data-octet': {
      k: 'cases',
      alt: ['Un octet : huit bits, dont chacun vaut une puissance de deux', 'A byte: eight bits, each worth a power of two'],
      rows: [
        { t: ['Un octet = 8 bits', 'A byte = 8 bits'], cells: ['0', '1', '0', '0', '0', '0', '0', '1'], s: ['', 'a', '', '', '', '', '', 'a'], cap: ['128', '64', '32', '16', '8', '4', '2', '1'], w: 38, gap: [3] },
        { sep: ['64 + 1 = 65 = « A » en ASCII', '64 + 1 = 65 = “A” in ASCII'], s: 'a' },
        { t: ['En hexadécimal : deux chiffres', 'In hexadecimal: two digits'], cells: ['4', '1'], s: 'v', w: 44 },
      ],
      anim: [
        { t: ['Deux bits à 1 : celui qui vaut 64 et celui qui vaut 1.', 'Two bits set to 1: the one worth 64 and the one worth 1.'], on: ['r0:1', 'r0:7'] },
        { t: ['64 + 1 = 65. En ASCII, 65 est la lettre A.', '64 + 1 = 65. In ASCII, 65 is the letter A.'], on: [1] },
        { t: ['En hexadécimal, 65 s’écrit 41 : chaque chiffre hexa code quatre bits, un octet tient en deux.', 'In hexadecimal, 65 is written 41: each hex digit encodes four bits, a byte fits in two.'], on: [2] },
      ],
    },

    'data-unites': {
      k: 'cases',
      alt: ['Unités décimales (Ko, Mo, Go) et binaires (Kio, Mio, Gio)', 'Decimal units (KB, MB, GB) and binary units (KiB, MiB, GiB)'],
      rows: [
        { t: ['Décimales (×1000)', 'Decimal (×1000)'], cells: [['1 Ko', '1 KB'], ['1 Mo', '1 MB'], ['1 Go', '1 GB']], s: 'a', cap: ['1 000 o', '1 000 Ko', '1 000 Mo'], w: 98, mono: false, sz: 14 },
        { t: ['Binaires (×1024)', 'Binary (×1024)'], cells: ['1 Kio', '1 Mio', '1 Gio'], s: 'v', cap: ['1 024 o', '1 024 Kio', '1 024 Mio'], w: 98, mono: false, sz: 14 },
      ],
      l: ['À Go égal, l’écart grandit : 1 Gio vaut environ 1,07 Go.', 'The gap grows: 1 GiB is about 1.07 GB.'],
    },

    'data-chunk': {
      k: 'cases',
      alt: ['Un gros fichier découpé en morceaux (chunks) traités un à un', 'A big file cut into chunks processed one at a time'],
      rows: [
        { t: ['Gros fichier découpé', 'Big file, cut up'], cells: ['chunk 1', 'chunk 2', 'chunk 3', 'chunk 4'], s: ['ok', 'a', 'mute', 'mute'], w: 76, mono: false, sz: 12 },
        { sep: ['lus un par un', 'read one by one'] },
        { t: ['En mémoire : un seul chunk à la fois', 'In memory: one chunk at a time'], cells: ['chunk 2'], s: 'a', w: 96, mono: false, sz: 12 },
      ],
      anim: [
        { t: ['Un fichier de plusieurs gigaoctets ne tient pas en mémoire.', 'A file of several gigabytes does not fit in memory.'], on: [0] },
        { t: ['On le lit par morceaux : un chunk à la fois, traité puis oublié.', 'It is read in pieces: one chunk at a time, processed then forgotten.'], on: [1, 2] },
      ],
    },

    'data-buffer': {
      k: 'graphe',
      alt: ['Un tampon absorbe la différence de vitesse entre producteur et consommateur', 'A buffer absorbs the speed difference between producer and consumer'],
      n: [
        { id: 'p', t: ['Producteur\npar à-coups', 'Producer\nin bursts'], c: 0, r: 0, s: 'a', w: 94 },
        { id: 'b', t: ['Buffer\n(tampon)', 'Buffer'], c: 1, r: 0, f: 'db', s: 'warn', w: 90, h: 54 },
        { id: 'c', t: ['Consommateur\nrégulier', 'Consumer\nsteady'], c: 2, r: 0, s: 'ok', w: 100 },
      ],
      e: [['p', 'b', '', 'a'], ['b', 'c', '', 'ok']],
      anim: [
        { t: ['Le producteur envoie par à-coups : beaucoup, puis rien.', 'The producer sends in bursts: a lot, then nothing.'], on: ['p', 'b'], flux: [0] },
        { t: ['Le tampon absorbe : il garde ce qui attend.', 'The buffer absorbs: it holds what is waiting.'], on: ['b'] },
        { t: ['Le consommateur lit à son rythme, régulier. Ni l’un ni l’autre n’attend l’autre.', 'The consumer reads at its own steady pace. Neither waits for the other.'], on: ['b', 'c'], flux: [1] },
      ],
    },

    'data-stream': {
      k: 'graphe',
      alt: ['Un flux transporte des données morceau par morceau, de la source à la destination', 'A stream carries data piece by piece, from source to destination'],
      n: [
        { id: 's', t: 'Source', c: 0, r: 0, f: 'db', s: 'v', w: 86, h: 50 },
        { id: 't', t: ['Traitement', 'Processing'], c: 1, r: 0, s: 'a', w: 90 },
        { id: 'd', t: 'Destination', c: 2, r: 0, s: 'ok', w: 92 },
      ],
      e: [['s', 't', '', 'v'], ['t', 'd', '', 'ok']],
      l: ['Les données circulent morceau par morceau (chunk) : tout n’est jamais en mémoire à la fois.', 'Data flows piece by piece (chunk): it is never all in memory at once.'],
      anim: [
        { t: ['La source émet morceau par morceau.', 'The source emits piece by piece.'], on: ['s', 't'], flux: [0] },
        { t: ['Chaque morceau est traité et transmis sans attendre les suivants : une vidéo commence avant d’être téléchargée.', 'Each piece is processed and passed on without waiting for the next ones: a video starts before it is fully downloaded.'], on: ['t', 'd'], flux: [1] },
      ],
    },

    'data-blob': {
      k: 'graphe',
      alt: ['Un Blob enveloppe des octets bruts avec un type MIME, pour les afficher ou les télécharger', 'A Blob wraps raw bytes with a MIME type, to display or download them'],
      gy: 76,
      n: [
        { id: 'o', t: ['Octets bruts', 'Raw bytes'], c: 0, r: 0.5, s: 'a', w: 94 },
        { id: 'b', t: 'Blob', sub: ['type MIME\n+ taille', 'MIME type\n+ size'], c: 1, r: 0.5, s: 'v', w: 92, h: 58 },
        { id: 'i', t: '<img src=…>', c: 2, r: 0, s: 'ok', w: 96, mono: true, sz: 10 },
        { id: 'a', t: '<a download>', c: 2, r: 1, s: 'ok', w: 96, mono: true, sz: 10 },
      ],
      e: [['o', 'b', '', 'a'], ['b', 'i', '', 'v'], ['b', 'a', '', 'v']],
      l: ['new Blob(octets) puis URL.createObjectURL(blob) donne une adresse temporaire pour l’afficher ou la télécharger.', 'new Blob(bytes) then URL.createObjectURL(blob) gives a temporary address to display or download it.'],
    },

    'data-ascii': {
      k: 'cases',
      alt: ['Quelques caractères ASCII et leur code numérique', 'A few ASCII characters and their numeric code'],
      rows: [
        { t: ['Caractère → code', 'Character → code'], cells: ['A', 'B', 'C', 'a', 'b', '0', '1', '␣'], s: ['a', 'a', 'a', 'v', 'v', 'ok', 'ok', 'mute'], cap: ['65', '66', '67', '97', '98', '48', '49', '32'], w: 38 },
      ],
      l: ['Majuscules à partir de 65, minuscules à partir de 97 : « a » = « A » + 32.', 'Capitals start at 65, lowercase at 97: “a” = “A” + 32.'],
    },

    'data-utf8': {
      k: 'cases',
      alt: ['UTF-8 : un caractère s’écrit sur un à quatre octets', 'UTF-8: a character is written on one to four bytes'],
      rows: [
        { t: ['Caractère', 'Character'], cells: ['A', 'é', '€', '😀'], s: ['a', 'v', 'warn', 'bad'], cap: ['U+0041', 'U+00E9', 'U+20AC', 'U+1F600'], w: 74, sz: 17 },
        { sep: ['UTF-8', 'UTF-8'] },
        { t: ['Octets (hexadécimal)', 'Bytes (hexadecimal)'], cells: ['41', 'C3 A9', 'E2 82 AC', 'F0 9F 98 80'], s: ['a', 'v', 'warn', 'bad'], cap: [['1 octet', '1 byte'], ['2 octets', '2 bytes'], ['3 octets', '3 bytes'], ['4 octets', '4 bytes']], w: 78, sz: 11 },
      ],
      anim: [
        { t: ['A est dans l’ASCII : un seul octet, 41, exactement comme en ASCII.', 'A is in ASCII: a single byte, 41, exactly as in ASCII.'], on: ['r0:0', 'r2:0'] },
        { t: ['é dépasse 127 : deux octets, C3 A9.', 'é goes beyond 127: two bytes, C3 A9.'], on: ['r0:1', 'r2:1'] },
        { t: ['€ en demande trois.', '€ needs three.'], on: ['r0:2', 'r2:2'] },
        { t: ['Un émoji, quatre. UTF-8 s’adapte : le texte anglais reste compact, tout Unicode reste possible.', 'An emoji, four. UTF-8 adapts: English text stays compact, all of Unicode stays possible.'], on: ['r0:3', 'r2:3'] },
      ],
    },

    'data-base64': {
      k: 'cases',
      alt: ['Base64 : trois octets deviennent quatre caractères de six bits', 'Base64: three bytes become four six-bit characters'],
      rows: [
        { t: ['3 octets = 24 bits', '3 bytes = 24 bits'], cells: ['M', 'a', 'n'], s: 'a', cap: ['4D', '61', '6E'], w: 58 },
        { sep: ['regroupés par 6 bits', 'regrouped by 6 bits'] },
        { cells: ['010011', '010110', '000101', '101110'], s: 'v', cap: ['19', '22', '5', '46'], w: 72, sz: 11 },
        { sep: ['table Base64', 'Base64 table'] },
        { t: ['4 caractères', '4 characters'], cells: ['T', 'W', 'F', 'u'], s: 'ok', w: 58 },
      ],
      anim: [
        { t: ['Trois octets : M, a, n — 24 bits.', 'Three bytes: M, a, n — 24 bits.'], on: [0] },
        { t: ['On les redécoupe en quatre paquets de six bits : 19, 22, 5, 46.', 'They are re-cut into four six-bit groups: 19, 22, 5, 46.'], on: [1, 2] },
        { t: ['Chaque nombre de 0 à 63 devient un caractère de la table : TWFu. Quatre caractères pour trois octets : un tiers de plus.', 'Each number from 0 to 63 becomes a character from the table: TWFu. Four characters for three bytes: a third more.'], on: [3, 4] },
      ],
    },

    'data-hexa': {
      k: 'cases',
      alt: ['L’hexadécimal compte de 0 à F : deux chiffres suffisent pour un octet', 'Hexadecimal counts from 0 to F: two digits are enough for a byte'],
      rows: [
        { t: ['Les 16 chiffres', 'The 16 digits'], cells: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'], s: ['', '', '', '', '', '', '', '', '', '', 'a', 'a', 'a', 'a', 'a', 'a'], cap: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'], w: 20, h: 26, sz: 12, gap: [9] },
        { sep: ['un octet = deux chiffres', 'a byte = two digits'] },
        { cells: ['F', 'F'], s: 'v', cap: ['15 × 16', '15'], w: 50 },
        { sep: ['= 255', '= 255'], s: 'ok' },
      ],
      anim: [
        { t: ['Seize chiffres : 0 à 9, puis A à F pour 10 à 15.', 'Sixteen digits: 0 to 9, then A to F for 10 to 15.'], on: [0] },
        { t: ['FF : 15 seizaines et 15 unités.', 'FF: 15 sixteens and 15 units.'], on: [2] },
        { t: ['15 × 16 + 15 = 255, le plus grand octet. Deux chiffres hexa = un octet, toujours.', '15 × 16 + 15 = 255, the largest byte. Two hex digits = one byte, always.'], on: [3] },
      ],
    },

    'data-endian': {
      k: 'cases',
      alt: ['Le nombre 0x12345678 rangé en gros-boutiste et en petit-boutiste', 'The number 0x12345678 laid out as big-endian and little-endian'],
      rows: [
        { t: ['Gros-boutiste (big-endian)', 'Big-endian'], cells: ['12', '34', '56', '78'], s: ['a', '', '', 'ok'], cap: ['adresse 0', '1', '2', '3'], w: 62 },
        { t: ['Petit-boutiste (little-endian)', 'Little-endian'], cells: ['78', '56', '34', '12'], s: ['ok', '', '', 'a'], cap: ['adresse 0', '1', '2', '3'], w: 62 },
      ],
      l: ['En bleu : l’octet de poids fort (12) ; en vert : celui de poids faible (78).', 'In blue: the most significant byte (12); in green: the least significant (78).'],
      anim: [
        { t: ['Gros-boutiste : l’octet de poids fort d’abord, comme on écrit un nombre.', 'Big-endian: the most significant byte first, the way a number is written.'], on: [0] },
        { t: ['Petit-boutiste : l’octet de poids faible d’abord. Les processeurs x86 et ARM font ainsi.', 'Little-endian: the least significant byte first. x86 and ARM processors do this.'], on: [1] },
        { t: ['Même nombre, octets dans l’ordre inverse : un format binaire doit dire lequel il utilise.', 'Same number, bytes in reverse order: a binary format must say which one it uses.'] },
      ],
    },

    'data-json': {
      k: 'arbre',
      alt: ['Un document JSON est un arbre d’objets, de tableaux et de valeurs', 'A JSON document is a tree of objects, arrays and values'],
      racine: {
        t: '{ }', s: 'a', k: [
          { t: 'nom\n"Zoé"', s: 'ok' },
          { t: 'age\n34', s: 'ok' },
          { t: 'langages\n[ ]', s: 'v', k: [{ t: '"js"', s: 'ok' }, { t: '"py"', s: 'ok' }] },
        ],
      },
    },

    'data-serialisation': {
      k: 'graphe',
      alt: ['Sérialiser : transformer un objet en texte pour l’enregistrer ou l’envoyer, puis le reconstruire', 'Serializing: turning an object into text to store or send it, then rebuilding it'],
      gy: 72,
      n: [
        { id: 'o', t: ['Objet\nen mémoire', 'Object\nin memory'], c: 0, r: 0, s: 'a', w: 90 },
        { id: 't', t: ['Texte\nJSON', 'JSON\ntext'], c: 1, r: 0, f: 'file', s: 'v', w: 84 },
        { id: 'd', t: ['Fichier\nou réseau', 'File or\nnetwork'], c: 2, r: 0, s: 'ok', w: 90 },
      ],
      e: [['o', 't', '', 'a'], ['t', 'o', '', 'v dash'], ['t', 'd', '', 'ok']],
      l: ['stringify : objet → texte · parse : texte → objet. Le texte peut alors être écrit ou envoyé.', 'stringify: object → text · parse: text → object. The text can then be written or sent.'],
      anim: [
        { t: ['En mémoire, un objet : des références, des types, propres au langage.', 'In memory, an object: references and types specific to the language.'], on: ['o'] },
        { t: ['JSON.stringify le sérialise : une suite de caractères que n’importe quel programme peut lire.', 'JSON.stringify serializes it: a sequence of characters any program can read.'], on: ['o', 't'], flux: [0] },
        { t: ['Ce texte s’enregistre dans un fichier ou part sur le réseau.', 'That text is saved to a file or sent over the network.'], on: ['t', 'd'], flux: [2] },
        { t: ['À l’arrivée, JSON.parse reconstruit un objet : la désérialisation.', 'On arrival, JSON.parse rebuilds an object: deserialization.'], on: ['t', 'o'], flux: [1] },
      ],
    },

    'data-parsing': {
      k: 'graphe',
      alt: ['Le parsing transforme un texte en une structure exploitable', 'Parsing turns a text into a usable structure'],
      n: [
        { id: 't', t: ['Texte', 'Text'], sub: '{"a":[1,2]}', c: 0, r: 0, f: 'file', s: 'a', w: 100, h: 50 },
        { id: 'p', t: ['Parseur', 'Parser'], c: 1, r: 0, s: 'v', w: 84 },
        { id: 'a', t: ['Objet', 'Object'], sub: 'a → [1, 2]', c: 2, r: 0, s: 'ok', w: 100, h: 50 },
      ],
      e: [['t', 'p', '', 'a'], ['p', 'a', '', 'v']],
      anim: [
        { t: ['Un texte : des caractères, sans structure pour le programme.', 'A text: characters, with no structure for the program.'], on: ['t'] },
        { t: ['Le parseur le lit signe à signe, en suivant la grammaire du format.', 'The parser reads it character by character, following the format’s grammar.'], on: ['t', 'p'], flux: [0] },
        { t: ['Il en sort une structure : des objets, des tableaux, des nombres, que le code peut parcourir.', 'Out comes a structure: objects, arrays, numbers, that the code can walk through.'], on: ['p', 'a'], flux: [1] },
      ],
    },

    'data-flottant': {
      k: 'dessin',
      h: 190,
      alt: ['0,1 + 0,2 ne fait pas exactement 0,3 en flottants, et la structure d’un flottant 64 bits', '0.1 + 0.2 is not exactly 0.3 in floats, and the layout of a 64-bit float'],
      d: [
        ['rect', 8, 14, 46, 28, { s: 'a', t: '0.1', mono: true, sz: 12 }],
        ['text', 66, 32, '+', { sz: 15, b: true }],
        ['rect', 80, 14, 46, 28, { s: 'a', t: '0.2', mono: true, sz: 12 }],
        ['text', 138, 32, '=', { sz: 15, b: true }],
        ['rect', 152, 14, 200, 28, { s: 'bad', t: '0.30000000000000004', mono: true, sz: 12 }],
        ['text', 180, 66, ['presque 0,3, mais pas exactement', 'almost 0.3, but not exactly'], { s: 'bad', sz: 11, b: true }],
        ['text', 8, 104, ['Un flottant 64 bits (IEEE 754)', 'A 64-bit float (IEEE 754)'], { a: 's', sz: 11, b: true, s: 'mute' }],
        ['rect', 8, 114, 12, 30, { s: 'bad' }],
        ['rect', 22, 114, 76, 30, { s: 'warn', t: ['11 bits', '11 bits'], sz: 10.5 }],
        ['rect', 100, 114, 252, 30, { s: 'ok', t: ['52 bits', '52 bits'], sz: 10.5 }],
        ['text', 14, 162, ['signe', 'sign'], { s: 'bad', sz: 10, b: true }],
        ['text', 60, 162, ['exposant', 'exponent'], { s: 'warn', sz: 10, b: true }],
        ['text', 226, 162, ['mantisse (les chiffres)', 'mantissa (the digits)'], { s: 'ok', sz: 10, b: true }],
      ],
    },

    'data-id': {
      k: 'dessin',
      h: 164,
      alt: ['Une table où la colonne id distingue deux personnes de même nom', 'A table where the id column tells apart two people with the same name'],
      d: [
        ['text', 20, 14, ['clé primaire', 'primary key'], { a: 's', s: 'warn', sz: 10, b: true }],
        ['rect', 20, 22, 60, 26, { s: 'warn', t: 'id', mono: true, sz: 11, r: 3 }],
        ['rect', 80, 22, 120, 26, { s: 'a', t: 'nom', mono: true, sz: 11, r: 3 }],
        ['rect', 200, 22, 140, 26, { s: 'a', t: 'ville', mono: true, sz: 11, r: 3 }],
        ['rect', 20, 48, 60, 26, { s: 'mute', t: '1', mono: true, sz: 11, r: 3 }],
        ['rect', 80, 48, 120, 26, { s: 'mute', t: 'Zoé', mono: true, sz: 11, r: 3 }],
        ['rect', 200, 48, 140, 26, { s: 'mute', t: 'Lyon', mono: true, sz: 11, r: 3 }],
        ['rect', 20, 74, 60, 26, { s: 'mute', t: '2', mono: true, sz: 11, r: 3 }],
        ['rect', 80, 74, 120, 26, { s: 'mute', t: 'Léo', mono: true, sz: 11, r: 3 }],
        ['rect', 200, 74, 140, 26, { s: 'mute', t: 'Nice', mono: true, sz: 11, r: 3 }],
        ['rect', 20, 100, 60, 26, { s: 'mute', t: '3', mono: true, sz: 11, r: 3 }],
        ['rect', 80, 100, 120, 26, { s: 'mute', t: 'Zoé', mono: true, sz: 11, r: 3 }],
        ['rect', 200, 100, 140, 26, { s: 'mute', t: 'Lille', mono: true, sz: 11, r: 3 }],
        ['text', 180, 148, ['deux « Zoé », mais des identifiants différents', 'two “Zoé”, but different identifiers'], { sz: 10.5, s: 'mute', b: true }],
      ],
    },

    'data-uuid': {
      k: 'dessin',
      h: 78,
      alt: ['Un UUID : 32 chiffres hexadécimaux en cinq groupes de 8, 4, 4, 4 et 12', 'A UUID: 32 hexadecimal digits in five groups of 8, 4, 4, 4 and 12'],
      d: [
        ['rect', 8, 10, 80, 28, { s: 'a', t: '550e8400', mono: true, sz: 11, r: 4 }],
        ['rect', 92, 10, 44, 28, { s: 'v', t: 'e29b', mono: true, sz: 11, r: 4 }],
        ['rect', 140, 10, 44, 28, { s: 'warn', t: '41d4', mono: true, sz: 11, r: 4 }],
        ['rect', 188, 10, 44, 28, { s: 'v', t: 'a716', mono: true, sz: 11, r: 4 }],
        ['rect', 236, 10, 116, 28, { s: 'a', t: '446655440000', mono: true, sz: 11, r: 4 }],
        ['text', 48, 56, ['8 chiffres', '8 digits'], { s: 'a', sz: 10, b: true }],
        ['text', 114, 56, '4', { s: 'v', sz: 10, b: true }],
        ['text', 162, 56, ['4 · version', '4 · version'], { s: 'warn', sz: 10, b: true }],
        ['text', 210, 56, '4', { s: 'v', sz: 10, b: true }],
        ['text', 294, 56, ['12 chiffres', '12 digits'], { s: 'a', sz: 10, b: true }],
      ],
    },

    'data-compression': {
      k: 'cases',
      alt: ['Compression sans perte : douze caractères répétés deviennent six, et l’original se reconstruit exactement', 'Lossless compression: twelve repeated characters become six, and the original is rebuilt exactly'],
      rows: [
        { t: ['Avant : 12 caractères', 'Before: 12 characters'], cells: ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'C', 'C'], s: ['a', 'a', 'a', 'a', 'v', 'v', 'v', 'ok', 'ok', 'ok', 'ok', 'ok'], w: 24, h: 26, sz: 11 },
        { sep: ['on note les répétitions', 'repetitions are noted'] },
        { t: ['Après : 6 caractères', 'After: 6 characters'], cells: ['4A', '3B', '5C'], s: ['a', 'v', 'ok'], w: 50, sz: 13 },
      ],
      l: ['Sans perte : on retrouve exactement l’original. gzip et zip font cela, en bien plus malin.', 'Lossless: the original comes back exactly. gzip and zip do this, in a much smarter way.'],
      anim: [
        { t: ['Du texte, des fichiers de code, des pages HTML : pleins de répétitions.', 'Text, code files, HTML pages: full of repetitions.'], on: [0] },
        { t: ['Les noter au lieu de les écrire : moitié moins d’octets, et rien de perdu. Avec perte (JPEG, MP3), on jette en plus ce que l’œil ou l’oreille ne remarque pas.', 'Noting them instead of writing them out: half the bytes, and nothing lost. Lossy (JPEG, MP3) also throws away what the eye or ear does not notice.'], on: [1, 2] },
      ],
    },

    'data-csv': {
      k: 'dessin',
      h: 192,
      alt: ['Un fichier CSV et le tableau qu’il représente : une ligne par rangée, une virgule par colonne', 'A CSV file and the table it represents: one line per row, one comma per column'],
      d: [
        ['text', 8, 14, 'notes.csv', { a: 's', mono: true, sz: 10.5, b: true, s: 'a' }],
        ['rect', 8, 22, 344, 64, { s: 'a', r: 6 }],
        ['text', 18, 40, 'nom,ville,age', { a: 's', mono: true, sz: 11 }],
        ['text', 18, 58, 'Zoé,Lyon,34', { a: 's', mono: true, sz: 11 }],
        ['text', 18, 76, '"Léo, Jr",Nice,28', { a: 's', mono: true, sz: 11 }],
        ['line', 180, 92, 180, 110, { s: 'v', arrow: 1 }],
        ['rect', 8, 116, 80, 22, { s: 'v', t: 'nom', mono: true, sz: 10, r: 3 }],
        ['rect', 88, 116, 80, 22, { s: 'v', t: 'ville', mono: true, sz: 10, r: 3 }],
        ['rect', 168, 116, 60, 22, { s: 'v', t: 'age', mono: true, sz: 10, r: 3 }],
        ['rect', 8, 140, 80, 22, { s: 'mute', t: 'Zoé', mono: true, sz: 10, r: 3 }],
        ['rect', 88, 140, 80, 22, { s: 'mute', t: 'Lyon', mono: true, sz: 10, r: 3 }],
        ['rect', 168, 140, 60, 22, { s: 'mute', t: '34', mono: true, sz: 10, r: 3 }],
        ['rect', 8, 164, 80, 22, { s: 'warn', t: 'Léo, Jr', mono: true, sz: 10, r: 3 }],
        ['rect', 88, 164, 80, 22, { s: 'mute', t: 'Nice', mono: true, sz: 10, r: 3 }],
        ['rect', 168, 164, 60, 22, { s: 'mute', t: '28', mono: true, sz: 10, r: 3 }],
        ['text', 244, 152, ['la virgule entre\nguillemets reste\ndans la valeur', 'the comma in\nquotes stays\nin the value'], { a: 's', sz: 9.5, s: 'warn', b: true }],
      ],
      anim: [
        { t: ['La première ligne nomme les colonnes.', 'The first line names the columns.'], on: [0, 1, 2, 6, 7, 8] },
        { t: ['Chaque ligne suivante est une rangée ; chaque virgule sépare une colonne.', 'Each following line is a row; each comma separates a column.'], on: [1, 3, 9, 10, 11], flux: [5] },
        { t: ['Une valeur qui contient une virgule se met entre guillemets. Excel, en français, préfère le point-virgule : vérifiez toujours le séparateur.', 'A value containing a comma goes in quotes. Excel, in French, prefers the semicolon: always check the separator.'], on: [1, 4, 12, 13, 14, 15] },
      ],
    },

    'data-timestamp': {
      k: 'cases',
      alt: ['Un timestamp Unix et sa conversion en date ISO puis en date locale', 'A Unix timestamp and its conversion to an ISO date then a local date'],
      rows: [
        { t: ['Timestamp Unix : secondes depuis le 1er janvier 1970, UTC', 'Unix timestamp: seconds since 1 January 1970, UTC'], cells: ['1700000000'], s: 'a', w: 150, sz: 14 },
        { sep: 'new Date(1700000000 * 1000)', s: 'v' },
        { cells: ['2023-11-14T22:13:20Z'], s: 'ok', w: 200, sz: 13, cap: [['ISO 8601, en UTC (le Z)', 'ISO 8601, in UTC (the Z)']] },
        { cells: [['14 nov. 2023, 23:13 à Paris', '14 Nov 2023, 23:13 in Paris']], s: 'warn', w: 220, sz: 11, mono: false, cap: [['la même seconde, dans un fuseau', 'the same second, in a time zone']] },
      ],
      anim: [
        { t: ['Un seul nombre : facile à stocker, à comparer, à soustraire. Aucun fuseau, aucune ambiguïté.', 'A single number: easy to store, compare, subtract. No time zone, no ambiguity.'], on: [0] },
        { t: ['JavaScript compte en millisecondes : × 1000. En ISO 8601, la même seconde s’écrit avec un Z : UTC.', 'JavaScript counts in milliseconds: × 1000. In ISO 8601, the same second is written with a Z: UTC.'], on: [1, 2] },
        { t: ['Pour l’afficher, on choisit un fuseau : 23:13 à Paris, 17:13 à Montréal. Stockez en UTC, affichez en local.', 'To display it, you pick a time zone: 23:13 in Paris, 17:13 in Montreal. Store in UTC, display in local time.'], on: [3] },
      ],
    },

    'data-encodage': {
      k: 'graphe',
      gy: 66,
      alt: ['Encoder transforme un texte en octets selon une table ; décoder fait l’inverse, avec la même table', 'Encoding turns text into bytes according to a table; decoding does the reverse, with the same table'],
      n: [
        { id: 't', t: ['Texte', 'Text'], sub: '"été"', c: 0, r: 0.5, s: 'a', w: 80, h: 50 },
        { id: 'e', t: ['Encodage', 'Encoding'], sub: 'UTF-8', c: 1, r: 0, s: 'v', w: 90, h: 50 },
        { id: 'd', t: ['Décodage', 'Decoding'], sub: 'UTF-8', c: 1, r: 1, s: 'ok', w: 90, h: 50 },
        { id: 'o', t: ['Octets', 'Bytes'], sub: 'C3 A9 74 C3 A9', c: 2, r: 0.5, s: 'warn', w: 110, h: 50 },
      ],
      e: [['t', 'e', '', 'a'], ['e', 'o', '', 'v'], ['o', 'd', '', 'warn'], ['d', 't', '', 'ok']],
      l: ['Décoder avec la mauvaise table donne « Ã©tÃ© » : le mojibake. Aujourd’hui, UTF-8 partout.', 'Decoding with the wrong table gives “Ã©tÃ©”: mojibake. Today, UTF-8 everywhere.'],
      anim: [
        { t: ['Un ordinateur ne stocke pas des lettres, mais des octets. L’encodage est la table de correspondance.', 'A computer does not store letters, but bytes. The encoding is the lookup table.'], on: ['t', 'e', 'o'], flux: [0, 1] },
        { t: ['« été » en UTF-8 : é prend deux octets, t un seul. Cinq octets pour trois lettres.', '“été” in UTF-8: é takes two bytes, t one. Five bytes for three letters.'], on: ['o'] },
        { t: ['Pour relire, il faut la même table. Avec Latin-1 à la place, les mêmes octets donnent « Ã©tÃ© ».', 'To read it back, the same table is needed. With Latin-1 instead, the same bytes give “Ã©tÃ©”.'], on: ['o', 'd', 't'], flux: [2, 3] },
      ],
    },

    'data-null': {
      k: 'cases',
      alt: ['Quatre « rien » différents : zéro, chaîne vide, null, undefined', 'Four different “nothings”: zero, empty string, null, undefined'],
      rows: [
        { t: ['Quatre « rien » différents', 'Four different “nothings”'], cells: ['0', '""', 'null', 'undefined'], s: ['ok', 'a', 'warn', 'bad'], cap: [['un nombre', 'a number'], ['une chaîne vide', 'an empty string'], ['rien, exprès', 'nothing, on purpose'], ['jamais défini', 'never set']], w: 78, sz: 12 },
      ],
      l: ['typeof null vaut "object" : une erreur historique de JavaScript, gardée pour ne rien casser.', 'typeof null is "object": a historical JavaScript mistake, kept so as not to break anything.'],
      anim: [
        { t: ['0 est un nombre, "" une chaîne : des valeurs vides, mais des valeurs.', '0 is a number, "" a string: empty values, but values.'], on: ['r0:0', 'r0:1'] },
        { t: ['null : « il n’y a rien, et je le dis ». undefined : « personne n’a jamais rien mis là ». Lire une propriété de l’un ou l’autre plante.', 'null: “there is nothing, and I say so”. undefined: “nobody ever put anything there”. Reading a property of either one crashes.'], on: ['r0:2', 'r0:3'] },
      ],
    },

    'data-tableau': {
      k: 'cases',
      alt: ['Un tableau de trois chaînes, numérotées à partir de zéro', 'An array of three strings, numbered from zero'],
      rows: [
        { t: 'const fruits = [ … ]', cells: ['"pomme"', '"poire"', '"kiwi"'], s: 'a', cap: ['0', '1', '2'], w: 90, sz: 12 },
      ],
      l: ['fruits[0] est "pomme" : le premier indice est 0. fruits.length vaut 3 ; le dernier est fruits[2].', 'fruits[0] is "pomme": the first index is 0. fruits.length is 3; the last one is fruits[2].'],
      anim: [
        { t: ['Les valeurs sont rangées dans l’ordre, chacune à une position : son indice.', 'The values are stored in order, each at a position: its index.'], on: [0] },
        { t: ['On compte à partir de zéro : fruits[0] est le premier, fruits[2] le troisième et dernier. fruits[3] n’existe pas : undefined.', 'Counting starts at zero: fruits[0] is the first, fruits[2] the third and last. fruits[3] does not exist: undefined.'], on: ['r0:0', 'r0:2'] },
      ],
    },

    'data-dictionnaire': {
      k: 'cases',
      alt: ['Un dictionnaire : chaque clé donne sa valeur', 'A dictionary: each key leads to its value'],
      rows: [
        { t: ['clé → valeur', 'key → value'], cells: ['"fr"', '→', '"bonjour"'], s: ['a', '', 'ok'], w: 90, sz: 12, espace: 4 },
        { cells: ['"en"', '→', '"hello"'], s: ['a', '', 'ok'], w: 90, sz: 12, espace: 4 },
        { cells: ['"es"', '→', '"hola"'], s: ['a', '', 'ok'], w: 90, sz: 12 },
      ],
      l: ['mots.get("en") → "hello", d’un coup, quelle que soit la taille. Map, dict, objet, table de hachage : même idée.', 'mots.get("en") → "hello", at once, whatever the size. Map, dict, object, hash table: same idea.'],
      anim: [
        { t: ['Pas de position, mais des noms : on demande "en", on obtient "hello".', 'No position, but names: you ask for "en", you get "hello".'], on: [1] },
        { t: ['Chaque clé est unique. Ajouter "en" une seconde fois remplace la valeur au lieu d’en créer une autre.', 'Each key is unique. Adding "en" a second time replaces the value instead of creating another.'], on: [0, 1, 2] },
      ],
    },

    'data-string': {
      k: 'cases',
      alt: ['La chaîne « Lexicode » : huit caractères, numérotés de 0 à 7', 'The string “Lexicode”: eight characters, numbered 0 to 7'],
      rows: [
        { t: ['"Lexicode" : une chaîne de 8 caractères', '"Lexicode": a string of 8 characters'], cells: ['L', 'e', 'x', 'i', 'c', 'o', 'd', 'e'], s: 'a', cap: ['0', '1', '2', '3', '4', '5', '6', '7'], w: 34, sz: 14 },
      ],
      l: ['s[0] → "L" · s.length → 8 · s.toUpperCase() → une nouvelle chaîne ; l’originale ne change jamais.', 's[0] → "L" · s.length → 8 · s.toUpperCase() → a new string; the original never changes.'],
      anim: [
        { t: ['Une chaîne est une suite de caractères, chacun à une position à partir de 0.', 'A string is a sequence of characters, each at a position starting from 0.'], on: [0] },
        { t: ['s[0] est "L", s[7] est le dernier "e". Attention : un émoji peut compter pour deux positions.', 's[0] is "L", s[7] is the last "e". Beware: an emoji may count as two positions.'], on: ['r0:0', 'r0:7'] },
      ],
    },

    'data-xml': {
      k: 'arbre',
      alt: ['Un document XML est un arbre de balises imbriquées', 'An XML document is a tree of nested tags'],
      racine: {
        t: '<livre>', s: 'a', k: [
          { t: '<titre>', s: 'v', k: [{ t: '"Dune"', s: 'ok' }] },
          { t: '<auteur>', s: 'v', k: [{ t: '"Herbert"', s: 'ok' }] },
          { t: '<annee>', s: 'v', k: [{ t: '1965', s: 'ok' }] },
        ],
      },
      l: ['Chaque balise s’ouvre et se ferme : <titre>Dune</titre>. Plus bavard que JSON, mais avec des attributs et des schémas.', 'Each tag opens and closes: <titre>Dune</titre>. Wordier than JSON, but with attributes and schemas.'],
      anim: [
        { t: ['Une balise racine contient tout le reste.', 'A root tag contains everything else.'], on: ['n0'] },
        { t: ['Des balises imbriquées, et du texte à l’intérieur : la même idée d’arbre que le HTML, avec des noms libres.', 'Nested tags, with text inside: the same tree idea as HTML, with free names.'], on: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'] },
      ],
    },

    'data-yaml': {
      k: 'dessin',
      h: 128,
      alt: ['Le même document en YAML, fondé sur l’indentation, et en JSON, fondé sur les accolades', 'The same document in YAML, based on indentation, and in JSON, based on braces'],
      d: [
        ['text', 8, 14, 'config.yaml', { a: 's', mono: true, sz: 10.5, b: true, s: 'a' }],
        ['rect', 8, 22, 160, 96, { s: 'a', r: 6 }],
        ['text', 18, 40, 'nom: lexicode', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 56, 'langues:', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 72, '  - fr', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 88, '  - en', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 104, 'hors_ligne: true', { a: 's', mono: true, sz: 10.5 }],
        ['text', 180, 76, '=', { sz: 18, b: true, s: 'mute' }],
        ['text', 192, 14, ['en JSON', 'in JSON'], { a: 's', sz: 10.5, b: true, s: 'v' }],
        ['rect', 192, 22, 160, 96, { s: 'v', r: 6 }],
        ['text', 202, 40, '{ "nom": "lexicode",', { a: 's', mono: true, sz: 9.5 }],
        ['text', 202, 56, '  "langues":', { a: 's', mono: true, sz: 9.5 }],
        ['text', 202, 72, '    ["fr", "en"],', { a: 's', mono: true, sz: 9.5 }],
        ['text', 202, 88, '  "hors_ligne": true }', { a: 's', mono: true, sz: 9.5 }],
      ],
      anim: [
        { t: ['YAML : l’indentation fait la structure. Deux espaces, jamais de tabulation ; un tiret par élément de liste.', 'YAML: indentation makes the structure. Two spaces, never a tab; a dash per list item.'], on: [0, 1, 2, 3, 4, 5, 6] },
        { t: ['Le même document en JSON : plus d’accolades et de guillemets, mais aucune ambiguïté. YAML pour la configuration, JSON pour les échanges.', 'The same document in JSON: more braces and quotes, but no ambiguity. YAML for configuration, JSON for exchanges.'], on: [7, 8, 9, 10, 11, 12, 13] },
      ],
    },

    'data-bom': {
      k: 'cases',
      alt: ['Les trois premiers octets d’un fichier UTF-8 avec BOM, invisibles, avant le texte', 'The first three bytes of a UTF-8 file with a BOM, invisible, before the text'],
      rows: [
        { t: ['Un fichier UTF-8 « avec BOM »', 'A UTF-8 file “with BOM”'], cells: ['EF', 'BB', 'BF', '48', '69'], s: ['warn', 'warn', 'warn', 'a', 'a'], cap: [['BOM', 'BOM'], ['(invisible)', '(invisible)'], '', 'H', 'i'], w: 52, sz: 13 },
      ],
      l: ['Un script qui commence par un BOM : sa première ligne « #!/bin/bash » n’est plus reconnue. Enregistrez en « UTF-8 sans BOM ».', 'A script starting with a BOM: its first line “#!/bin/bash” is no longer recognized. Save as “UTF-8 without BOM”.'],
      anim: [
        { t: ['Trois octets que l’éditeur n’affiche pas, mais qui sont bien dans le fichier.', 'Three bytes the editor does not display, but which are really in the file.'], on: ['r0:0', 'r0:1', 'r0:2'] },
        { t: ['Le texte ne commence qu’après. Un programme qui lit le fichier octet par octet tombe d’abord sur eux : « caractère inattendu ».', 'The text only starts after them. A program reading the file byte by byte hits them first: “unexpected character”.'], on: ['r0:3', 'r0:4'] },
      ],
    },

    'data-mime': {
      k: 'cases',
      alt: ['Un type MIME : un type, une barre, un sous-type, et quelques exemples', 'A MIME type: a type, a slash, a subtype, and a few examples'],
      rows: [
        { cells: ['text', '/', 'html'], s: ['a', '', 'v'], cap: [['type', 'type'], '', ['sous-type', 'subtype']], w: 80, sz: 13 },
        { sep: ['d’autres exemples', 'other examples'], s: 'mute' },
        { cells: ['image/png', 'application/json', 'text/css'], s: ['ok', 'ok', 'ok'], w: 108, sz: 10.5 },
      ],
      l: ['L’en-tête Content-Type porte ce type : le navigateur sait s’il doit afficher une image ou exécuter un script.', 'The Content-Type header carries that type: the browser knows whether to display an image or run a script.'],
      anim: [
        { t: ['Une grande famille (texte, image, application), puis le format précis.', 'A broad family (text, image, application), then the exact format.'], on: [0] },
        { t: ['Le navigateur se fie à ce type, pas à l’extension du fichier. Un .png servi en text/html s’affiche comme du texte.', 'The browser trusts that type, not the file extension. A .png served as text/html shows up as text.'], on: [2] },
      ],
    },

  });
})(window);
