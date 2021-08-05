const handleTextMessage = (message) => {
  let logMessage = getBaseLogText(message);
  let responseMessage;

  responseMessage = handleArticleMessage(message);
  if (responseMessage) {
    logMessage += `response: ${responseMessage}`;
  } else {
    responseMessage = handleStartMessage(message);
  }
  return {
    responseMessage,
    logMessage,
  };
};

exports.handleTextMessage = handleTextMessage;

function handleStartMessage(message) {
  if (message.text === '/start') {
    return 'Please send a message with the article URL inside';
  }
}

function handleArticleMessage(message) {
  const text = message.text || '';
  const urls = text.match(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi) || [''];
  const number = urls[0].match(/\d+(\.\d+)?/g);
  if (number) {
    return `https://www.themarker.com/misc/themarkersmartphoneapp/${number[0]}`;
  }
}

function getBaseLogText(message) {
  return `
  prod: ${process.env.NODE_ENV === 'production'}
  id: ${message.chat.id}
  first_name: ${message.chat.first_name}
  last_name: ${message.chat.last_name}
  username: ${message.chat.username}
  message: ${message.text}
  `;
}
