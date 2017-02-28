require('mocha.css');
require('mocha');
const e = document.getElementById('editro');
document.body.removeChild(e);
mocha.setup('bdd');
var req = require.context('../src', true, /\.test\.js$/);
req.keys().forEach(req);
mocha.run();
