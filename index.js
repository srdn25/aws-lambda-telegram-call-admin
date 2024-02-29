const axios = require('axios');

const token = process.env.TG_BOT_TOKEN;
const adminChatId = process.env.TG_ADMIN_CHAT_ID;

module.exports.webhook = async (event) => {
  const BASE_URL = `https://api.telegram.org/bot${token}`;
  let body = event;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(event)
    } catch (err) {
      throw new Error(`Cannot parse event: ${JSON.stringify(event)}`);
    }
  }

  const message = body.message
  const chat = message.chat

  axios.post(`${BASE_URL}/sendMessage`, {
      text: `Вызывают администратора! #alert
      https://t.me/${chat.username || chat.id}/${message.message_id}
      \n Сообщение от: \n<b>${JSON.stringify(message.from, null, '\t')}</b>`,
      chat_id: adminChatId,
    
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    console.log(`Telegram response: ${res}`);
  })
  .catch((err) => {
    throw new Error(`Error on send message to admin chat: ${err.message}`);
  })

  return {
    statusCode: 200,
    body: 'Ok',
  };
};
