import { createServer } from 'http'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import 'dotenv/config'

import { recognizeText } from './services/recognizeText.js';


const server = createServer((req, res) => {
  res.end('Hello World')
})
server.listen(3333)

const token = process.env.TELEGRAM_BOT_TOKEN;
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
  bot.telegram.getFileLink(fileId).then(async (link) => {
    // console.log(fileId, link)
    const text = await recognizeText(link.toString())
    ctx.reply(text)
  })
})
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

bot.on('document', async (ctx) => ctx.reply('Document received'))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))