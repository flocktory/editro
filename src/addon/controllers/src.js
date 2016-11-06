module.exports = function(Editro) {
  const { types: { Controller, ImageComponent } } = Editro;

  class Src extends Controller {
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

      this.node.innerHTML = '<h3 class="EditroController-title">Image</h3>';

      this.component = new ImageComponent(el.getAttribute('src'), {
        label: 'Upload new image',
        upload: this.editro.upload.bind(this.editro)
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
