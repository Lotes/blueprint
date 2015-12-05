declare function require(name:string): any;
declare var module: any;

(function() {
    'use strict';
    
    var dot = require('graphlib-dot');

    enum State {
        PENDING,
        REJECTED,
        RESOLVED
    }
    
    class Abortable<G> {
        _successList: ((result: G)=>void)[] = [];
        _failList: ((err: Error)=>void)[] = [];
        constructor(abort: ()=>void) { 
            this.abort = abort;
        }
        success(action: (result: G)=>void): Abortable<G> {
            this._successList.push(action);
            return this;
        }
        fail(action: (err: Error)=>void): Abortable<G> {
            this._failList.push(action);
            return this;
        }
        abort: ()=>void;
    }

    class Deferred<G> {
        private state: State = State.PENDING;
        abortable: Abortable<G>;
        constructor(abort: ()=>void) {
            this.abortable = new Abortable<G>(() => {
                abort();
                this.reject(new Error('User aborted!'));
            });
        }
        reject(err: Error): void {
            if(this.state !== State.PENDING)
                return;
            this.abortable._failList.forEach((action) => { action(err); });
            this.state = State.REJECTED;
        }
        resolve(result: G): void {
            if(this.state !== State.PENDING)
                return;
            this.abortable._successList.forEach((action) => { action(result); });
            this.state = State.RESOLVED;
        }
    }
    
    function render(dotScript: string, workerPath: string = 'renderer.worker.js'): Abortable<string> {
        var worker = new Worker(workerPath);
        var result = new Deferred<string>(() => { worker.terminate(); });
        worker.addEventListener('message', function(e: any) {
            try {
                var message = JSON.parse(e.data);
                if(message.success === true)
                    result.resolve(message.result);
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
    if(typeof window !== 'undefined') {
        (<any>window).renderDot = render;
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = render;
    }
})();