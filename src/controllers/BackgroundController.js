import Controller from '../Controller';
import BackgroundComponent from '../components/BackgroundComponent';
import {inputTags, listTags, definitionTags, blockTags, headersTags, contentTags, formTags} from './tags';


export default class BackgroundController extends Controller {
  static test(el) {
    const tags = [];

    tags.push(
      ...inputTags,
      ...listTags,
      ...definitionTags,
      ...blockTags,
      ...headersTags,
      ...contentTags,
      ...formTags
    );

    return tags.indexOf(el.tagName.toLowerCase()) !== -1;
  }

  createComponent(value) {
    return new BackgroundComponent(value, {
      i18n: this.i18n
    });
  }

  get() {
    const computedStyle = this.el.computedStyle;

    let color1 = computedStyle.backgroundColor;
    let hasGradient = false;
    let color2;
    let backgroundImage;
    let gradientDirection;

    const gradientMatch = /linear-gradient\(([\s\w]+),\s*(#[\d\w]{3,6}|rgba?\([\s\d,]+\))\s*0%\s*,\s*(#[\d\w]{3,6}|rgba?\([\s\d,]+\))\s*100%\s*\)/i.exec(computedStyle.backgroundImage || '');
    if (gradientMatch) {
      hasGradient = true;
      gradientDirection = gradientMatch[1].trim();
      color1 = gradientMatch[2].trim();
      color2 = gradientMatch[3].trim();
    }

    const urlMatch = /url\(([^\)]+)\)/i.exec(computedStyle.backgroundImage || '');
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

  set(value) {
    const backgroundImages = [];

    if (value.backgroundImage) {
      backgroundImages.push(`url(${value.backgroundImage})`);
    }

    if (!value.hasGradient) {
      this.el.style.backgroundColor = value.color1;
    } else {
      backgroundImages.push(`linear-gradient(${value.gradientDirection}, ${value.color1} 0%, ${value.color2} 100%)`);
    }

    if (backgroundImages.length) {
      this.el.style.backgroundImage = backgroundImages.join(', ');
    }

    this.el.style.backgroundSize = value.backgroundSize;
    this.el.style.backgroundPosition = value.backgroundPosition;
    this.el.style.backgroundRepeat = 'no-repeat';
  }

  get title() {
    return 'Background';
  }
}
