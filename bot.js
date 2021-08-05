const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const bodyParser = require('body-parser');
const messageHandler = require('./messageHandler');
require('dotenv').config();
 
const token = process.env.TELEGRAM_TOKEN;
let bot;
 
if (process.env.NODE_ENV === 'production') {
   bot = new TelegramBot(token);
   bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
   bot = new TelegramBot(token, { polling: true });
}

bot.onText(/\/start/, (msg) => {
// listens for "/start" and responds with the greeting below.
  bot.sendMessage(msg.chat.id, 'Please send a message with the article URL inside');
});

// full type we can found here: TelegramBot.MessageType
bot.on('text', (msg) => {
  const res = messageHandler.handleTextMessage(msg);
  const chatId = msg.chat.id;
  sendLog(res.logMessage);
  if(res.responseMessage){
    bot.sendMessage(chatId, res.responseMessage);
  }
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