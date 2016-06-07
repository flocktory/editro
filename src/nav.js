export function forward(history) {
  return makeHistoryNav('&#x25b6;', history.forward);
}
export function backward(history) {
  return makeHistoryNav('&#9664;', history.backward);
}

/**
 * Create history element (backward or forward)
 * @param {String} text
 * @param {Function} onClick click handler
 * @returns {Object} {node}
 */
function makeHistoryNav(text, onClick) {
  return () => {
    const node = window.document.createElement('button');
    node.classList.add('EditroButton');

    node.innerHTML = text;

    node.addEventListener('click', onClick);

    return {
      node
    };
  };
}
