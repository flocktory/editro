const { equal } = require('assert');
const { pre } = require('../monacoEditor');

const noN = s => s.replace(/\n/gmi, '').replace(/>\s*</gmi, '><');

describe('[addon] monacoEditor', () => {
  let html, want;

  it('should remove symbols between', () => {
    let html = '<html>NO<head></head></html>';
    equal(pre(html), '<html><head></head></html>');
  });
  it('should remove symbols between, when header exist', () => {
    let html = '<html>NO<head></head><body><header>Test</header></body></html>';
    let want = '<html><head></head><body><header>Test</header></body></html>';
    equal(pre(html), want);
  });
  it('should remove symbols between, when tag contains attrs', () => {
    let html = '<html at="t">NO<head></head><body><header>Test</header></body></html>';
    let want = '<html at="t"><head></head><body><header>Test</header></body></html>';
    equal(pre(html), want);

    html = '<html>NO<head at="t"></head><body><header>Test</header></body></html>';
    want = '<html><head at="t"></head><body><header>Test</header></body></html>';
    equal(pre(html), want);
  });
  it('should remove symbols between, when multiline', () => {
    let html = `
        <!doctype html>
          <html>fdfsdfff
          <head>
            </head>
          </html>
    `;
    let want = `
        <!doctype html>
          <html>
          <head>
            </head>
          </html>
    `;
    equal(noN(pre(html)), noN(want));
  });

  it('should remove all text between tags inside head', () => {
    html = '<html><head><meta test="a"/>WRONG</head><body><header>Test</header></body></html>';
    want = '<html><head><meta test="a"/></head><body><header>Test</header></body></html>';
    equal(noN(pre(html)), noN(want));
  });
  it('should remove all text between head and body', () => {
    html = '<html><head><meta test="a"/></head>WRONG<body><header>Test</header></body></html>';
    want = '<html><head><meta test="a"/></head><body><header>Test</header></body></html>';
    equal(noN(pre(html)), noN(want));
  });
  it('should not remove text inside script or style', () => {
    html = '<html><head><style>KEEP</style></head><body></body></html>';
    equal(noN(pre(html)), html);

    html = '<html><head><script>KEEP</script></head><body></body></html>';
    equal(noN(pre(html)), html);
  });
});
