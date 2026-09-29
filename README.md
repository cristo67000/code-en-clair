# Code en clair — le glossaire du codage (FR · EN)

Une application web progressive (PWA), hors ligne, qui définit clairement en
**français et en anglais** près de 400 termes du codage — Git, terminal, web,
réseau, données, sécurité, langages, outils, images, bases de données, Android,
IA, tests, architecture — avec **165 schémas**, des **exemples de code** colorés,
des mises en garde « à ne pas confondre », et, pour la personne qui s'en sert :
**ses propres notes, ses propres exemples, ses propres termes**, des favoris, un
quiz et une sauvegarde dans un fichier.

En ligne : https://cristo67000.github.io/code-en-clair/ · application Android :
dépôt `code-en-clair-twa` (Trusted Web Activity pour le Play Store).

Rien n'est envoyé nulle part : pas de compte, pas de serveur, pas de mesure
d'audience, `connect-src 'self'`. Voir `confidentialite.html`.

## Structure

```
index.html  manifest.webmanifest  sw.js  confidentialite.html
css/        theme.css (couleurs, polices) · schema.css · app.css · page.css
js/         un module par écran ou par rôle — voir l'en-tête de chacun
js/schemas/ les 165 figures, une description courte chacune (voir js/schema.js)
data/       glossaire.json, manifeste.json — produits par build/construire.mjs
icons/      icônes de l'application, image d'aperçu
build/      les sources du glossaire (termes/*.txt) et les outils de recette
```

Zéro build à l'exécution : des fichiers statiques, servis tels quels. Le seul
« build » est celui des données (`node build/construire.mjs`) : il compile les
fichiers texte de `build/termes/` en `data/glossaire.json` et échoue au moindre
défaut (renvoi cassé, définition manquante dans une langue, schéma introuvable).

## Écrire un terme

Un terme s'écrit comme il se lit, dans `build/termes/NN-categorie.txt` — le format
est décrit en tête de `build/construire.mjs` :

```
@ amend
cat: git
nom: Amend
nom-fr: amender
alias: git commit --amend, amende
fr: Option de git commit qui remplace le dernier commit…
en: An option of git commit that replaces the last commit…
ex: bash
| git commit --amend -m "Nouveau message"
ex-fr: Changer le message du dernier commit.
ex-en: Change the last commit's message.
voir: commit, rebase
schema: git-amend
```

Un schéma est une petite description dans `js/schemas/*.js` (sept genres : graphe,
commits, cases, pile, arbre, séquence, dessin). `build/galerie.html` les montre
tous, à la largeur d'un téléphone (`?l=en` pour l'anglais, `?theme=sombre`).

## Épreuves

```
node build/construire.mjs        # compile le glossaire, échoue à la moindre incohérence
node build/essais_statiques.mjs  # 155 contrôles sans navigateur (données, traductions, listes de fichiers)
node build/essais.mjs            # 81 contrôles dans un vrai Chrome, hors ligne réel compris
node build/captures.mjs          # les captures d'écran de la fiche Play Store
node build/essais_en_ligne.mjs   # le site PUBLIÉ : contenu identique au dépôt, démarrage, hors ligne réel (domaine coupé)
```

`essais.mjs` ouvre l'application à la taille d'un téléphone, cherche les 33 termes
attendus, écrit des notes et des exemples, joue au quiz, change de langue et de
thème, dessine les 165 schémas (français et anglais) en vérifiant qu'aucun texte ne
sort du cadre, puis **arrête le serveur** et vérifie que l'application se relance
hors ligne. Il échoue à la moindre erreur de page ou violation de la politique de
sécurité.

## Publier

Pages sert la branche `main` à la racine. À chaque changement de fichier de
l'application : incrémenter `VERSION` dans `sw.js` **et** `application-version`
dans `index.html` (`essais_statiques.mjs` vérifie qu'ils concordent). Le bandeau
« Une nouvelle version est prête » prévient les personnes qui l'ont installée.

## Licence des textes

Les définitions, exemples et schémas ont été écrits pour cette application ; aucun
n'est copié d'ailleurs. Git, GitHub, JavaScript, Android et les autres noms cités
appartiennent à leurs propriétaires.
