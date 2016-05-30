import Component from '../Component';


/**
 * config = {choices: [[key, value]]}
 */
export default class SelectComponent extends Component {
  template() {
    return `<div class="EditroSelect EditroControl">
              <select class="EditroSelect-select">
                ${(this.config.choices || []).map(([key, value]) => `<option value="${key}">${value}</option>`)}
              </select>
            </div>`;
  }

  watch() {
    this.el.querySelector('select').addEventListener('change', e => {
      this.emit('change', e.target.value);
    });
  }
}