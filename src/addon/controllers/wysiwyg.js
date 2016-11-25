const hasOnlyTags = (html, tags) => {
  const search = /<(\w+)\/?>|<(\w+)\s/gim;

  for (let match = search.exec(html); match; match = search.exec(html)) {
    if (tags.indexOf(match[1] || match[2]) === -1) {
      return false;
    }
  }

  return true;
};

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
      this.node.innerHTML = '<h3 class="EditroController-title">Content</h3>';
      this.temp = document.createElement('div');
      this.temp.className = 'EditroWysiwyg-content';
      this.temp.setAttribute('contenteditable', true);
      this.temp.style.display = 'inline-block';
      this.temp.style.width = '100%';
      this.temp.innerHTML = el.getHtml();
      this.node.appendChild(this.temp);

      const onUpdate = () => el.setHtml(this.temp.innerHTML);

      this.temp.addEventListener('keyup', onUpdate);
      this.temp.addEventListener('change', onUpdate);
    }

    _canEdit(el) {
      const fake = document.createElement('div');
      fake.innerHTML = el.getHtml();
      if (!hasOnlyTags(fake.innerHTML, [...tags.inline, ...tags.headers, ...tags.list, ...tags.content])) {
        return false;
      }
      // allow: list header content inline
      const banned = [
        ...tags.input,
        ...tags.definition,
        ...tags.form,
        ...tags.embedded,
      ];
      return !banned.includes(el.getTag()) && !fake.querySelector(banned.join(' '));
    }
  }

  Editro.defineHelper('controllers', 'Wysiwyg', Wysiwyg);
};
