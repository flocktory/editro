export function forward(editro, history) {
  return createNav(editro, history, '&#x25BA;',
      history.backward, (h) => h.total() > history.current() + 1);
}

export function backward(editro, history) {
  return createNav(editro, history, '&#x25C4;', history.backward, (h) => h.current() > 0);
}


function createNav(editro, history, text, handler, isEnabled) {
  return () => {
    const node = window.document.createElement('button');
    node.classList.add('Editro-navBtn');
    node.classList.add('EditroButton');

    node.innerHTML = text;

    const updateAttribute = () => {
      if (!isEnabled(history)) {
        node.setAttribute('disabled', 'disabled');
      } else {
        node.removeAttribute('disabled');
      }
    };
    updateAttribute();

    node.addEventListener('click', handler);

    history.on('change', updateAttribute);
    editro.on('change', updateAttribute);

    return {
      node
    };
  };
}
