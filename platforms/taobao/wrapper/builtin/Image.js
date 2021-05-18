var screencanvas = $global.screencanvas;

function Image () {
    // empty constructor
}
let ImageProxy = new Proxy(Image, {
    construct (target, args) {
        return screencanvas.createImage();
    },
});

// NOTE: this is a hack operation
// let img = new window.Image()
// console.error(img instanceof window.Image)  => false
export default ImageProxy;