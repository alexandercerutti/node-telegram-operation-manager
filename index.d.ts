declare module "node-telegram-operation-manager" {
	interface QueueObject<T> {
		[key: string]: T[]
	}

	interface Operation {
		command: string
	}

	interface ReplyData {
		[key: string]: any
	}

	interface Reply {
		action: Function,
		previousData?: any
	}

	interface RegisteredResult {
		repeat?: boolean;
		[key: string]: any;
	}

	class QueueManager<T> {
		/**
		 * Pushes the element into the queue.
		 * @param element
		 * @returns {number} - The amount of elements inside
		 * the queue for the same id (element.id)
		 */

		protected push(id: number | string, object: T): number;

		/**
		 * Removes from the queue the first element that matches
		 * the provided predicate.
		 * @param criteria
		 * @returns {T} - The removed element
		 */

		protected remove(id: number | string): T;

		/**
		 * Removes all the element that match with the provided id.
		 * @param id
		 */

		protected removeAll(id: number | string): void;

		/**
		 * Removes an element by searching for it using a criteria, like a cherry pick.
		 * @param id
		 * @param criteria
		 */

		protected cherryPickRemove(id: number | string, criteria: (value: T) => boolean): T;

		/**
		 * Checks if there are elements in queue that match
		 * with the criteria.
		 * @param criteria
		 * @returns {boolean} - True if there are elements, false otherwise.
		 */

		protected has(id: number | string): boolean;

		/**
		 * Retrives all the elements that match the criteria
		 * @param criteria
		 * @returns {T[]} - Array of elements
		 */

		protected all(id: number | string): T[];

		/**
		 * Returns the first element that match the criteria.
		 * @param criteria
		 * @return {T} - the first element.
		 */

		protected get(id: number | string): T;

		/**
		 * Pops out the last element of the id's queue.
		 * @param id
		 * @returns {T} - the last element
		 */

		protected pop(id: number | string): T;

		/**
		 * Wipes out all the queue.
		 * @param id - If has an id, id's queue will be wiped out.
		 * All the queues will otherwise.
		 */

		protected emptyQueue(id?: number | string): number;
	}

	class ReplyManager extends QueueManager<Reply> {

		/**
		 * Adds a reply to the queue
		 * @param id - the ID to which assign the action
		 * @param action - a callback to register
		 * @returns {this} - this (ReplyManager)
		 */

		public register(id: number | string, action: (data?: ReplyData) => RegisteredResult): this;

		/**
		 * Removes all the replies for this id.
		 * @param id
		 * @returns {this} - this
		 */

		public cancelAll(id: number | string): this;

		/**
		 * Pops the last reply for this id;
		 * @param id
		 */

		public pop(id: number | string): Reply;

		/**
		 * Checks if a specific id has some left replies
		 * @param id
		 */

		public expects(id: number | string): boolean;

		/**
		 * Fires the first reply for a specific id,
		 * passing to it some optional arbitrary data
		 * @param id
		 * @param data
		 */

		public execute(id: number | string, data?: ReplyData): void;

		/**
		 * Skips the current reply expectation
		 * only if there is at least one next
		 * @param id - specific identifier
		 * @returns {boolean} - check result
		 */

		public skip(id: number | string): boolean;

		/**
		 * Fetch all the pending replies for this id
		 * @param id
		 * @returns {Reply[]} - all the replies
		 */

		public pending(id: number | string): Reply[];
	}

	class OperationManager extends QueueManager<Operation> {

		public maxConcurrent: number;

		/**
		 * Adds a new operation to the queue.
		 * @param id
		 * @param command
		 * @param callback
		 */

		public register(id: number | string, command: string, callback?: Function): any;

		/**
		 * Cancels the current action or a specific action for a specific id
		 * @param id
		 * @param commandName - name to be used to identify a specific element to be removed.
		 * @return {Operations} - the cancelled operation
		 */

		public end(id: number | string, commandName?: string): Operation;

		/**
		 * Fetches all the current queued operations for a specific identifier.
		 * @param id
		 */

		public onGoing(id: number | string): Operation[];

		/**
		 * Checks if the current identifier has an ongoing operations
		 * @param id
		 * @returns {boolean} - The result of the check
		 */

		public hasActive(id: number | string): boolean;

		/**
		 * Wipes out all the operation queue.
		 * I hope you know what you are doing.
		 */

		public empty(): boolean;
	}
}
