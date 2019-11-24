import HTMLElement from './HTMLElement';

export default class HTMLScriptElement extends HTMLElement {
  constructor (type) {
    super(type);
    this._src = '';
  }

  get src () {
    return this._src;
  }

  set src (value) {
    this._src = value;
    try {
      let path;
      if (value.indexOf(':') >= 0) {
        path = new webkitURL(value).pathname;
        if (path[0] === '/') {
			path = path.substr(1);
		  }
		  var segs = path.split('/');
		  segs.shift();
		  path = segs.join('/');
      } else {
        path = value;
      }
      require('../../' + path);
      this.dispatchEvent({type: 'load'});
    } catch (error) {
      this.dispatchEvent({type: 'error'});
    }
  }

  get text() {
      return this.innerHTML;
  }

  set text(value) {
      this.innerHTML = value;
  }
}
