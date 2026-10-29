'use strict';
/*
 * Schémas de la catégorie « Images et couleurs ».
 *
 * Quelques figures ont pour sujet une couleur elle-même (RGB, HSL, contraste) :
 * la palette du thème ne peut pas les représenter, elles posent donc de vraies
 * couleurs par l'option `fill`.
 */
(function (racine) {

  /* Une grille de carrés, tirée d'un dessin en texte : X plein, . vide. */
  function grille(motif, x0, y0, cote, plein, vide) {
    const formes = [];
    motif.forEach((ligne, r) => {
      ligne.split('').forEach((signe, i) => {
        formes.push(['rect', x0 + i * cote, y0 + r * cote, cote - 2, cote - 2, { s: signe === 'X' ? plein : vide, r: 2 }]);
      });
    });
    return formes;
  }

  const hsl = (h, s, l) => 'hsl(' + h + ' ' + s + '% ' + l + '%)';
  function nuancier(y, etiquette, valeurs, fabrique) {
    const formes = [['text', 8, y + 17, etiquette, { a: 's', sz: 11, b: true, s: 'mute' }]];
    valeurs.forEach((v, i) => {
      formes.push(['rect', 92 + i * 44, y, 38, 26, { fill: fabrique(v), r: 4 }]);
      formes.push(['text', 111 + i * 44, y + 40, String(v), { sz: 9.5, mono: true, s: 'mute' }]);
    });
    return formes;
  }

  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'image-pixels': {
      k: 'dessin',
      h: 178,
      alt: ['Une image est une grille de pixels : ici, la lettre A en 8 par 5 pixels', 'An image is a grid of pixels: here, the letter A in 8 by 5 pixels'],
      d: grille(['..XXXX..', '.X....X.', '.XXXXXX.', '.X....X.', '.X....X.'], 76, 10, 26, 'a', 'mute').concat([
        ['text', 180, 156, ['chaque carré est un pixel : une seule couleur', 'each square is a pixel: a single color'], { sz: 11, s: 'mute', b: true }],
        ['text', 180, 172, 'rgb(36, 87, 214)', { sz: 10, mono: true, s: 'a' }],
      ]),
    },

    'image-densite': {
      k: 'dessin',
      h: 176,
      alt: ['Sur un écran 2×, la même largeur de 4 pixels CSS compte 8 pixels réels', 'On a 2× screen, the same 4-CSS-pixel width holds 8 real pixels'],
      d: [
        ['text', 8, 14, ['Écran 1× : 4 pixels CSS = 4 pixels réels', '1× screen: 4 CSS pixels = 4 real pixels'], { a: 's', sz: 11, b: true, s: 'a', max: 344 }],
      ].concat([0, 1, 2, 3].map((i) => ['rect', 30 + i * 78, 24, 74, 36, { s: 'a', r: 3 }]))
        .concat([['text', 8, 88, ['Écran 2× : mêmes 4 pixels CSS = 8 pixels réels', '2× screen: same 4 CSS pixels = 8 real pixels'], { a: 's', sz: 11, b: true, s: 'ok', max: 344 }]])
        .concat([0, 1, 2, 3, 4, 5, 6, 7].map((i) => ['rect', 30 + i * 39, 98, 35, 36, { s: 'ok', r: 3 }]))
        .concat([['text', 180, 162, ['Une image de 100 px CSS demande 200 px pour rester nette.', 'A 100 CSS px image needs 200 px to stay sharp.'], { sz: 10.5, s: 'mute', b: true }]]),
    },

    'image-rgb': {
      k: 'dessin',
      h: 168,
      alt: ['Synthèse additive : le rouge, le vert et le bleu se combinent en jaune, cyan, magenta et blanc', 'Additive mixing: red, green and blue combine into yellow, cyan, magenta and white'],
      d: [
        ['circ', 110, 58, 46, { fill: '#e5484d', fo: 0.62 }],
        ['circ', 170, 58, 46, { fill: '#30a46c', fo: 0.62 }],
        ['circ', 140, 106, 46, { fill: '#3e63dd', fo: 0.62 }],
        ['text', 84, 40, 'R', { sz: 15, b: true }],
        ['text', 196, 40, 'G', { sz: 15, b: true }],
        ['text', 140, 138, 'B', { sz: 15, b: true }],
        ['text', 140, 78, ['blanc', 'white'], { sz: 10, b: true }],
        ['text', 288, 30, 'R + G', { a: 'e', mono: true, sz: 10.5 }],
        ['text', 296, 30, ['= jaune', '= yellow'], { a: 's', sz: 10.5, b: true }],
        ['text', 288, 52, 'G + B', { a: 'e', mono: true, sz: 10.5 }],
        ['text', 296, 52, '= cyan', { a: 's', sz: 10.5, b: true }],
        ['text', 288, 74, 'R + B', { a: 'e', mono: true, sz: 10.5 }],
        ['text', 296, 74, ['= magenta', '= magenta'], { a: 's', sz: 10.5, b: true }],
        ['text', 288, 96, 'R + G + B', { a: 'e', mono: true, sz: 10.5 }],
        ['text', 296, 96, ['= blanc', '= white'], { a: 's', sz: 10.5, b: true }],
        ['text', 200, 158, 'rgb(255, 255, 255)', { sz: 10, mono: true, s: 'mute' }],
      ],
    },

    'image-srgb': {
      k: 'dessin',
      h: 186,
      alt: ['Schéma simplifié : le gamut sRGB est plus petit que Display P3, lui-même plus petit que Rec. 2020, tous contenus dans les couleurs visibles', 'Simplified diagram: the sRGB gamut is smaller than Display P3, itself smaller than Rec. 2020, all within the visible colors'],
      d: [
        ['path', 'M96,120 C70,70 100,26 168,22 C236,18 290,52 298,96 C302,124 250,142 190,144 C150,146 110,140 96,120 Z', { s: 'mute', dash: 1 }],
        ['text', 300, 18, ['couleurs visibles', 'visible colors'], { a: 'e', sz: 10, s: 'mute', b: true }],
        ['poly', [112, 124, 160, 34, 282, 104], { s: 'info' }],
        ['poly', [128, 118, 166, 50, 252, 104], { s: 'v' }],
        ['poly', [146, 112, 172, 70, 222, 102], { s: 'a' }],
        ['rect', 30, 160, 10, 10, { s: 'a' }],
        ['text', 46, 170, 'sRGB', { a: 's', sz: 10.5, b: true }],
        ['rect', 116, 160, 10, 10, { s: 'v' }],
        ['text', 132, 170, 'Display P3', { a: 's', sz: 10.5, b: true }],
        ['rect', 226, 160, 10, 10, { s: 'info' }],
        ['text', 242, 170, 'Rec. 2020', { a: 's', sz: 10.5, b: true }],
      ],
    },

    'image-alpha': {
      k: 'dessin',
      h: 150,
      alt: ['Le même disque bleu avec trois opacités : 1, 0,5 et 0,15, devant un damier', 'The same blue disc at three opacities: 1, 0.5 and 0.15, in front of a checkerboard'],
      d: [0, 1, 2].flatMap((i) => {
        const x0 = 20 + i * 115;
        const alpha = [1, 0.5, 0.15][i];
        return [
          ['rect', x0, 12, 45, 45, { fill: '#cfcfd6', r: 0 }],
          ['rect', x0 + 45, 12, 45, 45, { fill: '#f6f6f8', r: 0 }],
          ['rect', x0, 57, 45, 45, { fill: '#f6f6f8', r: 0 }],
          ['rect', x0 + 45, 57, 45, 45, { fill: '#cfcfd6', r: 0 }],
          ['circ', x0 + 45, 57, 32, { fill: '#3e63dd', fo: alpha }],
          ['text', x0 + 45, 122, ['alpha = ' + String(alpha).replace('.', ','), 'alpha = ' + alpha], { mono: true, sz: 10.5, b: true }],
          ['text', x0 + 45, 138, [['opaque', 'opaque'], ['à moitié', 'half'], ['presque invisible', 'nearly invisible']][i], { sz: 10, s: 'mute' }],
        ];
      }),
    },

    'image-formats': {
      k: 'dessin',
      h: 178,
      alt: ['Poids relatif d’une même photo selon le format : PNG, JPEG, WebP, AVIF', 'Relative weight of the same photo depending on the format: PNG, JPEG, WebP, AVIF'],
      d: [
        ['text', 8, 32, 'PNG', { a: 's', mono: true, sz: 12, b: true }],
        ['rect', 62, 16, 280, 28, { s: 'bad', t: '100 %', r: 4 }],
        ['text', 8, 72, 'JPEG', { a: 's', mono: true, sz: 12, b: true }],
        ['rect', 62, 56, 112, 28, { s: 'warn', t: '≈ 40 %', r: 4 }],
        ['text', 8, 112, 'WebP', { a: 's', mono: true, sz: 12, b: true }],
        ['rect', 62, 96, 80, 28, { s: 'ok', t: '≈ 28 %', r: 4 }],
        ['text', 8, 152, 'AVIF', { a: 's', mono: true, sz: 12, b: true }],
        ['rect', 62, 136, 58, 28, { s: 'a', t: '≈ 20 %', r: 4 }],
        ['text', 190, 72, ['photo, avec perte', 'photo, lossy'], { a: 's', sz: 10, s: 'mute' }],
        ['text', 156, 112, ['avec ou sans perte, transparence', 'lossy or lossless, transparency'], { a: 's', sz: 10, s: 'mute' }],
        ['text', 134, 152, ['le plus récent, encodage plus lent', 'the newest, slower to encode'], { a: 's', sz: 10, s: 'mute' }],
      ],
      l: ['Ordre de grandeur pour une même photo : les chiffres varient selon l’image et la qualité choisie.', 'Order of magnitude for the same photo: the figures vary with the image and the chosen quality.'],
    },

    'image-vectoriel': {
      k: 'dessin',
      h: 176,
      alt: ['Agrandi, un disque matriciel montre ses pixels ; un disque vectoriel reste net', 'Enlarged, a raster disc shows its pixels; a vector disc stays sharp'],
      d: grille(['...XXX...', '.XXXXXXX.', '.XXXXXXX.', 'XXXXXXXXX', 'XXXXXXXXX', 'XXXXXXXXX', '.XXXXXXX.', '.XXXXXXX.', '...XXX...'], 24, 14, 14, 'a', 'n').concat([
        ['line', 180, 10, 180, 136, { s: 'g', dash: 1 }],
        ['circ', 270, 74, 56, { s: 'a' }],
        ['text', 84, 158, ['matriciel : les pixels se voient', 'raster: the pixels show'], { sz: 10.5, b: true, s: 'mute' }],
        ['text', 270, 158, ['vectoriel : reste net', 'vector: stays sharp'], { sz: 10.5, b: true, s: 'mute' }],
      ]),
    },

    'image-maskable': {
      k: 'dessin',
      h: 200,
      alt: ['Une icône maskable : le fond couvre tout, le motif reste dans la zone de sécurité, le système découpe', 'A maskable icon: the background covers everything, the motif stays in the safe zone, the system cuts'],
      d: [
        ['rect', 105, 8, 150, 150, { s: 'a', r: 4 }],
        ['circ', 180, 83, 75, { s: 'mute', dash: 1 }],
        ['circ', 180, 83, 60, { s: 'ok', dash: 1 }],
        ['text', 180, 90, '{ }', { mono: true, sz: 28, b: true, s: 'a' }],
        ['text', 8, 24, ['le système peut\ndécouper en cercle', 'the system may\ncut to a circle'], { a: 's', sz: 10, s: 'mute', b: true }],
        ['line', 78, 34, 116, 34, { s: 'mute', arrow: 1 }],
        ['text', 352, 24, ['zone de sécurité\n(80 %)', 'safe zone\n(80%)'], { a: 'e', sz: 10, s: 'ok', b: true }],
        ['line', 282, 34, 240, 46, { s: 'ok', arrow: 1 }],
        ['text', 180, 182, ['Le fond va jusqu’aux bords ; tout le motif tient dans le cercle vert.', 'The background reaches the edges; the whole motif fits within the green circle.'], { sz: 10, s: 'mute', max: 340 }],
      ],
    },

    'image-hsl': {
      k: 'dessin',
      h: 178,
      alt: ['Trois curseurs HSL : la teinte, la saturation et la luminosité', 'Three HSL sliders: hue, saturation and lightness'],
      d: nuancier(8, ['Teinte', 'Hue'], [0, 60, 120, 180, 240, 300], (h) => hsl(h, 70, 50))
        .concat(nuancier(70, ['Saturation', 'Saturation'], [0, 25, 50, 75, 100], (s) => hsl(220, s, 50)))
        .concat(nuancier(132, ['Luminosité', 'Lightness'], [90, 70, 50, 30, 10], (l) => hsl(220, 70, l))),
    },

    'image-contraste': {
      k: 'dessin',
      h: 128,
      alt: ['Trois textes sur fond : un contraste très bon, la limite de 4,5:1, et un contraste insuffisant', 'Three texts on a background: very good contrast, the 4.5:1 limit, and insufficient contrast'],
      d: [
        ['rect', 6, 10, 108, 54, { fill: '#16213e', t: ['Lisible', 'Readable'], ts: 'blanc', sz: 14 }],
        ['rect', 126, 10, 108, 54, { fill: '#ffffff', t: ['Limite', 'Limit'], ts: 'gris', sz: 14 }],
        ['rect', 246, 10, 108, 54, { fill: '#ffffff', t: ['Pâle', 'Pale'], ts: 'pale', sz: 14 }],
        ['text', 60, 84, '16 : 1', { mono: true, sz: 13, b: true, s: 'ok' }],
        ['text', 60, 102, '✓', { sz: 14, b: true, s: 'ok' }],
        ['text', 180, 84, '4,5 : 1', { mono: true, sz: 13, b: true, s: 'warn' }],
        ['text', 180, 102, ['minimum WCAG', 'WCAG minimum'], { sz: 10, b: true, s: 'warn' }],
        ['text', 300, 84, '1,7 : 1', { mono: true, sz: 13, b: true, s: 'bad' }],
        ['text', 300, 102, '✗', { sz: 14, b: true, s: 'bad' }],
      ],
    },

    'image-hex': {
      k: 'cases',
      alt: ['Une couleur hexadécimale découpée en rouge, vert, bleu, et sa forme rgb()', 'A hexadecimal color split into red, green, blue, and its rgb() form'],
      rows: [
        { t: '#2457d6', cells: ['24', '57', 'd6'], s: ['bad', 'ok', 'a'], cap: [['rouge : 36', 'red: 36'], ['vert : 87', 'green: 87'], ['bleu : 214', 'blue: 214']], w: 70, sz: 16 },
        { sep: '= rgb(36, 87, 214)', s: 'a' },
        { cells: ['#fff', '#ffffff'], s: ['mute', 'mute'], w: 90, sz: 13, cap: [['forme courte', 'short form'], ['= blanc', '= white']] },
      ],
      anim: [
        { t: ['Six chiffres hexadécimaux : deux par composante, de 00 (rien) à ff (255, le maximum).', 'Six hexadecimal digits: two per component, from 00 (none) to ff (255, the maximum).'], on: [0] },
        { t: ['24 = 36 de rouge, 57 = 87 de vert, d6 = 214 de bleu : un bleu franc. #fff abrège #ffffff, le blanc.', '24 = 36 red, 57 = 87 green, d6 = 214 blue: a strong blue. #fff abbreviates #ffffff, white.'], on: [1, 2] },
      ],
    },

    'image-exif': {
      k: 'arbre',
      mode: 'liste',
      alt: ['Les métadonnées EXIF d’une photo : date, appareil, orientation, position GPS', 'A photo’s EXIF metadata: date, camera, orientation, GPS position'],
      racine: {
        t: 'photo.jpg', d: true, k: [
          { t: 'Date', c: '2024-06-12 14:03' },
          { t: ['Appareil', 'Camera'], c: 'Pixel 8' },
          { t: 'Orientation', c: ['6 : à tourner de 90°', '6: rotate by 90°'] },
          { t: 'GPS', c: ['45.76, 4.83 — à retirer avant de publier', '45.76, 4.83 — strip before publishing'], cs: 'bad' },
        ],
      },
      anim: [
        { t: ['L’appareil écrit dans le fichier ce qu’il sait : quand, avec quoi, dans quel sens tenir l’image.', 'The camera writes into the file what it knows: when, with what, which way up the picture goes.'], on: ['n0', 'n1', 'n2', 'n3'] },
        { t: ['Et souvent où. Une photo publiée telle quelle dit où vous habitez. Les réseaux sociaux effacent les EXIF ; un site perso, pas forcément.', 'And often where. A photo published as is says where you live. Social networks strip EXIF; a personal site, not necessarily.'], on: ['n4'] },
      ],
    },

    'image-gif': {
      k: 'dessin',
      h: 140,
      animDur: 700,
      alt: ['Un GIF animé : quatre images affichées l’une après l’autre, en boucle', 'An animated GIF: four frames shown one after the other, in a loop'],
      d: [
        ['rect', 14, 20, 70, 70, { s: 'mute', r: 6 }],
        ['circ', 49, 40, 10, { s: 'a' }],
        ['rect', 98, 20, 70, 70, { s: 'mute', r: 6 }],
        ['circ', 133, 60, 10, { s: 'a' }],
        ['rect', 182, 20, 70, 70, { s: 'mute', r: 6 }],
        ['circ', 217, 78, 10, { s: 'a' }],
        ['rect', 266, 20, 70, 70, { s: 'mute', r: 6 }],
        ['circ', 301, 60, 10, { s: 'a' }],
        ['text', 49, 108, ['image 1', 'frame 1'], { sz: 9.5, s: 'mute' }],
        ['text', 133, 108, ['image 2', 'frame 2'], { sz: 9.5, s: 'mute' }],
        ['text', 217, 108, ['image 3', 'frame 3'], { sz: 9.5, s: 'mute' }],
        ['text', 301, 108, ['image 4', 'frame 4'], { sz: 9.5, s: 'mute' }],
        ['text', 180, 130, ['100 ms par image, en boucle · 256 couleurs par image, pas plus', '100 ms per frame, looping · 256 colors per frame, no more'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['Image 1 : la balle en haut.', 'Frame 1: the ball at the top.'], on: [0, 1, 8] },
        { t: ['Image 2 : elle descend.', 'Frame 2: it comes down.'], on: [2, 3, 9] },
        { t: ['Image 3 : elle touche le sol.', 'Frame 3: it hits the ground.'], on: [4, 5, 10] },
        { t: ['Image 4 : elle remonte. Puis on recommence : lisez l’animation en boucle, c’est un GIF.', 'Frame 4: it bounces back up. Then it starts over: play the animation on a loop, that is a GIF.'], on: [6, 7, 11, 12] },
      ],
    },

    'image-ratio': {
      k: 'dessin',
      h: 176,
      alt: ['Quatre rapports largeur sur hauteur, à hauteur égale : 16:9, 4:3, 9:16 et 1:1', 'Four width-to-height ratios, at equal height: 16:9, 4:3, 9:16 and 1:1'],
      d: [
        ['rect', 8, 20, 160, 90, { s: 'a', t: '16:9', sz: 12 }],
        ['rect', 176, 20, 120, 90, { s: 'v', t: '4:3', sz: 12 }],
        ['rect', 302, 20, 50, 90, { s: 'warn', t: '9:16', sz: 10 }],
        ['rect', 8, 124, 45, 45, { s: 'ok', t: '1:1', sz: 10 }],
        ['text', 66, 140, ['Même hauteur, largeurs différentes. 16:9 = 1,78 (écrans, vidéo) · 4:3 = 1,33 · 1:1 = carré · 9:16 = vertical (téléphone).', 'Same height, different widths. 16:9 = 1.78 (screens, video) · 4:3 = 1.33 · 1:1 = square · 9:16 = vertical (phone).'], { a: 's', sz: 9.5, s: 'mute', max: 286 }],
      ],
      anim: [
        { t: ['16:9 : seize unités de large pour neuf de haut. Les écrans, la vidéo.', '16:9: sixteen units wide for nine high. Screens, video.'], on: [0] },
        { t: ['4:3 : plus carré, l’ancienne télévision. 1:1 : le carré, les avatars.', '4:3: squarer, the old television. 1:1: the square, avatars.'], on: [1, 3] },
        { t: ['9:16 : le 16:9 tourné, le téléphone tenu droit. Recadrer sans respecter le rapport, c’est déformer.', '9:16: the 16:9 turned round, the phone held upright. Cropping without keeping the ratio means distorting.'], on: [2, 4] },
      ],
    },

    'image-resolution': {
      k: 'cases',
      alt: ['La résolution d’une image : largeur fois hauteur en pixels, et la densité pour l’impression ou l’écran', 'An image’s resolution: width times height in pixels, and the density for print or screen'],
      rows: [
        { t: ['Largeur × hauteur', 'Width × height'], cells: ['1080', '×', '1920'], s: ['a', '', 'a'], w: 80, sz: 14, cap: [['pixels de large', 'pixels wide'], '', ['pixels de haut', 'pixels high']] },
        { sep: ['= 2 073 600 pixels (2 mégapixels)', '= 2,073,600 pixels (2 megapixels)'], s: 'ok' },
        { cells: [['300 ppp pour imprimer', '300 ppi for print'], ['72–96 ppp à l’écran', '72–96 ppi on screen']], s: ['v', 'v'], w: 150, sz: 10.5, mono: false },
      ],
      anim: [
        { t: ['Une image de 1080 par 1920 pixels : deux millions de points, chacun avec sa couleur.', 'An image of 1080 by 1920 pixels: two million dots, each with its color.'], on: [0, 1] },
        { t: ['La même image imprimée à 300 points par pouce fait 9 cm de large ; à l’écran, ce sont les pixels qui comptent, pas les centimètres.', 'The same image printed at 300 dots per inch is 9 cm wide; on screen, pixels count, not centimeters.'], on: [2] },
      ],
    },

  });
})(window);
