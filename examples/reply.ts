import bot from "./bot";
import ReplyManager from "../src/reply_manager";
import { MessageEntity } from "node-telegram-bot-api";

//*************************//
//* EXECUTE THIS, TRUST ME*//
//*************************//

const reply = new ReplyManager();

bot.onText(/\/multireply/, (message) => {
	bot.sendMessage(message.from.id, `Hey there! 😎 Some replies got registered! Follow my instructions to discover how this works. Send me a message now!`);

	// I could use any identifier I want, but I suggest to use user.id.
	// Command is an arbitrary string and optional string
	// If you don't want to pass a command, set it as empty
	reply
		.register(message.from.id, (someData?: any) => {
			bot.sendMessage(message.from.id, "Great! Now send me another message.");
		})
		.register(message.from.id, (someData?: any) => {
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

			bot.sendMessage(message.from.id, nextText, { parse_mode: "Markdown", disable_web_page_preview: true });
		})
		.register(message.from.id, (someData?: any) => {
			let nextText: string;
			if (someData.text === "I love replies") {
				nextText = "✔ Good! Conditional checks can use optional data that can be passed at your own discretion through `reply.execute()` (as above)"
					+ "\n\nThis is how you can set them:"
					+ "\n\n\t\`.add(identifier, (someData?: any) => { ... })\`"
					+ "\n\nYou can also set some data to be passed (or accumulated) through replies."
					+ " Instead of returning _false_ or _undefined_, return any value you want."
					+ "\nFor this example, I'm going to return an object with a property called \"potatoes\"."
					+ "\n\nNow send me another message with written inside *Show me potatoes!*.";

				bot.sendMessage(message.from.id, nextText, { parse_mode: "Markdown" });
				return {
					potatoes: "I like them fried!"
				}
			} else {
				nextText = "❌ Great, but the required text in this reply was \"I love replies\"."
					+ "\n\nYou can make repeat a reply until it satisfies your conditions by returning \"false\" inside the function."
					+ "\n\nNow try again. This time try to send me both \"I have replies\" (again) and \"I love replies\" and see what happen.";

				bot.sendMessage(message.from.id, nextText);
				return false;
			}
		})
		.register(message.from.id, (someData?: any) => {
			if (someData.text !== "Show me potatoes!") {
				bot.sendMessage(message.from.id, "Nope! The next is not correct! Try again.");
				return false;
			}

			let nextText = "You can access them by using \`someData.previousData\`."
				+ "\nSo, we will access to potatoes by saying: \`someData.previousData.potatoes\`."
				+ "\nAwesome! Isn't it?"
				+ "\n\nNow send me another message!";

			bot.sendMessage(message.from.id, nextText, { parse_mode: "Markdown" });
		})
		.register(message.from.id, (someData?: any) => {
			bot.sendMessage(message.from.id, "You are the best! Start now by looking at the documentation. 😉 Hope you have enjoyed the tutorial!");
		});
});

bot.on("message", (msg) => {
	// this requires the id and let you push optional data in form of object.

	if (!hasEntity("bot_command", msg.entities) && reply.expects(msg.from.id)) {
		let { text, entities } = msg;
		reply.execute(msg.from.id, { text, entities });
	}
});

bot.on("polling_error", (msg) => console.log(msg));

function hasEntity(entity: string, entities?: MessageEntity[]) {
	if (!entities || !entities.length) {
		return false;
	}

	return entities.some(e => e.type === entity);
}
