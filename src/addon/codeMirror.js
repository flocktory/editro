const { debounce } = require('../utils');

module.exports = function(Editro, CodeMirror=window.CodeMirror) {
  Editro.defineInitHook((editro, _, options) => {
    const wrapper = document.createElement('div');
    wrapper.style.height = '100%';
    wrapper.style.position = 'relative';

    const { code, readOnly = false} = options;

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
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      readOnly
    });

    let isEditing = false;

    cm.on('focus', () => {
      isEditing = true;
    });

    cm.on('blur', () => {
      isEditing = false;
    });

    /* Applies changes to CodeMirror if change something with editro staff */
    editro.on('change', e => {
      if (!isEditing && e.sourceType !== 'code' && cm.getValue() !== e.html) {
        cm.setValue(e.html);
      }
    });


    /* Applies changes to edtiro if changing code with CodeMirror */
    cm.on('changes', debounce(() => {
      const codeMirrorSource = cm.getValue();
      const iframeSource = editro.frame;

      if (isEditing && iframeSource && iframeSource.isDocumentReady() && codeMirrorSource !== editro.getHtml()) {
        editro.setHtml(codeMirrorSource, {
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

  //Editro.defineHelper('codePreprocessor', 'codeMirror', pre);
};


// export for tests
const pre = module.exports.pre = function pre(code) {
  const isKeepTag = s => /^<(script|style)[\s>]/i.test(s);

  // removes all text between tags
  function clear(str) {
    let n = '';
    let collecting = str.charAt(0) === '<';
    let keep = isKeepTag(str);

    for (let i = 0, l = str.length; i < l; i++) {
      let ch = str.charAt(i);
      if (ch === '<') {
        keep = isKeepTag(str.slice(i));
        collecting = true;
      }
      if (collecting || keep) {
        n += ch;
      }
      if (ch === '>') {
        if (keep) {
          keep = false;
        }
        else {
          collecting = false;
        }
      }
    }
    return n;
  }

  // remove all text between tags from open html to open body or close head if no body
  return code .replace(/(<html[^>]*>)([\s\S]*)(<(head|body)[\s>])/mi, (_, b, c, d) => {
    c = clear(c);
    return b + c + d;
  });
};

