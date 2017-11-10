const config = require('./config.json');
const util = require('./util.js');
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
    client.channels.find('name', 'wombot-testing').send('*wombat noises* [wombat started]');
});

client.on('message', (msg) => {
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
                const bggQuery = util.encodeForQs(game
                    .replace('{{', '')
                    .replace('}}', ''));
                msg.channel.send(`https://www.boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${bggQuery}`);
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
                        '    - messages with subreddit references (\'/r/\') will be responded to with a link to the subreddit\n\n' +
                        '#happy-hour:\n\n' +
                        '    - messages beginning with \'🍻 @ \' will return a Google Maps URL searching for whatever is after the prefix\n\n' +
                        '#board-games:\n\n' +
                        '    - board game titles surrounded by double braces, like {{this}} will return a BGG URL searching for the game\n\n' +
                        '#wallstreetbets:\n\n' +
                        '    - stock tickers referenced like $NAK will return a Google Finance URL to fetch the daily chart of that ticker\n\n' +
                        'Questions? Submit a PR and fix it yourself at https://github.com/traviscrowe/wombat```');
        }
    }
});

client.login(config.auth.token);
