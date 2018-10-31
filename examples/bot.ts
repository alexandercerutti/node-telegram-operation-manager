import * as TelegramBot from "node-telegram-bot-api";

if (process.argv.length < 3) {
	console.error("Specify a token to continue.");
	console.error("FORMAT: npm run <example-name> -- <your token>");
	process.exit(1);
}

export default new TelegramBot(process.argv[2], { polling: true });
