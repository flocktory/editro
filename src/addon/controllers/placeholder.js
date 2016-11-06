module.exports = function(Editro) {
  const { types: { Controller, InputComponent } } = Editro;

  class Placeholder extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;

      this.node = document.createElement('div');
      this.node.classList.add('EditroController');
    }

    onElementSelected(el) {
      this.el = el;

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Placeholder</h3>';

      this.component = new InputComponent(el.getAttribute('placeholder') || '');

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'content';
    }

    _onChange(el, value) {
      el.setAttribute('placeholder', value);
    }
  }

  Editro.defineHelper('controllers', 'Placeholder', Placeholder);
};
