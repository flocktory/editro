# Editro
Visual editor written in Javascript. Think about MS Front Page or Dreamweaver that can be injected into you web app.

## How to use
```
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
- [ ] More tests
- [ ] Custom colorpicker (simple, with opacity)
