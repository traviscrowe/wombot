let config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    //client.channels.find('name', 'wombot').send('*wombat noises* [wombat started]');
});

client.on('message', msg => {
    if (msg.author.bot) return;


    let subsReddits = msg.content.match(/([/][r][/]\w+)/g);
    if (subsReddits) {
        subsReddits.forEach(slashR => {
            msg.channel.send(`https://reddit.com${slashR}`);
        });
    }

    if (msg.channel.name === 'happy-hour') {
        if (msg.content.substring(0, 5) === '🍻 @ ') {
            const mapsQuery = msg.content.substring(5, msg.content.length).replace(' ', '+');
            msg.channel.send(`https://maps.google.com/?q=${mapsQuery}+appleton+wi`);
        }
    }

    if (msg.channel.name === 'wallstreetbets') {
        let tickers = msg.content.match(/(?:\$)(\w+)/g);
        if (tickers) {
            tickers.forEach(ticker => {
                msg.channel.send(`https://finance.google.com/finance/getchart?q=${ticker.replace('$', '')}`);
            });
        }
    }

    if (msg.channel.name === 'wombot') {
        let games = msg.content.match(/\{\{(.*?)\}\}/g);
        if (games) {
            console.log(games);
            games.forEach(game => {
                // i'm too fucking tired to deal with regex right now
                let formatted = game.replace('{{', '').replace('}}', '').replace(/\s/g, '+').toLowerCase();
                console.log(formatted);
                msg.channel.send(`https://www.boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${formatted}`)
            });
        }

        if (msg.content === '{{health}}') {
            msg.channel.send('yes, i\'m alive');
        }
    }
});

client.login(config.auth.token);
