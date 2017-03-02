const debounce = require('../../utils').debounce;

function parseShortColor(color) {
  const match = /^#([0-9A-F])([0-9A-F])([0-9A-F])$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => {
      const v = parseInt(match[i + 1], 16);

      return v * 16 + v;
    }),
    opacity: 1
  };
}


function parseLongColor(color) {
  const match = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 16)),
    opacity: 1
  };
}


function parseRgbColor(color) {
  const match = /^rgb\(([\d\s]+),([\d\s]+),([\d\s]+)\)$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 10)),
    opacity: 1
  };
}


function parseRgbaColor(color) {
  const match = /^rgba\(([\d\s]+),([\d\s]+),([\d\s]+),([\s\d.]+)\)$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 10)),
    opacity: parseFloat(match[4])
  };
}


function colorToPair(color) {
  let components = [255, 255, 255];
  let opacity = 1;

  const match = parseShortColor(color) || parseLongColor(color) || parseRgbColor(color) || parseRgbaColor(color);
  if (match) {
    components = match.components;
    opacity = parseInt(match.opacity * 100, 10);
  }

  const formatHex = num => {
    const hex = num.toString(16);

    return hex.length === 1 ? `0${hex}` : hex;
  };

  return {
    color: `#${formatHex(components[0])}${formatHex(components[1])}${formatHex(components[2])}`,
    opacity
  };
}


function pairToColor({ color, opacity }) {
  const { components } = parseLongColor(color);

  return `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${opacity / 100})`;
}


module.exports = function(Editro) {
  const { Component } = Editro.type;

  class ColorComponent extends Component {
    template() {
      const { color, opacity } = colorToPair(this.value);

      return `<div class="EditroField">
                <div class="EditroField-label">
                  <div class="EditroField-labelWrapper">
                    ${this.config.label}
                  </div>
                </div>
                <div class="EditroField-control EditroField-control--inline">
                  <div class="EditroColor EditroControl">
                    <div class="EditroColor-colorWrapper">
                      <input class="EditroColor-color" type="color" value="${color}" style="opacity: ${opacity / 100}" />
                    </div>
                    <div class="EditroColor-panel">
                      <input class="EditroColor-opacity EditroRange" type="range" value="${opacity}" min="0" max="100">
                    </div>
                  </div>
                  <div class="EditroInputWrapper EditroInputWrapper--full EditroControl">
                    <input type="text" class="EditroInput" value="${color}" />
                  </div>
                </div>
              </div>`;
    }

    watch() {
      const color = this.el.querySelector('input[type=color]');
      const opacity = this.el.querySelector('input[type=range]');
      const text = this.el.querySelector('input[type=text]');

      const collectColor = debounce(() => {
        const value = pairToColor({
          color: color.value,
          opacity: opacity.value
        });

        color.style.opacity = opacity.value / 100;
        text.value = value;
        this.emit('change', value);
      }, 30);

      this.addListener(color, 'change', collectColor);
      this.addListener(opacity, 'change', collectColor);

      const onTextChanged = () => {
        const newValues = colorToPair(text.value);

        color.value = newValues.color;
        opacity.value = newValues.opacity;

        color.style.opacity = opacity.value / 100;
        this.emit('change', pairToColor(newValues));
      };
      this.addListener(text, 'keyup', onTextChanged);
      this.addListener(text, 'change', onTextChanged);

      // Setup opacity when color is pasted
      this.addListener(text, 'paste', () => setTimeout(() => {
        text.value = text.value.trim();
        opacity.value = 100;
      }));
    }
  }

  Editro.defineHelper('type', 'ColorComponent', ColorComponent);
};