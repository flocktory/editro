const { debounce } = require('../utils');

module.exports = function(Editro, CodeMirror=window.CodeMirror) {
  Editro.defineInitHook((editro, _, { code }) => {
    const wrapper = document.createElement('div');
    wrapper.style.height = '100%';
    wrapper.style.position = 'relative';

    const bottomPanel = new Editro.type.Panel(editro, {
      position: 'bottom',
      tag: 'codemirror',
      child: wrapper
    });

    editro.getNode().appendChild(bottomPanel.getNode());

    const cm = CodeMirror(wrapper, {
      value: code,
      mode: 'htmlmixed',
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      matchTags: true,
      continueComments: true,
      autoCloseTags: true,
      fullScreen: false,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
    });

    editro.on('change', e => {
      if (e.sourceType !== 'code' && cm.getValue() !== e.html) {
        cm.setValue(e.html);
      }
    });

    cm.on('changes', debounce(() => {
      const v = cm.getValue();
      if (v !== editro.getHtml()) {
        editro.setHtml(v, {
          sourceType: 'code'
        });
      }
    }, 200));


    const I = Editro.type.Instrument;
    editro.addInstrument(new I(editro, {
      icon: require('../../images/code.svg'),
      title: 'Html',
      onClick: () => editro.emit('toggle-bottom-panel'),
      group: 'panels'
    }));
  });

  Editro.defineHelper('codePreprocessor', 'codeMirror', pre);
};

// export for tests
const pre = module.exports.pre = function pre(code) {
  const sre = /(<html[^>]*>)([\s\S]*)(<head[\s>])/mi;
  return code.replace(sre, (_, start, trash, end) => {
    return start + end;
  });
};

