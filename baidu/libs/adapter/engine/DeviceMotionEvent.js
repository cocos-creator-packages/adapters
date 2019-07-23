
const inputManager = _cc.inputManager;
let isInit = false;

let deviceOrientation = 1;
if (swan.onDeviceOrientationChange) {
  swan.onDeviceOrientationChange(function (res) {
    if (res.value === 'landscape') {
      deviceOrientation = 1;
    }
    else if (res.value === 'landscapeReverse') {
      deviceOrientation = -1;
    }
  });
}

Object.assign(inputManager, {
    setAccelerometerEnabled (isEnable) {
        let scheduler = cc.director.getScheduler();
        scheduler.enableForTarget(this);
        if (isEnable) {
            this._registerAccelerometerEvent();
            scheduler.scheduleUpdate(this);
        }
        else {
            this._unregisterAccelerometerEvent();
            scheduler.unscheduleUpdate(this);
        }
    },

    // No need to adapt
    // setAccelerometerInterval (interval) {  },

    _registerAccelerometerEvent () {
        this._accelCurTime = 0;   
        if (!isInit) {
            isInit = true;
            let self = this;
            self._acceleration = new cc.Acceleration();

            swan.onAccelerometerChange && swan.onAccelerometerChange(function (res) {
                let x = res.x;
                let y = res.y;
            
                let systemInfo = swan.getSystemInfoSync();
                let windowWidth = systemInfo.windowWidth;
                let windowHeight = systemInfo.windowHeight;
                if (windowHeight < windowWidth) {
                    let tmp = x;
                    x = -y;
                    y = tmp;
                }
                
                self._acceleration.x = x * deviceOrientation;
                self._acceleration.y = y * deviceOrientation;
                self._acceleration.z = res.z;
            });
        }
        else {
            swan.startAccelerometer && swan.startAccelerometer({
                fail: function (err) {
                    cc.error('register Accelerometer failed ! err: ' + err);
                },
                success: function () {},
                complete: function () {},
            });
        }
    },

    _unregisterAccelerometerEvent () {
        this._accelCurTime = 0;  
        swan.stopAccelerometer && swan.stopAccelerometer({
            fail: function (err) {
                cc.error('unregister Accelerometer failed ! err: ' + err);
            },
            success: function () {},
            complete: function () {},
        });
    },
});
