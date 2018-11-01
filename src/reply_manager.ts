import { Reply, Hashable, ReplyData } from "./model";
import QueueManager from "./queue_manager";


export default class ReplyManager extends QueueManager<Reply> {
	constructor() {
		super();
	}

	/**
	 * Returns pending replies that match against parameter.
	 * @param id - queue identifier
	 * @returns {Reply[]}
	 */

	pending(id: Hashable): Reply[] {
		return this.all(value => value.id === id);
	}

	/**
	 * Adds a new reply to the list
	 * @param id - identifier of the new element
	 * @param command - relative command
	 * @param action - action to be executed on execution
	 * @returns {number} - the amount of actions added under a specific identifier.
	 */

	register(id: Hashable, action: Function): this {
		this.push({ id, action });

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
	 * Pops the last reply from the queue of a specific user.
	 * @param id
	 */

	pop(id: Hashable): Reply {
		return this.removeBack(id);
	}

	/**
	 * Checks if there are some awaiting replies in queue with a specific identifier.
	 * @param id
	 * @returns {boolean}
	 */

	expects(id: Hashable): boolean {
		return this.has(value => value.id === id);
	}

	/**
	 * Executes an action with optional data and removes it if successful.
	 * @param id - identifier
	 * @param data - optional data to be passed inside your function.
	 *
	 */

	execute(id: Hashable, data: ReplyData = {}) {
		let next: Reply = this.get(e => e.id === id);
		let callback: Function = next.action;

		data.previousData = next.previousData || undefined;

		let result = callback(data);

		// Must not be removed if result is specifically false.
		if (result !== false) {
			// Removing
			this.pull(id);

			let secondNext = this.get(value => value.id === id)

			if (!secondNext) {
				return;
			}

			if (result !== undefined) {
				secondNext.previousData = result;
			}
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
	 * Removes first Reply occurence in the queue with a specific ID.
	 * @param id
	 */

	private pull(id: Hashable) {
		// removes the first value with specific id.
		this.remove(value => value.id === id);
	}
}
