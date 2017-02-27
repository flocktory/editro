const Component = require('./Component');


module.exports = class ColorPlaceholderComponent extends Component {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroColor EditroControl">
                  <div class="EditroColor-placeholder" color-placeholder></div>
                </div>
              </div>
            </div>`;
  }

  watch() {
    this.addListener(this.el.querySelector('[color-placeholder]'), 'click', () => this.emit('change'));
  }
};
