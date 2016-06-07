# Editro
Visual editor written in Javascript. Think about MS Front Page or Dreamweaver that can be injected into you web app.

*Warning! Package is tested only in chrome.*

## How to use
```javascript
var Editro = require('editro');

// some DOM element
var root = document.getElementById('editro-root');
// html code to edit
var html = '<html><head></head><body><h1>Hello World!</h1></body></html>';
// optional config object (see below)
var config = {};

editro = Editro(root, html, config);
editro.on('change', function(updatedHtml) {
  console.log(updatedHtml);
});
```

### Config
| Field | Type |
|-------|------|
| controllers | *Array* of controllers objects |
| nav | *Array* of nav functions |
| i18n | *Function* translate function `i18n = (key) => translation` |

More code (examples/dev)[examples/dev]

## Examples
`/examples/dev/` – development example. Show how to use custom controllers and navigation. Show how to integrate editro with (codemirror)[http://codemirror.net].


## Production build
```
make build
```

## Development
```
npm start
```
Go to [localhost:4001](http://localhost:4001/)

## Future plans
- [ ] More default controls
- [ ] Custom colorpicker (simple, with opacity)
