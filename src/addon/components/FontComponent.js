module.exports = function(Editro) {
  const { BaseCompositeComponent } = Editro.type;

  class FontComponent extends BaseCompositeComponent {
    getSubComponentsFactories() {
      return [
        {
          component: () => Editro.createComponent('ColorComponent', this.value.color, {
            label: this.config.i18n('Text color')
          }),
          onChange: color => {
            this.value.color = color;
          }
        },
        {
          component: () => Editro.createComponent('InputComponent', this.value.fontSize, {
            type: 'number',
            unit: 'px',
            label: this.config.i18n('Font size')
          }),
          onChange: fontSize => {
            this.value.fontSize = fontSize;
          }
        },
        {
          component: () => Editro.createComponent('InputComponent', this.value.lineHeight, {
            type: 'number',
            unit: 'px',
            label: this.config.i18n('Line height')
          }),
          onChange: lineHeight => {
            this.value.lineHeight = lineHeight;
          }
        },
        {
          component: () => Editro.createComponent('SelectComponent', this.value.textAlign, {
            choices: ['left', 'center', 'right'].map(ta => [ta, this.config.i18n(ta)]),
            label: this.config.i18n('Text align')
          }),
          onChange: textAlign => {
            this.value.textAlign = textAlign;
          }
        },
        {
          component: () => Editro.createComponent('SelectComponent', this.value.fontWeight, {
            choices: ['normal', 'light', 'bold'].map(ta => [ta, this.config.i18n(ta)]),
            label: this.config.i18n('Font weight')
          }),
          onChange: fontWeight => {
            this.value.fontWeight = fontWeight;
          }
        },
        {
          component: () => Editro.createComponent('SelectComponent', this.value.fontStyle, {
            choices: ['normal', 'italic'].map(ta => [ta, this.config.i18n(ta)]),
            label: this.config.i18n('Font style')
          }),
          onChange: fontStyle => {
            this.value.fontStyle = fontStyle;
          }
        }
      ];
    }
  }

  Editro.defineHelper('type', 'FontComponent', FontComponent);
};