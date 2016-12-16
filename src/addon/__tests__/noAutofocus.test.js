const { equal } = require('assert');
const { pre, post } = require('../noAutofocus');

describe('[addon] noAutofocus', () => {
  it('should change autofocus inside input', () => {
    let html = '<html><body><input type="text" autofocus="true"></body</html>';
    equal(pre(html), '<html><body><input type="text" autofocus-editro="true"></body</html>');
  });

  it('should change autofocus inside textarea', () => {
    let html = '<html><body><textarea type="text" autofocus="true"></textarea></body</html>';
    equal(pre(html), '<html><body><textarea type="text" autofocus-editro="true"></textarea></body</html>');
  });

  it('should not change autofocus outside input', () => {
    let html = '<html><body><input type="text">no autofocus</body</html>';
    equal(pre(html), '<html><body><input type="text">no autofocus</body</html>');
  });

  it('should restore autofocus attr', () => {
    let html = '<html><body><input type="text" autofocus-editro="true"></body</html>';
    equal(post(html), '<html><body><input type="text" autofocus="true"></body</html>');
  });
});
