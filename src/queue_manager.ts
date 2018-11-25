import { Hashable, QueueObject } from "./model";

export default class QueueManager<T> {
	private _queue: QueueObject<T> = {};

	/**
	 * Pushes an object into the queue.
	 * @param id - Queue identifier
	 * @param object
	 *
	 */

	protected push(id: Hashable, object: T): number {
		if (!this._queue[id]) {
			this._queue[id] = [object];
		} else {
			this._queue[id].push(object);
		}

		return this.all(id).length;
	}

	/**
	 * Removes the first element of a specific queue.
	 * @param id - queue identifier
	 * @returns - The shifted element
	 */

	protected remove(id: Hashable): T {
		return this._queue[id].shift();
	}

	/**
	 * Removes all the objects in a specific queue
	 * @param id
	 */

	protected removeAll(id: Hashable): void {
		this._queue[id] = [];
	}

	/**
	 * Removes an element from a specific queue through a criteria
	 * @param id - queue identifier
	 * @param criteria - Function to be used to find the element
	 * @returns boolean
	 */

	protected cherryPickRemove(id: Hashable, criteria: (value: T) => boolean): T {
		let elementIndex = this._queue[id].findIndex(criteria);

		if (elementIndex === -1) {
			return <T>{};
		}

		let element = this._queue[id][elementIndex];

		this._queue[id].splice(elementIndex, 1);
		return element;
	}

	/**
	 * Checks if a queue has any objects
	 * @param id
	 */

	protected has(id: Hashable): boolean {
		return !!(this._queue[id] ? this._queue[id].length : 0);
	}

	/**
	 * Fetches all the objects of a specific queue
	 * @param id
	 * @returns Array of objects
	 */

	protected all(id: Hashable): T[] {
		return this._queue[id] || [];
	}

	/**
	 * Fetches the first object of a specific queue.
	 * @param id
	 * @returns The element fetched.
	 */

	protected get(id: Hashable): T {
		return this._queue[id] && this._queue[id].length ? this._queue[id][0] : <T>{};
	}

	/**
	 * Pops out the last object of a specific queue.
	 * @param id
	 * @returns The popped element
	 */

	protected pop(id: Hashable): T {
		return this._queue[id] && this._queue[id].length ? this._queue[id].pop() : <T>{};
	}

	/**
	 * Wipes out one specific queue or the whole queue set,
	 * based on the presence of id parameter.
	 * @param id - id of the queue to be wiped out. Wipes out every queue if omitted.
	 * @returns the amount of object or queue removed.
	 */

	protected emptyQueue(id?: Hashable): number {
		let queueLen: number;

		if (id && this._queue[id]) {
			queueLen = this._queue[id].length;
			delete this._queue[id];
		} else {
			queueLen = Object.keys(this._queue).length;
			this._queue = <QueueObject<T>>{};
		}

		return queueLen;
	}
}
