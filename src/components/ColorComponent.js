import Component from '../Component';


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
  }
}


function parseLongColor(color) {
  const match = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 16)),
    opacity: 1
  }
}


function parseRgbColor(color) {
  const match = /^rgb\(([\d\s]+),([\d\s]+),([\d\s]+)\)$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 10)),
    opacity: 1
  }
}


function parseRgbaColor(color) {
  const match = /^rgba\(([\d\s]+),([\d\s]+),([\d\s]+),([\s\d.]+)\)$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 10)),
    opacity: parseFloat(match[4])
  }
}


function colorToPair(color) {
  let components = [255, 255, 255];
  let opacity = 1;

  const match = parseShortColor(color) || parseLongColor(color) || parseRgbColor(color) || parseRgbaColor(color);
  if (match) {
    components = match.components;
    opacity = parseInt(match.opacity * 100, 10);
  }

  return {
    color: `#${components[0].toString(16)}${components[1].toString(16)}${components[2].toString(16)}`,
    opacity
  };
}


function pairToColor({color, opacity}) {
  const {components} = parseLongColor(color);

  return `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${opacity / 100})`;
}


export default class ColorComponent extends Component {
  template() {
    const {color, opacity} = colorToPair(this.value);

    return `<div class="EditroColor EditroColor--separate EditroControl">
              <div class="EditroColor-colorWrapper">
                <input class="EditroColor-color" type="color" value="${color}" style="opacity: ${opacity / 100}" />
              </div>
              <div class="EditroColor-panel">
                <input class="EditroColor-opacity EditroRange" type="range" value="${opacity}" min="0" max="100">
              </div>
            </div>`;
  }

  watch() {
    const color = this.el.querySelector('input[type=color]');
    const opacity = this.el.querySelector('input[type=range]');

    const collectColor = () => {
      const value = pairToColor({
        color: color.value,
        opacity: opacity.value
      });

      color.style.opacity = opacity.value / 100;
      this.emit('change', value);
    };

    this.addListener(color, 'change', collectColor);
    this.addListener(opacity, 'change', collectColor);
  }
}
