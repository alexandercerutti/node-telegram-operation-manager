import { Hashable, Operation } from "./model";
import QueueManager from "./queue_manager";

export default class OperationManager extends QueueManager<Operation> {
	constructor() {
		super();
	}

	/**
	 * Checks if there is at least one of active operation that matches the id.
	 * @param id
	 * @returns {boolean}
	 */

	hasActive(id: Hashable): boolean {
		return this.has(value => value.id === id);
	}

	/**
	 * Cancels the current action with a specific id.
	 * @param id
	 * @returns {Operation} - The removed Operation object.
	 */

	cancel(id: Hashable): Operation {
		return this.remove(op => op.id === id);
	}

	/**
	 * Pushes a new operation in the queue.
	 * @param id
	 * @param command
	 * @param callback - action to be executed straight after the pushing.
	 * @returns {any | undefined} - the result of the callback or none.
	 */

	register(id: Hashable, command: string, callback?: Function): any | undefined {
		this.push({ id, command });

		if (typeof callback === "function") {
			return callback();
		}
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
