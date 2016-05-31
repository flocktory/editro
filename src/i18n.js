const translations = {
  size: 'Size',

  key1: 'Key 1 translation'
};

export default function i18n(redefine) {
  return redefine ?
    (k) => redefine(k) || translations[k] :
    (k) => translations[k];
}
