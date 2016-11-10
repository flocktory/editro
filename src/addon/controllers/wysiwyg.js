const Quill = require('quill');

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['clean']
];

module.exports = function(Editro) {
  const { type: { Controller }, tags } = Editro;

  class Wysiwyg extends Controller {
    constructor(editro) {
      super(editro);

      this.getNode().classList.add('EditroWysiwyg');
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
      this.temp.innerHTML = el.getHtml();

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
      const fake = document.createElement('div');
      fake.innerHTML = el.getHtml();
      return !banned.includes(el.getTag()) && !fake.querySelector(banned.join(' '));
    }
  }

  Editro.defineHelper('controllers', 'Wysiwyg', Wysiwyg);
};
