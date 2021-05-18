var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;
Page({
	onReady () {
		__globalAdapter.onTouchStart = function (cb) {
			touchstartCB = cb;
		}
		__globalAdapter.onTouchCancel = function (cb) {
			touchcancelCB = cb;
		}
		__globalAdapter.onTouchEnd = function (cb) {
			touchendCB = cb;
		}
		__globalAdapter.onTouchMove = function (cb) {
			touchmoveCB = cb;
		}
		my.createCanvas({
			id:'GameCanvas', 
			success(canvas){
				$global.screencanvas = canvas;
				$global.__cocosCallback();
			},
			fail (err) {
				console.error('failed to init on screen canvas', err)
			}
		});
	},
	onError (err) {
		console.error('error in page: ', err);
	},
	onTouchStart (event) {
		touchstartCB && touchstartCB(event);
	},
	onTouchCancel (event) {
		touchcancelCB && touchcancelCB(event);
	},
	onTouchEnd (event) {
		touchendCB && touchendCB(event);
	},
	onTouchMove (event) {
		touchmoveCB && touchmoveCB(event);
	},
	canvasOnReady () {
	}
});
