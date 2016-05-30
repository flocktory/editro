import Component from '../Component';


/**
 * config = {arrowDirection: 'in', shapes: {inner: 'real', outer: 'imag'}}
 */
export default class TBLRComponent extends Component {
  template() {
    return `<div class="EditroFourInputs" arrow-direction="${this.config.arrowDirection}">
              <div class="EditroFourInputs-outer" shape="${this.config.shapes.outer}"></div>
              <div class="EditroFourInputs-inner" shape="${this.config.shapes.inner}"></div>
              <div class="EditroFourInputs-arrow EditroFourInputs-arrow--top"></div>
              <div class="EditroFourInputs-arrow EditroFourInputs-arrow--bottom"></div>
              <div class="EditroFourInputs-arrow EditroFourInputs-arrow--right"></div>
              <div class="EditroFourInputs-arrow EditroFourInputs-arrow--left"></div>
              <input class="EditroFourInputs-input EditroFourInputs-input--top" type="number" placeholder="auto" value="${this.value.top}" target-name="top" />
              <input class="EditroFourInputs-input EditroFourInputs-input--bottom" type="number" placeholder="auto" value="${this.value.bottom}" target-name="bottom" />
              <input class="EditroFourInputs-input EditroFourInputs-input--right" type="number" placeholder="auto" value="${this.value.right}" target-name="right" />
              <input class="EditroFourInputs-input EditroFourInputs-input--left" type="number" placeholder="auto" value="${this.value.left}" target-name="left" />
            </div>`;
  }

  watch() {
    this.el.querySelectorAll('input').forEach(
      input => input.addEventListener('keyup',
        () => {
          this.value[input.getAttribute('target-name')] = input.value;
          this.emit('change', this.value);
        }));
  }
}
