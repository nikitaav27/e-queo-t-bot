const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const config = require('./config.json')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const fs = require('fs')

const Koa = require('koa')
const koaBody = require('koa-body')

require('https').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
  res.end('')
})

// Handler factoriess
const { enter, leave } = Stage

// Greeter scene
const greeterScene = new Scene('greeter')
greeterScene.enter((ctx) => ctx.reply('Привет, напиши мне, я отвечу в ближайшее время'))
greeterScene.leave((ctx) => ctx.reply('Пока', Markup
  .keyboard([
    ['Логин и пароль', 'Функционал платформы'],
    ['Ошибки', 'Уведомления'],
    ['Установка приложения и регистрация']
  ])
  .oneTime() // на 1 разработке
  .resize()
  .extra()
))

greeterScene.hears('Человек', enter('greeter'))
greeterScene.hears('Готово', leave())
greeterScene.on('message', (ctx) => ctx.reply('Переслал'))

// // Echo scene
// const echoScene = new Scene('echo')
// echoScene.enter((ctx) => ctx.reply('echo scene'))
// echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
// echoScene.command('back', leave())
// echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
// echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))
//
// const bot = new Telegraf(config.token)
// const stage = new Stage([greeterScene, echoScene], { ttl: 10 })
// bot.use(session())
// bot.use(stage.middleware())
// bot.command('greeter', (ctx) => ctx.scene.enter('greeter'))
// bot.command('echo', (ctx) => ctx.scene.enter('echo'))
// bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter'))

 const bot = new Telegraf(config.token)
 const stage = new Stage([greeterScene], { ttl: 10 })
 bot.use(session())
 bot.use(stage.middleware())

 console.log('Bot launched');

 bot.command('start', async (ctx)  => {
      console.log(`Пользователь ${ctx.message.from.first_name} ${ctx.message.from.last_name} @${ctx.message.from.username} запустил бота`)
      await ctx.replyWithHTML(`Привет,  <b>${ctx.message.from.first_name} ${ctx.message.from.last_name}</b>`)
      await ctx.reply('👋')
      await ctx.reply('Нажмите /menu, чтобы открыть меню')
      await ctx.reply('Выбери подходящий пункт меню',
        Markup.keyboard([
         ['Логин и пароль', 'Функционал платформы'], // Row1 with 2 buttons
         ['Ошибки', 'Уведомления'],
         ['Установка приложения и регистрация']
       ])
     .oneTime() // на 1 разработке
     .resize()
     .extra()
   )
   // await ctx.deleteMessage()
 })

 bot.command('menu', async (ctx)  => {
      await ctx.reply('Меню', Markup.keyboard
      ([
         ['Логин и пароль', 'Функционал платформы'],
         ['Ошибки', 'Уведомления'],
         ['Установка приложения и регистрация']
      ])
     .oneTime() // на 1 разработке
     .resize()
     .extra()
   )
 })

// ЛОГИН И ПАРОЛЬ
bot.hears('Логин и пароль', async (ctx) => {
  await ctx.reply(`1  Как получить логин и пароль пользователя платформы?
2  В чем разница доступа пользователя и его начальника?
3  Не могу войти. Выданный логин и пароль не подходят. Где взять правильный?
4  Несколько раз вводил. Ничего не помогает. Что делать?
5  Я получил логин и пароль администратора, но система меня не пускает в web-приложение. Что происходит?
6  Как восстановить пароль?
7  Должен ли я вводить свои настоящие имя и фамилию?
8  Можно ли изменить пароль для входа, который был мне предоставлен?`,
  Markup.inlineKeyboard([
    [
      Markup.callbackButton('1', 'Логин-1'),
      Markup.callbackButton('2', 'Логин-2'),
      Markup.callbackButton('3', 'Логин-3'),
      Markup.callbackButton('4', 'Логин-4')
    ],
    [
      Markup.callbackButton('5', 'Логин-5'),
      Markup.callbackButton('6', 'Логин-6'),
      Markup.callbackButton('7', 'Логин-7'),
      Markup.callbackButton('8', 'Логин-8')
    ]
  ]).extra()
)})

