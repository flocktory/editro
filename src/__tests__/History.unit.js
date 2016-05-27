/* eslint-disable no-unused-expressions */

import History from '../History';
import { jsdom } from 'jsdom';


describe('History', () => {
  let history = null;
  let onChange = null;
  let back = null;
  let forward = null;

  beforeEach(() => {
    onChange = spy();
    const window = jsdom('<iframe />').defaultView;
    global.window = window;
    const $iframe = window.document.querySelector('iframe');
    history = new History($iframe, onChange);

    const dispatch = (shiftKey) => window.document.dispatchEvent(new window.KeyboardEvent('keydown', {
      shiftKey,
      keyCode: 90,
      metaKey: true
    }));

    back = dispatch.bind(null, false);
    forward = dispatch.bind(null, true);
  });

  afterEach(() => {
    history.destroy();
    global.window = null;
  });

  it('should return back one step', () => {
    history.push(1);
    history.push(2);
    back();
    onChange.should.have.been.calledWith(1);
  });
  it('should return back two steps', () => {
    history.push(1);
    history.push(2);
    history.push(3);
    back();
    back();
    onChange.should.have.been.calledWith(1);
  });
  it('should move forward', () => {
    history.push(1);
    history.push(2);
    history.push(3);
    back();
    back();
    forward();
    onChange.should.have.callCount(3);
    onChange.lastCall.args[0].should.be.eql(2);
  });
  it('should not move forward if last point', () => {
    history.push(1);
    forward();
    onChange.should.not.have.been.called;
  });
  it('should not move forward if last point', () => {
    history.push(1);
    forward();
    onChange.should.not.have.been.called;
  });
  it('should not move backward if first point', () => {
    back();
    onChange.should.not.have.been.called;
  });
  it('should create new history if push after back', () => {
    history.push(1);
    history.push(2);
    back();
    history.push(3);
    back();
    onChange.lastCall.args[0].should.be.eql(1);
  });
  it('should take care of limit', () => {
    const $iframe = window.document.querySelector('iframe');
    history = new History($iframe, onChange, 2);

    history.push(1);
    history.push(2);
    history.push(3);
    back();
    back();
    back();
    onChange.lastCall.args[0].should.be.eql(2);
  });

  it('should move backward when method called', () => {
    history.push(1);
    history.push(2);
    history.backward();
    onChange.should.have.been.calledWith(1);
  });
  it('should move forward when method called', () => {
    history.push(1);
    history.push(2);
    history.backward();
    history.forward();
    onChange.lastCall.args[0].should.be.eql(2);
  });
});
