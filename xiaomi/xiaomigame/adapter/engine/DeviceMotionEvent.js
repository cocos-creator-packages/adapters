const inputManager = _cc.inputManager;
let isInit = false;

// NOTE: There is no LANDSCAPE_LEFT on Xiaomi platform
// const LANDSCAPE_LEFT = -90;
const LANDSCAPE_RIGHT = 90;

// NOTE: the data in callback registered on onAccelerometerChange is 10 times than the standard data
// Need to be scaled by 0.1
const factor = -0.1;

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

            qg.onAccelerometerChange && qg.onAccelerometerChange(function (res) {
                let x = res.x;
                let y = res.y;
                
                if (window.orientation === LANDSCAPE_RIGHT) {
                    let tmp = x;
                    x = -y;
                    y = tmp;
                }
                
                self._acceleration.x = x * factor;
                self._acceleration.y = y * factor;
                self._acceleration.z = res.z;
            });
        }
        else {
            qg.startAccelerometer && qg.startAccelerometer({
                fail (err) {
                    cc.error('register Accelerometer failed ! err: ' + err);
                },
                // success () { },
                // complete () { },
            });
        }
    },

    _unregisterAccelerometerEvent () {
        this._accelCurTime = 0;  
        qg.stopAccelerometer && qg.stopAccelerometer({
            fail (err) {
                cc.error('unregister Accelerometer failed ! err: ' + err);
            },
            // success () { },
            // complete () { },
        });
    },
});
