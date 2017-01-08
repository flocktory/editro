module.exports = function(Editro) {
  const { type: { Controller, ImageComponent } } = Editro;

  class Src extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;
    }

    onElementSelected(el) {
      const enabled = el.getTag() === 'img';
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Image</h3>';

      this.component = new ImageComponent(el.getAttribute('src'), {
        label: 'Upload new image',
        upload: this.editro.upload.bind(this.editro),
        current: el.getAttribute('src')
      });

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
      el.setAttribute('src', value);
    }
  }

  Editro.defineHelper('controllers', 'Src', Src);
};
