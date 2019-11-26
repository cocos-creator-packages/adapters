import Canvas from './Canvas'

export { default as navigator} from './navigator'
export { default as XMLHttpRequest} from './XMLHttpRequest'
export { default as WebSocket} from './WebSocket'
export { default as Image} from './Image'
export { default as ImageBitmap} from './ImageBitmap'
export { default as Audio} from './Audio'
export { default as FileReader} from './FileReader'
export { default as HTMLElement} from './HTMLElement'
export { default as HTMLImageElement} from './HTMLImageElement'
export { default as HTMLCanvasElement} from './HTMLCanvasElement'
export { default as HTMLMediaElement} from './HTMLMediaElement'
export { default as HTMLAudioElement} from './HTMLAudioElement'
export { default as HTMLVideoElement} from './HTMLVideoElement'
export { default as WebGLRenderingContext} from './WebGLRenderingContext'
export { TouchEvent, MouseEvent, DeviceMotionEvent } from './EventIniter/index.js'
export { default as localStorage} from './localStorage'
export { default as location} from './location'
export * from './WindowProperties'

// 暴露全局的 canvas
GameGlobal.screencanvas = GameGlobal.screencanvas || new Canvas()
const canvas = GameGlobal.screencanvas;

const {
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    requestAnimationFrame,
    cancelAnimationFrame,
} = window;


export {
    canvas,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    requestAnimationFrame,
    cancelAnimationFrame,
};
