module.exports = function(Editro) {
  Editro.defineInitHook(editro => {
    const wrapper = document.createElement('div');
    wrapper.style.height = '100%';

    const bottomPanel = new Editro.type.Panel(editro, {
      position: 'bottom',
      tag: 'codemirror',
      child: wrapper
    });

    editro.getNode().appendChild(bottomPanel.getNode());

    const cm = window.CodeMirror(wrapper, {
      value: editro.getHtml(),
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
      if (e.sourceType !== 'code') {
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
};

function debounce(fn, delay) {
  let timeoutId = null;
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(fn, delay);
  };
}
