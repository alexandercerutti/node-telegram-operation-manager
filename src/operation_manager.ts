import { Hashable, Operation } from "./model";
import QueueManager from "./queue_manager";

export default class OperationManager extends QueueManager<Operation> {
	public maxConcurrent = 1

	constructor() {
		super();
	}

	/**
	 * Pushes a new operation in the queue.
	 * @param id
	 * @param command
	 * @param action - action to be executed straight after the pushing.
	 * @returns {any | undefined} - the result of the callback or none.
	 */

	register(id: Hashable, command: string, action?: Function): any | undefined {
		if (this.maxConcurrent > 0 && this.onGoing(id).length === this.maxConcurrent) {
			console.error("Operation: maxConcurrent operation reached. No more ops will be added to the queue.");
			return;
		}

		this.push(id, { command });

		if (typeof action === "function") {
			return action();
		}
	}

	/**
	 * Terminates the current action with a specific id.
	 * @param id
	 * @returns {Operation} - The removed Operation object.
	 */

	end(id: Hashable): Operation {
		return this.remove(id);
	}

	/**
	 * Fetches all the current active operations
	 * @param id
	 */

	onGoing(id: Hashable): Operation[] {
		return this.all(id);
	}

	/**
	 * Checks if there is at least one of active operation that matches the id
	 * by checking if the amount is lower than the concurrent maximum.
	 * @param id
	 * @returns {boolean}
	 */

	hasActive(id: Hashable): boolean {
		return this.has(id);
	}

	/**
	 * Checks amount of active operations against the limit
	 * @param id
	 * @returns {boolean} The result in boolean
	 */

	hasReachedMaximum(id: Hashable) {
		const opsAmount = this.all(id).length;
		return opsAmount > 0 && opsAmount <= this.maxConcurrent;
	}

	/**
	 * Fully empty Operation queue.
	 * @returns {boolean}
	 */

	empty(): boolean {
		this.emptyQueue();
		return true;
	}
}
