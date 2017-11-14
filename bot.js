const config = require('./config.json');
const util = require('./util.js');
const request = require('request');
const xmlParser = require('xml2js').parseString;
const Discord = require('discord.js');
const messageHandler = require('./messageHandler.js');

const client = new Discord.Client();

client.on('ready', () => {
    client.channels.find('name', 'wombot-testing').send('*wombat noises* [wombot started]');
});

client.on('message', (msg) => {
    messageHandler.handle(msg);
});

client.login(config.auth.token);
