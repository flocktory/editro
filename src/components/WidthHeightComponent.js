import Component from '../Component';
import {toArray} from '../utils';


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
    toArray(this.el.querySelectorAll('input')).forEach(
      input => this.addListener(input, 'keyup',
        () => {
          this.value[input.getAttribute('target-name')] = input.value;
          this.emit('change', this.value);
        }));
  }
}
