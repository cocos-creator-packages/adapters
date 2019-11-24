import * as window from './window'
import HTMLElement from './HTMLElement'
import HTMLVideoElement from './HTMLVideoElement'
import HTMLScriptElement from './HTMLScriptElement'
import Image from './Image'
import Audio from './Audio'
import Canvas from './Canvas'
import './EventIniter/index.js'

const events = {};
const scripts = [];
const queryScriptsRegex = /script\[type=\"(.*)\"\]/;
const queryScriptSrcRegex = /script\[type=\"(.*)\"\]\[src\]/;

const document = {
  readyState: 'complete',
  visibilityState: 'visible',
  documentElement: window,
  hidden: false,
  style: {},
  location: window.location,
  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,

  head: new HTMLElement('head'),
  body: new HTMLElement('body'),

  createElement(tagName) {
    if (tagName === 'canvas') {
      return new Canvas()
    } else if (tagName === 'audio') {
      return new Audio()
    } else if (tagName === 'img') {
      return new Image()
    }else if (tagName === 'video') {
      return new HTMLVideoElement()
    } else if (tagName === 'script') {
      const scriptElement = new HTMLScriptElement();
      scripts.push(scriptElement);
      return scriptElement;
    }

    return new HTMLElement(tagName)
  },

  createElementNS(nameSpace, tagName) {
    return this.createElement(tagName);
  },

  getElementById(id) {
    if (id === window.canvas.id) {
      return window.canvas
    }
    return null
  },

  getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [window.canvas]
    }
    return []
  },

  getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [window.canvas]
    }
    return []
  },

  querySelector(query) {
    if (query === 'head') {
      return document.head
    } else if (query === 'body') {
      return document.body
    } else if (query === 'canvas') {
      return window.canvas
    } else if (query === `#${window.canvas.id}`) {
      return window.canvas
    }
    return null
  },

  querySelectorAll(query) {
    if (query === 'head') {
      return [document.head]
    } else if (query === 'body') {
      return [document.body]
    } else if (query === 'canvas') {
      return [window.canvas]
    } else {
      let match = queryScriptsRegex.exec(query);
      if (match) {
          return scripts.filter((script) => script.type === match[1]);
      }

      match = queryScriptSrcRegex.exec(query);
      if (match) {
        return scripts.filter((script) => script.type === match[1]).map((script) => script.src);
      }
    }
    return []
  },

  addEventListener(type, listener) {
    if (!events[type]) {
      events[type] = []
    }
    events[type].push(listener)
  },

  removeEventListener(type, listener) {
    const listeners = events[type]

    if (listeners && listeners.length > 0) {
      for (let i = listeners.length; i--; i > 0) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1)
          break
        }
      }
    }
  },

  dispatchEvent(event) {
    const listeners = events[event.type]

    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event)
      }
    }
  }
}

if (!window.fetch) {
    window.fetch = (url) => {
        throw new Error(`fetch() has not been implemented yet.`);
    };
}

export default document
