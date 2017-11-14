const util = require('./util.js');
const request = require('request');
const xmlParser = require('xml2js').parseString;

module.exports = {
    handle: (msg) => {
        if (msg.author.bot) return;

        const subsReddits = msg.content.match(/([/][r][/]\w+)/g);
        if (subsReddits && !msg.content.includes('reddit.com/r/')) {
            subsReddits.forEach((slashR) => {
                msg.channel.send(`https://reddit.com${slashR}`);
            });
        }

        if (msg.channel.name === 'happy-hour' || msg.channel.name === 'wombot-testing') {
            if (msg.content.substring(0, 5) === '🍻 @ ') {
                const mapsQuery = util.encodeForQs(msg.content.substring(5, msg.content.length));
                msg.channel.send(`https://maps.google.com/?q=${mapsQuery}`);
            }

            const beerQuery = msg.content.match(/(?:\.beer )(\w.*)/);
            if (beerQuery) {
                var ba = require('beeradvocate-api');
                var beerResult = '';
                ba.beerSearch(beerQuery[1], function(beers) {
                    var beersArray = JSON.parse(beers);
                    for (var beer in beersArray) {
                        var b = beersArray[beer];
                        beerResult += b.beer_name + ' - ' + '<https://www.beeradvocate.com' + b.beer_url + '>' + '\n';
                    };
                    var safeBeerResult = beerResult.substring(0, 1999) //can only send 2000 char messages to discord
                    msg.channel.send(safeBeerResult);
                });
            }
        }

        if (msg.channel.name === 'wallstreetbets' || msg.channel.name === 'wombot-testing') {
            const tickers = msg.content.match(/(?:\$)(\w+)/g);
            if (tickers) {
                tickers.forEach((ticker) => {
                    const tickerQuery = util.encodeForQs(ticker.replace('$', ''));
                    msg.channel.send(`https://finance.google.com/finance/getchart?q=${tickerQuery}`);
                });
            }
        }

        if (msg.channel.name === 'board-games' || msg.channel.name === 'wombot-testing') {
            const games = msg.content.match(/\{\{(.*?)\}\}/g);
            if (games) {
                games.forEach((game) => {
                    const options = {
                        url: `https://www.boardgamegeek.com/xmlapi2/search?type=boardgame&query=${game}`,
                        headers: {
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                        },
                    };
                    request(options, (error, response, body) => {
                        if (error) {
                            msg.channel.send('sorry, something is fucked');
                        }
                        return xmlParser(body, (err, result) => {
                            if (err) {
                                msg.channel.send('sorry, something is fucked');
                            }
                            if (parseInt(result.items.$.total, 10) > 0) {
                                const bestResult = result.items.item[0];
                                msg.channel.send(`\`${bestResult.name[0].$.value} [${bestResult.yearpublished[0].$.value}]\`\nhttps://www.boardgamegeek.com/boardgame/${bestResult.$.id}`);
                            } else {
                                msg.channel.send('no results!');
                            }
                        });
                    });
                });
            }
        }

        const dieRollQuery = msg.content.match(/\.roll (\d+)d(\d+)/);
        if (dieRollQuery) {
            const numDice = parseInt(dieRollQuery[1]);
            const numPips = parseInt(dieRollQuery[2]);

            if (numDice === 0 || numPips === 0) {
                msg.channel.send('wat?');
                return;
            }

            if (numDice > 100) {
                msg.channel.send('That\'s a lot of dice!');
                return;
            }

            let result = "You rolled ";

            for (let i = 0; i < numDice; i++) {
                if (i > 0) {
                    result += ", ";
                }

                result += Math.floor(Math.random() * numPips) + 1;
            }

            msg.channel.send(result);
        }

        if (msg.channel.name === 'wombot' || msg.channel.name === 'wombot-testing') {
            if (msg.content === 'wb.health') {
                msg.channel.send('yes, i\'m alive');
            }

            if (msg.content === 'wb.docs') {
                msg.channel.send('```womdocs:\n\n' +
                            'global:\n\n' +
                            '    - messages with subreddit references (\'/r/\') will be responded to with a link to the subreddit\n' +
                            '    - use .roll xdy to roll x dice with y pips\n\n' +
                            '#happy-hour:\n\n' +
                            '    - messages beginning with \'🍻 @ \' will return a Google Maps URL searching for whatever is after the prefix\n\n' +
                            '#board-games:\n\n' +
                            '    - board game titles surrounded by double braces, like {{this}} will return a BGG URL searching for the game\n\n' +
                            '#wallstreetbets:\n\n' +
                            '    - stock tickers referenced like $NAK will return a Google Finance URL to fetch the daily chart of that ticker\n\n' +
                            'Questions? Submit a PR and fix it yourself at https://github.com/traviscrowe/wombat```');
            }
        }
    }
};
