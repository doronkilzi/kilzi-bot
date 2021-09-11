const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const messageHandler = require('./messageHandler');
require('dotenv').config();

const {
  TELEGRAM_TOKEN, NODE_ENV, HEROKU_URL, PORT, CHAT_LOG_ID, SUPPORT_ID,
} = process.env;
let bot;

if (NODE_ENV === 'production') {
  bot = new TelegramBot(TELEGRAM_TOKEN);
  bot.setWebHook(HEROKU_URL + bot.token);
} else {
  bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
}

bot.on('text', (msg) => {
  const {
    unknownCommand, logMessage, responseMessage, isSupportMessage,
  } = messageHandler.handleTextMessage(msg, NODE_ENV);
  const chatId = msg.chat.id;

  if (logMessage) {
    sendLog(logMessage);
  }

  if (isSupportMessage) {
    sendSupportMessage(logMessage);
  }

  if (unknownCommand) {
    bot.sendMessage(chatId, "Sorry, I don't understand you.");
    return;
  }

  if (responseMessage) {
    bot.sendMessage(chatId, responseMessage);
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

function sendSupportMessage(text) {
  bot.sendMessage(SUPPORT_ID, text);
}
