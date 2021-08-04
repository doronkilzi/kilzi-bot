const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const bodyParser = require('body-parser');

require('dotenv').config();
 
const token = process.env.TELEGRAM_TOKEN;
let bot;
 
if (process.env.NODE_ENV === 'production') {
   bot = new TelegramBot(token);
   bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
   bot = new TelegramBot(token, { polling: true });
}

// full type we can found here: TelegramBot.MessageType
bot.on('text', (msg) => {
  let logMessage = `
  prod: ${process.env.NODE_ENV === 'production'}
  id: ${msg.chat.id}
  first_name: ${msg.chat.first_name}
  last_name: ${msg.chat.last_name}
  username: ${msg.chat.username}
  message: ${msg.text}
  `

  const chatId = msg.chat.id;
  const text = msg.text || '';
  const urls = text.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi) || [''];
  const number = urls[0].match(/\d+(\.\d+)?/g);
  if(number) {
    const response = `https://www.themarker.com/misc/themarkersmartphoneapp/${number[0]}`;
    logMessage += `response: ${response}`;
    bot.sendMessage(chatId, response);
  }
  sendLog(logMessage)
});

const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

function sendLog(text) {
  bot.sendMessage(process.env.CHAT_LOG_ID, text);
}