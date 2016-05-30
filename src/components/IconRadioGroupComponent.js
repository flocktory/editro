import Component from '../Component';


function uid() {
  return uid.id = (uid.id ? uid.id + 1 : 1);
}


/**
 * config = {items: [{value: 'bold', icon: 'fwb'}]}
 */
export default class IconRadioGroupComponent extends Component {
  template() {
    const name = `radio-group-${uid()}`;

    return `<div class="EditroBtnGroup">    
      ${this.config.items.map(({value, icon}) => `<label class="EditroBtnGroup-item EditroControl">
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
    this.el.firstChild.addEventListener('change', e => {
      this.emit('change', e.target.value);
    });
  }
}
