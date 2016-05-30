/**
 * Module with general helper functions
 */


export function createDocumentFragment(html) {
  return document.createRange().createContextualFragment(html);
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
