import Component from '../Component';
import InputComponent from './InputComponent';
import IconRadioGroupComponent from './IconRadioGroupComponent';
import ColorComponent from './ColorComponent';
import {createDocumentFragment} from '../utils';


export default class BorderComponent extends Component {
  isBordersEqual() {
    for (let i = 1; i < this.value.borders.length; i++) {
      for (let j = 0; j < this.value.borders[i].length; j++) {
        if (this.value.borders[i][j] !== this.value.borders[i - 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  collapseBorders() {
    for (let i = 1; i < this.value.borders.length; i++) {
      for (let j = 0; j < this.value.borders[i].length; j++) {
        this.value.borders[i][j] = this.value.borders[i - 1][j];
      }
    }

    this.emit('change', this.value);
  }

  isRadiusEqual() {
    for (let i = 1; i < this.value.radius.length; i++) {
      if (this.value.radius[i] !== this.value.radius[i - 1]) {
        return false;
      }
    }

    return true;
  }

  collapseRadius() {
    for (let i = 1; i < this.value.radius.length; i++) {
      this.value.radius[i] = this.value.radius[i - 1];
    }

    this.emit('change', this.value);
  }

  render() {
    let isBordersEqual = this.isBordersEqual();

    this.el = createDocumentFragment(`<div class="EditroSubForm EditroToggler EditroToggler-less" collapsed="${isBordersEqual}">
                                        <div class="EditroSubForm-inlineItem">
                                          <div class="EditroIcon EditroIcon--bd"></div>
                                          <span border-full></span>
                                          <div class="EditroIcon EditroIcon--expand" expand-border style="display: none"></div>
                                        </div>
                                        <div class="EditroSubForm-inlineItem EditroToggler-more">
                                          <div class="EditroIcon EditroIcon--bdt"></div>
                                          <span border-t></span>
                                        </div>
                                        <div class="EditroSubForm-inlineItem EditroToggler-more">
                                          <div class="EditroIcon EditroIcon--bdr"></div>
                                          <span border-r></span>
                                        </div>
                                        <div class="EditroSubForm-inlineItem EditroToggler-more">
                                          <div class="EditroIcon EditroIcon--bdb"></div>
                                          <span border-b></span>
                                        </div>
                                        <div class="EditroSubForm-inlineItem EditroToggler-more">
                                          <div class="EditroIcon EditroIcon--bdl"></div>
                                          <span border-l></span>
                                          <div class="EditroIcon EditroIcon--collapse" collapse-border></div>
                                        </div>
                                      </div>
                                      <div class="EditroSubForm">
                                      
                                      </div>`);

    [
      ['border-full', 0],
      ['border-t', 0],
      ['border-r', 1],
      ['border-b', 2],
      ['border-l', 3]
    ].forEach(([selector, index]) => {
      const container = this.el.querySelector(`[${selector}]`);
      const components = [
        new InputComponent(this.value.borders[index][0], {
          type: 'number',
          unit: 'px',
          size: 'small'
        }),
        new IconRadioGroupComponent(this.value.borders[index][1], {
          items: [
            {
              value: 'solid',
              icon: 'solid'
            },
            {
              value: 'dashed',
              icon: 'dashed'
            },
            {
              value: 'dotted',
              icon: 'dotted'
            }
          ]
        }),
        new ColorComponent(this.value.borders[index][2])
      ];

      components.forEach((component, i) => {
        component.on('change', val => {
          this.value.borders[index][i] = val;
          this.emit('change-component');
        });
        container.appendChild(component.el);
      });

      this.on('change-collapsed', () => components.forEach((component, i) => component.set(this.value.borders[index][i])));
    });

    const collapsedRoot = this.el.querySelector(`[collapsed]`);
    this.el.querySelector(`[expand-border]`).addEventListener('click', () => {
      isBordersEqual = false;
      this.emit('change-collapsed');
    });
    this.el.querySelector(`[collapse-border]`).addEventListener('click', () => {
      isBordersEqual = true;
      this.emit('change-collapsed');
      this.emit('change-component');
    });

    this.on('change-collapsed', () => collapsedRoot.setAttribute('collapsed', String(isBordersEqual)));
    this.on('change-component', () => {
      if (isBordersEqual) {
        this.collapseBorders();
        this.emit('change', this.value);
      }
    })
  }
}
