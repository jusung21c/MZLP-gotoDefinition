/** @babel */

export default {

  DEFINITION:{
    word: /[$0-9a-zA-Z_.]+/,
    regexes: [
      /(^|\s)\"{word}\"(\s{0,})\"\w+\"/,
      /\b{word}\"\s+\"/,
      /(^|\s)JINIE\s{word}(\s{0,}|\{|$)/,
      /(^|\s)JINIE (\w+.)?\w*({word})(\s{0,}|\{|$)/,
      /(^|\s)PERMANENT(\s{0,})\w+(\s{0,}){word}(\s{0,}|\{|$)/,
    ],
    files: ['*.DEFINITION'],
    dependencies: ['DEFINITION'],
  }



};
