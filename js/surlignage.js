'use strict';
/*
 * Coloration du code, sans bibliothèque.
 *
 * Un glossaire montre du code partout ; le colorer aide à voir d'un coup d'œil
 * ce qui est commande, option, chaîne, commentaire. Le besoin est modeste
 * (quelques lignes, une douzaine de langages) : un petit analyseur à règles
 * suffit, et il n'ajoute pas un octet de dépendance.
 *
 * Chaque langage est une liste de règles { re, cls }, essayées dans l'ordre à
 * chaque position ; la première qui s'applique gagne. Ce qui ne correspond à
 * aucune règle est du texte simple. Le résultat est construit avec `element()`
 * et `textContent` : le code montré n'est jamais interprété.
 *
 * Classes : t-c commentaire · t-s chaîne · t-n nombre · t-k mot-clé ·
 * t-f commande ou fonction · t-o option (-x, --long) · t-v variable ·
 * t-t balise · t-a attribut · t-p propriété · t-m marque (méthode HTTP, +/-).
 */
(function (racine) {

  const { element } = Outils;

  const MOTS_JS = 'abstract async await break case catch class const continue debugger default delete do else enum export extends false finally for function get if implements import in instanceof interface let new null of private protected public return set static super switch this throw true try typeof undefined var void while with yield';
  const MOTS_PY = 'and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield';
  const MOTS_SQL = 'ADD ALL ALTER AND AS ASC BEGIN BETWEEN BY CASCADE COMMIT CONSTRAINT CREATE DEFAULT DELETE DESC DISTINCT DROP ELSE END EXISTS FOREIGN FROM FULL GROUP HAVING IN INDEX INNER INSERT INTO IS JOIN KEY LEFT LIKE LIMIT NOT NULL ON OR ORDER OUTER PRIMARY REFERENCES RIGHT ROLLBACK SELECT SET TABLE THEN TRANSACTION UNION UNIQUE UPDATE VALUES VIEW WHEN WHERE WITH';
  const MOTS_JAVA = 'abstract boolean break byte case catch char class const continue default do double else enum extends false final finally float for fun if implements import in instanceof int interface is long new null object override package private protected public return short static super switch this throw true try val var void when while';
  const MOTS_BASH = 'if then else elif fi for while until do done case esac in function select return exit export local readonly';
  const MOTS_C = 'auto break case char const continue default do double else enum extern float for goto if inline int long register return short signed sizeof static struct switch typedef union unsigned void volatile while';

  function liste(mots, insensible) {
    return new RegExp('\\b(?:' + mots.split(' ').join('|') + ')\\b', insensible ? 'iy' : 'y');
  }

  const REGLES = {
    bash: [
      { re: /#[^\n]*/y, cls: 't-c' },
      { re: /"(?:[^"\\\n]|\\.)*"|'[^'\n]*'/y, cls: 't-s' },
      { re: /\$\{[^}\n]*\}|\$[A-Za-z_][A-Za-z0-9_]*|\$[0-9?@#!*$]/y, cls: 't-v' },
      { re: /(?<=\s|^)--?[A-Za-z0-9][A-Za-z0-9_-]*/my, cls: 't-o' },
      { re: liste(MOTS_BASH), cls: 't-k' },
      { re: /\b\d+\b/y, cls: 't-n' },
      { re: /(?:^|(?<=[|;&(]\s*))[A-Za-z_./~][\w./~-]*/my, cls: 't-f' },
    ],
    js: [
      { re: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y, cls: 't-c' },
      { re: /`(?:[^`\\]|\\[\s\S])*`|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y, cls: 't-s' },
      { re: /\b0x[0-9a-fA-F_]+\b|\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?n?\b/y, cls: 't-n' },
      { re: liste(MOTS_JS), cls: 't-k' },
      { re: /[A-Za-z_$][\w$]*(?=\s*\()/y, cls: 't-f' },
    ],
    py: [
      { re: /#[^\n]*/y, cls: 't-c' },
      { re: /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y, cls: 't-s' },
      { re: /\b\d[\d_]*(?:\.\d+)?\b/y, cls: 't-n' },
      { re: liste(MOTS_PY), cls: 't-k' },
      { re: /@[A-Za-z_][\w.]*/y, cls: 't-f' },
      { re: /[A-Za-z_][\w]*(?=\s*\()/y, cls: 't-f' },
    ],
    sql: [
      { re: /--[^\n]*|\/\*[\s\S]*?\*\//y, cls: 't-c' },
      { re: /'(?:[^']|'')*'/y, cls: 't-s' },
      { re: /\b\d+(?:\.\d+)?\b/y, cls: 't-n' },
      { re: liste(MOTS_SQL, true), cls: 't-k' },
      { re: /[A-Za-z_][\w]*(?=\s*\()/y, cls: 't-f' },
    ],
    json: [
      { re: /"(?:[^"\\\n]|\\.)*"(?=\s*:)/y, cls: 't-p' },
      { re: /"(?:[^"\\\n]|\\.)*"/y, cls: 't-s' },
      { re: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y, cls: 't-n' },
      { re: /\b(?:true|false|null)\b/y, cls: 't-k' },
    ],
    html: [
      { re: /<!--[\s\S]*?-->/y, cls: 't-c' },
      { re: /<\/?[A-Za-z][\w:-]*|\/?>/y, cls: 't-t' },
      { re: /"[^"\n]*"|'[^'\n]*'/y, cls: 't-s' },
      { re: /[A-Za-z_:][\w:.-]*(?==)/y, cls: 't-a' },
    ],
    css: [
      { re: /\/\*[\s\S]*?\*\//y, cls: 't-c' },
      { re: /"[^"\n]*"|'[^'\n]*'/y, cls: 't-s' },
      { re: /#[0-9a-fA-F]{3,8}\b|-?\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%|s|ms|deg)?\b/y, cls: 't-n' },
      { re: /[a-z-]+(?=\s*:)/y, cls: 't-p' },
      { re: /@[a-z-]+/y, cls: 't-k' },
    ],
    yaml: [
      { re: /#[^\n]*/y, cls: 't-c' },
      { re: /"(?:[^"\\\n]|\\.)*"|'[^'\n]*'/y, cls: 't-s' },
      { re: /[\w.-]+(?=\s*:(?:\s|$))/y, cls: 't-p' },
      { re: /\b\d+(?:\.\d+)?\b/y, cls: 't-n' },
      { re: /\b(?:true|false|null|yes|no)\b/y, cls: 't-k' },
    ],
    ini: [
      { re: /[#;][^\n]*/y, cls: 't-c' },
      { re: /\[[^\]\n]+\]/y, cls: 't-k' },
      { re: /^[\w.-]+(?=\s*=)/my, cls: 't-p' },
      { re: /"[^"\n]*"/y, cls: 't-s' },
    ],
    diff: [
      { re: /^@@[^\n]*/my, cls: 't-k' },
      { re: /^\+[^\n]*/my, cls: 't-add' },
      { re: /^-[^\n]*/my, cls: 't-del' },
      { re: /^(?:diff|index|---|\+\+\+)[^\n]*/my, cls: 't-c' },
    ],
    http: [
      { re: /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/my, cls: 't-m' },
      { re: /^HTTP\/[\d.]+/my, cls: 't-m' },
      { re: /^[A-Za-z][\w-]*(?=:)/my, cls: 't-p' },
      { re: /\b[1-5]\d\d\b/y, cls: 't-n' },
    ],
    gradle: [
      { re: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y, cls: 't-c' },
      { re: /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y, cls: 't-s' },
      { re: /\b\d+\b/y, cls: 't-n' },
      { re: /[a-zA-Z_][\w]*(?=\s*[({=])/y, cls: 't-f' },
    ],
  };
  REGLES.xml = REGLES.html;
  REGLES.ts = REGLES.js;
  REGLES.java = [
    { re: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y, cls: 't-c' },
    { re: /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y, cls: 't-s' },
    { re: /\b\d[\d_]*(?:\.\d+)?[fFLd]?\b/y, cls: 't-n' },
    { re: liste(MOTS_JAVA), cls: 't-k' },
    { re: /@[A-Za-z_]\w*/y, cls: 't-f' },
    { re: /[A-Za-z_]\w*(?=\s*\()/y, cls: 't-f' },
  ];
  REGLES.kotlin = REGLES.java;
  REGLES.c = [
    { re: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y, cls: 't-c' },
    { re: /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y, cls: 't-s' },
    { re: /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b/y, cls: 't-n' },
    { re: liste(MOTS_C), cls: 't-k' },
    { re: /#\s*[a-z]+/y, cls: 't-k' },
    { re: /[A-Za-z_]\w*(?=\s*\()/y, cls: 't-f' },
  ];

  /* Découpe le code en morceaux { texte, cls } : fusionne les caractères
   * « simples » consécutifs pour ne pas créer un nœud par lettre. */
  function decouper(code, langue) {
    const regles = REGLES[langue];
    if (!regles) return [{ texte: code, cls: '' }];
    const morceaux = [];
    let simple = '';
    let i = 0;
    const vider = () => { if (simple) { morceaux.push({ texte: simple, cls: '' }); simple = ''; } };
    while (i < code.length) {
      let trouve = null;
      for (const regle of regles) {
        regle.re.lastIndex = i;
        const m = regle.re.exec(code);
        if (m && m.index === i && m[0].length > 0) { trouve = { m, cls: regle.cls }; break; }
      }
      if (trouve) {
        vider();
        morceaux.push({ texte: trouve.m[0], cls: trouve.cls });
        i += trouve.m[0].length;
      } else {
        simple += code[i];
        i += 1;
      }
    }
    vider();
    return morceaux;
  }

  /* Un bloc de code prêt à afficher : <pre><code>…</code></pre>. */
  function bloc(code, langue) {
    const pre = element('pre', 'code');
    const c = element('code');
    c.setAttribute('data-langue', langue);
    for (const morceau of decouper(code, langue)) {
      if (!morceau.cls) { c.appendChild(document.createTextNode(morceau.texte)); continue; }
      c.appendChild(element('span', morceau.cls, morceau.texte));
    }
    pre.appendChild(c);
    return pre;
  }

  const NOMS = {
    bash: 'Bash', js: 'JavaScript', ts: 'TypeScript', json: 'JSON', html: 'HTML', css: 'CSS',
    py: 'Python', sql: 'SQL', xml: 'XML', yaml: 'YAML', java: 'Java', kotlin: 'Kotlin', c: 'C',
    ini: 'INI', diff: 'diff', text: 'texte', http: 'HTTP', gradle: 'Gradle',
  };

  racine.Surlignage = { bloc, decouper, NOMS, LANGAGES: Object.keys(NOMS) };

})(window);
