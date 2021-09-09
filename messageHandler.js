const twelveFtSites = ['nytimes', 'economist', 'medium.com', 'globes.co.il'];
const handleTextMessage = (message) => {
  let logMessage = getBaseLogText(message);
  let responseMessage;

  switch (true) {
    case isItStartMessage(message):
      responseMessage = handleStartMessage();
      break;
    case isContainHaaretzOrTheMarkerUrl(message):
      responseMessage = handleHaaretzOrTheMarkerUrlMessage(message);
      break;
    case isContainTwelveFtSitesUrl(message):
      responseMessage = handleTwelveFtSitesUrlMessage(message);
      break;
    default:
      break;
  }

  if (responseMessage) {
    logMessage += `response: ${responseMessage}`;
  }
  return {
    responseMessage,
    logMessage,
  };
};

exports.handleTextMessage = handleTextMessage;

function isItStartMessage(message) {
  return message.text === '/start';
}

function handleStartMessage() {
  return 'Please send a message with the article URL inside';
}

function isContainHaaretzOrTheMarkerUrl(message) {
  const urls = extractUrlsFromMessage(message);
  return urls.some((url) => url.includes('haaretz') || url.includes('themarker'));
}

function handleHaaretzOrTheMarkerUrlMessage(message) {
  const urls = extractUrlsFromMessage(message);
  const url = urls.find((u) => u.includes('haaretz') || u.includes('themarker'));
  const number = url.match(/\d+(\.\d+)?/g);
  if (number) {
    return `https://www.themarker.com/misc/themarkersmartphoneapp/${number[0]}`;
  }
}

function isContainTwelveFtSitesUrl(message) {
  const urls = extractUrlsFromMessage(message);
  return urls.some((url) => twelveFtSites.some((site) => url.includes(site)));
}

function handleTwelveFtSitesUrlMessage(message) {
  const urls = extractUrlsFromMessage(message);
  const url = urls.find((u) => twelveFtSites.some((site) => u.includes(site)));
  return `https://12ft.io/proxy?q=${url}`;
}

function extractUrlsFromMessage(message) {
  const text = message.text || '';
  return text.match(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi) || [''];
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
