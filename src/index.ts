require('dotenv/config');
import TelegramBot from "node-telegram-bot-api";
import { controller } from "./controller";


const token = process.env.BOT_TOKEN;
if (!token)
    throw new Error('Missing BOT_TOKEN env variable');

const bot = new TelegramBot(token, { polling: true });
bot.on('message', async (msg) => {
    const [chatId, telegramId, text, name] = [msg.chat.id, msg.from?.id.toString(), msg.text, `${msg.from?.first_name} ${msg.from?.last_name}`];
    if (text && telegramId) {
        const log = await controller.saveLog(telegramId, name, text, new Date());
        const previousLog = await controller.previousLog(log.id);
        const messages = [];
        if (previousLog)
            messages.push(`previous message ${previousLog.log} at ${previousLog.date}`);

        messages.push(`received message ${log.log} at ${log.date}`);
        if (previousLog) {
            bot.sendMessage(chatId, messages.join('\n'));
        }
    }
})
