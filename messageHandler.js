const handleTextMessage = (message) => {
  let responseMessage;
  let logMessage = `
  prod: ${process.env.NODE_ENV === 'production'}
  id: ${message.chat.id}
  first_name: ${message.chat.first_name}
  last_name: ${message.chat.last_name}
  username: ${message.chat.username}
  message: ${message.text}
  `;

  const text = message.text || '';
  const urls = text.match(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi) || [''];
  const number = urls[0].match(/\d+(\.\d+)?/g);
  if (number) {
    responseMessage = `https://www.themarker.com/misc/themarkersmartphoneapp/${number[0]}`;
    logMessage += `response: ${responseMessage}`;
  }
  return {
    responseMessage,
    logMessage,
  };
};

exports.handleTextMessage = handleTextMessage;