bot.action('Логин-1', async (ctx) => {
  await ctx.replyWithHTML(`<b>Как получить логин и пароль пользователя платформы?</b>

🔹  Логин и пароль можно запросить у администраторов платформы или руководителя.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Логин-2', async (ctx) => {
  await ctx.replyWithHTML(`<b>В чем разница доступа пользователя и его начальника?</b>

🔹  У каждого руководителя с подчиненными есть мобильный кабинет руководителя. В мобильном кабинете доступна статистика, прогресс команды, функции обратной связи и мотивации.`
,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Логин-3', async (ctx) => {
  await ctx.replyWithHTML(`<b>Не могу войти. Выданный логин и пароль не подходят. Где взять правильный?</b>

🔹  В 90% таких случаев просто неправильно введен пароль. Нажмите на пиктограмму глаза справа в строке ввода пароля. Символы станут видимыми и вы легко проверите корректность ввода пароля. Если это не сработало, попробуйте сбросить пароль, либо обратитесь к администратору платформы или в техподдержку.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Логин-4', async (ctx) => {
  await ctx.replyWithHTML(`<b>Несколько раз вводил. Ничего не помогает. Что делать?</b>

🔹  Вы можете задать свои вопросы нашей службе поддержки. Она доступна по телефону горячей линии, почте и чату в админпанели администратора. Объясните проблему, и вам помогут. Актуальные контакты техподдержки можно найти на экрана входа в приложение.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Логин-5', async (ctx) => {
  await ctx.replyWithHTML(`<b>Я получил логин и пароль администратора, но система меня не пускает в web-приложение. Что происходит?</b>

🔹  Чтобы войти в web-приложение, используйте учётную запись и пароль пользователя.
Логин и пароль администратора используются для управления платформой. Для использования возможностей администратора вам нужно перейти в <b>панель администратора</b> и уже там войти с выданной вам учётной записью админа. Кнопка перехода к панели администратора, расположена вверху страницы, справа.`,
  Markup.inlineKeyboard(
    [
      [
          Markup.urlButton('Панель администратора', 'https://manager.e-queo.online/')
      ],
      [
        Markup.callbackButton('👍', '👍'),
        Markup.callbackButton('👎', '👎')
      ]
    ]
  ).extra())
})

bot.action('Логин-6', async (ctx) => {
  await ctx.replyWithHTML(`<b>Как восстановить пароль?</b>

🔹  Пароль можно восстановить через сброс по SMS. Поэтому номер телефона и адрес электронной почты должны быть правильными и уникальными.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Логин-7', async (ctx) => {
  await ctx.replyWithHTML(`<b>Должен ли я вводить свои настоящие имя и фамилию?</b>

🔹  Мы рекомендуем использовать настоящие имя и фамилию, так как это может быть важно для вашего руководителя и администраторов системы, а также, непосредственно для вас, вашего рейтинга, возможности накопления и обмена баллов.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Логин-8', async (ctx) => {
  await ctx.replyWithHTML(`<b>Можно ли изменить пароль для входа, который был мне предоставлен?</b>

🔹  Да, вы можете это сделать самостоятельно в настройках профиля пользователя.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

// Функционал платформы
bot.hears('Функционал платформы', async (ctx) => {
  await ctx.reply(`1  Я не вижу некоторых нужных мне функций. Но они есть в описании платформы. Полный ли функционал в этой версии?
2  Меня не устраивает как выглядит ваш тест. Тут возможны какие либо настройки?
3  Я хочу сделать предложения по улучшению платформы. Как это сделать?`,
    Markup.inlineKeyboard (
      [
        Markup.callbackButton('1', 'Функционал-1'),
        Markup.callbackButton('2', 'Функционал-2'),
        Markup.callbackButton('3', 'Функционал-3')
      ]).extra())
})

bot.action('Функционал-1', async (ctx) => {
  await ctx.replyWithHTML(`<b>Я не вижу некоторых нужных мне функций. Но они есть в описании платформы. Полный ли функционал в этой версии?</b>

🔹  Доступность функционала оговаривается условиями контракта. Также, некоторые функции требуют специального тестирования и настроек.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Функционал-2', async (ctx) => {
  await ctx.replyWithHTML(`<b>Меня не устраивает как выглядит ваш тест. Тут возможны какие либо настройки?</b>

🔹  Приложение позволяет задать множество вариантов настроек теста на уровне администратора платформы. Решение о том, как будет выглядеть тест, какие вопросы и в каком виде будут в него добавлены, принимает администратор платформы.
Если у вас есть предложения по улучшению отображения тестов, озвучьте, пожалуйста, их администратору платформы или службе техподдержки.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Функционал-3', async (ctx) => {
  await ctx.replyWithHTML(`<b>Я хочу сделать предложения по улучшению платформы. Как это сделать?</b>

🔹  Сделайте пожалуйста свое предложение через руководителя или напрямую по почте support@e-queo.com`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

// Ошибки
bot.hears('Ошибки', async (ctx) => {
  await ctx.reply(`1  Что делать, если тест или курс «вылетает» при входящем звонке или активности другого приложения?
2  Что делать, если на мою электронную почту не приходит письмо о восстановлении пароля?
3  Что делать, если при прохождении курса видео отображается в горизонтальной ориентации, а тестовые вопросы в вертикальной? `,
    Markup.inlineKeyboard(
      [
        Markup.callbackButton('1', 'Ошибки-1'),
        Markup.callbackButton('2', 'Ошибки-2'),
        Markup.callbackButton('3', 'Ошибки-3')
      ]).extra())

})

bot.action('Ошибки-1', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что делать, если тест или курс «вылетает» при входящем звонке или активности другого приложения?</b>

🔹  Рекомендуем загрузить этот материал и пройти его в оффлайн режиме (отключить интернет). Приложение обновит результаты автоматически, когда интернет будет включен снова.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Ошибки-2', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что делать, если на мою электронную почту не приходит письмо о восстановлении пароля?</b>

🔹  Рекомендуем повторить запрос, проверить папку «Спам» или обратиться в нашу службу поддержки.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Ошибки-3', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что делать, если при прохождении курса видео отображается в горизонтальной ориентации, а тестовые вопросы в вертикальной?</b>

🔹  Рекомендуем включить функцию <b>Автоповорот экрана</b>`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

// Уведомления
bot.hears('Уведомления', async (ctx) => {
  await ctx.reply(`1  Как я буду получать уведомления?
2  Что делать, если не приходят никакие оповещения и уведомления?`,
    Markup.inlineKeyboard(
      [
        Markup.callbackButton('1', 'Уведомления-1'),
        Markup.callbackButton('2', 'Уведомления-2')
      ]).extra())
})

bot.action('Уведомления-1', async (ctx) => {
  await ctx.replyWithHTML(`<b>Как я буду получать уведомления?</b>

🔹  Уведомления направляются в виде push-сообщений. Администратор платформы может сам настроить логику уведомлений и их частоту.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('Уведомления-2', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что делать, если не приходят никакие оповещения и уведомления?</b>

🔹  Рекомендуем включить <b>Уведомления</b> и отключить <b>Контроль активности</b> в настройках своего смартфона.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

// Установка приложения и регистрация
bot.hears('Установка приложения и регистрация', async (ctx) => {
  await ctx.reply(`1  Что делать, если при регистрации всплывает уведомление, что номер уже зарегистрирован?
2  Приложение долго скачивается или устанавливается. Каков его размер?`,
    Markup.inlineKeyboard(
      [
        Markup.callbackButton('1', 'Установка-1'),
        Markup.callbackButton('2', 'Установка-2')
      ]).extra()
  )
})

bot.action('Установка-1', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что делать, если при регистрации всплывает уведомление, что номер уже зарегистрирован?</b>

🔹  Пожалуйста, обратитесь в службу поддержки. Возможно ваш номер уже был когда-то зарегистрирован на нашей платформе.`,
    Markup.inlineKeyboard(
      [
        Markup.callbackButton('Позвонить', 'Позвонить'),
        Markup.callbackButton('Написать', 'Написать')
      ]
    ).extra())
})

bot.action('Установка-2', async (ctx) => {
  await ctx.replyWithHTML(`<b>Приложение долго скачивается или устанавливается. Каков его размер?</b>

🔹  Вероятнее всего это связано с нестабильным или слабым интернетом. Размер приложения составляет — 65 Мб и как правило, устанавливается за несколько секунд.`,
Markup.inlineKeyboard([
    Markup.callbackButton('👍', '👍'),
    Markup.callbackButton('👎', '👎')
]).extra())
})

bot.action('👍', async (ctx) => {
  await ctx.replyWithHTML(`Рад был помочь`)
})

bot.action('👎', async (ctx) => {
  await ctx.reply('Чем я еще могу вам помочь?',
    Markup.keyboard([
     ['Логин и пароль', 'Функционал платформы'], // Row1 with 2 buttons
     ['Ошибки', 'Уведомления'],
     ['Установка приложения и регистрация']
   ])
 .oneTime() // на 1 разработке
 .resize()
 .extra()
)
})

bot.hears('Меню', async (ctx) => {
  await ctx.reply('Меню',
    Markup.keyboard([
     ['Логин и пароль', 'Функционал платформы'], // Row1 with 2 buttons
     ['Ошибки', 'Уведомления'],
     ['Установка приложения и регистрация']
   ])
 .oneTime() // на 1 разработке
 .resize()
 .extra()
)
})

bot.action('Написать', async (ctx) => {
  await ctx.scene.enter('greeter')
  await ctx.reply('Когда закончишь, нажми "Готово"', Markup
  .keyboard(['Готово'])
  .oneTime() // на 1 разработке
  .resize()
  .extra()
)})

bot.action('Позвонить', async (ctx) => {
  await ctx.replyWithHTML(`<a href="tel:+79911142131">+79911142131</a>`)
})

bot.launch()

bot.telegram.setWebhook('https://git.heroku.com/e-queo-t-bot.git/secret-path')

const app = new Koa()
app.use(koaBody())
app.use((ctx, next) => ctx.method === 'POST' || ctx.url === '/secret-path'
  ? bot.handleUpdate(ctx.request.body, ctx.response)
  : next()
)
app.listen(3000)
