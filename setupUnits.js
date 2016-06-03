'use strict';
const fs = require('fs'); 
// hook require to skip non js files
require.extensions['.scss'] = function(m, filename) {
  return m._compile('1', filename);
};
require.extensions['.html'] = function(m, filename) {
  m.exports = fs.readFileSync(filename, 'utf8');
};
require.extensions['.css'] = function(m, filename) {
  return m._compile('3', filename);
};

var chai = require('chai');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');

var jsdom = require('jsdom').jsdom;
var doc = jsdom('<html><body></body></html>');
global.window = doc.defaultView;
global.document = doc;
global.location = doc.location;
global.navigator = window.navigator;


chai.use(sinonChai);
global.spy = sinon.spy;
global.should = chai.should();
