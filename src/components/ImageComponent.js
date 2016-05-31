import Component from '../Component';


export default class ImageComponent extends Component {
  template() {
    return `<div class="EditroFileInput">
              <div class="EditroIcon EditroIcon--upload"></div>
              <input class="EditroFileInput-control" type="file" />
            </div>`;
  }

  watch() {
    const fileInput = this.el.querySelector('input');

    fileInput.addEventListener('change', e => {
      const file = fileInput.files[0];
      const reader = new FileReader();

      // Setup model when file is read
      reader.addEventListener('load', () => {
        this.emit('change', reader.result);
      }, false);

      // Read file
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  }
}
