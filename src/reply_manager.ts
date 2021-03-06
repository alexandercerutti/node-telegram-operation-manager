import { Reply, Hashable, ReplyData, RegisteredResult } from "./model";
import QueueManager from "./queue_manager";

export default class ReplyManager extends QueueManager<Reply> {
	constructor() {
		super();
	}

	/**
	 * Adds a new reply to the list
	 * @param id - identifier of the new element
	 * @param command - relative command
	 * @param action - action to be executed on execution
	 * @returns {number} - the amount of actions added under a specific identifier.
	 */

	register(id: Hashable, action: (data?: ReplyData) => RegisteredResult | undefined | void): this {
		this.push(id, { action });

		return this;
	}

	/**
	 * Removes all the replies matching with a specific id.
	 * @param id
	 */

	cancelAll(id: Hashable): this {
		this.removeAll(id);
		return this;
	}

	/**
	 * Pops out the last reply from the queue of a specific user.
	 * @param id
	 */

	pop(id: Hashable): Reply {
		return super.pop(id);
	}

	/**
	 * Checks if there are some awaiting replies in queue with a specific identifier.
	 * @param id
	 * @returns {boolean}
	 */

	expects(id: Hashable): boolean {
		return this.has(id);
	}

	/**
	 * Executes an action with optional data and removes it if successful.
	 * @param id - identifier
	 * @param data - optional data to be passed inside your function.
	 *
	 */

	execute(id: Hashable, data: ReplyData = {}): void {
		let next: Reply = this.get(id);
		let callback = next.action;

		// Passing the previous data to the function
		// We are setting the previousData below
		data.previousData = next.previousData || undefined;

		let result = callback(data);

		// We want to allow a successful execution in case of:
		// a. Missing result (undefined)
		// b. Object but not array result
		// c. Object with a falsy repeat property
		// d. Object without repeat property

		if (result === undefined) {
			this.remove(id);
			return;
		}

		if (typeof result === "object" && !Array.isArray(result)) {
			if (!result.repeat) {
				// if we have to want to repeat, we have to shift the reply
				this.remove(id);
			}

			let nextReply = this.get(id);

			// this.get returns an empty object if there
			// is no other reply in the id's queue.
			if (!Object.keys(nextReply).length) {
				return;
			}

			delete result.repeat; // even if it does not exists
			nextReply.previousData = result;
		}
	}

	/**
	 * Checks if possible to ignore current reply and skip to next.
	 * @param id
	 * @returns {boolean} - False if there are no replies left. True otherwise.
	 */

	skip(id: Hashable): boolean {
		if (!this.expects(id)) {
			return false;
		}

		this.execute(id, <Reply>{});
		return true;
	}

	/**
	 * Returns pending replies that match against parameter.
	 * @param id - queue identifier
	 * @returns {Reply[]}
	 */

	pending(id: Hashable): Reply[] {
		return this.all(id);
	}
}
