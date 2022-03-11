require('dotenv/config');
import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
if (!token)
    throw new Error('Missing BOT_TOKEN env variable');

const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (match) {
        const resp = match[1];
        bot.sendMessage(chatId, resp);
    }    
});

// bot.on('message', (msg) => {
//     console.log(`received message ${msg.text} from ${msg.from?.id}`);
// })
