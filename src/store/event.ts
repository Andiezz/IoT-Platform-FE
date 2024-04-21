export type EventAgrs = Array<unknown>
export type ListenerFunc = (...args: EventAgrs) => void;
class EventEmitter {
    listenersMap = new Map<string, ListenerFunc[]>()

    public on(event: string, handler: ListenerFunc): void {
        if (!this.listenersMap.has(event)) {
            this.listenersMap.set(event, [handler])
        } else {
            this.listenersMap.get(event)?.push(handler);
        }
    }

    public emit(event: string, ...args: EventAgrs): void {
        
        const handlers = this.listenersMap.get(event);
        if (!handlers || !handlers.length) {
            return;
        }
        handlers.forEach(h => {
            h(...args);
        });
    }
}

export default new EventEmitter();