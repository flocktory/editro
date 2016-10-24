import Component from '../Component';


/**
 * config = {choices: [[key, value]]}
 */
export default class SelectComponent extends Component {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroSelect EditroControl">
                  <select class="EditroSelect-select">
                    <option value=""></option>
                    ${(this.config.choices || []).map(([key, value]) => 
                      `<option value='${key}' ${key === this.value ? 'selected' : ''}>${value}</option>`)}
                  </select>
                </div>
              </div>
            </div>`;
  }

  watch() {
    this.addListener(this.el.querySelector('select'), 'change', e => {
      this.emit('change', e.target.value);
    });
  }
}
