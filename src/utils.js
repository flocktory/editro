/**
 * Module with general helper functions
 */


export function toArray(pseudoArray) {
  return Array.prototype.slice.call(pseudoArray || []);
}


export function createDocumentFragment(html) {
  try {
    return document.createRange().createContextualFragment(html);
  } catch (e) {
    const div = document.createElement('div');
    div.innerHTML = html;

    const fragment = document.createDocumentFragment();
    toArray(div.children).forEach(child => fragment.appendChild(child));

    return fragment;
  }
}


/**
 * Create an element search function
 * @param {Element} root block node
 * @param {String} blockName
 * @returns {Function} search function `search(elementName)`
 */
export function elementSearch(root, blockName) {
  return name => root.querySelector(`.${blockName}-${name}`);
}


/**
 * Add click handler to element
 * @param {Element} el
 * @param {Function} handler
 */
export function click(el, handler) {
  el.addEventListener('click', handler);
}


/**
 * Toggle Attribute
 * @param {Element} el
 * @param {String} attrName
 */
export function toggleAttr(el, attrName) {
  if (el.hasAttribute(attrName)) {
    el.removeAttribute(attrName);
  } else {
    el.setAttribute(attrName, '');
  }
}


export function num(valueStr, defaultValue = null) {
  return valueStr === '' ? defaultValue : parseInt(valueStr, 10);
}


export function px(value, defaultValue = 'auto') {
  return value || value === 0 ? value + 'px' : defaultValue;
}


export function emitDomEvent(elements, eventName) {
  const eventInstance = document.createEvent('Event');
  eventInstance.initEvent(eventName, true, true);
  toArray(elements).forEach(element => element.dispatchEvent(eventInstance));
}
