    // baidu can`t use system So need special treatment
    cc.loader.downloader.loadSubpackage = function(name, completeCallback) {
        swan.loadSubpackage({
            name: name,
            success: function() {
                cc$System.import('virtual:///prerequisite-imports/' + name).then(function() {
                    if (completeCallback) { completeCallback(); }
                }).catch(function(err) {
                    if (completeCallback) { completeCallback(err); }
                });
            },
            fail: function() {
                if (completeCallback) { completeCallback(new Error(`Failed to load subpackage ${name}`)); }
            },
        });
    };