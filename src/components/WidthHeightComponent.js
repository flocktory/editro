import Component from '../Component';


export default class WidthHeightComponent extends Component {
  template() {
    return `<div class="EditroSize">
              <div class="EditroSize-input">
                <div class="EditroInputWrapper" unit="px">
                  <input type="number" class="EditroInput" placeholder="auto" value="${this.value.width}" target-name="width" />
                </div>
              </div>
              <div class="EditroSize-separator">&times;</div>
              <div class="EditroSize-input">
                <div class="EditroInputWrapper" unit="px">
                  <input type="number" class="EditroInput" placeholder="auto" value="${this.value.height}" target-name="height" />
                </div>
              </div>
            </div>`;
  }

  watch() {
    Array.prototype.slice.call(this.el.querySelectorAll('input')).forEach(
      input => input.addEventListener('keyup',
        () => {
          this.value[input.getAttribute('target-name')] = input.value;
          this.emit('change', this.value);
        }));
  }
}
