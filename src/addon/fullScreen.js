module.exports = function(Editro) {
  Editro.defineOption('fullScreen', false, (editro, val) => {
    editro.getNode().classList.toggle('Editro--fullScreen', val);
  });
};
