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
  let opacity = 0;

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

  console.log("{color, opacity, result: `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${opacity / 100})`}", JSON.stringify({color, opacity, result: `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${opacity / 100})`}, true, 2));

  return `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${opacity / 100})`;
}


export default class ColorComponent extends Component {
  template() {
    const {color, opacity} = colorToPair(this.value);

    return `<div class="EditroColor EditroColor--separate EditroControl">
              <div class="EditroColor-sample" style="background-color: ${this.value};" sample></div>
              <div class="EditroColor-panel">
                <input class="EditroColor-color" type="color" value="${color}">
                <input class="EditroColor-opacity EditroRange" type="range" value="${opacity}" min="0" max="100">
              </div>
            </div>`;
  }

  watch() {
    const root = this.el.firstChild;
    const color = this.el.querySelector('input[type=color]');
    const opacity = this.el.querySelector('input[type=range]');
    const sample = this.el.querySelector('[sample]');

    sample.addEventListener('click', function() {
      const isOpenedValue = root.getAttribute('is-opened') === 'true' ? 'false' : 'true';

      root.setAttribute('is-opened', isOpenedValue);
    });

    const collectColor = () => {
      const value = pairToColor({
        color: color.value,
        opacity: opacity.value
      });

      sample.style.backgroundColor = value;
      this.emit('change', value);
    };

    color.addEventListener('change', collectColor);
    opacity.addEventListener('change', collectColor);
  }
}
