const TelegramBot = require('node-telegram-bot-api');
// const axios = require('axios');
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
  console.log('_________________________________________________________________');
  console.log();
  console.log(new Date(), 'got new message!');
  console.log('user:', msg.chat);
  console.log('text:', msg.text);
  console.log();

  const chatId = msg.chat.id;
  const text = msg.text || '';
  const urls = text.match(/\bhttps?:\/\/\S+/gi) || [''];
  const number = urls[0].match(/\d+(\.\d+)?/g);
  if(number) {
    bot.sendMessage(chatId, `https://www.themarker.com/misc/themarkersmartphoneapp/${number}`);
  }
});

const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});