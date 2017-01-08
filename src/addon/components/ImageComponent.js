const Component = require('./Component');


module.exports = class ImageComponent extends Component {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control EditroField-control--inline">
                <div class="EditroFileInput">
                  <div class="EditroIcon EditroIcon--upload"></div>
                  <input class="EditroFileInput-control" type="file" />
                </div>
                <img class="EditroSrcPreview" src="${this.config.current || ''}"/>
              </div>
            </div>`;
  }

  watch() {
    const fileInput = this.el.querySelector('input');
    const preview = this.el.querySelector('.EditroSrcPreview');

    this.addListener(fileInput, 'change', () => {
      const file = fileInput.files[0];

      this.config.upload([file]).then(url => {
        preview.setAttribute('src', url);
        this.emit('change', url);
      });
    });
  }
}
