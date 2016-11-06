module.exports = function(Editro) {
  Editro.defineOption('name', 'editro');

  Editro.defineExtension('getStorageItem', function(k) {
    try {
      return JSON.parse(localStorage.getItem(`editro:${this.getOption('name')}:${k}`));
    } catch(e) {
      return null;
    }
  });
  Editro.defineExtension('setStorageItem', function(k, v) {
    return localStorage.setItem(`editro:${this.getOption('name')}:${k}`, JSON.stringify(v));
  });
};
