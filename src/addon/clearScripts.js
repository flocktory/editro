// This addon prevent loading scripts in iframe.
// It change all scripts filetypes to "editro/noscript"

const sre = /<script[^>]*>/gmi;


module.exports = function(Editro) {
  Editro.defineHelper('codePreprocessor', 'scripts', module.exports.pre);
  Editro.defineHelper('codePostprocessor', 'scripts', module.exports.post);
};

module.exports.pre = function pre(code) {
  return code.replace(sre, (str) => str.indexOf('text/javascript') > -1 ?
    str.replace('text/javascript', 'editro/noscript') :
    str.replace(/<script/i, '<script type="editro/noscript" '));
};

module.exports.post = function post(code) {
  return code.replace(/type="editro\/noscript"/gmi, 'type="text/javascript"');
};
