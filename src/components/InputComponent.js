import Component from '../Component';


/**
 * config = {type: 'number', unit: 'px', icon: 'fz', size: 'small'}
 */
export default class InputComponent extends Component {
  template() {
    return `${this.config.icon ? `<span class="EditroIcon EditroIcon--${this.config.icon}"></span>` : ``}
            <span class="EditroInputWrapper EditroInputWrapper--${this.config.size} EditroControl"
                  ${this.config.unit ? `unit="${this.config.unit}"` : ``}>
              <input type="${this.config.type || 'text'}" 
                     class="EditroInput" 
                     value="${this.value}"/>
            </span>`;
  }

  watch() {
    this.addListener(this.el.querySelector('input'), 'change', e => {
      this.emit('change', e.target.value);
    });
  }
}
