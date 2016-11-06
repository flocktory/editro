const { toKebabCase } = require('./utils');
const EventEmitter = require('events');
const cssbeautify = require('cssbeautify');


class Element extends EventEmitter {
  constructor(node) {
    super();

    this.node = node;
  }

  getAttribute(name) {
    return this.node.getAttribute(name);
  }
  hasAttribute(name) {
    const attr = this.getAttribute(name);
    return attr === '' || !!attr;
  }
  setAttribute(name, value) {
    const v = this.node.setAttribute(name, value);

    this.emit('change', {
      type: 'attribute',
      name: name,
      value: value
    });

    return v;
  }
  removeAttribute(name) {
    return this.node.removeAttribute(name);
  }

  getStyle(name) {
    return window.getComputedStyle(this.node)[name];
  }
  getStyles(names) {
    return names.reduce((a, n) => {
      a[n] = this.getStyle(n);
      return a;
    }, {});
  }
  setStyle(name, value) {
    const target = this.node;
    // clear style
    target.style[name] = '';
    target.style.removeProperty(name);

    const st = this._getStyleTag();

    // add data attribute (used in selector)
    let identy = target.dataset.editroStyle;
    if (!identy) {
      identy = target.tagName.toLowerCase() +
        Math.floor(Math.random() * 100000);
      target.dataset.editroStyle = identy;
    }

    const selectorText = `[data-editro-style="${identy}"]`;
    const rule = [].find.call(st.rules, a => a.selectorText === selectorText);
    if (rule) {
      rule.style.setProperty(toKebabCase(name), value, 'important');
    } else {
      const cssValue = value.endsWith('!important') ? value : (value + ' !important');
      const cssProp = name.replace(/[A-Z]/, a => '-' + a.toLowerCase());
      st.insertRule(`${selectorText} { ${cssProp}: ${cssValue};}`, st.rules.length);
    }
    const allCssText = [].reduce.call(st.rules, (t, r) => t + '\n\n' + r.cssText,'');
    st.ownerNode.innerHTML = this._formatCss(allCssText);

    this.emit('change', {
      type: 'style',
      name: name,
      value: value
    });
  }
  setHtml(html) {
    this.node.innerHTML = html;

    this.emit('change', {
      type: 'html',
      value: html
    });
  }
  getHtml() {
    return this.node.innerHTML;
  }
  getTag() {
    return this.node.tagName.toLowerCase();
  }

  remove() {
    this.node.parentNode.removeChild(this.node);

    this.emit('change', {
      type: 'remove'
    });
  }

  // call to work with real node
  withNode(fn) {
    fn(this.node);
    this.emit('change', {
      type: 'custom'
    });
  }

  // TODO move to frame
  _getStyleTag() {
    const cd = this.node.getRootNode();
    let st = cd.getElementById('editro-perm-style');
    if (!st) {
      st = cd.createElement('style');
      st.id = 'editro-perm-style';
      cd.head.appendChild(st);
    }
    return [].find.call(cd.styleSheets, s => s.ownerNode === st);
  }
  _formatCss(css) {
    const bcss = '\n' + cssbeautify(css, {
      indent: '  ',
      autosemicolon: true
    }) + '\n';

    return bcss.split(/^/gmi).join('    ');
  }
}

module.exports = Element;

