enum State {
    PENDING,
    REJECTED,
    RESOLVED
}

export class Abortable<G> {
	   _progressList: ((percent: number)=>void)[] = []
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
    progress(action: (percent: number)=>void): Abortable<G> {
        this._progressList.push(action);
        return this;
    }
    abort: ()=>void;
}

export class Deferred<G> {
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
        this.abortable._failList.forEach((action) => action(err));
        this.state = State.REJECTED;
    }
    resolve(result: G): void {
        if(this.state !== State.PENDING)
            return;
        this.abortable._successList.forEach((action) => action(result));
        this.state = State.RESOLVED;
    }
    progress(percent: number): void {
    	   if(this.state !== State.PENDING)
    	       return;
    	   this.abortable._progressList.forEach((action) => action(percent));
    }
}