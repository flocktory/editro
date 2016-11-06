const { equal } = require('assert');
const { pre, post } = require('../clearScripts');

describe('[addon] clearScripts', () => {
  it('should set script type attribute', () => {
    let html = '<html><head><script></script></head></html>';
    equal(pre(html), '<html><head><script type="editro/noscript" ></script></head></html>');

    html = '<html><head><script src=""></script></head></html>';
    equal(pre(html), '<html><head><script type="editro/noscript"  src=""></script></head></html>');
  });
  it('should change script type attribute', () => {
    const html = '<html><head><script type="text/javascript" src=""></script></head></html>';
    equal(pre(html), '<html><head><script type="editro/noscript" src=""></script></head></html>');
  });

  it('should return type = text/javascript', () => {
    const html = '<html><head><script type="editro/noscript" ></script></head></html>';
    equal(post(html), '<html><head><script type="text/javascript" ></script></head></html>');
  });
});
