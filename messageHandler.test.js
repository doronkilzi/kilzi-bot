const messageHandler = require('./messageHandler');

const { handleTextMessage } = messageHandler;
describe('messageHandler', () => {
  test('get shutdown message', () => {
    const res = handleTextMessage(generatePrivateMessage('some text'));
    expect(res.responseMessage).toEqual(`It's time to switch to a better bot name.
You can now bypass the paywall by using the bypass_paywall_bot at https://t.me/bypass_paywall_bot`);
  });

  test('get shutdown message - from group', () => {
    const res = handleTextMessage(generateGroupMessage('some text'));
    expect(res.responseMessage).toEqual(`It's time to switch to a better bot name.
You can now bypass the paywall by using the bypass_paywall_bot at https://t.me/bypass_paywall_bot`);
  });
});

function generatePrivateMessage(text) {
  return {
    text,
    chat: {
      id: 'userId',
    },
    from: {
      id: 'userId',
      first_name: 'firstName',
      last_name: 'lastName',
      username: 'username',
    },
  };
}

function generateGroupMessage(text) {
  return {
    text,
    chat: {
      id: 'groupId',
      title: 'group title',
    },
    from: {
      id: 'userId',
      first_name: 'firstName',
      last_name: 'lastName',
      username: 'username',
    },
  };
}
