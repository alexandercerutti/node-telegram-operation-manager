import bot from "./bot";
import ReplyManager from "../src/reply_manager";
import { MessageEntity } from "node-telegram-bot-api";
import { ReplyKeyboard } from "node-telegram-keyboard-wrapper";
import { ReplyData } from "../src/model";

//*************************//
//* EXECUTE THIS, TRUST ME*//
//*************************//

const reply = new ReplyManager();
const keyboards = [
	new ReplyKeyboard("I hate replies"),
	(new ReplyKeyboard()).addRow("I hate replies", "I love replies"),
	new ReplyKeyboard("Show me potatoes!")
];

bot.onText(/\/multireply/, (message) => {
	bot.sendMessage(message.from.id, `Hey there! 😎 Some replies got registered! Follow my instructions to discover how this works. Send me a message now!`);

	// I could use any identifier I want, but I suggest to use user.id.
	// Command is an arbitrary string and optional string
	// If you don't want to pass a command, set it as empty
	reply
		.register(message.from.id, (someData?: ReplyData) => {
			bot.sendMessage(message.from.id, "Great! Now send me another message.");
		})
		.register(message.from.id, (someData?: ReplyData) => {
			let nextText = "See? You can register your replies easily by setting in your message listener the following check."
				+ "\nAssuming you are using [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) and you istantiated globally ReplyManager, you can do it by:"
				+ "\n\n```"
				+ "\nconst reply = new ReplyManager();"
				+ "\nbot.on(\"message\", (msg) => {"
				+ "\n\t// this requires the id and let you push optional data in form of object."
				+ "\n\tif (reply.expects(msg.from.id)) {"
				+ "\n\t\tlet { text, entities } = msg;"
				+ "\n\t\treply.execute(msg.from.id, { text, entities });"
				+ "\n\t}"
				+ "\n});```"
				+ "\n\nNow send me this text: \"I hate replies\"";

			let messageOpts = Object.assign({
				parse_mode: "Markdown",
				disable_web_page_preview: true
			}, keyboards[0].open({ resize_keyboard: true }));

			bot.sendMessage(message.from.id, nextText, messageOpts);
		})
		.register(message.from.id, (someData?: ReplyData) => {
			let nextText: string;

			const messageOpts1 = Object.assign({
				parse_mode: "Markdown",
			}, keyboards[1].open({ resize_keyboard: true }));

			const messageOpts2 = Object.assign({
				parse_mode: "Markdown",
			}, keyboards[2].open({ resize_keyboard: true }));

			if (someData.text === "I love replies") {
				nextText = "✔ Good! Conditional checks can use optional data that can be passed at your own discretion through `reply.execute()` (as above)"
					+ "\n\nThis is how you can set them:"
					+ "\n\n\t\`.add(identifier, (someData?: RegisteredResult) => { ... })\`"
					+ "\n\nYou can also set some data to be passed (or accumulated) through replies."
					+ " Instead of returning an object with `{ repeat: true }` or _undefined_, return an object with any value you want."
					+ "\nFor this example, I'm going to return an object with a property called \"potatoes\"."
					+ "\nYou can also return datas from a failed session, inserting in the same object of `{ repeat: true }`, other keys/values."
					+ "\n\nNow send me another message with written inside *Show me potatoes!*.";

				bot.sendMessage(message.from.id, nextText, messageOpts2);
				return {
					potatoes: "I like them fried!"
				}
			} else {
				nextText = "❌ Great, but the required text in this reply was \"I love replies\"."
					+ "\n\nYou can make repeat a reply until it satisfies your conditions by returning `{ repeat: true }` inside the function."
					+ "\n\nIf you omit that key or return it as true or omit the full return, the reply will be considered as to not be repeated."
					+ "\n\nNow try again. This time try to send me both \"I have replies\" (again) and \"I love replies\" and see what happen.";

				bot.sendMessage(message.from.id, nextText, messageOpts1);
				return { repeat: true };
			}
		})
		.register(message.from.id, (someData?: ReplyData) => {
			if (someData.text !== "Show me potatoes!") {
				bot.sendMessage(message.from.id, "Nope! The next is not correct! Try again.");
				return { repeat: true };
			}

			let nextText = "You can access them by using `someData.previousData`."
				+ "\nSo, we will access to potatoes by saying: `someData.previousData.potatoes`."
				+ "\nAwesome! Isn't it?"
				+ "\n\nNow send me another message!";

			bot.sendMessage(message.from.id, nextText, Object.assign({},
				keyboards[2].close(),
				{ parse_mode: "Markdown" }
			));
		})
		.register(message.from.id, (someData?: ReplyData) => {
			bot.sendMessage(message.from.id, "You are the best! Start now by looking at the [documentation](https://github.com/alexandercerutti/node-telegram-operation-manager#class_reply). 😉 Hope you have enjoyed the tutorial!", { parse_mode: "Markdown" });
		});
});

bot.on("message", (msg) => {
	// this requires the id and let you push optional data in form of object.

	if (!hasEntity("bot_command", msg.entities) && reply.expects(msg.from.id)) {
		let { text, entities } = msg;
		reply.execute(msg.from.id, { text, entities });
	}
});

function hasEntity(entity: string, entities?: MessageEntity[]) {
	if (!entities || !entities.length) {
		return false;
	}

	return entities.some(e => e.type === entity);
}
