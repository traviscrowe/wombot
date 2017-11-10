let config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    client.channels.find('name', 'wombot-testing').send('*wombat noises* [wombat started]');
});

client.on('message', msg => {
    if (msg.author.bot) return;


    let subsReddits = msg.content.match(/([/][r][/]\w+)/g);
    if (subsReddits && !msg.content.includes('reddit.com/r/')) {
        subsReddits.forEach(slashR => {
            msg.channel.send(`https://reddit.com${slashR}`);
        });
    }

    if (msg.channel.name === 'happy-hour' || msg.channel.name === 'wombot-testing') {
        if (msg.content.substring(0, 5) === '🍻 @ ') {
            const mapsQuery = msg.content.substring(5, msg.content.length).replace(' ', '+');
            msg.channel.send(`https://maps.google.com/?q=${mapsQuery.toLowerCase()}+appleton+wi`);
        }
    }

    if (msg.channel.name === 'wallstreetbets' || msg.channel.name === 'wombot-testing') {
        let tickers = msg.content.match(/(?:\$)(\w+)/g);
        if (tickers) {
            tickers.forEach(ticker => {
                msg.channel.send(`https://finance.google.com/finance/getchart?q=${ticker.replace('$', '')}`);
            });
        }
    }

    if (msg.channel.name === 'board-gaming' || msg.channel.name === 'wombot-testing') {
        let games = msg.content.match(/\{\{(.*?)\}\}/g);
        if (games) {
            games.forEach(game => {
                // i'm too fucking tired to deal with regex right now
                let formatted = game.
                    replace('{{', '').
                    replace('}}', '').
                    replace(/\s/g, '+').
                    toLowerCase();
                msg.channel.send(`https://www.boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${formatted}`);
            });
        }
    }

    if (msg.channel.name === 'wombot' || msg.channel.name === 'wombot-testing') {
        if (msg.content === '{{health}}') {
            msg.channel.send('yes, i\'m alive');
        }

        if (msg.content === '{{docs}}') {
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