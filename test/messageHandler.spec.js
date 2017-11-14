const messageHandler = require('../messageHandler.js');
const expect = require('chai').expect;

function createMessage(channel, messageText, sendCallback) {
    return {
        author: {},
        content: messageText,
        channel: {
            name: channel,
            send: sendCallback
        }
    }
}

describe('MessageHandler', () => {
    describe('Reddit Helper', () => {
        it('Returns Reddit Links', done => {
            messageHandler.handle(createMessage('any', 'something about /r/btc', text => {
                expect(text).to.equal('https://reddit.com/r/btc');
                done();
            }));
        });
    });

    describe('Die Roll', () => {
        it('Rolls 1d6', done => {
            messageHandler.handle(createMessage('any', 'please .roll 1d6', text => {
                expect(text).to.match(/You rolled \d/);
                done();
            }));
        });

        it('Rolls 5d20', done => {
            messageHandler.handle(createMessage('any', '.roll 5d20 now', text => {
                expect(text).to.match(/You rolled \d+, \d+, \d+, \d+, \d/);
                done();
            }));
        });
    });
});