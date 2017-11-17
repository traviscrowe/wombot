const config = require('./config.json');
const Discord = require('discord.js');
const messageHandler = require('./messageHandler.js');

const client = new Discord.Client();

client.on('ready', () => {
    //client.channels.find('name', 'wombot-testing').send('*wombat noises* [wombot started]');
    messageHandler.init(client);
});

client.on('message', (msg) => {
    messageHandler.handle(msg);
});

client.login(config.auth.token);
