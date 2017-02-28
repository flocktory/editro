const Component = require('./Component');


/**
 * config = {type: 'number', unit: 'px'}
 */
module.exports = class InputComponent extends Component {
  template() {
    return `<div class="EditroField ${!this.config.label ? 'EditroField--controlOnly' : ''}">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroInputWrapper EditroInputWrapper--full EditroControl"
                  ${this.config.unit ? `unit="${this.config.unit}"` : ''}>
                  <input type="${this.config.type || 'text'}" 
                         class="EditroInput" 
                         value="${this.value}"/>
                </div>
              </div>
            </div>`;
  }

  watch() {
    const input = this.el.querySelector('input');
    const onChanged = e => {
      this.emit('change', e.target.value);
    };

    this.addListener(input, 'change', onChanged);
    this.addListener(input, 'keyup', onChanged);
  }
};
