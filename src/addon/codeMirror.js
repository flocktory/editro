module.exports = function(Editro) {
  Editro.defineInitHook((editro, _, { code }) => {
    const wrapper = document.createElement('div');
    wrapper.style.height = '100%';
    wrapper.style.position = 'relative';
    //wrapper.innerHTML = '<button class="EditroCode-fs" style="position:absolute;right:0;top:0;z-index:1;">Fullscreen</button>';

    const bottomPanel = new Editro.type.Panel(editro, {
      position: 'bottom',
      tag: 'codemirror',
      child: wrapper
    });

    editro.getNode().appendChild(bottomPanel.getNode());

    const cm = window.CodeMirror(wrapper, {
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

    //wrapper.querySelector('.EditroCode-fs')
      //.addEventListener('click', () => cm.setOption('fullScreen', !cm.getOption('fullScreen')));

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
