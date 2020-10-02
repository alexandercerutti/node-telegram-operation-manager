# Node Telegram Operation Manager

This is amazing project.

This package purpose is to help managing the operations in Telegram bots in Node.js.

## Installation

```sh
$ npm install --save node-telegram-operation-manager
```
<hr>

## Architecture

The package exports 3 classes to achive different purposes:
- Queue Manager
- Reply Manager
- Operation Manager

The purposes are described below.

The second and the third extends Queue Manager to access to queue manipulation methods.

This is not a typical implementation of Queue. In fact this is a set of Queues, all identified by a custom identifier, which might be e.g. the user id the telegram bot interacts with.
The package makes available also operation to remove elements from the queue from the bottom (pop) or inside the queue (cherrypickRemove).

Queue Manager **is exported** to let developers to implement their own queues. This class is recommended to be exported only for this purpose, nothing else.

### Reply Manager

Reply Manager is specifically studied to register common set of actions to be executed or repeated in a flow which can be, for example, a sequence of message from a user.

Actually, if not native, Telegram bot api wrappers make it difficult to manage this aspect.

### Operation Manager

Operation Manager is designed to manage the amount of operations can be active at the same time for a specific user.

Operation Manager is not that useful to be used alone. In fact, it should be using to wrap the registration of replies.

### Queue Manager

Queue Manager is the responsible class for queue managing. Although exported, it shouldn't be used except for implementing other queues.

<br>
<hr>

## Examples

Two working examples are provided in [example folder](/examples).

They are structured to be a step-by-step examples in a chat with a bot you will choose by passing the token to the respective commands as below.

```sh
# ==================================#
# Execute these two commands before #
# ==================================#

# Go to project folder - assuming you installed it as module.
$ cd node_modules/node-telegram-operation-manager

# Development packages
$ npm install -D;

# =========================

$ npm run reply -- 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
# or
$ npm run operations -- 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```

<br>
<hr>

## Tests

Tests are also included. This package uses Jasmine as test suite.

```sh
$ npm install -D;
$ npm test
```

<br>
<hr>

## API Reference

