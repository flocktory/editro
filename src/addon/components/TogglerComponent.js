import Component from './Component';


export default class TogglerComponent extends Component {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper"></div>
              </div>
              <div class="EditroField-control">
                <div class="EditroBool" editro-toggler state="${this.value}"></div>
                <div class="EditroField-controlLabel">
                  ${this.config.label}
                </div>
              </div>
            </div>`;
  }

  watch() {
    this.addListener(this.el.querySelector('[editro-toggler]'), 'click', e => {
      e.target.setAttribute('state', !this.value);
      this.emit('change', !this.value);
    });
  }
}
