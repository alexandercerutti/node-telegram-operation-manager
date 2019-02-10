import bot from "./bot";
import { MessageEntity } from "node-telegram-bot-api";
import { ReplyManager, OperationManager } from "..";
import { ReplyData } from "../src/model";
import { ReplyKeyboard } from "node-telegram-keyboard-wrapper";

//*************************//
//* EXECUTE THIS, TRUST ME*//
//*************************//

const Opm = new OperationManager();
const reply = new ReplyManager();

const keyboards = [
	new ReplyKeyboard("Show me how!"),
	new ReplyKeyboard("Show me more"),
	new ReplyKeyboard("How can I do that?"),
];

bot.onText(/\/operations/, (message) => {
	if (Opm.hasReachedMaximum(message.from.id)) {
		bot.sendMessage(message.from.id, "Unable to execute /operations. Another op is on going.");
		return false;
	}

	Opm.register(message.from.id, "operations", function () {
		let messageText = "Hey there! 😎 Welcome to this operation example!"
			+ "\nIn this example we'll see how Operation queue works."
			+ "\n\nOperation queue is mainly designed to keep track about commands that users interact with."
			+ "\nTechnically a user should be using one command at the time, but it may start more and you, developer, may not want it."
			+ "\nTherefore, this system may be good if combined with replies."
			+ "\n\nSend me *Show me how!* to discover.";

		bot.sendMessage(message.from.id, messageText, Object.assign({
			parse_mode: "Markdown"
		},
			keyboards[0].open({
				resize_keyboard: true
			})));

		reply
			.register(message.from.id, (someData?: ReplyData) => {
				if (someData.text !== "Show me how!") {
					bot.sendMessage(message.from.id, "Unknown command. Retry with \"Show me how!\".");
					return { repeat: true };
				}

				let nextText = "You can `register` an operation as in the following snippet."
					+ "\nHere I'm assuming you are still using [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)."
					+ "\n\n```"
					+ "\nconst Opm = new OperationManager();`"
					+ "\nbot.onText(/\\/yourCommand/, () => {"
					+ "\n\t\tOpm.register(message.from.id, \"yourOperationIdentifier\", function() {"
					+ "\n\t\t\t\t// Everything in this function is executed immediately after the creation of command is successful."
					+ "\n\t\t\t\t// If you exceed the limit, the action won't be registered and function not executed."
					+ "\n\t\t\t\t// So you can use it to execute depending actions, like reply registration."
					+ "\n\t\t});"
					+ "\n});"
					+ "\n\n```"
					+ "\n\nEasy, isn't it? 😉"
					+ "\nSend me *Show me more* to continue.";

				bot.sendMessage(message.from.id, nextText, Object.assign({
					parse_mode: "Markdown",
					disable_web_page_preview: true
				},
					keyboards[1].open({
						resize_keyboard: true
					})
				));
			})
			.register(message.from.id, (someData?: ReplyData) => {
				if (someData.text !== "Show me more") {
					bot.sendMessage(message.from.id, "Unknown command. Retry with \"Show me more\".");
					return { repeat: true };
				}

				let nextText = "You can look at the code of this example to see how replies are registered."
					+ "\n\nNow, you are executing command /operations. But, let's say that a user of your bot will now execute another command"
					+ " like, I don't know, /dontclickthiscommand (you can try!), and you developer, don't want this to happen."
					+ "\nSo what to do? It's easy."
					+ "\nYou can add to your commands function a check: `Opm.hasReachedMaximum(<youridentifier>)`."
					+ "\nSee the code for more."
					+ "\n\nWhat is Maximum? And what if you want to let different actions to be executed at the same time?"
					+ "\nSend me *How can I do that?* to discover.";

				bot.sendMessage(message.from.id, nextText, Object.assign({ parse_mode: "Markdown" }, keyboards[2].open({ resize_keyboard: true })));
			})
			.register(message.from.id, (someData?: ReplyData) => {
				if (someData.text !== "How can I do that?") {
					bot.sendMessage(message.from.id, "Unknown command. Retry with \"Show me more\".");
					return { repeat: true };
				}

				let nextText = "It's easy! You only have to set this property:"
					+ "\n\n\t`Opm.maxConcurrent = N;`"
					+ "\n\nWhere 'N' is the number of max operations you want to let be executed at the same time."
					+ "\n\nSet it to 0 to allow infinite operations."
					+ "\n\n\nYou are the best! Start now by looking at the [documentation](https://github.com/alexandercerutti/node-telegram-operation-manager#class_operation). 😉 Hope you have enjoyed the tutorial!";

				bot.sendMessage(message.from.id, nextText, Object.assign({ parse_mode: "Markdown" }, keyboards[2].close()));
			});
	});
});

bot.onText(/\/dontclickthiscommand/, (message) => {
	if (Opm.hasReachedMaximum(message.from.id)) {
		bot.sendMessage(message.from.id, "Unable to start this operation. You are executing another operation.");
		return;
	}

	bot.sendMessage(message.from.id, "A check has been executed an you are not executing anything else. 👍");
});

bot.on("message", (msg) => {
	if (!hasEntity("bot_command", msg.entities) && Opm.hasActive(msg.from.id) && reply.expects(msg.from.id)) {
		reply.execute(msg.from.id, { text: msg.text, entities: msg.entities });
	}
});

function hasEntity(entity: string, entities?: MessageEntity[]) {
	if (!entities || !entities.length) {
		return false;
	}

	return entities.some(e => e.type === entity);
}
