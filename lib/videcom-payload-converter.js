'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'videcom-payload-converter:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    // get the current active editor
    const editor = atom.workspace.getActiveTextEditor();

    // bail out if you can't get it
    if (!editor)
      return;

    // get the text in the editor
    const encodedText = editor.getText();

    // bail out if there's no text
    if (!encodedText || !encodedText.replace)
      return;

    // clean up the XML
    const decodedText = encodedText
      .replace(/&gt;/g, `>`)
      .replace(/&lt;/g, `<`)
      .replace(/\\"/g, `"`)
      .replace(/" "/g, `""`)
      .replace(/></g, `>\n<`);

    // stick the cleaned up xml back into the editor
    editor.setText(decodedText);

    // set the syntax highlighter to XML
    atom.textEditors.setGrammarOverride(editor, `text.xml`);
  }

};
