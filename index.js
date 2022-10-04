const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5567684392:AAEofeQFr7713CYFDU2mH_pNmzfV4Mwe7jI';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const chats = {};

const gameOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
            [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
            [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
            [{ text: '0', callback_data: '0' }],
        ]
    })
}

const gameAgain = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Qaytada urinish !", callback_data: '/again' }]
        ]
    })
}

const todosBtn = {

    reply_markup: JSON.stringify(
        {
            inline_keyboard: [
                [{ text: "eslatma qo'shish 🔧", callback_data: '/add' }, { text: "eslatmani tahrirlash ✏️", callback_data: '/edit' }],
                [{ text: "eslatmani o'chirish 🧹", callback_data: '/remove' }],
                [{ text: "barcha eslatmalar 🎛", callback_data: '/todo' }],
            ],
            // resize_keyboard: true,
            // one_time_keyboard: true
        }
    )
}

bot.setMyCommands([
    { command: '/start', description: 'Botni ishga tushirish' },
    { command: '/info', description: "Bot haqida ma'lumot" },
    { command: '/user', description: "Foydalanuchi haqida" },
    { command: '/game', description: "Sonni top o'yini" },
    { command: '/todos', description: "Eslatmalar ro'yxati" },
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `0 dan 9 gacha bo'lgan raqamlardan birini tanlang! va o'yinimiz g'olibi bo'ling .`)
    const randomNumber = Math.floor(Math.random() * 10) // 0.6 * 10 = 1.6
    chats[chatId] = randomNumber;
    return bot.sendMessage(chatId, 'Tasodifiy sonni toping..?', gameOption)
}

const render = () => {

    // Matches "/echo [whatever]"
    bot.onText(/\/echo (.+)/, (msg, match) => {

        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"

        bot.sendMessage(chatId, resp);
    });


    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;


        // const textContent = document.createElement('p').value;
        // const div = `Eslatmalar ro'yxati: %0A - \n${textContent}`


        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://s3.amazonaws.com/stickers.wiki/YourLionKing/282384.160.webp')
            return bot.sendMessage(chatId, `Assalomu alaykum! \nXush kelibsiz ${msg.from.first_name}`)
        }
        if (text === '/info') return bot.sendMessage(chatId, `Xurmatli ${msg.from.first_name}  \nSiz bu bot orqali eslatmalar ro'yxatini tuzishingiz mumkin ?`);
        if (text === '/user') {
            return bot.sendMessage(chatId, `First name: ${msg.from.first_name}, \nUsername: ${msg.from.username}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        if (text === '/todos') {
            return bot.sendMessage(chatId, 'Amalni tanlang !', todosBtn)
        }
        return bot.sendMessage(chatId, 'iltimos, tarkibni tanlang !')
    });

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const text = msg.message.text;

        if (data === '/add') {
            return bot.sendMessage(chatId, "Eslatma kiriting !");

        }

        if (data === '/again') return startGame(chatId)
        if (data != chats[chatId]) {
            return bot.sendMessage(chatId, `Afsuski! Bizning son ${chats[chatId]} edi.`, gameAgain)
        } else {
            await bot.sendSticker(chatId, 'https://s3.amazonaws.com/stickers.wiki/YourLionKing/282381.160.webp')
            return bot.sendMessage(chatId, `Tabriklaymiz! Siz ${chats[chatId]} sonini tanladingiz va g'olib bo'ldingiz.`)
        }
    })

}


render()