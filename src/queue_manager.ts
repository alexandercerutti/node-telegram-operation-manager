import { Hashable, QueueObject, matchCriteria } from "./model";

export default class QueueManager<T extends QueueObject> {
	private _queue: T[] = [];

	protected push(element: T): number {
		this._queue.push(element);

		return this.all(value => value.id === element.id).length;
	}

	protected remove(criteria: matchCriteria<T>): T {
		let index = this._queue.findIndex(criteria);

		if (index == -1) {
			return <T>{};
		}

		let _queueElement = this._queue[index];
		this._queue.splice(index, 1);

		return _queueElement;
	}

	protected removeAll(id: Hashable): void {
		this._queue = this._queue.reduce((acc, current) =>
			current.id === id ? acc : [...acc, current],
			[]
		);
	}

	protected removeBack(id: Hashable): T {
		const revQueue = this._queue.slice().reverse();
		const revIndex = revQueue.findIndex(value => value.id === id);
		const index = this._queue.length - 1 - revIndex;
		const element = this._queue[index];

		this._queue = this._queue.splice(index, 1);

		return element;
	}

	protected has(criteria: matchCriteria<T>): boolean {
		return this._queue.some(criteria);
	}

	protected all(criteria: matchCriteria<T>): T[] {
		return this._queue.filter(criteria);
	}

	protected get(criteria: matchCriteria<T>): T {
		return this._queue.find(criteria);
	}

	protected emptyQueue(): number {
		let queueLen = this._queue.length;
		this._queue = [];
		return queueLen;
	}
}
