import style from './render/style'
import tplFn from './render/templateFn'
import Layout from './engine'
import dataDemo from './dataDemo'

let __env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan;
let sharedCanvas  = __env.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');
function draw() {
    let template = tplFn(dataDemo);
    Layout.clear();
    Layout.init(template, style);
    Layout.layout(sharedContext);
}

function updateViewPort(data) { 
    Layout.updateViewPort({
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
    });
}

__env.onMessage(data => {
    if ( data.fromEngine && data.event === 'viewport' ) {
        updateViewPort(data);
        draw();
    }
});
