function uid() {
  const id = uid.id = (uid.id ? uid.id + 1 : 1);

  return id;
}

module.exports = function(Editro) {
  const { Component } = Editro.type;

  /**
   * config = {items: [{value: 'bold', icon: 'fwb'}], position: 'right'}
   */
  class IconRadioGroupComponent extends Component {
    template() {
      const name = `radio-group-${uid()}`;

      return `<div class="EditroBtnGroup EditroControl">    
        ${this.config.items.map(({ value, icon }) => `<label class="EditroBtnGroup-item">
          <input class="EditroBtnGroup-input" 
                type="radio" 
                name="${name}" 
                value="${value}" 
                ${this.value === value ? 'checked' : ''} />
          <span class="EditroBtnGroup-itemWrapper">
            <span class="EditroIcon EditroIcon--${icon}"></span>
          </span>
        </label>`).join('')}
      </div>`;
    }

    watch() {
      this.addListener(this.el.firstChild, 'change', e => {
        this.emit('change', e.target.value);
      });
    }
  }

  Editro.defineHelper('type', 'IconRadioGroupComponent', IconRadioGroupComponent);
};