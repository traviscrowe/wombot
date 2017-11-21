const config = require('./config.json');
const Discord = require('discord.js');
const messageHandler = require('./messageHandler.js');
const Persistance = require('./persistance');
const p = new Persistance();
const client = new Discord.Client();

client.on('ready', () => {
    p.init('wombot-config').then(data => {
        const wombot = client.channels.find('name', 'wombot-testing');
        if (wombot) {
            wombot.send('*wombat noises* [wombot started]');
        }
        messageHandler.init(client, p);
    });
});

client.on('error', (err) => {
    console.log(err);
})

client.on('message', (msg) => {
    messageHandler.handle(msg);
});

client.login(config.auth.token);

// Use this code for creating an initial config file in the S3 bucket

// var d = require('./default.subs.json');
// const Persistance = require('./persistance');
// const p = new Persistance();
// p.init('wombot-config');
// p.storeObject('config.json', d)