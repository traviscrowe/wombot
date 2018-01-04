
// Use this code for creating an initial config file in the S3 bucket
const d = require('./default.subs.json');
const Persistance = require('./persistance');

const p = new Persistance();
p.init('wombot-config');
p.storeObject('config.json', d);
