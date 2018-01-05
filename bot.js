const config = require('./config.json');
const Discord = require('discord.js');
const messageHandler = require('./messageHandler.js');
const Persistance = require('./persistance');

const p = new Persistance();
const client = new Discord.Client();

client.on('ready', () => {
    p.init('wombot-config').then(() => {
        const wombot = client.channels.find('name', 'wombot');
        if (wombot) {
            wombot.send('*wombat noises* [wombot started]');
        }
        messageHandler.init(client, p);
    });
});

client.on('error', (err) => {
    console.log(err);
});

client.on('message', (msg) => {
    messageHandler.handle(msg);
});

client.login(config.auth.token);
