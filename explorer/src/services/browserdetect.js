import MobileDetect from "mobile-detect";

let instance = null;

class BrowserDetect {
  constructor() {
    if (!instance) {
      this.browserDetect = new MobileDetect(window.navigator.userAgent);
      instance = this;
    }
    return instance;
  }

  /**
   * check is mobile
   *
   * @readonly
   * @memberof BrowserDetect
   */
  get isMobile() {
    return this.browserDetect.phone() !== null;
  }

  get isIphone() {
    return this.browserDetect.is("iphone");
  }

  get isChrome() {
    return this.browserDetect.is("Chrome");
  }

  get isSafari() {
    return this.browserDetect.is("Safari");
  }

  get isChromeExtension() {
    return window.chrome && window.chrome.runtime && window.chrome.runtime.id;
  }

  /**
   * check is tablet
   *
   * @readonly
   * @memberof BrowserDetect
   */
  get isTablet() {
    return this.browserDetect.tablet() !== null;
  }

  /**
   * check is desktop
   *
   * @readonly
   * @memberof BrowserDetect
   */
  get isDesktop() {
    return !this.isMobile && !this.isTablet;
  }

  get isBot() {
    return /bot|googlebot|crawler|spider|robot|crawling/i.test(
      navigator.userAgent
    );
  }
}

export default new BrowserDetect();
