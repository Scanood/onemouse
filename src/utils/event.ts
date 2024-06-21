type fn = ((...args: unknown[]) => void)

interface Handle {
    [key: string]: Array<fn>
}

class EventEmitter {
    handle: Handle = undefined
    constructor() {
        this.handle = {}
    }
    on(type: string, fun: fn): void {
        if (!this.handle[type]) {
            this.handle[type] = []
        }
        this.handle[type].push(fun)
    }
    emit(type: string, ...args: unknown[]): void {
        if (!this.handle[type]) return
        this.handle[type].forEach((callback) => callback(args))
    }
    removeAllListeners(type: string): void {
        if (!this.handle[type]) return
        this.handle[type].length = 0
    }
}

const e = new EventEmitter()

export {
    e
}