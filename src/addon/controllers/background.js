module.exports = function(Editro) {
  const GRADIENT_RX = /linear-gradient\(([\s\w]+),\s*(#[\d\w]{3,6}|rgba?\([\s\d, \.?]+\))\s*0%\s*,\s*(#[\d\w]{3,6}|rgba?\([\s\d,\.?]+\))\s*100%\s*\)/i;
  const { tags, type: { Controller, BackgroundComponent } } = Editro;
  const enabledTags = [];

  enabledTags.push(
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form,
    'a'
  );

  class Background extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;
    }

    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Background</h3>';

      this.component = new BackgroundComponent(this._getValue(el), {
        i18n: a => a,
        upload: this.editro.upload.bind(this.editro)
      });

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getPane() {
      return 'style';
    }

    _onChange(el, value) {
      const backgroundImages = [];

      if (value.backgroundImage) {
        backgroundImages.push(`url(${value.backgroundImage})`);
      }

      if (!value.hasGradient) {
        el.setStyle('backgroundColor', value.color1);
      } else {
        const direction = value.gradientDirection || 'to right';
        backgroundImages
          .push(`linear-gradient(${direction}, ${value.color1} 0%, ${value.color2} 100%)`);
      }

      if (backgroundImages.length) {
        el.setStyle('backgroundImage', backgroundImages.join(', '));
      } else {
        el.setStyle('backgroundImage', 'none'); // Avoid conflicts with backgroundColor if an element is set backgroundImage
      }

      el.setStyle('backgroundSize', value.backgroundSize);
      el.setStyle('backgroundPosition', value.backgroundPosition);
      el.setStyle('backgroundRepeat', 'no-repeat');
    }

    _setElBg(url) {
      this.el.setStyle('backgroundImage', `url(${url})`);
    }

    _getValue(el) {
      const computedStyle = el.getStyles([
        'backgroundColor',
        'backgroundImage',
        'backgroundSize',
        'backgroundPosition'
      ]);

      let color1 = computedStyle.backgroundColor;
      let hasGradient = false;
      let color2;
      let backgroundImage;
      let gradientDirection;

      const gradientMatch = GRADIENT_RX.exec(computedStyle.backgroundImage || '');
      if (gradientMatch) {
        hasGradient = true;
        gradientDirection = gradientMatch[1].trim();
        color1 = gradientMatch[2].trim();
        color2 = gradientMatch[3].trim();
      }

      const urlMatch = /url\("?([^\)]+)"?\)/i.exec(computedStyle.backgroundImage || '');
      if (urlMatch) {
        backgroundImage = urlMatch[1];
      }

      return {
        color1,
        hasGradient,
        color2,
        gradientDirection,
        backgroundImage,
        backgroundSize: computedStyle.backgroundSize,
        backgroundPosition: computedStyle.backgroundPosition
      };
    }
  }

  Editro.defineHelper('controllers', 'Background', Background);
};
