export interface QueueObject {
	id: Hashable,
	command: string
}

export interface Operation extends QueueObject { }

export interface Reply extends QueueObject {
	action: Function,
	previousData?: any
}

export interface ReplyData {
	[key: string]: any
}

export type Hashable = number | string;
export type matchCriteria<T> = (value: T, index?: number, array?: T[]) => boolean;
