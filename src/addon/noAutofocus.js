const sre = /<(input|textarea)[^>]+(autofocus)/gmi;

module.exports = function(Editro) {
  Editro.defineHelper('codePreprocessor', 'autofocus', module.exports.pre);
  Editro.defineHelper('codePostprocessor', 'autofocus', module.exports.post);
};

module.exports.pre = function pre(code) {
  return code.replace(sre, '$&-editro');
};

module.exports.post = function post(code) {
  return code.replace(/autofocus-editro/gmi, 'autofocus');
};