- [Reply Manager](#class_reply)
	- [.register()](#method_rep_register)
	- [.cancelAll()](#method_rep_cancelall)
	- [.pop()](#method_rep_pop)
	- [.expects()](#method_rep_expects)
	- [.execute()](#method_rep_execute)
	- [.skip()](#method_rep_skip)
	- [.pending()](#method_rep_pending)
- [Operation Manager](#class_operation)
	- [.register()](#method_op_register)
	- [.end()](#method_op_end)
	- [.onGoing()](#method_op_ongoing)
	- [.hasActive()](#method_op_hasactive)
	- [.hasReachedMaximum()](#method_op_hrm)
	- [.empty()](#method_op_empty)
	- [.maxConcurrent](#property_op_maxconcurrent)
- [Queue Manager](#class_qm)
	- [.push()](#method_qm_push)
	- [.remove()](#method_qm_remove)
	- [.removeAll()](#method_qm_removeall)
	- [.cherryPickRemove()](#method_qm_cpr)
	- [.has()](#method_qm_has)
	- [.all()](#method_qm_all)
	- [.get()](#method_qm_get)
	- [.pop()](#method_qm_pop)
	- [.emptyQueue()](#method_qm_emptyqueue)

<hr>

<a name="class_reply"></a>

## Reply Manager
<hr>

Reply Manager extends QueueManager with a type `Reply`, which will be used below to represent to express one pushed or pulled element.

Please keep this as always valid:

```javascript
// for Typescript
import { ReplyManager } from "node-telegram-operation-manager";

// for Node.js
const { ReplyManager } = require("node-telegram-operation-manager");

const reply = new ReplyManager();
```

<a name="method_rep_register"></a>

### .register();

It adds a new action to be executed at the next user reply.

```javascript
reply.register(id, action) : this;
```

**Description**:

`action` parameter has the following signature:

```typescript
action: (someData?: ReplyData) => RegisteredResponse
```

You can pass through the method `execute`, some arbitrary data to be used in the current response. They will appear in `someData`.

It will also include a key, called `previousData`, which will be the data returned from the previous registered replies. If no data is returned from the previous responses, it won't have this key.

To pass datas to the next reply, just return an object with your data.

The default behavior is to remove from the queue the current reply.
If current **user** reply does not satisfy your conditions, you can make them repeat, by returning:

```javascript
{
	repeat: true,
	someOtherDatas: ...
}
```

Omitting `repeat` key or setting it to `false`, will determine the default behavior to be executed.

**Returns**:

The object itself for chaining multiple replies listeners.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |
| action | Function to be executed | Function | false | - |

<br>
<hr>

<a name="method_rep_cancelall"></a>

### .cancelAll()

It removes all the actions for a specific identifier.

```javascript
reply.cancelAll(id) : this;
```

**Returns**:

The object itself for chaining.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_rep_pop"></a>

### .pop()

It removes the last element from a specific queue.

```javascript
reply.pop(id) : Reply;
```

**Returns**:

The expelled element.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_rep_expects"></a>

### .expects()

It checks if there are any element in queue for the specified identifier. Useful on telegram message listener.

```typescript
reply.expects(id) : boolean;
```

**Returns**: The result of the check.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_rep_execute"></a>

### .execute()

It execute the next registered action in the queue and removes it from the queue.

```javascript
reply.execute(id, data);
```

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |
| data | data to be passed to the reply | Object | true | `{}` |

<br>
<hr>

<a name="method_rep_skip"></a>

### .skip()

Skips the execution of the current reply and pass to the next one. Before skipping, it checks if there are other replies in the queue.
It will succeed only if the current reply is **not** the last.

```typescript
reply.skip(id) : boolean;
```

**Returns**:

Whether current reply got skipped or not.


**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_rep_pending"></a>

### .pending()

It fetches all the pending replies object.
Even this might be the most useless method in the class.

```typescript
reply.pending(id) : Reply[];
```

**Returns**:

Whether current reply got skipped or not.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>
<a name="class_operation"></a>

## Operation Manager
<hr>

Operation Manager extends QueueManager with a type `Operation`, which will be used below to represent to express one element.

Please keep this as always valid:

```javascript
// for Typescript
import { OperationManager } from "node-telegram-operation-manager";

// for Node.js
const { OperationManager } = require("node-telegram-operation-manager");

const opm = new OperationManager();
```

<a name="method_op_register"></a>

### .register();

It adds a new operation in execution list.

```typescript
opm.register(id, command, action) : any | undefined;
```

**Returns**:

The result of action.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |
| command | Command identifier | String | false | - |
| action | Function to be executed immediately after queue operation | Function | false | - |

<br>
<hr>

<a name="method_op_end"></a>

### .end()

It removes a specific action or all the actions for a specific identifier, based on the presence or absence of parameter `commandName`.

```typescript
opm.end(id, commandName?) : Operation;
```

**Returns**:

The object itself for chaining.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |
| commandName | Command of the element that will be removed | String | true | - |

<br>
<hr>

<a name="method_op_ongoing"></a>

### .onGoing()

Fetches all the active operation.
`Warning: might be useless.`

```typescript
opm.onGoing(id) : Operation[];
```

**Returns**:

All on going operations for a specific identifier.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_op_hasactive"></a>

### .hasActive()

It checks if there are any active operations in queue for the specified identifier.

```typescript
opm.hasActive(id) : boolean;
```

**Returns**: The result of the check.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_op_hrm"></a>

### .hasReachedMaximum()

Checks whether the limit of concurrent operations has been reached.

```typescript
opm.hasReachedMaximum(id): boolean;
```

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_op_empty"></a>

### .empty()

It wipes out a specific operation queue.

```typescript
opm.empty(id) : boolean;
```

**Returns**: the operation result.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="property_op_maxconcurrent"></a>

### .maxConcurrent

It determines the maximum of concurrent operation that may happen. The value must be a number.

```typescript
opm.maxConcurrent = N;
```

<br>
<br>

<hr>
<a name="class_qm"></a>

## Queue Manager
<hr>

Queue Manager is the basic class for all the classes above.
QueueManager class has type `T`, that will be used to represent objects.

> _**Please note** that this class should be used **only** as extension for other classes._


Please keep this as always valid:

```javascript
// for Typescript
import { QueueManager } from "node-telegram-operation-manager";

// for Node.js
const { QueueManager } = require("node-telegram-operation-manager");

class newQueueOperator extends QueueManager<QueueOperatorStruct> {
	// Here T is QueueOperatorStruct
}
```

<a name="method_qm_push"></a>

### .push();

It adds a new operation to the queue.

```typescript
reply.push(id, object: T) : number;
```

**Returns**:

The amount of elements

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |
| object | The object to be pushed to the queue | Object | false | - |

<br>
<hr>

<a name="method_qm_remove"></a>

### .remove()

It removes the first element from a specific queue identified.

```typescript
.remove(id) : T;
```

**Returns**:

The removed object.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_qm_removeall"></a>

### .removeAll()

Removes all the elements from a specific queue.

```typescript
.removeAll(id) : void;
```

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_qm_cpr"></a>

### .cherryPickRemove()

Removes a specific element from a specific queue.

```typescript
.cherryPickRemove(id, criteria) : T;
```

**Returns**: The removed element if found, empty object otherwise.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |
| criteria | A function with this signature: `(value) => boolean` | Function | false | - |

<br>
<hr>

<a name="method_qm_has"></a>

### .has()

Checks if a specific identifier has some elements inside its queue.

```javascript
.has(id) : boolean;
```

**Returns**:

The result of operation.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_qm_all"></a>

### .all()

Fetches all the elements in a specific queue.

```typescript
.all(id) : T[];
```

**Returns**: the operation result.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_qm_get"></a>

### .get()

Fetches the first element in a specific queue.

```typescript
.get(id) : T;
```

**Returns**: the first element in the queue.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_qm_pop"></a>

### .get()

Removes the last element from the queue.

```typescript
.pop(id) : T;
```

**Returns**: the removed element.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | false | - |

<br>
<hr>

<a name="method_qm_emptyqueue"></a>

### .emptyQueue()

Wipes out a specific queue or the whole set of queues, based on presence of `id` parameter.

```typescript
.emptyQueue(id?) : number;
```

**Returns**: the amount of removed element or removed sets.

**Arguments**:

| Parameters | Description | Type | Optional | Default value |
| ---------- | ----------- | ---- |:--------:|:-------------:|
| id | Queue identifier | Number \| String | true | - |
