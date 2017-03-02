module.exports = function(Editro) {
  const { Component } = Editro.type;

  /**
   * config = {type: 'delete', text: 'Delete'}
   */
  class ActionButtonComponent extends Component {
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

  Editro.defineHelper('type', 'ActionButtonComponent', ActionButtonComponent);
};
