import Component from '../Component';

export default class ColorPlaceholderComponent extends Component {
  template() {
    return `<div class="EditroColor EditroControl">
              <div class="EditroColor-placeholder"></div>
            </div>`;
  }

  watch() {
    this.el.firstChild.addEventListener('click', () => this.emit('change'));
  }
}
