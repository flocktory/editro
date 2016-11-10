const Component = require('./Component');


/**
 * config = {choices: [[key, value]]}
 */
module.exports = class SelectComponent extends Component {
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
                    ${this._buildOptionsHtml(this.config.choices)}
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

  _buildOptionsHtml(choices=[]) {
    return choices.map(c => {
      let name, val;
      if (Array.isArray(c)) {
        val = c[0];
        name = c[1] || c[0];
      } else {
        name = val = c;
      }

      return `<option value='${val}' ${val === this.value ? 'selected' : ''}>${name}</option>`;
    }).join('\n');
  }
};
