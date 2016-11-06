module.exports = function(Editro) {
  const { type: { Controller, InputComponent, SelectComponent } } = Editro;

  class Href extends Controller {
    onElementSelected(el) {
      const enabled = el.getTag() === 'a';
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Href</h3>';

      this.component = new InputComponent(el.getAttribute('href') || '');

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);

      this.targetComponent = new SelectComponent(el.getAttribute('target'), {
        choices: [
          ['_top', 'Same tab'],
          ['_blank', 'New tab']
        ],
        label: 'Open in'
      });
      this.targetComponent.on('change', v => el.setAttribute('target', v) || '_top');
      this.getNode().appendChild(this.targetComponent.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'settings';
    }

    _onChange(el, value) {
      el.setAttribute('href', value);
    }
  }

  Editro.defineHelper('controllers', 'Href', Href);
};
