import { browser, element, by } from 'protractor';

describe('ack-webcam app example', function () {

  beforeAll(function () {
    browser.get('/');
  });

  describe('ack-webcam', function () {

    it('should display title "ack-webcam test example"', function () {
      expect(browser.getTitle()).toEqual('ack-webcam test example');
    });

    it('should render #ack-webcam container', function () {
      const e = element(by.id('ack-webcam'));
      expect(e).toBeTruthy();
      expect(e.getTagName()).toEqual('div');
    });

    it('should render video tag', function () {
      const e = element(by.tagName('video'));
      expect(e).toBeTruthy();
      expect(e.getTagName()).toEqual('video');
    });
  });
});
