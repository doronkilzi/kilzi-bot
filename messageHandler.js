const theMarkerSites = ['haaretz', 'themarker'];
const twelveFtSites = ['globes.co.il', 'nytimes', 'economist', 'medium.com', 'theguardian'];
const handleTextMessage = (message, NODE_ENV) => {
  let logMessage = getBaseLogText(message, NODE_ENV);
  let responseMessage;

  switch (true) {
    case isItStartMessage(message):
      responseMessage = handleStartMessage();
      break;
    case isMessageContainUrlFromSiteGroup(message, theMarkerSites):
      responseMessage = handleHaaretzOrTheMarkerUrlMessage(message);
      break;
    case isMessageContainUrlFromSiteGroup(message, twelveFtSites):
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
  return `Please send a message with the article URL inside.

What Sites are Supported?

${[...theMarkerSites, ...twelveFtSites].join('\n')}`;
}

function isMessageContainUrlFromSiteGroup(message, sites) {
  const urls = extractUrlsFromMessage(message);
  return urls.some((url) => sites.some((site) => url.includes(site)));
}

function handleHaaretzOrTheMarkerUrlMessage(message) {
  const urls = extractUrlsFromMessage(message);
  const url = urls.find((u) => theMarkerSites.some((site) => u.includes(site)));
  const number = url.match(/\d+(\.\d+)?/g);
  if (number) {
    return `https://www.themarker.com/misc/themarkersmartphoneapp/${number[0]}`;
  }
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

function getBaseLogText(message, NODE_ENV) {
  const groupTitle = message.chat?.title;
  return `
${NODE_ENV === 'production' ? 'prod' : 'dev'}
id: ${message.from.id}
first_name: ${message.from.first_name}
last_name: ${message.from.last_name}
username: ${message.from.username}
${groupTitle ? `groupTitle : ${groupTitle} (${message.chat.id})
` : ''}`
+ `message: ${message.text}
`;
}
