const axios = require('axios');

const token = process.env.TG_BOT_TOKEN;
const adminChatId = process.env.TG_ADMIN_CHAT_ID;

function createMessage(message) {
  const chat = message.chat;
  const chatLink = `https://t.me/${chat.username || chat.id}`;
  const targetText = message?.reply_to_message?.text;

  let result = `Вызывают администратора! #alert\n${chatLink}/${message.message_id}\n`;

  if (targetText) {
    result = `${result}\n🎯<blockquote>${targetText}</blockquote>\n${chatLink}/${message?.reply_to_message?.message_id}\n`;
  }

  result = `${result}\nСообщение от: \n<b>${JSON.stringify(message.from, null, '\t')}</b>`;
  
  return result;
}

module.exports.webhook = async (event) => {
  const BASE_URL = `https://api.telegram.org/bot${token}`;
  let body = event.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      throw new Error(`Cannot parse event: ${JSON.stringify(body)}`);
    }
  }

  const message = body.message;

  if (!message.text || !message.text.startsWith('/alert')) {
    const msg = `Wrong call. This is not an alert! ${message.text}`;
    console.error(msg);

    return {
      statusCode: 200,
      body: msg,
    }
  }

  try {
    const response = await axios.post(`${BASE_URL}/sendMessage`, {
      text: createMessage(message),
      chat_id: adminChatId,
      parse_mode: 'HTML',
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Telegram response: ${JSON.stringify(response.data)}`);
  } catch (err) {
    throw new Error(`Error on send message to admin chat: ${err.message}`);
  }

  return {
    statusCode: 200,
    body: 'Ok',
  };
};
