const Quill = require('quill');

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['clean']
];

module.exports = function(Editro) {
  const { types: { Controller }, tags } = Editro;

  class Wysiwyg extends Controller {
    constructor(editro) {
      super(editro);

      this.node = document.createElement('div');
      this.node.className = editro.getOption('prefix') + 'Controller-Wysiwyg';
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'content';
    }

    onElementSelected(el) {
      if (!this._canEdit(el)) {
        this.node.dataset.enabled = 'no';
        return;
      }

      this.node.dataset.enabled = 'yes';
      this.node.innerHTML = '';
      this.temp = document.createElement('div');
      this.node.appendChild(this.temp);
      this.temp.innerHTML = el.getNode().innerHTML;


      this.quill = new Quill(this.temp, {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      });
      this.quill.on('text-change', () => {
        el.setHtml(this.node.querySelector('.ql-editor').innerHTML);
      });
    }

    _canEdit(el) {
      // allow: list header content inline
      const banned = [
        ...tags.input,
        ...tags.definition,
        ...tags.block,
        ...tags.form,
        ...tags.embedded
      ];
      return !banned.includes(el.getTag()) && !el.getNode().querySelector(banned.join(' '));
    }
  }

  Editro.defineHelper('controllers', 'Wysiwyg', Wysiwyg);
};
