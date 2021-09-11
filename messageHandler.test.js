const messageHandler = require('./messageHandler');

const { handleTextMessage } = messageHandler;
describe('messageHandler', () => {
  describe('invalid urls', () => {
    test('when message dont contain any url', () => {
      const res = handleTextMessage(generatePrivateMessage('some text'));
      expect(res.responseMessage).toBeUndefined();
      expect(res.unknownCommand).toBeTruthy();
    });
    test('when message contain unfamiliar url ', () => {
      const res = handleTextMessage(generatePrivateMessage('www.google.co.il'));
      expect(res.responseMessage).toBeUndefined();
      expect(res.unknownCommand).toBeTruthy();
    });
  });
  describe('handleHaaretzOrTheMarkerArticleMessage', () => {
    test('when message contain valid url', () => {
      const res = handleTextMessage(
        generatePrivateMessage(
          'www.haaretz.co.il/captain/tutorial/.premium-1.10066882',
        ),
      );
      expect(res.responseMessage).toEqual(
        'https://www.themarker.com/misc/themarkersmartphoneapp/1.10066882',
      );
    });

    test('when message contain valid url but with multiple numbers, should take the first number', () => {
      const res = handleTextMessage(
        generatePrivateMessage(
          // eslint-disable-next-line max-len
          'https://www.themarker.com/career/.premium-MAGAZINE-1.9779555?_ga=2.229269338.777765809.1627724524-420367032.1580220277',
        ),
      );
      expect(res.responseMessage).toEqual(
        'https://www.themarker.com/misc/themarkersmartphoneapp/1.9779555',
      );
    });

    test('when message contain Haaretz Or TheMarker url any url but without numbers', () => {
      const res = handleTextMessage(
        generatePrivateMessage('www.haaretz.co.il/captain/tutorial'),
      );
      expect(res.responseMessage).toEqual('invalid haaretz or themarker url');
    });
  });
  describe('handleTwelveFtSitesUrlMessage', () => {
    test('when message contain nyt url', () => {
      const res = handleTextMessage(
        generatePrivateMessage(
          'https://www.nytimes.com/2021/09/03/science/nania-elephant.html',
        ),
      );
      expect(res.responseMessage).toEqual(
        'https://12ft.io/proxy?q=www.nytimes.com/2021/09/03/science/nania-elephant.html',
      );
    });
    test('when message contain economist url', () => {
      const res = handleTextMessage(
        generatePrivateMessage(
          'https://www.economist.com/china/2021/09/04/xi-jinping-thought-for-children',
        ),
      );
      expect(res.responseMessage).toEqual(
        'https://12ft.io/proxy?q=www.economist.com/china/2021/09/04/xi-jinping-thought-for-children',
      );
    });
    test('when message contain globes url', () => {
      const res = handleTextMessage(
        generatePrivateMessage(
          'https://www.globes.co.il/news/article.aspx?did=1001383766',
        ),
      );
      expect(res.responseMessage).toEqual(
        'https://12ft.io/proxy?q=www.globes.co.il/news/article.aspx?did=1001383766',
      );
    });
    test('when message contain theguardian url', () => {
      const res = handleTextMessage(
        generatePrivateMessage(
          'https://www.theguardian.com/uk-news/2021/sep/09/priti-patel-to-send-boats-carrying-migrants-to-uk-back-across-channel',
        ),
      );
      expect(res.responseMessage).toEqual(
        // eslint-disable-next-line max-len
        'https://12ft.io/proxy?q=www.theguardian.com/uk-news/2021/sep/09/priti-patel-to-send-boats-carrying-migrants-to-uk-back-across-channel',
      );
    });
    // https://www.theguardian.com/uk-news/2021/sep/09/priti-patel-to-send-boats-carrying-migrants-to-uk-back-across-channel
    // todo: kilzi: add test for medium when you find example.
  });
  test('when message is /start', () => {
    const res = handleTextMessage(generatePrivateMessage('/start'));
    expect(res.responseMessage)
      .toEqual(`Please send a message with the article URL inside.

What Sites are supported?

haaretz
themarker
globes.co.il
nytimes
economist
medium.com
theguardian`);
  });
  test('when message is /help', () => {
    const res = handleTextMessage(generatePrivateMessage('/help'));
    expect(res.responseMessage)
      .toEqual(`/start - general explanation and What Sites are Supported
/sites - list of all supported sites
/support - need help? Have any suggestion? send me a message
/help - list of all commands`);
  });
  test('when message is /sites', () => {
    const res = handleTextMessage(generatePrivateMessage('/sites'));
    expect(res.responseMessage).toEqual(`What Sites are supported?

haaretz
themarker
globes.co.il
nytimes
economist
medium.com
theguardian`);
  });
  describe('/support', () => {
    test('when message is /support without any payload', () => {
      const res = handleTextMessage(generatePrivateMessage('/support'));
      expect(res.isSupportMessage).toBeTruthy();
      expect(res.responseMessage).toEqual(`let me know how can I help you. send me message in this structure:
/support [TEXT]
for example:
/support how can I do X`);
    });

    test('when message is /support with payload', () => {
      const res = handleTextMessage(generatePrivateMessage('/support how can I do X'));
      expect(res.isSupportMessage).toBeTruthy();
      expect(res.responseMessage).toBeUndefined();
    });
  });
  describe('logMessage', () => {
    test('with private message', () => {
      const res = handleTextMessage(generatePrivateMessage('text'));
      expect(res.logMessage).toEqual(`
dev
id: userId
first_name: firstName
last_name: lastName
username: username
message: text
`);
    });
    test('with group message', () => {
      const res = handleTextMessage(generateGroupMessage('text'));
      expect(res.logMessage).toEqual(`
dev
id: userId
first_name: firstName
last_name: lastName
username: username
groupTitle: group title (groupId)
message: text
`);
    });
    test('with NODE_ENV === production', () => {
      const res = handleTextMessage(generatePrivateMessage('text'), 'production');
      expect(res.logMessage).toEqual(`
prod
id: userId
first_name: firstName
last_name: lastName
username: username
message: text
`);
    });
    test('with response', () => {
      const res = handleTextMessage(generatePrivateMessage('www.haaretz.co.il/captain/tutorial/.premium-1.10066882'));
      expect(res.logMessage).toEqual(`
dev
id: userId
first_name: firstName
last_name: lastName
username: username
message: www.haaretz.co.il/captain/tutorial/.premium-1.10066882
response: https://www.themarker.com/misc/themarkersmartphoneapp/1.10066882`);
    });
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
