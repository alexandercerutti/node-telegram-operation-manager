import { Hashable, Operation } from "./model";
import QueueManager from "./queue_manager";

export default class OperationManager extends QueueManager<Operation> {
	private _maxConcurrent = 1

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
		if (this._maxConcurrent > 0 && this.onGoing(id).length === this._maxConcurrent) {
			console.error("Operation: _maxConcurrent operation reached. No more ops will be added to the queue.");
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

	end(id: Hashable, commandName?: string): Operation {
		if (commandName) {
			return this.cherryPickRemove(id, (value) => value.command === commandName);
		}

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

	hasReachedMaximum(id: Hashable): boolean {
		const opsAmount = this.all(id).length;
		return opsAmount > 0 && opsAmount <= this._maxConcurrent;
	}

	/**
	 * Fully empty Operation queue for a specific user
	 * @param id
	 * @returns boolean
	 */

	empty(id: Hashable): boolean {
		this.emptyQueue(id);
		return true;
	}

	set maxConcurrent(newValue: number) {
		if (typeof newValue !== "number") {
			return;
		}

		this._maxConcurrent = newValue;
	}
}
