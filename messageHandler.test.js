const messageHandler = require('./messageHandler');

const { handleTextMessage } = messageHandler;
describe('handleTextMessage', () => {
  test('when message dont contain any url', () => {
    const res = handleTextMessage(generateMessage('some text'));
    expect(res.responseMessage).toBeUndefined();
  });

  test('when message contain any url but without numbers', () => {
    const res = handleTextMessage(generateMessage('https://ynet.co.il'));
    expect(res.responseMessage).toBeUndefined();
  });

  test('when message contain valid url', () => {
    const res = handleTextMessage(generateMessage('www.haaretz.co.il/captain/tutorial/.premium-1.10066882'));
    expect(res.responseMessage).toEqual('https://www.themarker.com/misc/themarkersmartphoneapp/1.10066882');
  });

  test('when message contain valid url but with multiple numbers', () => {
    const res = handleTextMessage(generateMessage('https://www.themarker.com/career/.premium-MAGAZINE-1.9779555?_ga=2.229269338.777765809.1627724524-420367032.1580220277'));
    expect(res.responseMessage).toEqual('https://www.themarker.com/misc/themarkersmartphoneapp/1.9779555');
  });
});

function generateMessage(text) {
  return {
    text,
    chat: {
      id: 'chatId',
      first_name: 'firstName',
      last_name: 'lastName',
      username: 'username',
    },
  };
}
