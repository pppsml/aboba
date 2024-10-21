// import TelegramBot, { Message } from 'node-telegram-bot-api'
// import {  } from 'tesseract.js'
import 'dotenv/config'
// import { createReadStream, readFileSync } from 'fs'

const token = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramBot(token, { polling: true });

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const messageText = msg.text;

//   if (messageText === '/start') {
//     bot.sendMessage(chatId, 'Отправьте накладную');
//   }
// });

// const onPhotoHandler = async (msg: Message) => {
//   const chatId = msg.chat.id;
//   const document = msg.document;
//   const photo = msg.photo?.[0];
//   const fileId = photo?.file_id || document?.file_id;
//   if (!fileId) {
//     bot.sendMessage(chatId, 'Ошибка при получении Id файла. Попробуйте отправить фото еще раз');
//     return;
//   }
//   const file = await bot.getFile(fileId);

//   console.log(file);

//   bot.sendMessage(chatId, 'Фотография получена');
//   if (file.file_path) {
//     bot.sendDocument(chatId, 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?cs=srgb&dl=pexels-soldiervip-1308881.jpg&fm=jpg');
//     bot.sendPhoto(chatId, 'https://telegram.org/img/t_logo.png');
//   }
// }

// bot.on('photo', onPhotoHandler)
// bot.on('document', onPhotoHandler)



import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { recognizeText } from './services/recognizeText.js';

const bot = new Telegraf(token)
bot.start((ctx) => ctx.reply('Welcome', {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'oldschool', callback_data: 'oldschool' }],
      [{ text: 'hipster', callback_data: 'hipster' }],
    ],
  },
}))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('hipster', Telegraf.reply('λ'))

bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.on(message('document'), (ctx) => {
  const photo = ctx.message.document
  if (!photo) return ctx.reply('Photo not found')
  const fileId = photo.file_id
  ctx.reply('Photo found')
  bot.telegram.getFileLink(fileId).then((link) => {
    console.log(fileId, link)
    recognizeText(link.toString())
    // ctx.reply(link.toString())
  })
})
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

bot.on('document', async (ctx) => ctx.reply('Document received'))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))