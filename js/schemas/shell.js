'use strict';
/*
 * Schémas de la catégorie « Terminal et shell » (et du saut de ligne, qui en
 * est voisin). Voir js/schema.js pour le vocabulaire des figures.
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'shell-terminal': {
      k: 'pile',
      alt: ['Les étages traversés par une commande tapée dans un terminal', 'The layers a command typed in a terminal goes through'],
      piles: [{
        t: ['Ce qui se passe quand vous tapez une commande ↓', 'What happens when you type a command ↓'],
        layers: [
          { t: ['Vous', 'You'], d: ['tapez « git status »', 'type “git status”'], s: 'a' },
          { t: ['Terminal', 'Terminal'], d: ['la fenêtre : affiche et transmet le texte', 'the window: displays and forwards the text'], s: 'info' },
          { t: ['Shell', 'Shell'], d: ['Bash, Zsh, PowerShell : comprend la commande', 'Bash, Zsh, PowerShell: understands the command'], s: 'v' },
          { t: ['Programme', 'Program'], d: ['git, npm, ls : fait le travail', 'git, npm, ls: does the work'], s: 'ok' },
          { t: ['Système d’exploitation', 'Operating system'], d: ['fichiers, réseau, mémoire', 'files, network, memory'], s: 'mute' },
        ],
      }],
      anim: [
        { t: ['Vous tapez « git status » et Entrée.', 'You type “git status” and press Enter.'], on: [0] },
        { t: ['Le terminal, la fenêtre, affiche vos lettres et transmet la ligne.', 'The terminal, the window, displays your letters and forwards the line.'], on: [1] },
        { t: ['Le shell la comprend : un programme à lancer, git, avec un argument, status.', 'The shell understands it: a program to run, git, with one argument, status.'], on: [2] },
        { t: ['Le programme fait le travail…', 'The program does the work…'], on: [3] },
        { t: ['…en demandant au système d’exploitation de lire les fichiers. Le résultat remonte jusqu’à l’écran.', '…asking the operating system to read the files. The result goes back up to the screen.'], on: [4] },
      ],
    },

    'shell-commande': {
      k: 'dessin',
      h: 104,
      alt: ['Anatomie d’une commande : programme, sous-commande, option, valeur', 'Anatomy of a command: program, subcommand, option, value'],
      d: [
        ['rect', 8, 10, 56, 30, { s: 'a', t: 'git', mono: true, sz: 13 }],
        ['rect', 72, 10, 82, 30, { s: 'v', t: 'commit', mono: true, sz: 13 }],
        ['rect', 162, 10, 44, 30, { s: 'warn', t: '-m', mono: true, sz: 13 }],
        ['rect', 214, 10, 138, 30, { s: 'ok', t: '"Correction"', mono: true, sz: 13 }],
        ['text', 36, 60, ['programme', 'program'], { s: 'a', sz: 10.5, b: true }],
        ['text', 113, 60, ['sous-commande', 'subcommand'], { s: 'v', sz: 10.5, b: true }],
        ['text', 184, 78, ['option', 'option'], { s: 'warn', sz: 10.5, b: true }],
        ['text', 283, 60, ['valeur de l’option', 'the option’s value'], { s: 'ok', sz: 10.5, b: true }],
        ['line', 36, 42, 36, 50, { s: 'a' }],
        ['line', 113, 42, 113, 50, { s: 'v' }],
        ['line', 184, 42, 184, 68, { s: 'warn' }],
        ['line', 283, 42, 283, 50, { s: 'ok' }],
      ],
      anim: [
        { t: ['Le programme : ce qui est lancé.', 'The program: what gets run.'], on: [0, 4, 8] },
        { t: ['La sous-commande : ce que le programme doit faire.', 'The subcommand: what the program must do.'], on: [1, 5, 9] },
        { t: ['Une option, introduite par un tiret, qui modifie le comportement.', 'An option, introduced by a dash, that changes the behavior.'], on: [2, 6, 10] },
        { t: ['La valeur que l’option attend : ici le message, entre guillemets parce qu’il contient une espace.', 'The value the option expects: here the message, in quotes because it contains a space.'], on: [3, 7, 11] },
      ],
    },

    'shell-flux': {
      k: 'graphe',
      alt: ['Les trois flux d’un programme : entrée, sortie et erreurs', 'A program’s three streams: input, output and errors'],
      gy: 62,
      n: [
        { id: 'i', t: 'stdin (0)', sub: ['clavier\nou fichier', 'keyboard\nor file'], c: 0, r: 0.5, s: 'a', w: 96, h: 58, mono: true, sz: 10.5 },
        { id: 'p', t: ['Programme', 'Program'], c: 1, r: 0.5, s: 'v', w: 78, sz: 11 },
        { id: 'o', t: 'stdout (1)', sub: ['écran\nou fichier', 'screen\nor file'], c: 2, r: 0, s: 'ok', w: 96, h: 58, mono: true, sz: 10.5 },
        { id: 'e', t: 'stderr (2)', sub: ['écran\nou fichier', 'screen\nor file'], c: 2, r: 1, s: 'bad', w: 96, h: 58, mono: true, sz: 10.5 },
      ],
      e: [['i', 'p', '<', 'a'], ['p', 'o', '>', 'ok'], ['p', 'e', '2>', 'bad']],
      l: ['Les chevrons redirigent chaque flux vers un fichier : « < » lit, « > » écrit, « 2> » écrit les erreurs.', 'The chevrons redirect each stream to a file: “<” reads, “>” writes, “2>” writes the errors.'],
      anim: [
        { t: ['Le programme lit sur l’entrée standard (stdin, 0) : le clavier, ou un fichier avec « < ».', 'The program reads from standard input (stdin, 0): the keyboard, or a file with “<”.'], on: ['i', 'p'], flux: [0] },
        { t: ['Il écrit ses résultats sur la sortie standard (stdout, 1) : l’écran, ou un fichier avec « > ».', 'It writes its results to standard output (stdout, 1): the screen, or a file with “>”.'], on: ['p', 'o'], flux: [1] },
        { t: ['Ses erreurs partent sur un flux à part (stderr, 2) : elles ne se mélangent pas aux résultats. « 2> » les capte.', 'Its errors go to a separate stream (stderr, 2): they do not mix with the results. “2>” catches them.'], on: ['p', 'e'], flux: [2] },
      ],
    },

    'shell-pipe': {
      k: 'graphe',
      alt: ['Un tube relie la sortie d’une commande à l’entrée de la suivante', 'A pipe connects one command’s output to the next command’s input'],
      gy: 70,
      n: [
        { id: 'a', t: 'cat\njournal.txt', c: 0, r: 0, s: 'a', mono: true, w: 82, sz: 10.5 },
        { id: 'b', t: 'grep\nERREUR', c: 1, r: 0, s: 'v', mono: true, w: 82, sz: 10.5 },
        { id: 'c', t: 'sort', c: 2, r: 0, s: 'ok', mono: true, w: 82, sz: 10.5 },
      ],
      e: [['a', 'b', '|', 'a'], ['b', 'c', '|', 'v']],
      l: ['Chaque commande lit le texte produit par la précédente : lire, filtrer, trier.', 'Each command reads the text produced by the previous one: read, filter, sort.'],
      anim: [
        { t: ['cat lit le journal et l’écrit sur sa sortie.', 'cat reads the log and writes it to its output.'], on: ['a'] },
        { t: ['Le tube « | » branche cette sortie sur l’entrée de grep, qui ne garde que les lignes contenant ERREUR.', 'The pipe “|” plugs that output into grep’s input, which keeps only the lines containing ERREUR.'], on: ['a', 'b'], flux: [0] },
        { t: ['Un second tube passe ces lignes à sort. Trois petits programmes, une chaîne.', 'A second pipe passes those lines to sort. Three small programs, one chain.'], on: ['b', 'c'], flux: [1] },
      ],
    },

    'shell-env': {
      k: 'graphe',
      alt: ['Une variable d’environnement est héritée par les programmes lancés', 'An environment variable is inherited by the programs launched'],
      gy: 70,
      n: [
        { id: 's', t: 'Shell', sub: 'API_URL=https://…', c: 0, r: 0, s: 'a', w: 118, h: 50 },
        { id: 'p', t: ['Programme lancé', 'Launched program'], sub: 'API_URL=https://…', c: 1, r: 0, s: 'ok', w: 118, h: 50 },
        { id: 'q', t: ['Autre shell', 'Another shell'], sub: 'API_URL absente', c: 0, r: 1, s: 'mute', w: 118, h: 50 },
      ],
      e: [['s', 'p', ['copie', 'copy'], 'ok'], ['s', 'q', ['ne se propage pas', 'does not propagate'], 'mute dash']],
      anim: [
        { t: ['Dans ce shell, vous avez défini API_URL.', 'In this shell, you defined API_URL.'], on: ['s'] },
        { t: ['Chaque programme lancé depuis ce shell en reçoit une copie.', 'Every program launched from this shell receives a copy of it.'], on: ['s', 'p'], flux: [0] },
        { t: ['Un autre terminal ne la voit pas : une variable d’environnement vit dans son shell et dans ses enfants.', 'Another terminal does not see it: an environment variable lives in its shell and in its children.'], on: ['s', 'q'], flux: [1] },
      ],
    },

    'shell-path': {
      k: 'pile',
      alt: ['Le shell cherche un programme dans les dossiers de PATH, dans l’ordre', 'The shell looks for a program in the PATH folders, in order'],
      piles: [{
        t: ['Vous tapez « git » : le shell parcourt PATH', 'You type “git”: the shell walks through PATH'],
        layers: [
          { t: '/usr/local/bin', d: ['git absent → on continue', 'no git here → keep going'], s: 'mute', mono: true },
          { t: '/usr/bin', d: ['git trouvé → il est exécuté', 'git found → it is run'], s: 'ok', mono: true },
          { t: '/bin', d: ['jamais consulté', 'never looked at'], s: 'mute', mono: true },
        ],
      }],
      anim: [
        { t: ['Vous tapez « git ». Le shell regarde dans le premier dossier de PATH : rien.', 'You type “git”. The shell looks in the first PATH folder: nothing.'], on: [0] },
        { t: ['Deuxième dossier : git est là. Le shell le lance et s’arrête de chercher.', 'Second folder: git is there. The shell runs it and stops searching.'], on: [1] },
        { t: ['Les dossiers suivants ne sont jamais consultés. « command not found » veut dire : aucun dossier de PATH ne le contient.', 'The following folders are never looked at. “command not found” means: no PATH folder contains it.'], on: [2] },
      ],
    },

    'shell-chemins': {
      k: 'arbre',
      mode: 'liste',
      alt: ['Un chemin absolu part de la racine ; un chemin relatif part du dossier courant', 'An absolute path starts at the root; a relative path starts at the current folder'],
      racine: {
        t: '/', d: true, c: ['racine', 'root'], k: [{
          t: 'home/', d: true, k: [{
            t: 'moi/', d: true, c: ['~ = dossier personnel', '~ = home folder'], k: [
              {
                t: 'projets/', d: true, k: [
                  { t: 'app/', d: true, c: ['. = dossier courant', '. = current folder'], k: [{ t: 'notes.txt', c: ['./notes.txt', './notes.txt'], cs: 'ok' }] },
                  { t: 'blog/', d: true, c: ['../blog', '../blog'] },
                ],
              },
            ],
          }],
        }],
      },
    },

    'shell-chmod': {
      k: 'cases',
      alt: ['Les droits d’un fichier : propriétaire, groupe, autres, chacun r, w, x', 'A file’s permissions: owner, group, others, each r, w, x'],
      l: ['754 : le propriétaire fait tout (4+2+1), le groupe lit et exécute (4+1), les autres lisent (4).', '754: the owner can do everything (4+2+1), the group reads and runs (4+1), others read (4).'],
      rows: [
        { t: 'chmod 754 script.sh', cells: ['rwx', 'r-x', 'r--'], s: ['ok', 'a', 'warn'], cap: [['propriétaire', 'owner'], ['groupe', 'group'], ['autres', 'others']], w: 96, sz: 15 },
        { sep: '' },
        { cells: ['7', '5', '4'], s: ['ok', 'a', 'warn'], cap: ['4 + 2 + 1', '4 + 0 + 1', '4 + 0 + 0'], w: 96, sz: 17 },
      ],
    },

    'shell-slash': {
      k: 'dessin',
      h: 146,
      alt: ['Slash, antislash et commande slash', 'Slash, backslash and slash command'],
      d: [
        ['circ', 30, 30, 18, { s: 'a', t: '/', mono: true, sz: 20 }],
        ['text', 62, 26, ['slash', 'slash'], { a: 's', b: true, sz: 12.5 }],
        ['text', 62, 42, ['chemins Unix · URL · Git', 'Unix paths · URLs · Git'], { a: 's', s: 'mute', sz: 10.5 }],
        ['circ', 30, 78, 18, { s: 'warn', t: '\\', mono: true, sz: 20 }],
        ['text', 62, 74, ['antislash (backslash)', 'backslash'], { a: 's', b: true, sz: 12.5 }],
        ['text', 62, 90, ['chemins Windows · échappement', 'Windows paths · escaping'], { a: 's', s: 'mute', sz: 10.5 }],
        ['circ', 30, 126, 18, { s: 'v', t: '/x', mono: true, sz: 12 }],
        ['text', 62, 122, ['commande slash', 'slash command'], { a: 's', b: true, sz: 12.5 }],
        ['text', 62, 138, ['/help · /clear dans un outil ou une conversation', '/help · /clear in a tool or a chat'], { a: 's', s: 'mute', sz: 10.5 }],
      ],
    },

    'data-saut-de-ligne': {
      k: 'cases',
      alt: ['Deux façons de marquer une fin de ligne : LF (Unix) et CRLF (Windows)', 'Two ways to mark an end of line: LF (Unix) and CRLF (Windows)'],
      rows: [
        { t: ['Unix, macOS : LF', 'Unix, macOS: LF'], cells: ['H', 'i', 'LF', '!'], s: ['', '', 'a', ''], cap: ['48', '69', '0A', '21'], w: 54 },
        { t: ['Windows : CRLF', 'Windows: CRLF'], cells: ['H', 'i', 'CR', 'LF', '!'], s: ['', '', 'warn', 'a', ''], cap: ['48', '69', '0D', '0A', '21'], w: 54 },
      ],
      l: ['Le second saut de ligne prend deux octets : la même ligne n’a pas les mêmes octets.', 'The second line ending takes two bytes: the same line does not have the same bytes.'],
      anim: [
        { t: ['Sous Unix et macOS, une ligne finit par un seul octet : LF (0A).', 'On Unix and macOS, a line ends with a single byte: LF (0A).'], on: [0] },
        { t: ['Sous Windows, par deux : CR (0D) puis LF (0A). Le même texte n’a pas les mêmes octets.', 'On Windows, with two: CR (0D) then LF (0A). The same text does not have the same bytes.'], on: [1] },
        { t: ['Git peut convertir à la volée (core.autocrlf, .gitattributes) pour que personne ne voie la convention de l’autre.', 'Git can convert on the fly (core.autocrlf, .gitattributes) so that nobody sees the other’s convention.'], on: ['r0:2', 'r1:2', 'r1:3'] },
      ],
    },

    'shell-code-sortie': {
      k: 'graphe',
      gy: 64,
      alt: ['Le code de sortie d’une commande : 0 pour réussi, autre chose pour échec ; && et || enchaînent selon ce code', 'A command’s exit code: 0 for success, anything else for failure; && and || chain according to that code'],
      n: [
        { id: 'c', t: ['commande', 'command'], c: 0, r: 0.5, s: 'a', w: 90, mono: true, sz: 11 },
        { id: 'z', t: ['0 : réussi', '0: success'], c: 1, r: 0, s: 'ok', w: 96 },
        { id: 'n', t: ['≠ 0 : échec', '≠ 0: failure'], c: 1, r: 1, s: 'bad', w: 96 },
        { id: 'a2', t: ['&& la suivante', '&& the next one'], c: 2, r: 0, s: 'ok', w: 110, mono: true, sz: 10.5 },
        { id: 'b2', t: ['|| la suivante', '|| the next one'], c: 2, r: 1, s: 'bad', w: 110, mono: true, sz: 10.5 },
      ],
      e: [['c', 'z', '', 'ok'], ['c', 'n', '', 'bad'], ['z', 'a2', '', 'ok'], ['n', 'b2', '', 'bad']],
      l: ['echo $? affiche le code de la dernière commande. make && ./app : lancer seulement si la construction a réussi.', 'echo $? prints the last command’s code. make && ./app: run only if the build succeeded.'],
      anim: [
        { t: ['Chaque commande se termine par un nombre. 0 : tout s’est bien passé.', 'Every command ends with a number. 0: all went well.'], on: ['c', 'z'], flux: [0] },
        { t: ['Autre chose : une erreur, et le nombre dit souvent laquelle (1 générique, 2 mauvais usage, 127 commande introuvable).', 'Anything else: an error, and the number often says which (1 generic, 2 misuse, 127 command not found).'], on: ['c', 'n'], flux: [1] },
        { t: ['a && b lance b seulement si a a réussi ; a || b, seulement si a a échoué. Un script avec set -e s’arrête au premier échec.', 'a && b runs b only if a succeeded; a || b, only if a failed. A script with set -e stops at the first failure.'], on: ['z', 'a2', 'n', 'b2'], flux: [2, 3] },
      ],
    },

    'shell-cron': {
      k: 'cases',
      alt: ['Une ligne de crontab : cinq champs de temps, puis la commande', 'A crontab line: five time fields, then the command'],
      rows: [
        { t: ['Cinq champs, puis la commande', 'Five fields, then the command'], cells: ['30', '6', '*', '*', '1-5'], s: ['a', 'a', 'mute', 'mute', 'v'], cap: [['minute', 'minute'], ['heure', 'hour'], ['jour', 'day'], ['mois', 'month'], ['jour de\nsemaine', 'weekday']], w: 52, sz: 14 },
        { cells: ['/usr/bin/sauvegarde.sh'], s: 'ok', w: 200, sz: 11 },
      ],
      l: ['« À 6 h 30, du lundi au vendredi, lance la sauvegarde. » * = n’importe lequel.', '“At 6:30, Monday to Friday, run the backup.” * = any.'],
      anim: [
        { t: ['30 6 : à la minute 30 de l’heure 6, soit 6 h 30.', '30 6: at minute 30 of hour 6, that is 6:30.'], on: ['r0:0', 'r0:1'] },
        { t: ['* * : n’importe quel jour du mois, n’importe quel mois.', '* *: any day of the month, any month.'], on: ['r0:2', 'r0:3'] },
        { t: ['1-5 : du lundi au vendredi (0 ou 7 = dimanche). Puis la commande, avec son chemin complet : cron n’a pas votre PATH.', '1-5: Monday to Friday (0 or 7 = Sunday). Then the command, with its full path: cron does not have your PATH.'], on: ['r0:4', 1] },
      ],
    },

    'shell-curl': {
      k: 'sequence',
      lh: 44,
      alt: ['curl envoie une requête HTTP depuis le terminal et affiche la réponse', 'curl sends an HTTP request from the terminal and prints the response'],
      a: ['curl', ['Serveur', 'Server']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'GET https://api.exemple.org/notes'],
        [1, 0, '200 OK + JSON', 'ok dash'],
        [0, 0, ['affiche le corps, ou -o fichier', 'prints the body, or -o file'], 'mute'],
        [0, 1, 'POST … -d \'{"a":1}\' -H "Content-Type: application/json"', 'a'],
        [1, 0, '201 Created', 'ok dash'],
      ],
      anim: [
        { t: ['curl adresse : une requête GET, comme le ferait un navigateur, mais sans rien afficher d’autre que la réponse brute.', 'curl address: a GET request, as a browser would, but showing nothing but the raw response.'], flux: [0, 1], on: [2] },
        { t: ['Avec -X, -d et -H, on choisit la méthode, le corps et les en-têtes : l’outil idéal pour essayer une API. -i montre aussi les en-têtes reçus.', 'With -X, -d and -H, you pick the method, the body and the headers: the ideal tool to try an API. -i also shows the headers received.'], flux: [3, 4] },
      ],
    },

    'shell-glob': {
      k: 'cases',
      alt: ['Trois motifs glob et les fichiers qu’ils désignent ou non', 'Three glob patterns and the files they match or not'],
      rows: [
        { t: ['*.txt — n’importe quelle suite, puis .txt', '*.txt — any sequence, then .txt'], cells: ['notes.txt', 'a.txt', 'todo.md'], s: ['ok', 'ok', 'mute'], w: 90, sz: 10.5 },
        { t: ['img-?.png — exactement un caractère', 'img-?.png — exactly one character'], cells: ['img-1.png', 'img-12.png', 'img-a.png'], s: ['ok', 'mute', 'ok'], w: 90, sz: 10 },
        { t: ['**/*.js — dans tous les sous-dossiers', '**/*.js — in every subfolder'], cells: ['app.js', 'src/a.js', 'src/x/b.js'], s: ['ok', 'ok', 'ok'], w: 90, sz: 10 },
      ],
      anim: [
        { t: ['* remplace n’importe quoi, même rien : notes.txt et a.txt, mais pas todo.md.', '* stands for anything, even nothing: notes.txt and a.txt, but not todo.md.'], on: [0] },
        { t: ['? remplace exactement un caractère : img-12.png en a deux, il est exclu.', '? stands for exactly one character: img-12.png has two, it is left out.'], on: [1] },
        { t: ['** descend dans les sous-dossiers. C’est le shell qui développe le motif, avant même que la commande le voie.', '** goes down into subfolders. The shell expands the pattern, before the command even sees it.'], on: [2] },
      ],
    },

    'shell-grep': {
      k: 'dessin',
      h: 184,
      alt: ['grep ERREUR ne garde que les lignes du journal qui contiennent ce mot', 'grep ERREUR keeps only the log lines that contain that word'],
      d: [
        ['text', 8, 14, 'journal.txt', { a: 's', mono: true, sz: 10.5, b: true, s: 'mute' }],
        ['rect', 8, 22, 344, 76, { s: 'mute', r: 6 }],
        ['text', 18, 40, '10:01 INFO   démarrage', { a: 's', mono: true, sz: 10 }],
        ['text', 18, 56, '10:02 ERREUR fichier introuvable', { a: 's', mono: true, sz: 10, s: 'bad', b: true }],
        ['text', 18, 72, '10:03 INFO   requête reçue', { a: 's', mono: true, sz: 10 }],
        ['text', 18, 88, '10:04 ERREUR délai dépassé', { a: 's', mono: true, sz: 10, s: 'bad', b: true }],
        ['line', 180, 104, 180, 124, { s: 'a', arrow: 1 }],
        ['text', 196, 118, 'grep ERREUR journal.txt', { a: 's', mono: true, sz: 10.5, s: 'a', b: true }],
        ['rect', 8, 130, 344, 44, { s: 'ok', r: 6 }],
        ['text', 18, 148, '10:02 ERREUR fichier introuvable', { a: 's', mono: true, sz: 10, b: true }],
        ['text', 18, 164, '10:04 ERREUR délai dépassé', { a: 's', mono: true, sz: 10, b: true }],
      ],
      anim: [
        { t: ['Un journal de mille lignes. Seules celles qui contiennent ERREUR vous intéressent.', 'A thousand-line log. Only the lines containing ERREUR matter to you.'], on: [0, 1, 2, 3, 4, 5] },
        { t: ['grep lit ligne par ligne et n’affiche que celles où le motif apparaît. -i ignore la casse, -n numérote, -r cherche dans un dossier.', 'grep reads line by line and prints only those where the pattern appears. -i ignores case, -n numbers, -r searches a folder.'], on: [6, 7, 8, 9, 10], flux: [6] },
      ],
    },

    'shell-heredoc': {
      k: 'dessin',
      h: 136,
      alt: ['Un heredoc : les lignes entre les deux EOF sont envoyées telles quelles à la commande', 'A heredoc: the lines between the two EOFs are sent as is to the command'],
      d: [
        ['rect', 8, 8, 200, 96, { s: 'a', r: 6 }],
        ['text', 18, 26, "cat > config.txt <<'EOF'", { a: 's', mono: true, sz: 10.5, b: true }],
        ['text', 18, 46, 'nom=lexicode', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 64, 'langue=fr', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 84, 'EOF', { a: 's', mono: true, sz: 10.5, b: true, s: 'a' }],
        ['line', 214, 56, 250, 56, { s: 'a', arrow: 1 }],
        ['rect', 256, 30, 96, 52, { s: 'ok', f: 'file', t: 'config.txt', mono: true, sz: 10 }],
        ['text', 180, 124, ['Entre les deux EOF, le texte est pris tel quel, lignes et guillemets compris.', 'Between the two EOFs, the text is taken as is, lines and quotes included.'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['<<\'EOF\' annonce : « ce qui suit, jusqu’au mot EOF seul sur sa ligne, est l’entrée de la commande ».', '<<\'EOF\' announces: “what follows, up to the word EOF alone on its line, is the command’s input”.'], on: [0, 1, 4] },
        { t: ['Les lignes sont écrites dans config.txt sans échappement ni concaténation. Avec EOF sans guillemets, $variables seraient remplacées.', 'The lines are written to config.txt with no escaping or concatenation. With EOF unquoted, $variables would be substituted.'], on: [0, 2, 3, 5, 6, 7], flux: [5] },
      ],
    },

    'shell-processus': {
      k: 'arbre',
      alt: ['Les processus forment un arbre : le système lance un terminal, qui lance un shell, qui lance des programmes', 'Processes form a tree: the system starts a terminal, which starts a shell, which starts programs'],
      racine: {
        t: 'systemd\nPID 1', s: 'mute', k: [{
          t: 'terminal', s: 'a', k: [{
            t: 'bash\nPID 2140', s: 'v', k: [{ t: 'node\nPID 2203', s: 'ok' }, { t: 'git\nPID 2217', s: 'ok' }],
          }],
        }],
      },
      l: ['Chaque processus a un parent et un numéro (PID). ps et top les listent ; kill PID en arrête un.', 'Each process has a parent and a number (PID). ps and top list them; kill PID stops one.'],
      anim: [
        { t: ['Au démarrage, un premier processus (PID 1) lance tous les autres.', 'At boot, a first process (PID 1) starts all the others.'], on: ['n0'] },
        { t: ['Vous ouvrez un terminal, qui lance un shell : chacun est un processus, enfant du précédent.', 'You open a terminal, which starts a shell: each is a process, child of the previous one.'], on: ['n0', 'n1', 'n2'] },
        { t: ['Chaque commande tapée devient un processus enfant du shell, avec sa mémoire à lui. Il meurt, le shell reprend la main.', 'Each typed command becomes a child process of the shell, with its own memory. It dies, the shell takes over again.'], on: ['n2', 'n3', 'n4'], flux: ['n3', 'n4'] },
      ],
    },

    'shell-script': {
      k: 'dessin',
      h: 146,
      alt: ['Un script shell : un shebang en première ligne, des commandes, puis chmod +x et ./deploy.sh pour le lancer', 'A shell script: a shebang on the first line, commands, then chmod +x and ./deploy.sh to run it'],
      d: [
        ['rect', 8, 8, 190, 112, { s: 'a', r: 6 }],
        ['text', 18, 26, '#!/bin/bash', { a: 's', mono: true, sz: 10.5, b: true, s: 'v' }],
        ['text', 18, 44, 'set -e', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 62, 'npm test', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 80, 'npm run build', { a: 's', mono: true, sz: 10.5 }],
        ['text', 18, 98, 'echo "Prêt."', { a: 's', mono: true, sz: 10.5 }],
        ['text', 103, 134, 'deploy.sh', { mono: true, sz: 10, s: 'mute' }],
        ['text', 278, 40, 'chmod +x deploy.sh', { mono: true, sz: 10, s: 'warn', b: true }],
        ['text', 278, 58, ['le rendre exécutable', 'make it executable'], { sz: 9.5, s: 'mute' }],
        ['text', 278, 92, './deploy.sh', { mono: true, sz: 10.5, s: 'ok', b: true }],
        ['text', 278, 110, ['le lancer : les commandes\ns’exécutent dans l’ordre', 'run it: the commands\nrun in order'], { sz: 9.5, s: 'mute' }],
      ],
      anim: [
        { t: ['La première ligne, le shebang, dit avec quel programme lire le fichier : ici bash.', 'The first line, the shebang, says which program should read the file: bash here.'], on: [0, 1, 6] },
        { t: ['Puis des commandes, comme tapées au clavier. set -e : s’arrêter dès que l’une échoue.', 'Then commands, as if typed at the keyboard. set -e: stop as soon as one fails.'], on: [0, 2, 3, 4, 5] },
        { t: ['chmod +x le rend exécutable ; ./deploy.sh le lance. Un script, c’est une suite de commandes qu’on n’a plus à retaper.', 'chmod +x makes it executable; ./deploy.sh runs it. A script is a sequence of commands you never have to retype.'], on: [7, 8, 9, 10] },
      ],
    },

    'shell-ssh': {
      k: 'sequence',
      lh: 42,
      alt: ['ssh : vérification du serveur, preuve par clé privée, puis un shell chiffré sur la machine distante', 'ssh: server check, proof with the private key, then an encrypted shell on the remote machine'],
      a: [['Votre ordinateur', 'Your computer'], ['Serveur distant', 'Remote server']],
      s: ['a', 'v'],
      m: [
        [0, 1, 'ssh zoe@serveur.exemple.org'],
        [1, 0, ['clé publique du serveur', 'server’s public key'], 'dash'],
        [0, 0, ['déjà connue ? (known_hosts)', 'already known? (known_hosts)'], 'warn'],
        [0, 1, ['preuve par votre clé privée', 'proof with your private key'], 'a'],
        [1, 0, ['shell ouvert, chiffré', 'shell opened, encrypted'], 'ok dash'],
        [0, 1, ['vos commandes…', 'your commands…'], 'ok'],
      ],
      anim: [
        { t: ['Vous demandez un shell sur une autre machine, par le réseau.', 'You ask for a shell on another machine, over the network.'], flux: [0] },
        { t: ['Le serveur se présente avec sa clé publique. La première fois, vous confirmez ; ensuite, elle est connue, et un changement serait suspect.', 'The server introduces itself with its public key. The first time, you confirm; afterwards, it is known, and a change would be suspicious.'], flux: [1], on: [2] },
        { t: ['Vous prouvez qui vous êtes avec votre clé privée, qui ne quitte jamais votre ordinateur. Plus sûr qu’un mot de passe.', 'You prove who you are with your private key, which never leaves your computer. Safer than a password.'], flux: [3] },
        { t: ['Un shell s’ouvre là-bas ; tout ce que vous tapez voyage chiffré. scp et rsync empruntent le même tunnel pour copier des fichiers.', 'A shell opens over there; everything you type travels encrypted. scp and rsync use the same tunnel to copy files.'], flux: [4, 5] },
      ],
    },

    'shell-sudo': {
      k: 'graphe',
      alt: ['sudo vérifie votre mot de passe et vos droits, puis lance une seule commande avec les pouvoirs de root', 'sudo checks your password and your rights, then runs a single command with root’s powers'],
      n: [
        { id: 'u', t: ['Vous\n(utilisateur)', 'You\n(user)'], c: 0, r: 0.5, s: 'a', w: 90 },
        { id: 's', t: 'sudo', sub: ['mot de passe ?\nautorisé ?', 'password?\nallowed?'], c: 1, r: 0.5, f: 'diam', s: 'warn', w: 116, h: 70, mono: true },
        { id: 'r', t: ['Commande\navec les droits root', 'Command\nwith root rights'], c: 2, r: 0.5, s: 'bad', w: 108, sz: 10.5 },
      ],
      e: [['u', 's', 'sudo apt install …', 'a'], ['s', 'r', '', 'bad']],
      l: ['root peut tout, y compris casser le système : sudo pour une commande, jamais pour tout.', 'root can do anything, including breaking the system: sudo for one command, never for everything.'],
      anim: [
        { t: ['Installer un logiciel pour toute la machine demande les droits de root. Vous n’êtes pas root.', 'Installing software for the whole machine requires root’s rights. You are not root.'], on: ['u', 's'], flux: [0] },
        { t: ['sudo demande votre mot de passe, vérifie que vous êtes sur la liste des gens autorisés, note l’action dans un journal…', 'sudo asks for your password, checks that you are on the list of allowed people, logs the action…'], on: ['s'] },
        { t: ['…et lance cette commande-là, et elle seule, avec tous les pouvoirs. La suivante repart avec vos droits ordinaires.', '…and runs that command, and only it, with full powers. The next one goes back to your ordinary rights.'], on: ['s', 'r'], flux: [1] },
      ],
    },

    'shell-echappement': {
      k: 'cases',
      alt: ['Trois échappements : un guillemet dans une chaîne, une espace dans un nom de fichier, des guillemets simples ou doubles', 'Three escapes: a quote inside a string, a space in a file name, single or double quotes'],
      rows: [
        { t: ['echo "Il a dit \\"salut\\""', 'echo "He said \\"hi\\""'], cells: ['\\"'], s: 'a', w: 60, sz: 14, cap: [['le guillemet ne ferme plus la chaîne', 'the quote no longer closes the string']] },
        { t: 'ls mon\\ fichier.txt', cells: ['\\ '], s: 'v', w: 60, sz: 14, cap: [['l’espace ne sépare plus deux arguments', 'the space no longer separates two arguments']] },
        { t: ['echo \'$HOME\' et echo "$HOME"', 'echo \'$HOME\' and echo "$HOME"'], cells: ['\'…\'', '"…"'], s: ['ok', 'warn'], w: 60, sz: 14, cap: [['rien n’est interprété', 'nothing is interpreted'], ['$HOME est remplacé', '$HOME is replaced']] },
      ],
      anim: [
        { t: ['Un antislash devant un signe spécial lui retire son sens : le guillemet devient un simple caractère.', 'A backslash before a special character strips its meaning: the quote becomes a plain character.'], on: [0] },
        { t: ['Même chose pour l’espace : sans antislash, le shell verrait deux fichiers, « mon » et « fichier.txt ».', 'Same for the space: without the backslash, the shell would see two files, “mon” and “fichier.txt”.'], on: [1] },
        { t: ['Entre guillemets simples, rien n’est interprété ; entre doubles, les $variables le sont encore. Les simples sont les plus sûrs pour du texte brut.', 'In single quotes, nothing is interpreted; in double quotes, $variables still are. Single quotes are the safest for raw text.'], on: [2] },
      ],
    },

  });
})(window);
