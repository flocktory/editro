const Component = require('./Component');
const {toArray} = require('../../utils');


module.exports = class WidthHeightComponent extends Component {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroSize EditroControl">
                  <div class="EditroSize-input">
                    <div class="EditroInputWrapper" unit="px">
                      <input type="number" class="EditroInput" placeholder="auto" 
                             value="${this.value.width}" target-name="width" />
                    </div>
                  </div>
                  <div class="EditroSize-separator">&times;</div>
                  <div class="EditroSize-input">
                    <div class="EditroInputWrapper" unit="px">
                      <input type="number" class="EditroInput" placeholder="auto" 
                             value="${this.value.height}" target-name="height" />
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
  }

  watch() {
    toArray(this.el.querySelectorAll('input')).forEach(input => {
      const onChange = () => {
        this.value[input.getAttribute('target-name')] = input.value;
        this.emit('change', this.value);
      };
      this.addListener(input, 'keyup', onChange);
    });
  }
};
