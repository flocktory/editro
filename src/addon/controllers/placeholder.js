module.exports = function(Editro) {
  const { type: { Controller, InputComponent } } = Editro;

  class Placeholder extends Controller {
    onElementSelected(el) {
      const enabled = ['input', 'textarea'].includes(el.getTag());
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Placeholder</h3>';

      this.component = new InputComponent(el.getAttribute('placeholder') || '');

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
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
