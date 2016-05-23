'use strict';
var chai = require('chai');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');

var jsdom = require('jsdom').jsdom;
var doc = jsdom('<html><body></body></html>');
global.window = doc.defaultView;
global.document = doc;
global.location = doc.location;
global.navigator = window.navigator;


global.should = chai.should();
chai.use(sinonChai);
global.spy = sinon.spy;
