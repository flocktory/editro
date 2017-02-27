const Component = require('./Component');


module.exports = class ContentComponent extends Component {
  template() {
    return `<div class="EditroTextContent">
              ${this.value.disabled ? `
                <div class="EditroTextContent-preview">
                  ${this.value.content}
                  <div class="EditroTextContent-previewLabel">${this.config.i18n('click to undlock and edit')}</div>
                </div>
              ` : `
                <div class="EditroTextContent-editable" contenteditable>
                  ${this.value.content}
                </div>
              `}
            </div>`;
  }

  watch() {
    const onChange = e => {
      this.value.content = e.target.innerHTML;
      this.emit('change', this.value);
    };
    this.addListener(this.el.querySelector('[contenteditable]'), 'keyup', onChange);
    this.addListener(this.el.querySelector('[contenteditable]'), 'change', onChange);
  }
};
