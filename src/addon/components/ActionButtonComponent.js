import Component from './Component';


/**
 * config = {type: 'delete', text: 'Delete'}
 */
module.exports = class ActionButtonComponent extends Component {
  template() {
    return `<button class="EditroAction EditroAction--${this.config.type}">
              <span class="EditroAction-text">
                ${this.config.text}
              </span>
            </button>`;
  }

  watch() {
    this.addListener(this.el.firstChild, 'click', () => this.emit('change'));
  }
}
