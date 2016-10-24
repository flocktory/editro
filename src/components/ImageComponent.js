import Component from '../Component';


export default class ImageComponent extends Component {
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

    this.addListener(fileInput, 'change', e => {
      const file = fileInput.files[0];
      const reader = new FileReader();

      // Setup model when file is read
      this.addListener(reader, 'load', () => {
        this.emit('change', reader.result);
      }, false);

      // Read file
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  }
}
