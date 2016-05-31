import Component from '../Component';
import {toArray} from '../utils';


export default class ContentComponent extends Component {
  template() {
    return `<div class="EditroTextContent">
              <div class="${this.value.isPreview ? 'EditroTextContent-preview' : ''}">
                ${this.value.nodes.map((item, index) => {
                  switch (item.type) {
                    case 'text': return `<div class="EditroTextContent-item" 
                                              index="${index}" 
                                              contenteditable>${item.content}</div>`;
                    case 'other': return `<div class="EditroTextContent-item" 
                                               title="${item.content}"><&hellip;></div>`;
                  }
                }).join('')}
              </div>
            </div>`;
  }

  watch() {
    toArray(this.el.querySelectorAll('[contenteditable]')).forEach(
      contenteditable => contenteditable.addEventListener('keyup',
        () => {
          this.value.nodes[+contenteditable.getAttribute('index')].content = contenteditable.textContent;
          this.emit('change', this.value);
        }));
  }
}
