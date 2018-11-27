/** @babel */

// eslint-disable-next-line
import { CompositeDisposable } from 'atom';
import DefinitionsView from './definitions-view';
import Searcher from './searcher';
import Config from './config';
const path = require('path');

export default {
  config: {
    contextMenuDisplayAtFirst: {
      type: 'boolean',
      default: true,
    },
    performanceMode: {
      type: 'boolean',
      default: false,
    },
  },

  firstContextMenu: {
    'atom-text-editor': [
      {
        label: 'Goto Definition',
        command: 'goto-definition:go',
      }, {
        type: 'separator',
      },
    ],
  },

  normalContextMenu: {
    'atom-text-editor': [
      {
        label: 'Goto Definition',
        command: 'goto-definition:go',
      },
    ],
  },

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'goto-definition:go', this.go.bind(this)));
    if (atom.config.get('goto-definition.contextMenuDisplayAtFirst')) {
      this.subscriptions.add(atom.contextMenu.add(this.firstContextMenu));
      atom.contextMenu.itemSets.unshift(atom.contextMenu.itemSets.pop());
    } else {
      this.subscriptions.add(atom.contextMenu.add(this.normalContextMenu));
    }
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  getSelectedWord(editor, wordRegex) {
    return (editor.getSelectedText() || editor.getWordUnderCursor({
      wordRegex,
      includeNonWordCharacters: true,
      //})).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    })).replace(/[-/\\^$*+?()|[\]{}]/g, '\\$&');
  },

  getScanOptions(editor) {

    const filePath = editor.getPath();    
    // 현재 에디터의 파일 Fullpath
    if (!filePath) {
      return {
        message: 'This file must be saved to disk .',
      };
    }
    const fileExtension = `*.${filePath.split('.').pop()}`;    

    //현재 파일의 언어를 추출한다.
    const filePathArr = filePath.split('\\');
    const fileLang = filePathArr[filePathArr.length - 2];

    const scanGrammars = [];
    let scanRegexes = [];
    let scanFiles = [];
    let wordRegexes = [];
    const grammarNames = Object.keys(Config);
    for (let i = 0; i < grammarNames.length; i++) {
      const grammarName = grammarNames[i];
      const grammarOption = Config[grammarName];
      if (grammarOption.files.includes(fileExtension)) {
        if (grammarOption.dependencies) {
          grammarOption.dependencies.map(x => scanGrammars.push(x));
        } else {
        scanGrammars.push(grammarName);
        }
      }
    }

    for (let i = 0; i < scanGrammars.length; i++) {
      const grammarName = scanGrammars[i];
      const grammarOption = Config[grammarName];
      scanRegexes.push(...grammarOption.regexes.map(x => x.source));
      scanFiles.push(...grammarOption.files);
      wordRegexes.push(grammarOption.word.source);
    }

    if (scanRegexes.length === 0) {
      return {
        message: 'This language is not supported . Pull Request Welcome 👏.',
      };
    }

    wordRegexes = wordRegexes.filter((e, i, a) => a.lastIndexOf(e) === i).join('|');
    const word = this.getSelectedWord(editor, new RegExp(wordRegexes, 'i'));
    if (!word.trim().length) {
      return {
        message: 'Unknown keyword .',
      };
    }

    scanRegexes = scanRegexes.filter((e, i, a) => a.lastIndexOf(e) === i);
    scanFiles = scanFiles.filter((e, i, a) => a.lastIndexOf(e) === i);
    return {
      regex: scanRegexes.join('|').replace(/{word}/g, word),
      fileTypes: scanFiles,
      fileLang: fileLang,
    };
  },

  getProvider() {
    const self = this;
    return {
      providerName: 'goto-definition-hyperclick',
      wordRegExp: /[0-9a-zA-Z._-]+/g, //하이퍼클릭 부분, 단어 선택 REGEX . 도 포함하기

      getSuggestionForWord: (editor, text, range) => ({
        range,
        callback() {
          if (text) {
            self.go(editor);
          }
        },
      }),
    };
  },

  go(editor) {    
    const activeEditor = ( editor && editor.constructor.name === 'TextEditor') ? editor : atom.workspace.getActiveTextEditor();
    
    const { regex, fileTypes, message, fileLang } = this.getScanOptions(activeEditor);
    if (!regex) {
      return atom.notifications.addWarning(message);
    }

    if (this.definitionsView) {
      this.definitionsView.cancel();
    }

    this.definitionsView = new DefinitionsView();
    this.state = 'started';

    const iterator = (items) => {
      this.state = 'searching';
      this.definitionsView.addItems(items);
    };

    const callback = () => {
      this.state = 'completed';
      if (this.definitionsView.items.length === 0) {
        this.definitionsView.show();
      } else if (this.definitionsView.items.length === 1) {
       //this.definitionsView.confirmedFirst(); //한개 일때 넘어가는거 방지
      }
    };
    // const scanPaths = atom.project.getDirectories().map(x => path.join(x.path, 'LP Tools', '01. Table Builder', 'Input', fileLang));


    if (atom.config.get('goto-definition.performanceMode')) {
      Searcher.ripgrepScan(activeEditor, fileLang, fileTypes, regex, iterator, callback);
    } else {
      Searcher.atomWorkspaceScan(activeEditor, fileLang, fileTypes, regex, iterator, callback);
    }
    return null;
  },
};
