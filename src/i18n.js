const translations = {
  size: 'Size',

  key1: 'Key 1 translation'
};

export default function i18n(redefine) {
  const translate = (k) => translations[k] || k;
  return redefine ?
    (k) => redefine(k) || translate(k) :
    translate;
}
