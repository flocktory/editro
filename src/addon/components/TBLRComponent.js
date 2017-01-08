const Component = require('./Component');
const {toArray} = require('../../utils');


/**
 * config = {arrowDirection: 'in', shapes: {inner: 'real', outer: 'imag'}}
 */
module.exports = class TBLRComponent extends Component {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroSelect EditroControl">
                  <div class="EditroFourInputs EditroControl" arrow-direction="${this.config.arrowDirection}">
                    <div class="EditroFourInputs-outer" shape="${this.config.shapes.outer}"></div>
                    <div class="EditroFourInputs-inner" shape="${this.config.shapes.inner}"></div>
                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--top"></div>
                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--bottom"></div>
                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--right"></div>
                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--left"></div>
                    <input class="EditroFourInputs-input EditroFourInputs-input--top" type="number" placeholder="auto" 
                           value="${this.value.top}" target-name="top" />
                    <input class="EditroFourInputs-input EditroFourInputs-input--bottom" type="number" placeholder="auto" 
                           value="${this.value.bottom}" target-name="bottom" />
                    <input class="EditroFourInputs-input EditroFourInputs-input--right" type="number" placeholder="auto" 
                           value="${this.value.right}" target-name="right" />
                    <input class="EditroFourInputs-input EditroFourInputs-input--left" type="number" placeholder="auto" 
                           value="${this.value.left}" target-name="left" />
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
      this.addListener(input, 'change', onChange);
    });
  }
}
