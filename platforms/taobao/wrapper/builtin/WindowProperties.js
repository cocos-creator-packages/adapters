const { pixelRatio } = my.getSystemInfoSync()
const devicePixelRatio = pixelRatio;

let { width, height } = $global.screencanvas.getBoundingClientRect();
export const innerWidth = width;
export const innerHeight = height;
export { devicePixelRatio }
export const screen = {
  width,
  height,
  availWidth: innerWidth,
  availHeight: innerHeight,
  availLeft: 0,
  availTop: 0,
}

export const performance = {
  now: Date.now
};

export const ontouchstart = null;
export const ontouchmove = null;
export const ontouchend = null;