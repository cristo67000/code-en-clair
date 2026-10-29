'use strict';
/*
 * Schémas de la catégorie « IA et assistants de code ».
 */
(function (racine) {
  Object.assign(racine.Schemas = racine.Schemas || {}, {

    'ia-llm': {
      k: 'graphe',
      alt: ['Un modèle de langage prédit la suite d’un texte : il calcule des probabilités, en choisit une, et recommence', 'A language model predicts what follows a text: it computes probabilities, picks one, and starts again'],
      gy: 84,
      n: [
        { id: 'a', t: ['Texte', 'Text'], sub: '"Le ciel est"', c: 0, r: 0, s: 'a', w: 100, h: 50, sz: 11 },
        { id: 'l', t: 'LLM', c: 1, r: 0, s: 'v', w: 76 },
        { id: 'p', t: ['Probabilités', 'Probabilities'], sub: 'bleu 62 %\ngris 20 %', c: 2, r: 0, s: 'warn', w: 100, h: 60, sz: 10.5 },
        { id: 'o', t: ['Texte allongé', 'Longer text'], sub: '"Le ciel est bleu"', c: 1, r: 1, s: 'ok', w: 120, h: 50, sz: 10.5 },
      ],
      e: [['a', 'l', '', 'a'], ['l', 'p', '', 'v'], ['p', 'o', '', 'warn'], ['o', 'l', ['on recommence', 'repeat'], 'ok dash']],
      anim: [
        { t: ['Le texte entre, découpé en tokens.', 'The text goes in, cut into tokens.'], on: ['a', 'l'], flux: [0] },
        { t: ['Le modèle calcule, pour chaque token possible, la probabilité qu’il vienne ensuite.', 'The model computes, for every possible token, the probability that it comes next.'], on: ['l', 'p'], flux: [1] },
        { t: ['Il en tire un : « bleu ». Le texte s’allonge d’un token.', 'It draws one: “bleu”. The text grows by one token.'], on: ['p', 'o'], flux: [2] },
        { t: ['Et on recommence avec le nouveau texte, token après token, jusqu’à la fin de la réponse.', 'And it starts again with the new text, token after token, until the end of the answer.'], on: ['o', 'l'], flux: [3] },
      ],
    },

    'ia-contexte': {
      k: 'dessin',
      h: 130,
      alt: ['La fenêtre de contexte se remplit : consignes, conversation, fichiers, réponse', 'The context window fills up: instructions, conversation, files, answer'],
      d: [
        ['text', 8, 16, ['Fenêtre de contexte (en tokens)', 'Context window (in tokens)'], { a: 's', sz: 11, b: true, s: 'mute' }],
        ['rect', 10, 28, 36, 34, { s: 'warn', r: 3 }],
        ['rect', 46, 28, 110, 34, { s: 'a', r: 3 }],
        ['rect', 156, 28, 90, 34, { s: 'v', r: 3 }],
        ['rect', 246, 28, 54, 34, { s: 'ok', r: 3 }],
        ['rect', 300, 28, 50, 34, { s: 'mute', dash: 1, r: 3 }],
        ['text', 28, 80, ['consignes', 'rules'], { sz: 10, b: true, s: 'warn' }],
        ['text', 101, 80, ['conversation', 'conversation'], { sz: 10, b: true, s: 'a' }],
        ['text', 201, 80, ['fichiers', 'files'], { sz: 10, b: true, s: 'v' }],
        ['text', 273, 80, ['réponse', 'answer'], { sz: 10, b: true, s: 'ok' }],
        ['text', 325, 80, ['libre', 'free'], { sz: 10, b: true, s: 'mute' }],
        ['text', 180, 112, ['Ce qui dépasse est oublié ou doit être résumé.', 'What exceeds it is forgotten or must be summarized.'], { sz: 10.5, s: 'mute' }],
      ],
    },

    'ia-temperature': {
      k: 'dessin',
      h: 176,
      alt: ['Température basse : le token le plus probable presque toujours ; haute : des choix plus variés', 'Low temperature: almost always the most likely token; high: more varied choices'],
      d: [
        ['text', 80, 14, ['température basse', 'low temperature'], { sz: 11, b: true, s: 'a' }],
        ['text', 270, 14, ['température haute', 'high temperature'], { sz: 11, b: true, s: 'v' }],
        ['line', 20, 144, 156, 144, { s: 'g' }],
        ['line', 204, 144, 340, 144, { s: 'g' }],
        ['rect', 32, 54, 30, 90, { s: 'a', r: 2 }],
        ['rect', 82, 136, 30, 8, { s: 'mute', r: 2 }],
        ['rect', 132, 142, 30, 2, { s: 'mute', r: 1 }],
        ['text', 47, 46, '90 %', { mono: true, sz: 9.5 }],
        ['rect', 216, 99, 30, 45, { s: 'v', r: 2 }],
        ['rect', 266, 111, 30, 33, { s: 'v', r: 2 }],
        ['rect', 316, 122, 30, 22, { s: 'v', r: 2 }],
        ['text', 231, 91, '45 %', { mono: true, sz: 9.5 }],
        ['text', 47, 160, 'bleu', { mono: true, sz: 10, s: 'mute' }],
        ['text', 97, 160, 'gris', { mono: true, sz: 10, s: 'mute' }],
        ['text', 147, 160, 'noir', { mono: true, sz: 10, s: 'mute' }],
        ['text', 231, 160, 'bleu', { mono: true, sz: 10, s: 'mute' }],
        ['text', 281, 160, 'gris', { mono: true, sz: 10, s: 'mute' }],
        ['text', 331, 160, 'noir', { mono: true, sz: 10, s: 'mute' }],
      ],
    },

    'ia-embedding': {
      k: 'dessin',
      h: 178,
      alt: ['Des mots de sens proche ont des vecteurs proches : les animaux d’un côté, la programmation de l’autre', 'Words of similar meaning have nearby vectors: animals on one side, programming on the other'],
      d: [
        ['ell', 78, 66, 62, 42, { s: 'ok', dash: 1 }],
        ['ell', 272, 120, 66, 42, { s: 'a', dash: 1 }],
        ['circ', 54, 52, 6, { s: 'ok' }], ['text', 54, 38, 'chat', { mono: true, sz: 10 }],
        ['circ', 100, 48, 6, { s: 'ok' }], ['text', 110, 51, 'chien', { a: 's', mono: true, sz: 10 }],
        ['circ', 78, 84, 6, { s: 'ok' }], ['text', 88, 88, 'lion', { a: 's', mono: true, sz: 10 }],
        ['circ', 246, 110, 6, { s: 'a' }], ['text', 236, 104, 'python', { a: 'e', mono: true, sz: 10 }],
        ['circ', 292, 100, 6, { s: 'a' }], ['text', 302, 96, 'js', { a: 's', mono: true, sz: 10 }],
        ['circ', 268, 136, 6, { s: 'a' }], ['text', 278, 148, 'code', { a: 's', mono: true, sz: 10 }],
        ['circ', 190, 30, 6, { s: 'warn' }], ['text', 200, 26, 'pizza', { a: 's', mono: true, sz: 10 }],
        ['text', 180, 168, ['proche dans l’espace = proche par le sens', 'close in space = close in meaning'], { sz: 10.5, s: 'mute', b: true }],
      ],
    },

    'ia-rag': {
      k: 'graphe',
      alt: ['RAG : chercher des documents pertinents, les ajouter au prompt, puis laisser le modèle répondre', 'RAG: find relevant documents, add them to the prompt, then let the model answer'],
      gy: 84,
      n: [
        { id: 'q', t: ['Question', 'Question'], c: 0, r: 0, s: 'a', w: 88 },
        { id: 's', t: ['Recherche', 'Search'], sub: 'embeddings', c: 1, r: 0, s: 'v', w: 92, h: 48, sz: 11 },
        { id: 'd', t: ['Documents\npertinents', 'Relevant\ndocuments'], c: 2, r: 0, f: 'db', s: 'info', w: 92, h: 58, sz: 10.5 },
        { id: 'p', t: ['Prompt\nenrichi', 'Enriched\nprompt'], c: 2, r: 1, s: 'warn', w: 92, sz: 10.5 },
        { id: 'l', t: 'LLM', c: 1, r: 1, s: 'v', w: 80 },
        { id: 'r', t: ['Réponse\n+ sources', 'Answer\n+ sources'], c: 0, r: 1, s: 'ok', w: 88, sz: 10.5 },
      ],
      e: [['q', 's', '', 'a'], ['s', 'd', '', 'v'], ['d', 'p', '', 'info'], ['p', 'l', '', 'warn'], ['l', 'r', '', 'v']],
      anim: [
        { t: ['La question est transformée en vecteur et comparée aux documents.', 'The question is turned into a vector and compared with the documents.'], on: ['q', 's'], flux: [0] },
        { t: ['Les plus proches par le sens sont retenus.', 'The closest in meaning are kept.'], on: ['s', 'd'], flux: [1] },
        { t: ['Ils sont collés dans le prompt, avec la question.', 'They are pasted into the prompt, with the question.'], on: ['d', 'p'], flux: [2] },
        { t: ['Le modèle répond à partir de ces documents, et peut les citer. Moins d’hallucinations, des sources.', 'The model answers from those documents, and can cite them. Fewer hallucinations, and sources.'], on: ['p', 'l', 'r'], flux: [3, 4] },
      ],
    },

    'ia-agent': {
      k: 'graphe',
      alt: ['Un agent : le modèle choisit une action, un outil l’exécute, le modèle observe le résultat, et recommence', 'An agent: the model chooses an action, a tool runs it, the model observes the result, and repeats'],
      gy: 84,
      n: [
        { id: 'g', t: ['Objectif', 'Goal'], c: 0, r: 0, s: 'a', w: 88 },
        { id: 'm', t: ['Modèle', 'Model'], sub: ['décide', 'decides'], c: 1, r: 0, s: 'v', w: 88, h: 48 },
        { id: 't', t: ['Outil', 'Tool'], sub: ['fichier, commande,\nAPI', 'file, command,\nAPI'], c: 2, r: 0, s: 'warn', w: 104, h: 62, sz: 11 },
        { id: 'o', t: ['Résultat', 'Result'], c: 2, r: 1, s: 'info', w: 88 },
        { id: 'f', t: ['Réponse\nfinale', 'Final\nanswer'], c: 0, r: 1, s: 'ok', w: 88, sz: 10.5 },
      ],
      e: [['g', 'm', '', 'a'], ['m', 't', ['agit', 'acts'], 'v'], ['t', 'o', '', 'warn'], ['o', 'm', ['observe', 'observes'], 'info dash'], ['m', 'f', ['a fini', 'is done'], 'ok']],
      anim: [
        { t: ['L’agent reçoit un objectif : « corrige le test qui échoue ».', 'The agent gets a goal: “fix the failing test”.'], on: ['g', 'm'], flux: [0] },
        { t: ['Le modèle décide d’une action : lire un fichier, lancer une commande.', 'The model decides on an action: read a file, run a command.'], on: ['m', 't'], flux: [1] },
        { t: ['L’outil l’exécute et renvoie un résultat.', 'The tool runs it and returns a result.'], on: ['t', 'o'], flux: [2] },
        { t: ['Le modèle l’observe et décide de la suite. Boucle…', 'The model observes it and decides what comes next. Loop…'], on: ['o', 'm'], flux: [3] },
        { t: ['…jusqu’à ce qu’il juge l’objectif atteint : réponse finale.', '…until it judges the goal reached: final answer.'], on: ['m', 'f'], flux: [4] },
      ],
    },

    'ia-mcp': {
      k: 'graphe',
      alt: ['Un assistant se connecte par MCP à un serveur qui expose des outils', 'An assistant connects through MCP to a server that exposes tools'],
      gy: 64,
      n: [
        { id: 'c', t: ['Assistant', 'Assistant'], sub: 'client MCP', c: 0, r: 1, s: 'a', w: 92, h: 48, sz: 11 },
        { id: 's', t: ['Serveur MCP', 'MCP server'], c: 1, r: 1, s: 'v', w: 96, sz: 11 },
        { id: 'f', t: ['Fichiers', 'Files'], c: 2, r: 0, s: 'ok', w: 88 },
        { id: 'b', t: ['Base de données', 'Database'], c: 2, r: 1, f: 'db', s: 'ok', w: 92, h: 50, sz: 10.5 },
        { id: 'w', t: ['Service web', 'Web service'], c: 2, r: 2, s: 'ok', w: 92, sz: 11 },
      ],
      e: [['c', 's', 'MCP', 'a double'], ['s', 'f', '', 'v'], ['s', 'b', '', 'v'], ['s', 'w', '', 'v']],
      anim: [
        { t: ['L’assistant demande au serveur MCP : « quels outils proposes-tu ? »', 'The assistant asks the MCP server: “which tools do you offer?”'], on: ['c', 's'], flux: [0] },
        { t: ['Le serveur expose des outils : lire des fichiers, interroger une base, appeler un service.', 'The server exposes tools: read files, query a database, call a service.'], on: ['s', 'f', 'b', 'w'], flux: [1, 2, 3] },
        { t: ['L’assistant les appelle par un protocole commun : un serveur écrit une fois sert à tous les assistants.', 'The assistant calls them through a common protocol: a server written once serves every assistant.'], on: ['c', 's'], flux: [0] },
      ],
    },

    'ia-entrainement': {
      k: 'graphe',
      alt: ['L’entraînement : des données entrent, le modèle ajuste ses poids pendant des semaines, un modèle en sort', 'Training: data goes in, the model adjusts its weights for weeks, a model comes out'],
      n: [
        { id: 'd', t: ['Données\n(textes, code)', 'Data\n(text, code)'], c: 0, r: 0.5, f: 'db', s: 'a', w: 100, h: 60 },
        { id: 'e', t: ['Entraînement', 'Training'], sub: ['des semaines, des milliers de GPU', 'weeks, thousands of GPUs'], c: 1, r: 0.5, s: 'v', w: 126, h: 56, sz: 11 },
        { id: 'm', t: ['Modèle\n(poids)', 'Model\n(weights)'], c: 2, r: 0.5, s: 'ok', w: 86 },
      ],
      e: [['d', 'e', '', 'a'], ['e', 'm', '', 'v'], ['e', 'e', ['répéter', 'repeat'], 'warn dash']],
      anim: [
        { t: ['Des milliards de phrases, dont on cache le mot suivant.', 'Billions of sentences, with the next word hidden.'], on: ['d', 'e'], flux: [0] },
        { t: ['Le modèle le devine, on compare à la vérité, on corrige un peu ses poids. Des milliards de fois.', 'The model guesses it, the guess is compared with the truth, its weights are nudged. Billions of times.'], on: ['e'], flux: [2] },
        { t: ['Au bout : un fichier de poids figés. L’entraînement coûte des millions ; l’utiliser (l’inférence) coûte des centimes.', 'At the end: a file of frozen weights. Training costs millions; using it (inference) costs cents.'], on: ['e', 'm'], flux: [1] },
      ],
    },

    'ia-inference': {
      k: 'graphe',
      alt: ['L’inférence : un prompt entre dans le modèle figé, une réponse en sort ; le modèle n’apprend rien', 'Inference: a prompt goes into the frozen model, an answer comes out; the model learns nothing'],
      n: [
        { id: 'p', t: 'Prompt', c: 0, r: 0.5, s: 'a', w: 80 },
        { id: 'm', t: ['Modèle entraîné\n(figé)', 'Trained model\n(frozen)'], c: 1, r: 0.5, s: 'v', w: 120 },
        { id: 'r', t: ['Réponse', 'Answer'], c: 2, r: 0.5, s: 'ok', w: 80 },
      ],
      e: [['p', 'm', '', 'a'], ['m', 'r', ['quelques secondes', 'a few seconds'], 'ok']],
      l: ['Le modèle est le même avant et après : il ne retient pas votre conversation. Chaque token produit coûte du calcul.', 'The model is the same before and after: it does not remember your conversation. Each token produced costs compute.'],
      anim: [
        { t: ['Votre question est découpée en tokens et entre dans le modèle.', 'Your question is cut into tokens and enters the model.'], on: ['p', 'm'], flux: [0] },
        { t: ['Le modèle calcule la réponse token par token, avec ses poids figés. Rien n’est appris : demain, il ne saura pas que vous avez parlé.', 'The model computes the answer token by token, with its frozen weights. Nothing is learned: tomorrow it will not know you talked.'], on: ['m', 'r'], flux: [1] },
      ],
    },

    'ia-fine-tuning': {
      k: 'graphe',
      gy: 70,
      alt: ['Le fine-tuning poursuit l’entraînement d’un modèle de base sur un petit jeu de données spécialisé', 'Fine-tuning continues the training of a base model on a small specialized dataset'],
      n: [
        { id: 'b', t: ['Modèle\nde base', 'Base\nmodel'], c: 0, r: 0.5, s: 'v', w: 86 },
        { id: 'd', t: ['Petit jeu de données\nspécialisé', 'Small specialized\ndataset'], c: 1, r: 0, f: 'db', s: 'a', w: 130, h: 60, sz: 11 },
        { id: 'f', t: 'Fine-tuning', c: 1, r: 1, s: 'warn', w: 100 },
        { id: 's', t: ['Modèle\nspécialisé', 'Specialized\nmodel'], c: 2, r: 0.5, s: 'ok', w: 96 },
      ],
      e: [['b', 'f', '', 'v'], ['d', 'f', '', 'a'], ['f', 's', '', 'ok']],
      anim: [
        { t: ['On part d’un modèle déjà entraîné sur tout le web : il sait parler, il ne connaît pas votre métier.', 'You start from a model already trained on the whole web: it can talk, it does not know your trade.'], on: ['b'] },
        { t: ['On lui montre quelques milliers d’exemples de ce qu’on veut : vos tickets de support, vos contrats, votre style.', 'You show it a few thousand examples of what you want: your support tickets, your contracts, your style.'], on: ['b', 'd', 'f'], flux: [0, 1] },
        { t: ['Quelques heures de calcul : un modèle qui a votre ton et votre vocabulaire. Pour des faits à jour, un RAG suffit souvent.', 'A few hours of compute: a model with your tone and vocabulary. For up-to-date facts, a RAG is often enough.'], on: ['f', 's'], flux: [2] },
      ],
    },

    'ia-hallucination': {
      k: 'sequence',
      lh: 48,
      alt: ['Une hallucination : le modèle répond avec aplomb une fonction qui n’existe pas', 'A hallucination: the model confidently answers with a function that does not exist'],
      a: [['Vous', 'You'], ['Modèle', 'Model']],
      s: ['a', 'v'],
      m: [
        [0, 1, ['« Quelle méthode JS trie sans modifier le tableau ? »', '“Which JS method sorts without changing the array?”']],
        [1, 0, ['« Array.prototype.sortBy() »', '“Array.prototype.sortBy()”'], 'bad dash'],
        [0, 0, ['vérification : elle n’existe pas', 'check: it does not exist'], 'warn'],
        ['note', 0, 1, ['Plausible, assuré, faux : le modèle prédit du texte probable, pas du texte vrai. Vérifiez, testez, demandez les sources. (La bonne réponse : toSorted().)', 'Plausible, confident, wrong: the model predicts likely text, not true text. Verify, test, ask for sources. (The right answer: toSorted().)']],
      ],
      anim: [
        { t: ['Une question précise, à laquelle il existe une bonne réponse.', 'A precise question, which has a correct answer.'], flux: [0] },
        { t: ['Le modèle répond avec aplomb un nom qui ressemble à ce qui devrait exister. Le ton ne dit rien de la vérité.', 'The model confidently answers a name that looks like what should exist. The tone says nothing about the truth.'], flux: [1] },
        { t: ['La console tranche : « sortBy is not a function ». Pour du code, le test vaut toute confiance.', 'The console settles it: “sortBy is not a function”. For code, a test beats any trust.'], on: [2, 3] },
      ],
    },

    'ia-prompt': {
      k: 'pile',
      alt: ['Un prompt utile se lit de haut en bas : rôle, contexte, tâche, format attendu', 'A useful prompt reads top to bottom: role, context, task, expected format'],
      piles: [{
        t: ['Un prompt utile, de haut en bas', 'A useful prompt, top to bottom'],
        layers: [
          { t: ['Rôle', 'Role'], d: ['« Tu es un relecteur de code expérimenté. »', '“You are an experienced code reviewer.”'], s: 'v' },
          { t: ['Contexte', 'Context'], d: ['le fichier, l’erreur, ce qui a déjà été essayé', 'the file, the error, what was already tried'], s: 'a' },
          { t: ['Tâche', 'Task'], d: ['« Trouve pourquoi le test échoue. »', '“Find why the test fails.”'], s: 'ok' },
          { t: ['Format attendu', 'Expected format'], d: ['« Trois points, puis le code corrigé. »', '“Three points, then the fixed code.”'], s: 'warn' },
        ],
      }],
      anim: [
        { t: ['Le rôle oriente le ton et le niveau : relecteur, professeur, traducteur.', 'The role sets the tone and the level: reviewer, teacher, translator.'], on: [0] },
        { t: ['Le contexte est ce qui manque le plus souvent : sans le code et l’erreur, le modèle devine.', 'Context is what is most often missing: without the code and the error, the model guesses.'], on: [1] },
        { t: ['La tâche, précise et unique. Une question, pas trois.', 'The task, precise and single. One question, not three.'], on: [2] },
        { t: ['Le format : ce que vous voulez recevoir, pour ne pas avoir à le redemander.', 'The format: what you want to receive, so you do not have to ask again.'], on: [3] },
      ],
    },

    'ia-machine-learning': {
      k: 'graphe',
      gy: 80,
      alt: ['Programmation classique : des règles écrites à la main produisent des réponses ; apprentissage automatique : des données et des réponses connues produisent des règles', 'Classic programming: hand-written rules produce answers; machine learning: data and known answers produce rules'],
      n: [
        { id: 'r', t: ['Règles\nà la main', 'Hand-written\nrules'], c: 0, r: 0, s: 'a', w: 90, sz: 11 },
        { id: 'd', t: ['Données', 'Data'], c: 1, r: 0, s: 'mute', w: 80 },
        { id: 'o', t: ['Réponses', 'Answers'], c: 2, r: 0, s: 'ok', w: 80 },
        { id: 'd2', t: ['Données', 'Data'], c: 0, r: 1, s: 'mute', w: 80 },
        { id: 'a', t: ['Réponses\nconnues', 'Known\nanswers'], c: 1, r: 1, s: 'ok', w: 90, sz: 11 },
        { id: 'r2', t: ['Règles\napprises', 'Learned\nrules'], c: 2, r: 1, s: 'v', w: 90, sz: 11 },
      ],
      e: [['r', 'd', '', 'a sans'], ['d', 'o', ['programme', 'program'], 'ok'], ['d2', 'a', '', 'mute sans'], ['a', 'r2', ['apprentissage', 'learning'], 'v']],
      g: [{ t: ['Programmation classique', 'Classic programming'], ids: ['r', 'd', 'o'] }, { t: ['Apprentissage automatique', 'Machine learning'], ids: ['d2', 'a', 'r2'] }],
      anim: [
        { t: ['Classique : vous écrivez les règles (« si le mail contient “gratuit”, c’est du spam »), le programme les applique aux données.', 'Classic: you write the rules (“if the email contains ‘free’, it is spam”), the program applies them to the data.'], on: ['r', 'd', 'o'], flux: [1] },
        { t: ['Apprentissage : vous donnez des milliers de mails déjà classés ; l’algorithme en déduit les règles, que personne n’a écrites.', 'Learning: you give thousands of already-labelled emails; the algorithm derives the rules, which nobody wrote.'], on: ['d2', 'a', 'r2'], flux: [3] },
      ],
    },

    'ia-sous-agent': {
      k: 'arbre',
      w: 104,
      alt: ['Un agent principal délègue des sous-tâches à des sous-agents, qui ne rapportent que leur conclusion', 'A main agent delegates subtasks to sub-agents, which only report their conclusion'],
      mono: false,
      racine: {
        t: ['Agent principal', 'Main agent'], s: 'a', k: [
          { t: ['explore\nle dépôt', 'explores\nthe repo'], s: 'ok' },
          { t: ['lance\nles tests', 'runs\nthe tests'], s: 'ok' },
          { t: ['relit\nle code', 'reviews\nthe code'], s: 'ok' },
        ],
      },
      l: ['Chaque sous-agent a son propre contexte, vide au départ, et ne renvoie que sa conclusion.', 'Each sub-agent has its own context, empty at the start, and returns only its conclusion.'],
      anim: [
        { t: ['L’agent principal garde la vue d’ensemble et le fil de la conversation.', 'The main agent keeps the big picture and the thread of the conversation.'], on: ['n0'] },
        { t: ['Il confie des sous-tâches à des sous-agents, en parallèle. Chacun lit des dizaines de fichiers sans encombrer le contexte du principal, et rapporte en quelques lignes.', 'It hands subtasks to sub-agents, in parallel. Each reads dozens of files without cluttering the main one’s context, and reports back in a few lines.'], on: ['n0', 'n1', 'n2', 'n3'], flux: ['n1', 'n2', 'n3'] },
      ],
    },

  });
})(window);
