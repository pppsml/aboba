import { createServer } from 'http'
import TelegramBot, {  } from 'node-telegram-bot-api'
import 'dotenv/config'

import { recognizeText } from './services/recognizeText.js';

const server = createServer((req, res) => {
  res.end('Hello World')
})
server.listen(3333)

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true })

bot.on('document', async (msg) => { 
  const document = msg.document
  if (!document) return
  const fileId = document.file_id
  const { message_id } = await bot.sendMessage(msg.chat.id, 'Processing...', { reply_to_message_id: msg.message_id })
  bot.getFileLink(fileId).then(async (link) => {
    // console.log(fileId, link)
    const text = await recognizeText(link.toString())
    bot.editMessageText(text, { message_id, chat_id: msg.chat.id })
  })
  // const photo = ctx.message.document
  // if (!photo) return ctx.reply('Photo not found')
  // const fileId = photo.file_id
  // const { message_id } = await ctx.reply('Processing...', { reply_parameters: { message_id: ctx.message.message_id } })
  // bot.telegram.getFileLink(fileId).then(async (link) => {
  //   // console.log(fileId, link)
  //   const text = await recognizeText(link.toString())
  //   ctx.edit
  // })
})


// Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))