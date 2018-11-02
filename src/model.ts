export interface QueueObject<T> {
	[key: string]: T[]
}

//export type Reply = QueueObject<ReplyDescriptor>;
//export type Operation = QueueObject<OperationDescriptor>;
export type Hashable = number | string;

export interface ReplyData {
	[key: string]: any
}

export interface Operation {
	command: string
}

export interface Reply {
	action: Function,
	previousData?: any
}
