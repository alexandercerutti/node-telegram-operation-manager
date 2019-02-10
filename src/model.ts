export interface QueueObject<T> {
	[key: string]: T[]
}

export type Hashable = number | string;

export interface ReplyData {
	[key: string]: any
}

export interface Operation {
	command: string
}

export interface Reply {
action: (data?: ReplyData) => RegisteredResult | undefined | void,
	previousData?: any
}

export interface RegisteredResult {
	repeat?: boolean;
	[key: string]: any;
}
