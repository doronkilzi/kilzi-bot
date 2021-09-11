const messageHandler = require('./messageHandler');

const {
  handleTextMessage,
} = messageHandler;
describe('messageHandler', () => {
  describe('invalid urls', () => {
    test('when message dont contain any url', () => {
      const res = handleTextMessage(generateMessage('some text'));
      expect(res.responseMessage).toBeUndefined();
    });
    test('when message contain unfamiliar url ', () => {
      const res = handleTextMessage(generateMessage('www.google.co.il'));
      expect(res.responseMessage).toBeUndefined();
    });

    test('when message contain Haaretz Or TheMarker url any url but without numbers', () => {
      const res = handleTextMessage(generateMessage('www.haaretz.co.il/captain/tutorial'));
      expect(res.responseMessage).toBeUndefined();
    });
  });
  describe('handleHaaretzOrTheMarkerArticleMessage', () => {
    test('when message contain valid url', () => {
      const res = handleTextMessage(generateMessage('www.haaretz.co.il/captain/tutorial/.premium-1.10066882'));
      expect(res.responseMessage).toEqual('https://www.themarker.com/misc/themarkersmartphoneapp/1.10066882');
    });

    test('when message contain valid url but with multiple numbers, should take the first number', () => {
      const res = handleTextMessage(generateMessage('https://www.themarker.com/career/.premium-MAGAZINE-1.9779555?_ga=2.229269338.777765809.1627724524-420367032.1580220277'));
      expect(res.responseMessage).toEqual('https://www.themarker.com/misc/themarkersmartphoneapp/1.9779555');
    });
  });
  describe('handleTwelveFtSitesUrlMessage', () => {
    test('when message contain nyt url', () => {
      const res = handleTextMessage(generateMessage('https://www.nytimes.com/2021/09/03/science/nania-elephant.html'));
      expect(res.responseMessage).toEqual('https://12ft.io/proxy?q=www.nytimes.com/2021/09/03/science/nania-elephant.html');
    });
    test('when message contain economist url', () => {
      const res = handleTextMessage(generateMessage('https://www.economist.com/china/2021/09/04/xi-jinping-thought-for-children'));
      expect(res.responseMessage).toEqual('https://12ft.io/proxy?q=www.economist.com/china/2021/09/04/xi-jinping-thought-for-children');
    });
    test('when message contain globes url', () => {
      const res = handleTextMessage(generateMessage('https://www.globes.co.il/news/article.aspx?did=1001383766'));
      expect(res.responseMessage).toEqual('https://12ft.io/proxy?q=www.globes.co.il/news/article.aspx?did=1001383766');
    });
    test('when message contain theguardian url', () => {
      const res = handleTextMessage(generateMessage('https://www.theguardian.com/uk-news/2021/sep/09/priti-patel-to-send-boats-carrying-migrants-to-uk-back-across-channel'));
      expect(res.responseMessage).toEqual('https://12ft.io/proxy?q=www.theguardian.com/uk-news/2021/sep/09/priti-patel-to-send-boats-carrying-migrants-to-uk-back-across-channel');
    });
    // https://www.theguardian.com/uk-news/2021/sep/09/priti-patel-to-send-boats-carrying-migrants-to-uk-back-across-channel
    // todo: kilzi: add test for medium when you find example.
  });
  describe('handleStartMessage', () => {
    test('when message is /start', () => {
      const res = handleTextMessage(generateMessage('/start'));
      expect(res.responseMessage).toEqual(`Please send a message with the article URL inside.

What Sites are Supported?

haaretz
themarker
globes.co.il
nytimes
economist
medium.com
theguardian`);
    });
  });
});

function generateMessage(text) {
  return {
    text,
    chat: {
      id: 'chatId',
    },
    from: {
      id: 'chatId',
      first_name: 'firstName',
      last_name: 'lastName',
      username: 'username',
    },
  };
}
