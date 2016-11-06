import Component from './Component';


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
              </div>
            </div>`;
  }

  watch() {
    const fileInput = this.el.querySelector('input');

    this.addListener(fileInput, 'change', () => {
      const file = fileInput.files[0];

      this.config.upload([file]).then(url => {
        this.emit('change', url);
      });
    });
  }
}
