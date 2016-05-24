const defaultTransforms = [
  {
    match: true,
    type: 'number',
    label: 'Margin top',
    target: {
      type: 'style',
      field: 'marginTop'
    }
  },
  {
    match: true,
    type: 'number',
    label: 'Padding',
    target: {
      type: 'style',
      field: 'padding'
    }
  },
  {
    match: true,
    type: 'text',
    label: 'Font family',
    target: {
      type: 'style',
      field: 'fontFamily'
    }
  },
  {
    match: 'img',
    type: 'image',
    label: 'Source image',
    target: {
      type: 'attr',
      field: 'src'
    }
  }
];

/**
 * Create toolbox
 *
 * @param root DOM element to render tollbox
 * @param e DOM element to edit
 * @param omarginTopptions
 * @param options.transforms list of transforms
 * @returns {undefined}
 */
export default function Toolbox(root, el, { transforms = [] } = {}) {
  transforms = defaultTransforms.concat(transforms);
  const fragment = window.document.createDocumentFragment();
  const filter = isElMatchTransform.bind(null, el);
  transforms
    .filter(filter)
    .map(t => renderTransform(t, el)) // can use Proxy
    .forEach(t => fragment.appendChild(t));

  root.innerHTML = '';
  root.appendChild(fragment);

  const insertBtn = window.document.createElement('button');
  insertBtn.innerText = 'Insert inside'; // TODO inside outside befre after
  insertBtn.addEventListener('click', () => {
    const ins = window.document.createElement('div');
    ins.style.background = '#fca';
    ins.style.padding = '10px'
    ins.style.margin = '10px'
    ins.innerHTML = 'WARGHHHHHH!!!!';
    el.appendChild(ins);
  });
  root.appendChild(insertBtn);

  const insertBtn2 = window.document.createElement('button');
  insertBtn2.innerText = 'Insert split'; // TODO inside outside befre after
  insertBtn2.addEventListener('click', () => {
    const ins = window.document.createElement('div');
    ins.innerHTML = `
      <div>
        <div style="width:50%;float:left;background: #FFB8B8;">Panel 1</div>
        <div style="width:50%;float:left;background: #DDFFDD;">Panel 2</div>
        <div style="clearfix:both;"></div>
      </div>`;
    el.appendChild(ins);
  });
  root.appendChild(insertBtn2);


  const removeBtn = window.document.createElement('button');
  removeBtn.innerText = 'Remove el';
  removeBtn.addEventListener('click', () => {
    el.parentNode.removeChild(el);
    root.innerHTML = 'Click on element to select';
  });
  root.appendChild(removeBtn);

  return {
    destroy: () => {
      // Clear handlers
    }
  };
}

/**
 * Check if element match
 *
 * @param e dom node
 * @param t transform object
 * @returns {Boolean}
 */
function isElMatchTransform(e, t) {
  const { match } = t;
  if (t.match === true) {
    return true;
  }

  // check is string, also add function matcher, attribute matcher
  if (t.match) {
    return e.tagName.toLowerCase() === match;
  }

  throw new Error(`Wrong transform match: ${match}`);
}

let id = 0;
// Get transform render DOM node for it
function renderTransform(t, el) {
  id++;
  const { type, label, target } = t;
  const value = getTargetValue(el, target);
  const tel = window.document.createElement('div');
  tel.className = 'Toolbox-field';

  // TODO should choose dinamycaly from list of renderers by "type"
  if (type === 'number' || type === 'text') {
    tel.innerHTML = `
      <label for="${id}">${label}</label>
      <input type="text" value="${value}">
    `;
    tel.querySelector('input').addEventListener('change', (e) => {
      setTargetValue(el, target, e.target.value);
    });
  } else if (type === 'image') {
    tel.innerHTML = `
      <label for="${id}">Best image selector</label>
      <label for="${id}">${label}</label>
      <input type="text" value="${value}">
    `;
    tel.querySelector('input').addEventListener('change', (e) => {
      setTargetValue(el, target, e.target.value);
    });
  }

  return tel;
}


function getTargetValue(e, { type, field }) {
  if (type === 'style') {
    return window.getComputedStyle(e)[field];
  }
  if (type === 'attr') {
    return e.getAttribute(field);
  }
  throw new Error(`Wrong target type ${type}`);
}

function setTargetValue(e, { type, field }, value) {
  if (type === 'style') {
    e.style[field] = value;
  } else if (type === 'attr') {
    e.setAttribute(field, value);
  } else {
    throw new Error(`Wrong target type ${type}`);
  }
}

