import cssbeautify from 'cssbeautify';

export {
  formatCss,
  getElementAttr
};

function formatCss(css) {
  const bcss = '\n' + cssbeautify(css, {
    indent: '  ',
    autosemicolon: true
  }) + '\n';

  return bcss.split(/^/gmi).join('    ');
}


function getElementAttr(el) {
  let attr = [].find.call(el.attributes, a => a.name.indexOf('editro') > -1);
  attr = attr && attr.name;

  if (!attr) {
    const tag = el.tagName.toLowerCase();
    const hash = Math.floor(Math.random() * 10000000);
    attr = `editro-${tag}-${hash}`;
    el.setAttribute(attr, '');
  }
  return attr;
}
