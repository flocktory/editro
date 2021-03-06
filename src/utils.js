const toArray = module.exports.toArray = function(list) {
  return Array.prototype.slice.call(list);
};

module.exports.elem = function(instance, n) {
  if (!n) {
    return n => module.exports.elem(instance, n);
  }

  return instance.getNode()
    .querySelector('.' + instance.getPrefix() + '-' + n);
};
module.exports.elems = function(instance, n) {
  return toArray(instance.getNode()
    .querySelectorAll('.' + instance.getPrefix() + '-' + n));
};
module.exports.is = function(instance, mod) {
  return instance.getNode().classList.contains(instance.getPrefix() + '--' + mod);
};

/**
 * html create element from html
 *
 * @returns {Element}
 */
module.exports.html = function(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
};

module.exports.createDocumentFragment = function (html) {
  return document.createRange().createContextualFragment(html);
};

module.exports.toKebabCase = function (str) {
  return str.replace(/([A-Z])/g, a => '-' + a.toLowerCase());
};
module.exports.toCamelCase = function (str) {
  return str.replace(/(-.)/g, a => a.slice(1).toUpperCase());
};

module.exports.capitalize = function(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
};
module.exports.px = function px(value, defaultValue = 'auto') {
  return value || value === 0 ? value + 'px' : defaultValue;
};

const combination = module.exports.combination = function(...colls) {
  if (colls.length === 1) {
    return colls[0].map(c => [c]);
  }

  return colls[0].reduce((acc, c0) => {
    // maybe better to calc once and then clone?
    const rest = combination(...colls.slice(1));

    rest.forEach(cr => {
      cr.unshift(c0);
      acc.push(cr);
    });

    return acc;
  }, []);
};

module.exports.num = function num(valueStr, defaultValue = null) {
  return valueStr === '' ? defaultValue : parseInt(valueStr, 10);
};

module.exports.emitDomEvent = function emitDomEvent(elements, eventName) {
  const eventInstance = document.createEvent('Event');
  eventInstance.initEvent(eventName, true, true);
  toArray(elements).forEach(element => element.dispatchEvent(eventInstance));
};


/**
 * Creates a debounced function that delays invoking f until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} f function to debounce
 * @param {Number} wait the number of milliseconds to delay
 * @returns {Function} new debounced function
 */
module.exports.debounce = function debounce(f, wait) {
  let id = null;

  return (...args) => {
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout(() => f(...args), wait);
  };
};
