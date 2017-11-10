let config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    client.channels.find('name', 'testing').send('*wombat noises* [wombat started]');
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
});

client.login(config.auth.token);