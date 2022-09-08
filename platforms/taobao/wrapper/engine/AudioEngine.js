const Audio = require('./Audio');
const AudioClip = cc.AudioClip;
const js = cc.js;

let _instanceId = 0;
const _id2audio = {};
const _audioPool = [];
const _maxPoolSize = 32;

function handleVolume (volume) {
    if (volume === undefined) {
        // set default volume as 1
        volume = 1;
    }
    else if (typeof volume === 'string') {
        volume = Number.parseFloat(volume);
    }
    return volume;
};

function getOrCreateAudio (path, serializedDuration) {
    const audio = _audioPool.pop();
    if (audio) {
        audio.id = ++_instanceId;
        return { audio, loadPromise: Promise.resolve(), };
    }
    const { audio: loadedAudio, loadPromise } = Audio.load(path, serializedDuration);
    loadedAudio.id = ++_instanceId;
    return { audio: loadedAudio, loadPromise };
}

function putOrDestroyAudio (audio) {
    if (_audioPool.includes(audio)) {
        return;
    }
    delete _id2audio[audio.id];
    if (_audioPool.length < _maxPoolSize) {
        _audioPool.push(audio);
    } else {
        audio.destroy();
    }
}

const _playingAudio = [];
const _maxPlayingAudio = 10;

function addPlaying (audio) {
    if (!_playingAudio.includes(audio)) {
        _playingAudio.push(audio);
    }
}

function removePlaying (audio) {
    const index = _playingAudio.indexOf(audio);
    if (index !== -1) {
        js.array.fastRemoveAt(_playingAudio, index);
    }
}

function stopAudioIfNeccessary () {
    if (_playingAudio.length >= _maxPlayingAudio) {
        const oldestAudio = _playingAudio.shift();
        if (oldestAudio.getState() === Audio.State.PLAYING) {
            oldestAudio.stop();
        }
        removePlaying(oldestAudio);
        putOrDestroyAudio(oldestAudio);
    }
}


