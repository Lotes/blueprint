'use strict';

import deferred = require('./deferred');
var dot: any = require('graphlib-dot');

function render(dotScript: string, workerPath: string = 'renderer.worker.js'): deferred.Abortable<any> {
    var worker = new Worker(workerPath);
    var result = new deferred.Deferred<any>(() => { worker.terminate(); });
    worker.addEventListener('message', function(e: any) {
        try {
            var message = JSON.parse(e.data);
            if(message.success === true)
                result.resolve(dot.read(message.result));
            else
                result.reject(new Error(message.error));
        } catch(err) {
            result.reject(err);
        }
        worker.terminate();
    }, false);
    worker.postMessage(dotScript);
    return result.abortable;
}

//export
declare var module: any;
if(typeof window !== 'undefined') {
    (<any>window).renderDot = render;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = render;
}