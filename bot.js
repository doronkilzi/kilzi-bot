const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const messageHandler = require('./messageHandler');
require('dotenv').config();

const {
  TELEGRAM_TOKEN, NODE_ENV, HEROKU_URL, PORT, CHAT_LOG_ID,
} = process.env;
let bot;

if (NODE_ENV === 'production') {
  bot = new TelegramBot(TELEGRAM_TOKEN);
  bot.setWebHook(HEROKU_URL + bot.token);
} else {
  bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
}

bot.on('text', (msg) => {
  const res = messageHandler.handleTextMessage(msg, NODE_ENV);
  const chatId = msg.chat.id;
  const chatId = msg.chat.id;
  if (res.logMessage) {
    sendLog(res.logMessage);
  }
  if (res.responseMessage) {
    bot.sendMessage(chatId, res.responseMessage);
  } else {
    bot.sendMessage(chatId, "Sorry, I don't understand you.");
  }
});

const app = express();

app.use(bodyParser.json());

app.listen(PORT);

app.post(`/${bot.token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

function sendLog(text) {
  bot.sendMessage(CHAT_LOG_ID, text);
}
