const theMarkerSites = ['haaretz', 'themarker'];
const twelveFtSites = ['globes.co.il', 'nytimes', 'economist', 'medium.com', 'theguardian'];
const handleTextMessage = (message, NODE_ENV) => {
  let logMessage = getBaseLogText(message, NODE_ENV);
  let responseMessage;
  let isSupportMessage = false;
  let unknownCommand = false;
  switch (true) {
    case message.text === '/start':
      responseMessage = handleStartMessage();
      break;
    case message.text === '/help':
      responseMessage = handleHelpMessage();
      break;
    case message.text === '/sites':
      responseMessage = getSupportedSites();
      break;
    case message.text.startsWith('/support'):
      isSupportMessage = true;
      if (message.text === '/support') {
        responseMessage = `let me know how can I help you. send me message in this structure:
/support [TEXT]
for example:
/support how can I do X`;
      }
      break;
    case isMessageContainUrlFromSiteGroup(message, theMarkerSites):
      responseMessage = handleHaaretzOrTheMarkerUrlMessage(message);
      break;
    case isMessageContainUrlFromSiteGroup(message, twelveFtSites):
      responseMessage = handleTwelveFtSitesUrlMessage(message);
      break;
    default:
      unknownCommand = true;
      break;
  }

  if (responseMessage) {
    logMessage += `response: ${responseMessage}`;
  }
  return {
    unknownCommand,
    responseMessage,
    isSupportMessage,
    logMessage,
  };
};

exports.handleTextMessage = handleTextMessage;

function handleStartMessage() {
  return `Please send a message with the article URL inside.

${getSupportedSites()}`;
}

function handleHelpMessage() {
  return `/start - general explanation and What Sites are Supported
/sites - list of all supported sites
/support - need help? Have any suggestion? send me a message
/help - list of all commands`;
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

  return 'invalid haaretz or themarker url';
}

function handleTwelveFtSitesUrlMessage(message) {
  const urls = extractUrlsFromMessage(message);
  const url = urls.find((u) => twelveFtSites.some((site) => u.includes(site)));
  return `https://12ft.io/proxy?q=${url}`;
}

function getSupportedSites() {
  return `What Sites are supported?

${[...theMarkerSites, ...twelveFtSites].join('\n')}`;
}

function extractUrlsFromMessage(message) {
  return message.text?.match(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi) || [''];
}

function getBaseLogText(message, NODE_ENV) {
  const groupTitle = message.chat?.title;
  return `
${NODE_ENV === 'production' ? 'prod' : 'dev'}
id: ${message.from.id}
first_name: ${message.from.first_name}
last_name: ${message.from.last_name}
username: ${message.from.username}
${groupTitle ? `groupTitle: ${groupTitle} (${message.chat.id})
` : ''}`
+ `message: ${message.text}
`;
}
