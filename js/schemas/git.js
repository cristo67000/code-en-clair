'use strict';
/*
 * Schémas de la catégorie « Git et GitHub ».
 *
 * Chaque entrée est la description d'une figure, dessinée par js/schema.js.
 * Voir l'en-tête de ce fichier pour le vocabulaire : `t` est un titre ou un
 * texte, `l` une légende, `alt` la description pour les lecteurs d'écran ; un
 * texte est une chaîne ou un couple [français, anglais].
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'git-zones': {
      k: 'graphe',
      alt: ['Les quatre zones de Git : dossier de travail, index, dépôt local, dépôt distant', 'The four areas of Git: working tree, index, local repository, remote repository'],
      l: ['Une modification traverse les zones dans l’ordre : add, commit, push.', 'A change moves through the areas in order: add, commit, push.'],
      n: [
        { id: 'w', t: ['Dossier de travail', 'Working tree'], c: 0, r: 0, f: 'file', s: 'warn', w: 112 },
        { id: 'i', t: ['Index\n(zone d’attente)', 'Index\n(staging area)'], c: 1, r: 0, s: 'a', w: 112 },
        { id: 'l', t: ['Dépôt local', 'Local repo'], c: 1, r: 1, f: 'db', s: 'ok', w: 112, h: 50 },
        { id: 'd', t: ['Dépôt distant', 'Remote repo'], c: 1, r: 2, f: 'cloud', s: 'v', w: 112, h: 54 },
      ],
      e: [
        ['w', 'i', 'git add', 'a'],
        ['i', 'l', 'git commit', 'a'],
        ['l', 'd', 'git push', 'v'],
        ['d', 'l', 'git fetch', 'v dash'],
      ],
      g: [{ t: ['Votre ordinateur', 'Your computer'], ids: ['w', 'i', 'l'] }],
      anim: [
        { t: ['Vous modifiez un fichier : la modification n’existe que dans votre dossier de travail.', 'You change a file: the change exists only in your working tree.'], on: ['w'] },
        { t: ['git add copie la modification dans l’index, la zone d’attente du prochain commit.', 'git add copies the change into the index, the waiting area of the next commit.'], on: ['w', 'i'], flux: [0] },
        { t: ['git commit enregistre le contenu de l’index dans le dépôt local, avec un message et une date.', 'git commit records the index’s content into the local repository, with a message and a date.'], on: ['i', 'l'], flux: [1] },
        { t: ['git push envoie vos nouveaux commits au dépôt distant : les autres peuvent les voir.', 'git push sends your new commits to the remote repository: others can now see them.'], on: ['l', 'd'], flux: [2] },
        { t: ['git fetch fait le chemin inverse : il rapatrie ce que les autres ont poussé, sans toucher à vos fichiers.', 'git fetch goes the other way: it brings in what others pushed, without touching your files.'], on: ['d', 'l'], flux: [3] },
      ],
    },

    'git-clone': {
      k: 'graphe',
      alt: ['Cloner : copier un dépôt distant sur son ordinateur', 'Cloning: copying a remote repository to your computer'],
      n: [
        { id: 'd', t: ['Dépôt distant\n(GitHub)', 'Remote repo\n(GitHub)'], c: 0, r: 0, f: 'cloud', s: 'v', w: 120, h: 56 },
        { id: 'l', t: ['Copie locale\n(dossier .git)', 'Local copy\n(.git folder)'], c: 1, r: 0, f: 'db', s: 'ok', w: 120, h: 62 },
        { id: 'w', t: ['Dossier de travail\n(vos fichiers)', 'Working tree\n(your files)'], c: 1, r: 1, f: 'file', s: 'warn', w: 134 },
      ],
      e: [
        ['d', 'l', 'git clone', 'a'],
        ['l', 'w', ['extrait', 'checks out'], 'a'],
      ],
      anim: [
        { t: ['Le dépôt distant contient le projet et tout son historique, commit après commit.', 'The remote repository holds the project and its whole history, commit after commit.'], on: ['d'] },
        { t: ['git clone copie cet historique entier dans un dossier .git sur votre ordinateur.', 'git clone copies that entire history into a .git folder on your computer.'], on: ['d', 'l'], flux: [0] },
        { t: ['Git extrait ensuite la dernière version des fichiers dans le dossier de travail : vous pouvez les ouvrir.', 'Git then checks out the latest version of the files into the working tree: you can open them.'], on: ['l', 'w'], flux: [1] },
        { t: ['La copie connaît son origine sous le nom origin : push et fetch sauront où aller.', 'The copy knows where it came from under the name origin: push and fetch will know where to go.'], on: ['d', 'l', 'w'] },
      ],
    },

    'git-fetch': {
      k: 'graphe',
      alt: ['Fetch : rapatrier les nouveautés du dépôt distant sans toucher aux fichiers', 'Fetch: bring remote updates locally without touching your files'],
      n: [
        { id: 'd', t: ['Dépôt distant', 'Remote repo'], c: 0, r: 0, f: 'cloud', s: 'v', w: 110, h: 50 },
        { id: 'l', t: ['Dépôt local\norigin/main mis à jour', 'Local repo\norigin/main updated'], c: 1, r: 0, f: 'db', s: 'ok', w: 150, h: 62 },
        { id: 'w', t: ['Dossier de travail\n(inchangé)', 'Working tree\n(unchanged)'], c: 1, r: 1, f: 'file', s: 'mute', w: 150 },
      ],
      e: [
        ['d', 'l', 'git fetch', 'a'],
        ['l', 'w', ['rien ne bouge', 'nothing moves'], 'mute dash sans'],
      ],
      anim: [
        { t: ['Quelqu’un a poussé de nouveaux commits sur le dépôt distant.', 'Someone pushed new commits to the remote repository.'], on: ['d'] },
        { t: ['git fetch les rapatrie dans votre dépôt local : la référence origin/main avance.', 'git fetch brings them into your local repository: the origin/main reference moves forward.'], on: ['d', 'l'], flux: [0] },
        { t: ['Vos fichiers n’ont pas bougé. À vous de les intégrer quand vous voulez, avec merge ou rebase.', 'Your files have not moved. You integrate them when you choose, with merge or rebase.'], on: ['l', 'w'], flux: [1] },
      ],
    },

    'git-pull': {
      k: 'graphe',
      alt: ['Pull : fetch suivi d’une fusion dans la branche courante', 'Pull: fetch followed by a merge into the current branch'],
      n: [
        { id: 'd', t: ['Dépôt distant', 'Remote repo'], c: 0, r: 0, f: 'cloud', s: 'v', w: 110, h: 50 },
        { id: 'l', t: ['Dépôt local', 'Local repo'], c: 1, r: 0, f: 'db', s: 'ok', w: 110, h: 50 },
        { id: 'w', t: ['Dossier de travail\n(mis à jour)', 'Working tree\n(updated)'], c: 1, r: 1, f: 'file', s: 'warn', w: 138 },
      ],
      e: [
        ['d', 'l', '1. fetch', 'a'],
        ['l', 'w', '2. merge', 'a'],
      ],
      g: [{ t: ['git pull = fetch + merge', 'git pull = fetch + merge'], ids: ['l', 'w', 'd'] }],
      anim: [
        { t: ['D’abord un fetch : les nouveaux commits du dépôt distant arrivent dans le dépôt local.', 'First a fetch: the remote repository’s new commits arrive in the local repository.'], on: ['d', 'l'], flux: [0] },
        { t: ['Puis un merge : la branche courante les intègre, et vos fichiers sont mis à jour.', 'Then a merge: the current branch integrates them, and your files are updated.'], on: ['l', 'w'], flux: [1] },
        { t: ['git pull = fetch + merge. Avec --rebase, vos propres commits sont rejoués par-dessus au lieu d’être fusionnés.', 'git pull = fetch + merge. With --rebase, your own commits are replayed on top instead of being merged.'] },
      ],
    },

    'git-push': {
      k: 'graphe',
      alt: ['Push : envoyer ses commits vers le dépôt distant', 'Push: send your commits to the remote repository'],
      n: [
        { id: 'l', t: ['Dépôt local\ncommits A B C', 'Local repo\ncommits A B C'], c: 0, r: 0, f: 'db', s: 'ok', w: 112, h: 62 },
        { id: 'd', t: ['Dépôt distant\navait A B', 'Remote repo\nhad A B'], c: 1, r: 0, f: 'cloud', s: 'v', w: 112, h: 62 },
      ],
      e: [['l', 'd', ['git push\n(envoie C)', 'git push\n(sends C)'], 'a']],
      anim: [
        { t: ['En local, vous avez trois commits : A, B et C.', 'Locally, you have three commits: A, B and C.'], on: ['l'] },
        { t: ['Le dépôt distant n’a encore que A et B.', 'The remote repository only has A and B so far.'], on: ['d'] },
        { t: ['git push envoie ce qui manque : seul C voyage. Le distant a maintenant les trois.', 'git push sends what is missing: only C travels. The remote now has all three.'], on: ['l', 'd'], flux: [0] },
      ],
    },

    'git-commit': {
      k: 'commits',
      alt: ['Une suite de commits sur la branche main', 'A chain of commits on the main branch'],
      lanes: ['main'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'] },
        { i: 'D', l: 0, x: 3, p: ['C'], s: 'new' },
      ],
      lab: [{ c: 'D', t: 'HEAD → main', s: 'head' }],
      l: ['Chaque commit pointe vers son parent : c’est une chaîne.', 'Each commit points to its parent: it is a chain.'],
      anim: [
        { t: ['Premier commit : un instantané du projet, avec son auteur, sa date et un message.', 'First commit: a snapshot of the project, with its author, its date and a message.'], on: ['A'] },
        { t: ['Le deuxième pointe vers son parent A : l’historique est une chaîne.', 'The second one points to its parent A: history is a chain.'], on: ['A', 'B'], flux: ['B'] },
        { t: ['Chaque commit reçoit une empreinte unique, calculée à partir de son contenu et de son parent.', 'Each commit gets a unique hash, computed from its content and its parent.'], on: ['A', 'B', 'C'], flux: ['C'] },
        { t: ['Le dernier commit est celui que désigne la branche main ; HEAD dit que vous êtes dessus.', 'The latest commit is the one the main branch points to; HEAD says you are on it.'], on: ['A', 'B', 'C', 'D'], flux: ['D'] },
      ],
    },

    'git-objets': {
      k: 'arbre',
      alt: ['Un commit désigne un arbre, qui contient des blobs et d’autres arbres', 'A commit points to a tree, which holds blobs and other trees'],
      racine: {
        t: 'commit\n9fc2', s: 'a',
        k: [{
          t: 'tree\n4b8e', s: 'v',
          k: [
            { t: 'blob\nREADME', s: 'ok' },
            { t: 'tree\nsrc/', s: 'v', k: [{ t: 'blob\nmain.js', s: 'ok' }, { t: 'blob\nstyle.css', s: 'ok' }] },
          ],
        }],
      },
      l: ['Blob = contenu d’un fichier · tree = dossier · commit = instantané daté.', 'Blob = file content · tree = folder · commit = dated snapshot.'],
      anim: [
        { t: ['Un commit : un auteur, une date, un message… et l’empreinte d’un arbre.', 'A commit: an author, a date, a message… and the hash of a tree.'], on: ['n0'] },
        { t: ['L’arbre racine liste le contenu du dossier du projet : des fichiers et des sous-dossiers.', 'The root tree lists the contents of the project folder: files and subfolders.'], on: ['n1'] },
        { t: ['Chaque fichier est un blob : son contenu, et rien d’autre — pas même son nom, qui est dans l’arbre.', 'Each file is a blob: its content, and nothing else — not even its name, which is in the tree.'], on: ['n2', 'n4', 'n5'] },
        { t: ['Un sous-dossier est un autre arbre. Deux fichiers au contenu identique partagent le même blob.', 'A subfolder is another tree. Two files with identical content share the same blob.'], on: ['n3'] },
      ],
    },

    'git-branche': {
      k: 'commits',
      alt: ['Une branche qui s’écarte de main', 'A branch that splits from main'],
      lanes: ['main', 'feature'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2.6, p: ['B'] },
        { i: 'D', l: 1, x: 2, p: ['B'], s: 'new' },
        { i: 'E', l: 1, x: 3, p: ['D'], s: 'new' },
      ],
      lab: [{ c: 'C', t: 'main', s: 'a' }, { c: 'E', t: 'feature', s: 'ok' }],
      anim: [
        { t: ['main avance, commit après commit.', 'main moves forward, commit after commit.'], on: ['A', 'B'] },
        { t: ['git switch -c feature : une nouvelle branche part de B et reçoit le commit D.', 'git switch -c feature: a new branch starts from B and receives commit D.'], on: ['A', 'B', 'D'], flux: ['D'] },
        { t: ['Sur feature, le travail continue avec E, sans toucher à main.', 'On feature, work goes on with E, without touching main.'], on: ['A', 'B', 'D', 'E'], flux: ['E'] },
        { t: ['Pendant ce temps, main a reçu C : les deux lignes ont divergé.', 'Meanwhile, main received C: the two lines have diverged.'], on: ['A', 'B', 'C'], flux: ['C'] },
        { t: ['Deux branches, deux histoires parallèles à partir de B — jusqu’à une fusion.', 'Two branches, two parallel stories from B onwards — until a merge.'], on: ['A', 'B', 'C', 'D', 'E'] },
      ],
    },

    'git-merge': {
      k: 'commits',
      alt: ['Une fusion réunit deux branches en un commit à deux parents', 'A merge joins two branches into a commit with two parents'],
      lanes: ['main', 'feature'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'] },
        { i: 'D', l: 1, x: 2, p: ['B'] },
        { i: 'E', l: 1, x: 3, p: ['D'] },
        { i: 'M', l: 0, x: 4, p: ['C', 'E'], s: 'new' },
      ],
      lab: [{ c: 'M', t: 'main', s: 'a' }, { c: 'E', t: 'feature', s: 'ok', dessous: true }],
      l: ['M est un commit de fusion : il a deux parents (C et E).', 'M is a merge commit: it has two parents (C and E).'],
      anim: [
        { t: ['Depuis la séparation, main a reçu C.', 'Since the split, main has received C.'], on: ['A', 'B', 'C'] },
        { t: ['feature, partie de B, a reçu D puis E.', 'feature, which started from B, has received D then E.'], on: ['A', 'B', 'D', 'E'] },
        { t: ['git merge feature crée M, un commit de fusion à deux parents : C et E.', 'git merge feature creates M, a merge commit with two parents: C and E.'], on: ['A', 'B', 'C', 'D', 'E', 'M'], flux: ['M'] },
        { t: ['main pointe maintenant sur M. L’historique garde la trace des deux branches.', 'main now points to M. History keeps the trace of both branches.'], on: ['M'] },
      ],
    },

    'git-fast-forward': {
      k: 'commits',
      alt: ['Fast-forward : main avance simplement jusqu’au bout de feature', 'Fast-forward: main simply moves up to the tip of feature'],
      lanes: ['main', 'feature'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 1, x: 2, p: ['B'] },
        { i: 'D', l: 1, x: 3, p: ['C'] },
      ],
      lab: [
        { c: 'B', t: ['main (avant)', 'main (before)'], s: 'mute' },
        { c: 'D', t: ['main (après)', 'main (after)'], s: 'a' },
        { c: 'D', t: 'feature', s: 'ok' },
      ],
      l: ['Aucun nouveau commit : l’étiquette main est seulement déplacée.', 'No new commit: the main label is simply moved.'],
      anim: [
        { t: ['main est restée sur B.', 'main has stayed on B.'], on: ['A', 'B'] },
        { t: ['feature a avancé : C puis D, dans la continuité directe de B.', 'feature has moved on: C then D, in direct continuation of B.'], on: ['A', 'B', 'C', 'D'], flux: ['C', 'D'] },
        { t: ['git merge feature : rien à fusionner. Git avance simplement l’étiquette main jusqu’à D.', 'git merge feature: nothing to merge. Git simply moves the main label up to D.'], on: ['D'] },
        { t: ['Aucun commit de fusion : main et feature désignent le même commit. C’est un fast-forward.', 'No merge commit: main and feature point to the same commit. That is a fast-forward.'], on: ['A', 'B', 'C', 'D'] },
      ],
    },

    'git-rebase': {
      k: 'commits',
      alt: ['Rebase : les commits de feature sont rejoués après ceux de main', 'Rebase: the feature commits are replayed on top of main'],
      lanes: ['main', 'feature'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'] },
        { i: 'D', l: 1, x: 2, p: ['B'], s: 'old' },
        { i: 'E', l: 1, x: 3, p: ['D'], s: 'old' },
        { i: 'D2', l: 0, x: 3, p: ['C'], s: 'new', t: "D'" },
        { i: 'E2', l: 0, x: 4, p: ['D2'], s: 'new', t: "E'" },
      ],
      lab: [{ c: 'E2', t: 'feature', s: 'ok' }],
      l: ['D et E (pointillés) sont abandonnés ; D’ et E’ sont de nouveaux commits, aux empreintes différentes.', 'D and E (dashed) are abandoned; D’ and E’ are new commits with different hashes.'],
      anim: [
        { t: ['main a avancé jusqu’à C.', 'main has moved on to C.'], on: ['A', 'B', 'C'] },
        { t: ['feature a reçu D et E à partir de B.', 'feature received D and E, starting from B.'], on: ['A', 'B', 'D', 'E'] },
        { t: ['git rebase main rejoue D après C : D’ est un nouveau commit, au contenu identique.', 'git rebase main replays D after C: D’ is a new commit with identical content.'], on: ['A', 'B', 'C', 'D2'], flux: ['D2'] },
        { t: ['Puis E devient E’. L’historique est linéaire, comme si feature était née après C.', 'Then E becomes E’. History is linear, as if feature had been born after C.'], on: ['A', 'B', 'C', 'D2', 'E2'], flux: ['E2'] },
        { t: ['D et E sont abandonnés : leurs empreintes ont disparu de feature. Ne rebasez jamais une branche déjà poussée.', 'D and E are abandoned: their hashes are gone from feature. Never rebase a branch you have already pushed.'], on: ['D', 'E'] },
      ],
    },

    'git-cherry-pick': {
      k: 'commits',
      alt: ['Cherry-pick : copier un seul commit d’une branche sur une autre', 'Cherry-pick: copy a single commit from one branch onto another'],
      lanes: ['main', 'feature'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 1, x: 2, p: ['B'] },
        { i: 'D', l: 1, x: 3, p: ['C'], s: 'ok' },
        { i: 'E', l: 1, x: 4, p: ['D'] },
        { i: 'D2', l: 0, x: 3.4, p: ['B'], s: 'new', t: "D'" },
      ],
      lab: [{ c: 'D2', t: 'main', s: 'a' }, { c: 'E', t: 'feature', s: 'ok' }],
      l: ['Seul D est copié (D’) : C et E restent sur feature.', 'Only D is copied (D’): C and E stay on feature.'],
      anim: [
        { t: ['feature contient trois commits : C, D et E.', 'feature holds three commits: C, D and E.'], on: ['A', 'B', 'C', 'D', 'E'] },
        { t: ['Seul D vous intéresse : une correction qu’il faudrait aussi sur main.', 'Only D matters to you: a fix that main needs too.'], on: ['D'] },
        { t: ['git cherry-pick D copie ce seul commit sur main, sous une nouvelle empreinte D’.', 'git cherry-pick D copies that single commit onto main, under a new hash D’.'], on: ['A', 'B', 'D2'], flux: ['D2'] },
        { t: ['C et E restent sur feature : rien d’autre n’a bougé.', 'C and E stay on feature: nothing else has moved.'], on: ['C', 'E'] },
      ],
    },

    'git-amend': {
      k: 'commits',
      alt: ['Amend : le dernier commit est remplacé par une nouvelle version', 'Amend: the last commit is replaced by a new version'],
      lanes: ['main', ''],
      lh: 52,
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'], s: 'old' },
        { i: 'C2', l: 1, x: 2, p: ['B'], s: 'new', t: "C'" },
      ],
      lab: [
        { c: 'C', t: ['ancien (abandonné)', 'old (abandoned)'], s: 'mute' },
        { c: 'C2', t: 'HEAD → main', s: 'head', dessous: true },
      ],
      l: ['C’ prend la place de C : nouvelle empreinte, même parent. À éviter après un push.', 'C’ takes C’s place: new hash, same parent. Avoid after a push.'],
      anim: [
        { t: ['Vous venez de faire le commit C… avec une faute dans le message.', 'You have just made commit C… with a typo in the message.'], on: ['A', 'B', 'C'] },
        { t: ['git commit --amend crée C’, qui remplace C : même parent B, nouveau message, nouvelle empreinte.', 'git commit --amend creates C’, which replaces C: same parent B, new message, new hash.'], on: ['A', 'B', 'C2'], flux: ['C2'] },
        { t: ['C est abandonné. Si vous l’aviez déjà poussé, les autres l’ont encore : amender après un push sème la confusion.', 'C is abandoned. If you had already pushed it, others still have it: amending after a push breeds confusion.'], on: ['C'] },
      ],
    },

    'git-stash': {
      k: 'graphe',
      alt: ['Stash : mettre de côté ses modifications en cours, puis les reprendre', 'Stash: set aside your work in progress, then bring it back'],
      n: [
        { id: 'w', t: ['Modifications\nen cours', 'Work in\nprogress'], c: 0, r: 0, f: 'file', s: 'warn', w: 96 },
        { id: 's', t: ['Stash\n(la pile)', 'Stash\n(the pile)'], c: 1, r: 0, f: 'db', s: 'v', w: 96, h: 58 },
        { id: 'c', t: ['Dossier propre\n(= dernier commit)', 'Clean folder\n(= last commit)'], c: 0, r: 1, f: 'file', s: 'ok', w: 134 },
      ],
      e: [
        ['w', 's', 'stash', 'v'],
        ['s', 'w', 'pop', 'v dash'],
        ['w', 'c', ['on repart de HEAD', 'back to HEAD'], 'ok dash'],
      ],
      anim: [
        { t: ['Vous avez des modifications en cours, et il faut changer de branche tout de suite.', 'You have work in progress, and you must switch branches right now.'], on: ['w'] },
        { t: ['git stash les met de côté, dans une pile…', 'git stash sets it aside, on a pile…'], on: ['w', 's'], flux: [0] },
        { t: ['…et remet le dossier à l’état du dernier commit : propre, prêt pour autre chose.', '…and resets the folder to the state of the last commit: clean, ready for something else.'], on: ['c'], flux: [2] },
        { t: ['Plus tard, git stash pop reprend les modifications là où vous les aviez laissées.', 'Later, git stash pop brings the changes back where you left them.'], on: ['s', 'w'], flux: [1] },
      ],
    },

    'git-tag': {
      k: 'commits',
      alt: ['Des étiquettes de version posées sur des commits précis', 'Version labels attached to specific commits'],
      lanes: ['main'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'] },
        { i: 'D', l: 0, x: 3, p: ['C'] },
        { i: 'E', l: 0, x: 4, p: ['D'] },
      ],
      lab: [
        { c: 'B', t: 'v1.0', s: 'tag' },
        { c: 'D', t: 'v1.1', s: 'tag' },
        { c: 'E', t: 'main', s: 'a' },
      ],
      l: ['Une étiquette ne bouge pas : elle marque un commit pour toujours.', 'A tag never moves: it marks a commit for good.'],
      anim: [
        { t: ['Au commit B, le projet est prêt : git tag v1.0 y pose une étiquette.', 'At commit B, the project is ready: git tag v1.0 puts a label on it.'], on: ['A', 'B'] },
        { t: ['Le travail continue ; D reçoit v1.1.', 'Work goes on; D gets v1.1.'], on: ['C', 'D'] },
        { t: ['main avance encore, mais v1.0 et v1.1 restent fixées à leurs commits : une étiquette ne bouge jamais.', 'main keeps moving, but v1.0 and v1.1 stay fixed to their commits: a tag never moves.'], on: ['E'] },
      ],
    },

    'git-head': {
      k: 'commits',
      alt: ['HEAD désigne la branche courante, qui désigne le dernier commit', 'HEAD names the current branch, which names the latest commit'],
      lanes: ['main'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'] },
      ],
      lab: [
        { c: 'C', t: 'main', s: 'a' },
        { c: 'C', t: 'HEAD', s: 'head' },
      ],
      l: ['HEAD → main → C : « vous êtes ici ».', 'HEAD → main → C: “you are here”.'],
    },

    'git-detached-head': {
      k: 'commits',
      alt: ['HEAD détaché : HEAD pointe directement sur un commit, plus sur une branche', 'Detached HEAD: HEAD points straight at a commit, no longer at a branch'],
      lanes: ['main', ''],
      lh: 60,
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'] },
        { i: 'X', l: 1, x: 2, p: ['B'], s: 'warn' },
      ],
      lab: [
        { c: 'C', t: 'main', s: 'a' },
        { c: 'X', t: ['HEAD (détaché)', 'HEAD (detached)'], s: 'head', dessous: true },
      ],
      l: ['X n’appartient à aucune branche : sans étiquette, on le perd en quittant.', 'X belongs to no branch: without a label, leaving it loses it.'],
      anim: [
        { t: ['Normalement, HEAD désigne la branche main, qui désigne C.', 'Normally, HEAD points to the main branch, which points to C.'], on: ['A', 'B', 'C'] },
        { t: ['git checkout B, puis un commit : X est créé, mais aucune branche ne le désigne. HEAD est « détaché ».', 'git checkout B, then a commit: X is created, but no branch points to it. HEAD is “detached”.'], on: ['A', 'B', 'X'], flux: ['X'] },
        { t: ['Si vous repassez sur main sans créer de branche (git switch -c sauvetage), X devient orphelin et finira oublié.', 'If you go back to main without creating a branch (git switch -c rescue), X becomes an orphan and will eventually be forgotten.'], on: ['X'] },
      ],
    },

    'git-reset': {
      k: 'cases',
      alt: ['Les trois modes de reset : soft, mixed, hard', 'The three reset modes: soft, mixed, hard'],
      l: ['En bleu : ce que le reset remet en état. Le mode hard efface aussi vos fichiers.', 'In blue: what reset puts back. Hard mode also erases your files.'],
      rows: [
        { t: 'git reset --soft', cells: ['HEAD', ['Index', 'Index'], ['Fichiers', 'Files']], s: ['a', 'ok', 'ok'], w: 100, mono: false, sz: 12, espace: 6 },
        { t: 'git reset --mixed', cells: ['HEAD', ['Index', 'Index'], ['Fichiers', 'Files']], s: ['a', 'a', 'ok'], w: 100, mono: false, sz: 12, espace: 6 },
        { t: 'git reset --hard', cells: ['HEAD', ['Index', 'Index'], ['Fichiers', 'Files']], s: ['a', 'a', 'bad'], w: 100, mono: false, sz: 12 },
      ],
      anim: [
        { t: ['--soft recule HEAD. Vos modifications restent dans l’index, prêtes à être recommitées.', '--soft moves HEAD back. Your changes stay in the index, ready to be committed again.'], on: [0] },
        { t: ['--mixed (par défaut) recule HEAD et vide l’index. Vos fichiers sont intacts.', '--mixed (the default) moves HEAD back and empties the index. Your files are untouched.'], on: [1] },
        { t: ['--hard recule tout, fichiers compris : les modifications non commitées sont perdues.', '--hard moves everything back, files included: uncommitted changes are lost.'], on: [2] },
      ],
    },

    'git-revert': {
      k: 'commits',
      alt: ['Revert : un nouveau commit qui annule l’effet d’un commit précédent', 'Revert: a new commit that undoes the effect of an earlier commit'],
      lanes: ['main'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'], s: 'bad' },
        { i: 'D', l: 0, x: 3, p: ['C'] },
        { i: 'R', l: 0, x: 4, p: ['D'], s: 'new' },
      ],
      lab: [
        { c: 'C', t: ['à annuler', 'to undo'], s: 'bad', dessous: true },
        { c: 'R', t: 'revert C', s: 'a' },
      ],
      l: ['L’historique n’est pas réécrit : R s’ajoute à la suite.', 'History is not rewritten: R is simply added on top.'],
      anim: [
        { t: ['C a introduit un bug. Il est déjà poussé et partagé : on ne le réécrit pas.', 'C introduced a bug. It is already pushed and shared: it is not to be rewritten.'], on: ['C'] },
        { t: ['git revert C crée R, un commit qui applique exactement l’inverse de C.', 'git revert C creates R, a commit that applies the exact opposite of C.'], on: ['A', 'B', 'C', 'D', 'R'], flux: ['R'] },
        { t: ['L’historique n’est pas réécrit : C reste visible, R l’annule. Sûr, même après un push.', 'History is not rewritten: C stays visible, R undoes it. Safe, even after a push.'], on: ['R'] },
      ],
    },

    'git-squash': {
      k: 'commits',
      alt: ['Squash : plusieurs commits réunis en un seul', 'Squash: several commits combined into one'],
      lanes: [['avant', 'before'], ['après', 'after']],
      lh: 52,
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'b1', l: 0, x: 1, p: ['A'], s: 'old' },
        { i: 'b2', l: 0, x: 2, p: ['b1'], s: 'old' },
        { i: 'b3', l: 0, x: 3, p: ['b2'], s: 'old' },
        { i: 'A2', l: 1, x: 0, t: 'A' },
        { i: 'S', l: 1, x: 3, p: ['A2'], s: 'new' },
      ],
      lab: [{ c: 'S', t: 'b1 + b2 + b3', s: 'a', dessous: true }],
      anim: [
        { t: ['Trois petits commits : « wip », « fix typo », « fix fix ».', 'Three small commits: “wip”, “fix typo”, “fix fix”.'], on: ['A', 'b1', 'b2', 'b3'] },
        { t: ['Un squash les réunit en un seul commit S, avec un message propre.', 'A squash combines them into a single commit S, with a clean message.'], on: ['A2', 'S'], flux: ['S'] },
        { t: ['Le résultat est identique, l’histoire est plus lisible. Comme tout rebase : à faire avant de pousser.', 'The result is identical, the history is easier to read. Like any rebase: do it before pushing.'], on: ['S'] },
      ],
    },

    'git-bisect': {
      k: 'cases',
      alt: ['Bisect : une recherche dichotomique du commit qui a introduit un bug', 'Bisect: a binary search for the commit that introduced a bug'],
      l: ['En 3 essais, on isole le coupable parmi 8 commits.', 'In 3 tries, the culprit among 8 commits is found.'],
      rows: [
        { t: [' 0. Le dernier commit est mauvais, le premier était bon', ' 0. The latest commit is bad, the first was good'], cells: ['1', '2', '3', '4', '5', '6', '7', '8'], s: ['ok', '', '', '', '', '', '', 'bad'], w: 36, h: 26, espace: 4 },
        { t: [' 1. On teste le milieu (4) → bon', ' 1. Test the middle (4) → good'], cells: ['1', '2', '3', '4', '5', '6', '7', '8'], s: ['ok', 'ok', 'ok', 'ok', '', '', '', 'bad'], w: 36, h: 26, espace: 4 },
        { t: [' 2. On teste 6 → mauvais', ' 2. Test 6 → bad'], cells: ['1', '2', '3', '4', '5', '6', '7', '8'], s: ['ok', 'ok', 'ok', 'ok', '', 'bad', 'bad', 'bad'], w: 36, h: 26, espace: 4 },
        { t: [' 3. On teste 5 → mauvais : le coupable est 5', ' 3. Test 5 → bad: the culprit is 5'], cells: ['1', '2', '3', '4', '5', '6', '7', '8'], s: ['ok', 'ok', 'ok', 'ok', 'bad', 'bad', 'bad', 'bad'], w: 36, h: 26, espace: 4 },
      ],
      anim: [
        { t: ['Le commit 8 est cassé, le 1 marchait. Lequel a introduit le bug ?', 'Commit 8 is broken, commit 1 worked. Which one introduced the bug?'], on: [0] },
        { t: ['git bisect teste le milieu : 4 est bon. Les commits 1 à 4 sont hors de cause.', 'git bisect tests the middle: 4 is good. Commits 1 to 4 are cleared.'], on: [1] },
        { t: ['Puis 6 : mauvais. Le coupable est 5 ou 6.', 'Then 6: bad. The culprit is 5 or 6.'], on: [2] },
        { t: ['Enfin 5 : mauvais. C’est lui. Trois essais au lieu de huit : une recherche dichotomique.', 'Finally 5: bad. That is the one. Three tries instead of eight: a binary search.'], on: [3] },
      ],
    },

    'git-hook': {
      k: 'graphe',
      alt: ['Un hook s’exécute avant le commit et peut le refuser', 'A hook runs before the commit and may refuse it'],
      n: [
        { id: 'a', t: 'git commit', c: 0, r: 0, s: 'a', mono: true, w: 86, sz: 11 },
        { id: 'h', t: ['pre-commit\n(votre script)', 'pre-commit\n(your script)'], c: 1, r: 0, f: 'diam', s: 'warn', w: 120, h: 62, sz: 11 },
        { id: 'o', t: ['Commit\ncréé', 'Commit\ncreated'], c: 2, r: 0, s: 'ok', w: 78 },
        { id: 'k', t: ['Commit refusé', 'Commit refused'], c: 1, r: 1, s: 'bad', w: 120 },
      ],
      e: [
        ['a', 'h'],
        ['h', 'o', '0', 'ok'],
        ['h', 'k', '≠ 0', 'bad'],
      ],
      anim: [
        { t: ['git commit lance d’abord le script .git/hooks/pre-commit, s’il existe.', 'git commit first runs the .git/hooks/pre-commit script, if there is one.'], on: ['a', 'h'], flux: [0] },
        { t: ['Le script se termine avec le code 0 : le commit est créé.', 'The script exits with code 0: the commit is created.'], on: ['h', 'o'], flux: [1] },
        { t: ['Il se termine avec un autre code (un test échoue, le lint refuse) : le commit est refusé.', 'It exits with another code (a test fails, the linter objects): the commit is refused.'], on: ['h', 'k'], flux: [2] },
      ],
    },

    'git-submodule': {
      k: 'graphe',
      alt: ['Un sous-module : un dépôt à l’intérieur d’un autre, figé sur un commit précis', 'A submodule: a repository inside another, pinned to an exact commit'],
      n: [
        { id: 'p', t: ['Dépôt\nprincipal', 'Main\nrepository'], c: 0, r: 0, f: 'db', s: 'ok', w: 90, h: 60 },
        { id: 's', t: ['Dépôt tiers\n(sous-module)', 'Third-party repo\n(submodule)'], c: 1, r: 0, f: 'db', s: 'v', w: 108, h: 60 },
      ],
      e: [['p', 's', ['épingle\nle commit a3f9', 'pins\ncommit a3f9'], 'a']],
    },

    'git-remote': {
      k: 'graphe',
      alt: ['Un dépôt local peut connaître plusieurs remotes : origin et upstream', 'A local repository can know several remotes: origin and upstream'],
      n: [
        { id: 'l', t: ['Dépôt\nlocal', 'Local\nrepo'], c: 0, r: 0, f: 'db', s: 'ok', w: 90, h: 58 },
        { id: 'o', t: ['origin\n(votre fork)', 'origin\n(your fork)'], c: 1, r: 0, f: 'cloud', s: 'v', w: 120, h: 56 },
        { id: 'u', t: ['upstream\n(projet d’origine)', 'upstream\n(original project)'], c: 1, r: 1, f: 'cloud', s: 'info', w: 130, h: 56 },
      ],
      e: [
        ['l', 'o', 'push', 'v'],
        ['o', 'l', 'fetch', 'v dash'],
        ['u', 'l', 'fetch', 'info dash'],
      ],
      anim: [
        { t: ['Vous poussez votre travail sur origin : votre fork.', 'You push your work to origin: your fork.'], on: ['l', 'o'], flux: [0] },
        { t: ['Vous rapatriez les nouveautés du projet d’origine depuis upstream.', 'You fetch the original project’s news from upstream.'], on: ['u', 'l'], flux: [2] },
        { t: ['origin, upstream : de simples noms pour des adresses. git remote -v les liste.', 'origin, upstream: just names for addresses. git remote -v lists them.'], on: ['l', 'o', 'u'], flux: [1] },
      ],
    },

    'git-fork': {
      k: 'graphe',
      alt: ['Fork : une copie personnelle d’un dépôt sur GitHub, pour proposer des changements', 'Fork: your own copy of a repository on GitHub, to propose changes'],
      n: [
        { id: 'u', t: ['Dépôt d’origine\n(upstream)', 'Original repo\n(upstream)'], c: 0, r: 0, f: 'cloud', s: 'info', w: 116, h: 56 },
        { id: 'f', t: ['Votre fork\n(sur GitHub)', 'Your fork\n(on GitHub)'], c: 1, r: 0, f: 'cloud', s: 'v', w: 116, h: 56 },
        { id: 'c', t: ['Clone local', 'Local clone'], c: 1, r: 1, f: 'db', s: 'ok', w: 116, h: 50 },
      ],
      e: [
        ['u', 'f', 'fork', 'a'],
        ['f', 'u', 'pull\nrequest', 'a dash'],
        ['f', 'c', 'clone', 'a'],
        ['c', 'f', 'push', 'a dash'],
      ],
      anim: [
        { t: ['Fork : GitHub copie le dépôt d’origine dans votre compte.', 'Fork: GitHub copies the original repository into your account.'], on: ['u', 'f'], flux: [0] },
        { t: ['Vous clonez votre fork sur votre ordinateur et y travaillez.', 'You clone your fork to your computer and work there.'], on: ['f', 'c'], flux: [2] },
        { t: ['Vous poussez vos commits sur votre fork.', 'You push your commits to your fork.'], on: ['c', 'f'], flux: [3] },
        { t: ['Puis vous ouvrez une pull request : proposer vos changements au projet d’origine.', 'Then you open a pull request: proposing your changes to the original project.'], on: ['f', 'u'], flux: [1] },
      ],
    },

    'git-pull-request': {
      k: 'sequence',
      alt: ['Le déroulé d’une pull request entre l’auteur, GitHub et le relecteur', 'How a pull request unfolds between the author, GitHub and the reviewer'],
      a: [['Auteur', 'Author'], 'GitHub', ['Relecteur', 'Reviewer']],
      s: ['a', 'n', 'v'],
      m: [
        [0, 1, ['push de la branche', 'push the branch']],
        [0, 1, ['ouvre la pull request', 'opens the pull request']],
        [2, 1, ['relit et commente', 'reviews and comments']],
        [1, 0, ['demande des changements', 'requests changes'], 'warn dash'],
        [0, 1, ['push des corrections', 'push the fixes']],
        [2, 1, ['approuve', 'approves'], 'ok'],
        [1, 1, ['fusion dans main', 'merge into main'], 'ok'],
      ],
      anim: [
        { t: ['L’auteur pousse sa branche sur GitHub.', 'The author pushes their branch to GitHub.'], flux: [0] },
        { t: ['Il ouvre une pull request : « voici mes changements, voulez-vous les intégrer ? »', 'They open a pull request: “here are my changes, would you merge them?”'], flux: [1] },
        { t: ['Un relecteur lit le diff et commente.', 'A reviewer reads the diff and comments.'], flux: [2] },
        { t: ['GitHub transmet : des changements sont demandés.', 'GitHub passes it on: changes are requested.'], flux: [3] },
        { t: ['L’auteur corrige et pousse de nouveau : la pull request se met à jour toute seule.', 'The author fixes and pushes again: the pull request updates itself.'], flux: [4] },
        { t: ['Approuvée.', 'Approved.'], flux: [5] },
        { t: ['Fusion dans main. La branche peut être supprimée.', 'Merged into main. The branch can be deleted.'], flux: [6] },
      ],
    },

    'git-conflit': {
      k: 'commits',
      alt: ['Conflit : deux branches ont modifié la même ligne, Git ne sait pas choisir', 'Conflict: two branches changed the same line, Git cannot choose'],
      lanes: ['main', 'feature'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'], s: 'warn' },
        { i: 'C', l: 1, x: 1, p: ['A'], s: 'warn' },
        { i: 'M', l: 0, x: 3, p: ['B', 'C'], s: 'bad', t: '⚠' },
      ],
      lab: [{ c: 'B', t: ['ligne 12 : « a »', 'line 12: “a”'], s: 'warn' }, { c: 'C', t: ['ligne 12 : « b »', 'line 12: “b”'], s: 'warn', dessous: true }, { c: 'M', t: ['à résoudre', 'to resolve'], s: 'bad' }],
      anim: [
        { t: ['Sur main, B a changé la ligne 12 en « a ».', 'On main, B changed line 12 to “a”.'], on: ['A', 'B'] },
        { t: ['Sur feature, C a changé la même ligne en « b ».', 'On feature, C changed the same line to “b”.'], on: ['A', 'C'] },
        { t: ['Au merge, Git ne peut pas choisir : conflit. Il marque la ligne (<<<<<<<, =======, >>>>>>>), vous tranchez, puis git add et git commit.', 'At merge time, Git cannot choose: conflict. It marks the line (<<<<<<<, =======, >>>>>>>), you decide, then git add and git commit.'], on: ['M'], flux: ['M'] },
      ],
    },

    'git-gitignore': {
      k: 'arbre',
      mode: 'liste',
      alt: ['Un dossier de projet : ce que .gitignore exclut du suivi de Git', 'A project folder: what .gitignore keeps out of Git’s tracking'],
      racine: {
        t: 'mon-projet/', d: true, k: [
          { t: 'src/', d: true, k: [{ t: 'app.js', c: ['suivi', 'tracked'], cs: 'ok' }] },
          { t: 'node_modules/', d: true, s: 'mute', c: ['ignoré', 'ignored'], cs: 'bad' },
          { t: '.env', s: 'mute', c: ['ignoré (secrets)', 'ignored (secrets)'], cs: 'bad' },
          { t: '.gitignore', c: ['suivi', 'tracked'], cs: 'ok' },
          { t: 'README.md', c: ['suivi', 'tracked'], cs: 'ok' },
        ],
      },
      anim: [
        { t: ['Git suit vos sources, la configuration et la documentation.', 'Git tracks your sources, the configuration and the documentation.'], on: ['n2', 'n5', 'n6'] },
        { t: ['node_modules se réinstalle avec npm install : des milliers de fichiers inutiles à versionner.', 'node_modules reinstalls with npm install: thousands of files there is no point versioning.'], on: ['n3'] },
        { t: ['.env contient des secrets : il ne doit jamais partir sur GitHub.', '.env holds secrets: it must never go to GitHub.'], on: ['n4'] },
        { t: ['Une ligne par motif dans .gitignore suffit : node_modules/ et .env.', 'One line per pattern in .gitignore is enough: node_modules/ and .env.'], on: ['n5'] },
      ],
    },

    'git-dossier-git': {
      k: 'arbre',
      mode: 'liste',
      alt: ['Le contenu du dossier caché .git', 'The contents of the hidden .git folder'],
      racine: {
        t: '.git/', d: true, k: [
          { t: 'HEAD', c: ['branche courante', 'current branch'] },
          { t: 'config', c: ['réglages du dépôt', 'repository settings'] },
          { t: 'index', c: ['zone d’attente', 'staging area'] },
          { t: 'objects/', d: true, c: ['commits, arbres, blobs', 'commits, trees, blobs'] },
          { t: 'refs/', d: true, c: ['branches et tags', 'branches and tags'] },
          { t: 'hooks/', d: true, c: ['scripts automatiques', 'automatic scripts'] },
        ],
      },
    },

    'git-porcelaine': {
      k: 'pile',
      alt: ['Porcelaine et plomberie : les deux étages des commandes Git', 'Porcelain and plumbing: the two layers of Git commands'],
      piles: [{
        t: ['Ce que vous tapez ↓', 'What you type ↓'],
        layers: [
          { t: ['Porcelaine', 'Porcelain'], d: 'add · commit · push · pull · status', s: 'a' },
          { t: ['Plomberie', 'Plumbing'], d: 'hash-object · cat-file · update-ref · rev-parse', s: 'v' },
          { t: ['Base de données', 'Database'], d: ['objets et références dans .git', 'objects and references in .git'], s: 'mute' },
        ],
      }],
      anim: [
        { t: ['Vous tapez les commandes de la porcelaine : lisibles, pensées pour les humains.', 'You type the porcelain commands: readable, designed for humans.'], on: [0] },
        { t: ['Elles appellent la plomberie : des commandes de bas niveau, une par opération élémentaire.', 'They call the plumbing: low-level commands, one per elementary operation.'], on: [1] },
        { t: ['Tout finit dans la base d’objets de .git : blobs, arbres, commits, références.', 'Everything ends up in the object database inside .git: blobs, trees, commits, references.'], on: [2] },
      ],
    },

    'git-noreply': {
      k: 'dessin',
      h: 128,
      alt: ['L’adresse noreply de GitHub, découpée en trois parties', 'The GitHub noreply address, split into three parts'],
      d: [
        ['rect', 8, 8, 344, 34, { s: 'a', t: '231077272+cristo67000@users.noreply.github.com', mono: true, sz: 10.5, r: 8 }],
        ['line', 12, 54, 74, 54, { s: 'ok' }],
        ['line', 80, 54, 146, 54, { s: 'v' }],
        ['line', 154, 54, 348, 54, { s: 'warn' }],
        ['text', 43, 72, ['ID numérique', 'numeric ID'], { s: 'ok', sz: 10, b: true }],
        ['text', 113, 72, ['nom de compte', 'username'], { s: 'v', sz: 10, b: true }],
        ['text', 251, 72, ['domaine réservé de GitHub', 'GitHub reserved domain'], { s: 'warn', sz: 10, b: true }],
        ['text', 180, 104, ['Ce courriel masque votre vraie adresse : aucun message n’y arrive.', 'This email hides your real address: no mail is delivered to it.'], { sz: 10.5, max: 340 }],
      ],
    },

    'git-github': {
      k: 'graphe',
      alt: ['GitHub : une plateforme qui héberge des dépôts Git et les outils pour collaborer', 'GitHub: a platform hosting Git repositories and the tools to collaborate'],
      n: [
        { id: 'g', t: 'GitHub', c: 1, r: 1, f: 'cloud', s: 'v', w: 100, h: 60 },
        { id: 'd', t: ['Vous\n(git push)', 'You\n(git push)'], c: 0, r: 0, s: 'ok', w: 96 },
        { id: 'c', t: ['Équipe\n(pull requests)', 'Team\n(pull requests)'], c: 0, r: 2, s: 'a', w: 96 },
        { id: 'p', t: ['Pages\n(site web)', 'Pages\n(website)'], c: 2, r: 0, s: 'info', w: 96 },
        { id: 'x', t: ['Actions\n(automatisation)', 'Actions\n(automation)'], c: 2, r: 2, s: 'warn', w: 96 },
      ],
      gy: 66,
      e: [['d', 'g', '', 'ok'], ['c', 'g', '', 'a double'], ['g', 'p', '', 'info'], ['g', 'x', '', 'warn']],
    },

    'git-diff': {
      k: 'graphe',
      alt: ['Un diff compare deux versions d’un fichier et liste les lignes retirées et ajoutées', 'A diff compares two versions of a file and lists the removed and added lines'],
      gy: 66,
      n: [
        { id: 'a', t: ['Version avant', 'Version before'], c: 0, r: 0, f: 'file', s: 'bad', w: 112 },
        { id: 'b', t: ['Version après', 'Version after'], c: 0, r: 1, f: 'file', s: 'ok', w: 112 },
        { id: 'd', t: 'diff', sub: ['− ligne retirée\n+ ligne ajoutée', '− removed line\n+ added line'], c: 1, r: 0.5, s: 'a', w: 130, h: 62, mono: true },
      ],
      e: [['a', 'd', '', 'bad'], ['b', 'd', '', 'ok']],
      anim: [
        { t: ['La version d’avant.', 'The version before.'], on: ['a'] },
        { t: ['La version d’après.', 'The version after.'], on: ['b'] },
        { t: ['git diff compare les deux et ne montre que ce qui change : « − » les lignes retirées, « + » les lignes ajoutées.', 'git diff compares the two and shows only what changes: “−” the removed lines, “+” the added lines.'], on: ['a', 'b', 'd'], flux: [0, 1] },
      ],
    },

    'git-main': {
      k: 'commits',
      alt: ['La branche principale main, d’où partent les autres branches', 'The main branch, from which the other branches start'],
      lanes: ['main', 'fix-bug'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'] },
        { i: 'D', l: 0, x: 3.5, p: ['C', 'F'], s: 'new' },
        { i: 'E', l: 1, x: 1.6, p: ['B'] },
        { i: 'F', l: 1, x: 2.6, p: ['E'] },
      ],
      lab: [{ c: 'D', t: 'main', s: 'a' }, { c: 'F', t: 'fix-bug', s: 'ok', dessous: true }],
      anim: [
        { t: ['main : la branche principale, toujours en état de marche.', 'main: the principal branch, always in working order.'], on: ['A', 'B', 'C'] },
        { t: ['fix-bug part de B pour corriger un défaut, en deux commits.', 'fix-bug starts from B to fix a defect, in two commits.'], on: ['B', 'E', 'F'], flux: ['E', 'F'] },
        { t: ['Une fois le correctif prêt, il est fusionné dans main : D.', 'Once the fix is ready, it is merged into main: D.'], on: ['C', 'F', 'D'], flux: ['D'] },
      ],
    },

    'git-checkout': {
      k: 'commits',
      alt: ['checkout : HEAD passe de main (sur C) au commit A, puis revient', 'checkout: HEAD moves from main (on C) to commit A, then comes back'],
      lanes: ['main'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'] },
      ],
      lab: [
        { c: 'C', t: 'main', s: 'a' },
        { c: 'C', t: 'HEAD', s: 'head' },
        { c: 'A', t: ['HEAD après checkout A', 'HEAD after checkout A'], s: 'warn', dessous: true },
      ],
      anim: [
        { t: ['HEAD désigne main, qui désigne C : vos fichiers sont ceux de C.', 'HEAD points to main, which points to C: your files are those of C.'], on: ['A', 'B', 'C'] },
        { t: ['git checkout A : HEAD va sur A et vos fichiers deviennent ceux de A. Détaché, car A n’est pas une branche.', 'git checkout A: HEAD moves to A and your files become those of A. Detached, since A is not a branch.'], on: ['A'] },
        { t: ['git checkout main ramène tout à C. Aujourd’hui, git switch (branches) et git restore (fichiers) découpent checkout en deux.', 'git checkout main brings everything back to C. Today, git switch (branches) and git restore (files) split checkout in two.'], on: ['C'] },
      ],
    },

    'git-force-push': {
      k: 'commits',
      alt: ['Un push forcé remplace sur le dépôt distant le commit C par sa version réécrite C’', 'A force push replaces commit C on the remote with its rewritten version C’'],
      lanes: [['distant', 'remote'], ['local', 'local']],
      lh: 52,
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'], s: 'old' },
        { i: 'A2', l: 1, x: 0, t: 'A' },
        { i: 'B2', l: 1, x: 1, p: ['A2'], t: 'B' },
        { i: 'C2', l: 1, x: 2, p: ['B2'], s: 'new', t: "C'" },
      ],
      lab: [
        { c: 'C', t: ['sera écrasé', 'will be overwritten'], s: 'bad' },
        { c: 'C2', t: '--force-with-lease', s: 'a', dessous: true },
      ],
      anim: [
        { t: ['Vous avez amendé C en C’ en local. Le distant a toujours C : un push normal est refusé, les historiques divergent.', 'You amended C into C’ locally. The remote still has C: a normal push is refused, the histories diverge.'], on: ['A', 'B', 'C', 'A2', 'B2', 'C2'] },
        { t: ['git push --force remplace C par C’ sur le distant. Si quelqu’un avait construit sur C, son travail est orphelin.', 'git push --force replaces C with C’ on the remote. If someone had built on C, their work is orphaned.'], on: ['C', 'C2'], flux: ['C2'] },
        { t: ['--force-with-lease refuse si le distant a bougé depuis votre dernier fetch : le filet de sécurité à toujours préférer.', '--force-with-lease refuses if the remote moved since your last fetch: the safety net to always prefer.'], on: ['C2'] },
      ],
    },

    'git-log': {
      k: 'dessin',
      h: 170,
      alt: ['La sortie de git log : trois commits, du plus récent au plus ancien, avec empreinte, auteur, date et message', 'The output of git log: three commits, newest first, with hash, author, date and message'],
      d: [
        ['rect', 8, 8, 344, 40, { s: 'a', r: 6 }],
        ['text', 16, 24, 'commit 9fc2a1e (HEAD -> main)', { a: 's', mono: true, sz: 10, b: true, s: 'a' }],
        ['text', 16, 40, ['Zoé · il y a 2 h · « Corrige la recherche »', 'Zoé · 2 hours ago · “Fix search”'], { a: 's', sz: 10 }],
        ['rect', 8, 54, 344, 40, { s: 'mute', r: 6 }],
        ['text', 16, 70, 'commit 4b8e77d', { a: 's', mono: true, sz: 10, b: true }],
        ['text', 16, 86, ['Léo · hier · « Ajoute le quiz »', 'Léo · yesterday · “Add the quiz”'], { a: 's', sz: 10 }],
        ['rect', 8, 100, 344, 40, { s: 'mute', r: 6 }],
        ['text', 16, 116, 'commit 1d03c5f (tag: v1.0)', { a: 's', mono: true, sz: 10, b: true }],
        ['text', 16, 132, ['Zoé · la semaine dernière · « Première version »', 'Zoé · last week · “First version”'], { a: 's', sz: 10 }],
        ['text', 180, 160, ['Du plus récent au plus ancien. git log --oneline : une ligne par commit.', 'Newest first. git log --oneline: one line per commit.'], { sz: 10, s: 'mute', max: 340 }],
      ],
      anim: [
        { t: ['En haut, le plus récent : celui que désignent HEAD et main. Son empreinte abrégée, son auteur, sa date, son message.', 'At the top, the newest: the one HEAD and main point to. Its short hash, its author, its date, its message.'], on: [0, 1, 2] },
        { t: ['Puis on remonte le temps, parent après parent. Les tags et les branches s’affichent à côté de leur commit.', 'Then you go back in time, parent after parent. Tags and branches show next to their commit.'], on: [3, 4, 5, 6, 7, 8, 9] },
      ],
    },

    'git-blame': {
      k: 'dessin',
      h: 104,
      alt: ['git blame : chaque ligne d’un fichier avec le commit, l’auteur et la date qui l’ont écrite', 'git blame: each line of a file with the commit, author and date that wrote it'],
      d: [
        ['rect', 8, 8, 344, 84, { s: 'mute', r: 6 }],
        ['text', 16, 28, '9fc2a1e  Zoé  2024-03-02  function chercher(q) {', { a: 's', mono: true, sz: 9.5, s: 'a' }],
        ['text', 16, 50, '4b8e77d  Léo  2024-02-10    const r = index.get(q);', { a: 's', mono: true, sz: 9.5, s: 'v' }],
        ['text', 16, 72, '9fc2a1e  Zoé  2024-03-02    return r ?? [];', { a: 's', mono: true, sz: 9.5, s: 'a' }],
      ],
      anim: [
        { t: ['Chaque ligne porte le commit et l’auteur qui l’ont écrite en dernier.', 'Each line carries the commit and the author who last wrote it.'], on: [0, 1, 3] },
        { t: ['La ligne 2 vient d’un autre commit : git show 4b8e77d dit pourquoi elle a été écrite. Blâmer, ici, c’est comprendre.', 'Line 2 comes from another commit: git show 4b8e77d says why it was written. Blaming, here, means understanding.'], on: [0, 2] },
      ],
    },

    'git-reflog': {
      k: 'commits',
      alt: ['Après un reset, le commit C ne pend plus à aucune branche ; le reflog se souvient que HEAD y était', 'After a reset, commit C hangs from no branch anymore; the reflog remembers HEAD was there'],
      lanes: ['main'],
      c: [
        { i: 'A', l: 0, x: 0 },
        { i: 'B', l: 0, x: 1, p: ['A'] },
        { i: 'C', l: 0, x: 2, p: ['B'], s: 'old' },
      ],
      lab: [
        { c: 'B', t: 'HEAD → main', s: 'head' },
        { c: 'C', t: 'HEAD@{1}', s: 'warn', dessous: true },
      ],
      anim: [
        { t: ['Après un git reset --hard B, C ne pend plus à aucune branche : invisible dans git log.', 'After a git reset --hard B, C hangs from no branch anymore: invisible in git log.'], on: ['A', 'B'] },
        { t: ['Mais le reflog a noté chaque mouvement de HEAD : HEAD@{1} était sur C.', 'But the reflog recorded every move of HEAD: HEAD@{1} was on C.'], on: ['C'] },
        { t: ['git reset --hard HEAD@{1}, ou git branch sauvetage C : récupéré. Le reflog garde ces traces environ 90 jours.', 'git reset --hard HEAD@{1}, or git branch rescue C: recovered. The reflog keeps those traces for about 90 days.'], on: ['A', 'B', 'C'], flux: ['C'] },
      ],
    },

    'git-patch': {
      k: 'graphe',
      alt: ['Un patch : un diff écrit dans un fichier, qu’un autre dépôt peut appliquer', 'A patch: a diff written to a file, which another repository can apply'],
      n: [
        { id: 'a', t: ['Votre dépôt', 'Your repo'], c: 0, r: 0.5, f: 'db', s: 'ok', w: 92, h: 50 },
        { id: 'p', t: 'fix.patch', sub: ['un diff dans un fichier', 'a diff in a file'], c: 1, r: 0.5, f: 'file', s: 'a', w: 110, h: 52, mono: true, sz: 10.5 },
        { id: 'b', t: ['Autre dépôt', 'Other repo'], c: 2, r: 0.5, f: 'db', s: 'v', w: 92, h: 50 },
      ],
      e: [['a', 'p', 'git diff > fix.patch', 'ok'], ['p', 'b', 'git apply fix.patch', 'v']],
      anim: [
        { t: ['git diff > fix.patch : la différence est écrite dans un fichier texte, lignes retirées et ajoutées.', 'git diff > fix.patch: the difference is written to a text file, removed and added lines.'], on: ['a', 'p'], flux: [0] },
        { t: ['Envoyé par courriel ou copié sur une clé, git apply le rejoue ailleurs. C’est ainsi qu’on contribuait avant les pull requests — et encore, pour le noyau Linux.', 'Sent by email or copied on a stick, git apply replays it elsewhere. That is how people contributed before pull requests — and still do, for the Linux kernel.'], on: ['p', 'b'], flux: [1] },
      ],
    },

    'git-gitattributes': {
      k: 'cases',
      alt: ['Trois règles de .gitattributes : fins de ligne, fichiers binaires, fichiers sans diff', 'Three .gitattributes rules: line endings, binary files, files without diff'],
      rows: [
        { t: '.gitattributes', cells: ['* text=auto eol=lf'], s: 'a', w: 200, sz: 11, cap: [['fins de ligne LF pour tout texte', 'LF line endings for all text']] },
        { cells: ['*.png binary'], s: 'v', w: 200, sz: 11, cap: [['jamais de conversion ni de diff', 'never converted nor diffed']] },
        { cells: ['*.min.js -diff'], s: 'warn', w: 200, sz: 11, cap: [['pas de diff pour les fichiers générés', 'no diff for generated files']] },
      ],
      anim: [
        { t: ['Tout fichier texte est enregistré avec des fins de ligne LF, quel que soit le système de la personne.', 'Every text file is stored with LF line endings, whatever the person’s system.'], on: [0] },
        { t: ['Les images sont binaires : Git ne tente ni conversion ni diff ligne par ligne.', 'Images are binary: Git attempts neither conversion nor a line-by-line diff.'], on: [1] },
        { t: ['Un fichier minifié d’une seule ligne : un diff n’aurait aucun sens, on le désactive.', 'A one-line minified file: a diff would make no sense, it is turned off.'], on: [2] },
      ],
    },

  });
})(window);
