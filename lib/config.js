/** @babel */

export default {
  JavaScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [
      /(^|\s|\.){word}\s*[:=]\s*function\s*\(/,
      /(^|\s)function\s+{word}\s*\(/,
      /(^|\s)class\s+{word}(\s|$)/,
      /(^|\s){word}\s*\([^(]*?\)\s*\{/,
    ],
    files: ['*.js'],
    dependencies: ['CoffeeScript', 'TypeScript'],
  },

  CoffeeScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [
      /(^|\s)class\s+{word}(\s|$)/,
      /(^|\s|\.|@){word}\s*[:=]\s*(\([^(]*?\))?\s*[=-]>/,
    ],
    files: ['*.coffee'],
    dependencies: ['JavaScript', 'TypeScript'],
  },

  TypeScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [
      /(^|\s|\.){word}\s*[:=]\s*function\s*\(/,
      /(^|\s)function\s+{word}\s*\(/,
      /(^|\s)interface\s+{word}(\s|$)/,
      /(^|\s)class\s+{word}(\s|$)/,
      /(^|\s){word}\([^(]*?\)\s*\{/,
      /(^|\s|\.|@){word}\s*[:=]\s*(\([^(]*?\))?\s*[=-]>/,
    ],
    files: ['*.ts'],
    dependencies: ['JavaScript', 'CoffeeScript'],
  },

  DEFINITION:{
    word: /[$0-9a-zA-Z_.]+/,
    regexes: [
      /(^|\s)\"{word}\"(\s{0,})\"\w+\"/,
      /(^|\s)JINIE\s{word}(\s{0,}|\{|$)/,
      /(^|\s)JINIE (\w+.)?\w*({word})(\s{0,}|\{|$)/,
      /(^|\s)PERMANENT(\s{0,})\w+(\s{0,}){word}(\s{0,}|\{|$)/,
    ],
    files: ['*.DEFINITION'],
    dependencies: ['DEFINITION'],
  }



};