cc.audioEngine = {

    AudioState: Audio.State,

    _maxPoolSize: 32,

    _id2audio,

    _pauseIDCache: [],

    _play (clip, loop, volume) {
        if (!(clip instanceof AudioClip)) {
            return cc.error('Wrong type of AudioClip.');
        }
        let path = clip.nativeUrl;
        let { audio, loadPromise } = getOrCreateAudio(path, clip.duration);

        volume = handleVolume(volume);
        loadPromise.then(() => {
            audio.setSrc(path);
            audio.setLoop(loop || false);
            audio.setVolume(volume);
    
            stopAudioIfNeccessary();
            audio.play();
            addPlaying(audio);
        });

        return audio;
    },

    play: function (clip, loop, volume) {
        const audio = this._play(clip, loop, volume);
        this._id2audio[audio.id] = audio;
        return audio.id;
    },

    setLoop: function (id, loop) {
        const audio = this._id2audio[id];
        if (audio) {
            audio.setLoop(loop);
        }
    },

    isLoop: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getLoop();
        }
        return false;        
    },

    setVolume: function (id, volume) {
        volume = handleVolume(volume);
        const audio = this._id2audio[id];
        if (audio) {
            return audio.setVolume(volume);
        }
    },

    getVolume: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getVolume();
        }
        return 1;        
    },
    
    setCurrentTime: function (id, sec) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.seek(sec);
        }
    },

    
    getCurrentTime: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getCurrentTime();
        }
        return 0;
    },
    
    getDuration: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getDuration();
        }
        return 1;        
    },

    
    getState: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getState();
        }
        return Audio.State.INITIALZING;
        
    },

    
    isPlaying: function(id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getState() === Audio.State.PLAYING;
        }
        return false;        
    },

    setFinishCallback: function (id, callback) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.finishCB = callback;
        }        
    },

    
    pause: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            audio.pause();
        }        
    },

    
    pauseAll: function () {
        for (let id in this._id2audio) {
            const audio = this._id2audio[id];
            if (audio) {
                audio.pause();
            }
        }
    },

    resume: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            audio.resume();
        }    
    },

    resumeAll: function () {
        for (let id in this._id2audio) {
            const audio = this._id2audio[id];
            if (audio) {
                audio.resume();
            }
        }     
    },

    
    stop: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            audio.stop();
        }        
    },

    
    stopAll: function () {
        for (let id in this._id2audio) {
            const audio = this._id2audio[id];
            if (audio) {
                audio.stop();
            }
        }      
    },

    
    setMaxAudioInstance: function (num) {
        // NOT SUPPPORTED
    },

    getMaxAudioInstance: function () {
        return _maxPlayingAudio;
    },
    
    uncache: function (clip) {
        var filePath = clip;
        if (typeof clip === 'string') {
            // backward compatibility since 1.10
            cc.warnID(8401, 'cc.audioEngine', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
            filePath = clip;
        }
        else {
            if (!clip) {
                return;
            }
            filePath = clip.nativeUrl;
        }

        for (let id in _id2audio) {
            const audio = this._id2audio[id];
            if (audio && audio.getSrc() === filePath) {
                audio.stop();
                putOrDestroyAudio(audio);
            }
        }
    },

    uncacheAll: function () {
        this.stopAll();
        for (let id in _id2audio) {
            const audio = _id2audio[id];
            if (audio) {
                audio.stop();
                putOrDestroyAudio(audio);
            }
        }
    },

    _break: function () {
        // DO NOTHING
    },

    _restore: function () {
        // DO NOTHING        
    },

    ///////////////////////////////
    // Classification of interface

    _music: null,

    _effect: {
        audios: [],
        volume: 1,
    },

    
    playMusic: function (clip, loop) {
        if (this._music.getSrc() !== clip.nativeUrl) {
            this._music.stop();
            removePlaying(this._music);
            putOrDestroyAudio(this._music);
        }
        const audio = this._play(clip, loop);
        this._music = audio;
        return audio.id;
    },

    
    stopMusic: function () {
        this._music.stop();
        removePlaying(this._music);
    },

    
    pauseMusic: function () {
        this._music.pause();
        removePlaying(this._music);        
    },

    
    resumeMusic: function () {
        this._music.resume();
        addPlaying(this._music);     
    },
    
    getMusicVolume: function () {
        if (this._music) {
            return this._music.getVolume();
        }
        return 1;
    },
    
    setMusicVolume: function (volume) {
        volume = handleVolume(volume);
        if (this._music) {
            this._music.setVolume(volume);
        }
    },
    
    isMusicPlaying: function () {
        return this._music.getState() === Audio.State.PLAYING;
    },
    
    playEffect: function (clip, loop) {
        const audio = this._play(clip, loop, this._effect.volume);
        this._effect.audios.push(audio);
        addPlaying(audio);
        return audio.id;
    },
    
    setEffectsVolume: function (volume) {
        volume = handleVolume(volume);
        this._effect.audios.forEach(audio => {
            audio.setVolume(volume);
        });
        this._effect.volume = volume;
    },
    
    getEffectsVolume: function () {
        return this._effect.volume;
    },
    
    pauseEffect: function (id) {
        this._effect.audios.some(audio => {
            if (audio.id === id) {
                audio.pause();
                removePlaying(audio);
                return true;
            }
            return false;
        });
    },
    
    pauseAllEffects: function () {
        this._effect.audios.forEach(audio => {
            audio.pause();
            removePlaying(audio);
        });        
    },
    
    resumeEffect: function (id) {
        this._effect.audios.some(audio => {
            if (audio.id === id) {
                audio.resume();
                addPlaying(audio);
                return true;
            }
            return false;
        });        
    },
    
    resumeAllEffects: function () {
        this._effect.audios.forEach(audio => {
            audio.resume();
            addPlaying(audio);
        });        
    },
    
    stopEffect: function (id) {
        this._effect.audios.some(audio => {
            if (audio.id === id) {
                audio.stop();
                removePlaying(audio);
                return true;
            }
            return false;
        });        
    },
    
    stopAllEffects: function () {
        this._effect.audios.forEach(audio => {
            audio.stop();
            removePlaying(audio);
        });        
    }
};
 