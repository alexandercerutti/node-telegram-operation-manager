import { Hashable, QueueObject } from "./model";

export default class QueueManager<T> {
	private _queue: QueueObject<T> = {};

	protected push(id: Hashable, object: T): number {
		if (!this._queue[id]) {
			this._queue[id] = [object];
		} else {
			this._queue[id].push(object);
		}

		return this.all(id).length;
	}

	protected remove(id: Hashable): T {
		return this._queue[id].shift();
	}

	protected removeAll(id: Hashable): void {
		this._queue[id] = [];
	}

	protected has(id: Hashable): boolean {
		return !!(this._queue[id] ? this._queue[id].length : 0);
	}

	protected all(id: Hashable): T[] {
		return this._queue[id] || [];
	}

	protected get(id: Hashable): T {
		return this._queue[id] && this._queue[id].length ? this._queue[id][0] : <T>{};
	}

	protected pop(id: Hashable): T {
		return this._queue[id] && this._queue[id].length ? this._queue[id].pop() : <T>{};
	}

	protected emptyQueue(id?: Hashable): number {
		let queueLen = (id ? this._queue[id] : Object.keys(this._queue)).length;

		this._queue = <QueueObject<T>>{};
		return queueLen;
	}
}
