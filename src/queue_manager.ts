import { Hashable, QueueObject, matchCriteria } from "./model";

export default class QueueManager<T extends QueueObject> {
	private queue: T[];

	public push(element: T): number {
		this.queue.push(element);

		return this.all(value => value.id === element.id).length;
	}

	public remove(criteria: matchCriteria<T>): T {
		let index = this.queue.findIndex(criteria);

		if (index == -1) {
			return <T>{};
		}

		let queueElement = this.queue[index];
		this.queue.splice(index, 1);

		return queueElement;
	}

	public removeAll(id: Hashable): void {
		this.queue = this.queue.reduce((acc, current) =>
			current.id === id ? acc : [...acc, current],
			[]
		);
	}

	public removeBack(id: Hashable): T {
		const revQueue = this.queue.slice().reverse();
		const revIndex = revQueue.findIndex(value => value.id === id);
		const index = this.queue.length - 1 - revIndex;
		const element = this.queue[index];

		this.queue = this.queue.splice(index, 1);

		return element;
	}

	public has(criteria: matchCriteria<T>): boolean {
		return this.queue.some(criteria);
	}

	public all(criteria: matchCriteria<T>): T[] {
		return this.queue.filter(criteria);
	}

	public get(criteria: matchCriteria<T>): T {
		return this.queue.find(criteria);
	}

	public emptyQueue(): number {
		let queueLen = this.queue.length;
		this.queue = [];
		return queueLen;
	}
}
