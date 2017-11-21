const options = {};
const util = require('./util.js');
const bgg = require('bgg')(options);
const ba = require('beeradvocate-api');
const RedditHandler = require('./redditModule');

const redditHandler = new RedditHandler();

module.exports = {
    init: (client, persistance) => {
        redditHandler.init(client, persistance);
    },
    handle: (msg) => {
        if (msg.author.bot) return;

        redditHandler.handleMessage(msg);

        const subsReddits = msg.content.match(/([/][r][/]\w+)/g);
        if (subsReddits && !msg.content.includes('reddit.com/r/')) {
            subsReddits.forEach((slashR) => {
                msg.channel.send(`https://reddit.com${slashR}`);
            });
        }

        const dieRollQuery = msg.content.match(/\.roll (\d+)d(\d+)/);
        if (dieRollQuery) {
            const numDice = parseInt(dieRollQuery[1], 10);
            const numPips = parseInt(dieRollQuery[2], 10);

            if (numDice === 0 || numPips === 0) {
                msg.channel.send('wat?');
                return;
            }

            if (numDice > 100) {
                msg.channel.send('That\'s a lot of dice!');
                return;
            }

            let result = 'You rolled ';

            for (let i = 0; i < numDice; i += 1) {
                if (i > 0) {
                    result += ', ';
                }

                result += Math.floor(Math.random() * numPips) + 1;
            }

            msg.channel.send(result);
        }

        if (msg.channel.name === 'happy-hour' || msg.channel.name === 'wombot-testing') {
            if (msg.content.substring(0, 5) === '🍻 @ ') {
                const mapsQuery = util.encodeForQs(msg.content.substring(5, msg.content.length));
                msg.channel.send(`https://maps.google.com/?q=${mapsQuery}`);
            }

            const beerQuery = msg.content.match(/(?:\.beer )(\w.*)/);
            if (beerQuery) {
                let beerResult = '';
                ba.beerSearch(beerQuery[1], (beers) => {
                    const beersArray = JSON.parse(beers);
                    beersArray.forEach((beer) => {
                        beerResult += `${beer.beer_name} - <https://www.beeradvocate.com${beer.beer_url}>\n`;
                    });
                    const safeBeerResult = beerResult.substring(0, 1999); // can only send 2000 char messages to discord
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
                games.forEach((gameQuery) => {
                    bgg('search', { type: 'boardgame', query: gameQuery.toLowerCase() }).then((results) => {
                        if (!results.items.total) {
                            msg.channel.send('no results!');
                        } else {
                            bgg('thing', { thingtype: 'boardgame', id: results.items.item[0].id, stats: 1 }).then((result) => {
                                if (!result) {
                                    msg.channel.send('no results!');
                                } else {
                                    const game = result.items.item;
                                    const regexp = /.+?(?=&amp;&amp;#35)/;
                                    const name = game.name.length > 1 ? game.name[0].value : game.name.value;
                                    const players = game.minplayers.value === game.maxplayers.value ?
                                        game.minplayers.value : `${game.minplayers.value} - ${game.maxplayers.value}`;
                                    const minutes = game.minplaytime.value === game.maxplaytime.value ?
                                        game.minplaytime.value : `${game.minplaytime.value} - ${game.maxplaytime.value}`;
                                    msg.channel.send(`${name} [${game.yearpublished.value}]\n` +
                                    `${players} players\n` +
                                    `${minutes} minutes\n` +
                                    `${game.statistics.ratings.average.value} avg. rating\n` +
                                    `<https://www.boardgamegeek.com/boardgame/${game.id}>\n` +
                                    `${game.description.match(regexp)}\n` +
                                    `${game.thumbnail}\n`);
                                }
                            }, () => {
                                msg.channel.send('sorry, something is fucked');
                            });
                        }
                    }, () => {
                        msg.channel.send('sorry, something is fucked');
                    });
                });
            }
        }

        if (msg.channel.name === 'wombot' || msg.channel.name === 'wombot-testing') {
            if (msg.content === 'wb.health') {
                msg.channel.send('yes, i\'m alive');
            }

            if (msg.content === 'wb.docs') {
                msg.channel.send('```womdocs:\n\n' +
                    'global:\n\n' +
                    '    - use /r/something to get a link to the subreddit\n' +
                    '    - use .roll xdy to roll x dice with y pips\n\n' +
                    '#happy-hour:\n\n' +
                    '    - use \'🍻 @ \' followed by the name of a location to get a Google Maps URL pointed to that location\n\n' +
                    '#board-games:\n\n' +
                    '    - {{BoardGameTitle}} in messages will return a bunch of information about and a link to the best match of BoardGameTitle on BoardGameGeek\n\n' +
                    '#wallstreetbets:\n\n' +
                    '    - $XYZ in messages will return a Google Finance URL to fetch the daily chart of XYZ ticker\n\n' +
                    '#subreddit-watcher: watches a specified subreddit and auto-posts when anything reaches specified score\n\n' +
                    '    - wb.addSub {subredditname} {score} (ws.addSub gaming 10000)\n' +
                    '    - wb.removeSub {subreddit}\n' + 
                    '    - wb.listSubs\n' + 
                    'Questions? Submit a PR and fix it yourself at https://github.com/traviscrowe/wombat```');
            }
        }
    }
};
