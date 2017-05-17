'use babel';

import MzlpGotodefinitionView from './mzlp-gotodefinition-view';
import { CompositeDisposable } from 'atom';

export default {

  mzlpGotodefinitionView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.mzlpGotodefinitionView = new MzlpGotodefinitionView(state.mzlpGotodefinitionViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mzlpGotodefinitionView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mzlp-gotodefinition:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mzlpGotodefinitionView.destroy();
  },

  serialize() {
    return {
      mzlpGotodefinitionViewState: this.mzlpGotodefinitionView.serialize()
    };
  },

  toggle() {
    console.log('MzlpGotodefinition was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
