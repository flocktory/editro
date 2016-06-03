import Editro from '../Editro';
import { jsdom } from 'jsdom';

describe('Editro', () => {
  describe('.sanitize()', () => {
    it('should remove data', () => {
      const html = `
        <html>
        <head>
          <!--EDITRO START-->
          <style id="editro-style">
            .editro-body a {
              pointer-events: none;
            }
            .editro-body {
              background: red;
            }
          </style>
          <!--EDITRO END-->
        </head>
        <body class="editro-body"></body></html>
      `;
      const root = document.createElement('div');
      const editro = Editro(root, html);
      const sanitized = editro.sanitize(html);
      const doc = jsdom(sanitized);
      doc.body.classList.contains('editro-body').should.be.false;
      should.not.exist(doc.querySelector('#editro-style'));
    })
  });

  it.only('should conver to-way', () => {
    const html = `
      <html>
      <head>
      </head>
      <body></body></html>
    `;
    const root = document.createElement('div');
    const editro = Editro(root, html);
    console.log(editro.enrich(html))
    editro.sanitize(editro.enrich(html)).replace(/\s+/gmi, '')
      .should.be.eql(html.replace(/\s+/gmi, ''));
  });
});
