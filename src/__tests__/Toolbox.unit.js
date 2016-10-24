/* eslint-disable no-unused-expressions */

import Toolbox from '../Toolbox';
import {jsdom} from 'jsdom';


describe('Toolbox', () => {
  beforeEach(() => {});
  afterEach(() => {});

  it('should render if empty', () => {

    const root = jsdom('<div></div>');
    const el = jsdom('<span />');
    // js-dom doesn't work with document.createRange ((
    // const toolbox = new Toolbox(el, [], root);

  });
});
