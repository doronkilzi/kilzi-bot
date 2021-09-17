const handleTextMessage = (message, NODE_ENV) => {
  let logMessage = getBaseLogText(message, NODE_ENV);
  const responseMessage = `It's time to switch to a better bot name.
You can now bypass the paywall by using the bypass_paywall_bot at https://t.me/bypass_paywall_bot`;

  logMessage += `response: ${responseMessage}`;
  return {
    unknownCommand: false,
    responseMessage,
    isSupportMessage: false,
    logMessage,
  };
};

exports.handleTextMessage = handleTextMessage;

function getBaseLogText(message) {
  const groupTitle = message.chat?.title;
  return (
    `
id: ${message.from.id}
first_name: ${message.from.first_name}
last_name: ${message.from.last_name}
username: ${message.from.username}
${
    groupTitle
      ? `groupTitle: ${groupTitle} (${message.chat.id})
`
      : ''
    }`
    + `message: ${message.text}
`
  );
}
