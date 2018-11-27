/** @babel */

export default {

  DEFINITION:{
    word: /[$0-9a-zA-Z_.]+/,
    regexes: [
      /^.*?\"{word}\"[\w\s]{1,}\".*?\".*$/,
      /^.*?JINIE.*?\s{word}\s.*?\(.*?\).*$/,
      /^.*?\"{word}\"\s*?\d{1,}.*$/,
      /^.*?(TEMPORARY|PERMANENT)\s{1,}(STRING|NUMBER)\s{1,}{word}\s{1,}.*$/,
    ],
    files: ['*.DEFINITION', '*.SCENARIO'],
    dependencies: ['DEFINITION'],
  }
};
