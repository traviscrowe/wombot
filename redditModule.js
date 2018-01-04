const schedule = require('node-schedule');
const config = require('./config.json');
const Snoowrap = require('snoowrap');

const storageKey = 'config.json';

const r = new Snoowrap(config.reddit);

const defaultScore = 1000;
const cron = '*/5 * * * *';
const addSubRegex = /(?:\wb\.addSub\s)(\w+)(?:\s)(\w+)/i;
const listSubsRegex = /(?:\wb\.listSubs)/i;
const removeSubRegex = /(?:\wb\.removeSub\s)(\w+)/i;
const isReddit = /https:\/\/www\.reddit\.com/i;

class RedditClient {
    constructor() {
        this.posts = {};
    }
    getHotPosts(subreddit, score = defaultScore) {
        return r.getHot(subreddit, { limit: 10 })
            .filter(x => x.score > score)
            .filter(x => !this.posts[x.id])
            .map(x => ({
                id: x.id,
                title: x.title,
                score: x.score,
                preview: x.preview,
                thumbnail: x.thumbnail,
                permalink: x.permalink,
                url: x.url
            }))
            .map((x) => {
                this.posts[x.id] = x;
                return x;
            });
    }
}

class RedditScheduler {
    constructor() {
        this.scheduledJob = null;
        this.localClient = null;
        this.subscriptions = {};
        this.redditClient = new RedditClient();
    }

    getPosts(postToChannel = true) {
        Object.keys(this.subscriptions).forEach((key) => {
            const sub = this.subscriptions[key];
            this.redditClient.getHotPosts(sub.subreddit, sub.score).then((posts) => {
                posts.forEach((post) => {
                    if (postToChannel && sub.channel) {
                        if (isReddit.test(post.url)) {
                            sub.channel.send(`http://reddit.com${post.permalink}`);
                        } else {
                            sub.channel.send(`${post.title}\n${post.url}`);
                        }
                    }
                });
            });
        });
    }

    getKey(channelName, subreddit) {
        return `${channelName}-${subreddit}`;
    }

    setSubscription(channel, channelName, subreddit, score, store = true) {
        const key = this.getKey(channelName, subreddit);
        this.subscriptions[key] = {
            channel,
            channelName,
            subreddit,
            score
        };
        if (store) {
            this.saveSubscriptions();
        }
    }

    saveSubscriptions() {
        const subs = Object.keys(this.subscriptions).map((x) => {
            const sub = this.subscriptions[x];
            return {
                channelName: sub.channelName,
                subreddit: sub.subreddit,
                score: sub.score
            };
        });
        this.persistance.storeObject(storageKey, { subscriptions: subs }).catch(err => console.log(err));
    }

    init(client, persistance) {
        this.localClient = client;
        this.persistance = persistance;
        if (!this.scheduledJob) {
            this.scheduledJob = schedule.scheduleJob(cron, this.getPosts.bind(this));
            this.persistance.getObject(storageKey).then((c) => {
                console.log('Saved subscriptions', c);
                if (c && c.subscriptions) {
                    c.subscriptions.forEach((sub) => {
                        const channel = client.channels.filter(x => x.name === sub.channelName).first();
                        this.setSubscription(channel, sub.channelName, sub.subreddit, sub.score, false);
                    });
                    this.saveSubscriptions();
                    this.getPosts(false);
                }
            }).catch(() => {
                console.log('No saved subscriptions found');
            });
        }
    }

    addSubscription(channel, subreddit, score) {
        this.setSubscription(channel, channel.name, subreddit, score);
        this.getPosts();
    }

    getSubscriptions(channel) {
        const subs = Object.keys(this.subscriptions)
            .map(key => this.subscriptions[key])
            .filter(x => x.channel === channel);
        if (subs && subs.length) {
            let response = '';
            subs.forEach((sub) => {
                response += `\nr/${sub.subreddit} (score: ${sub.score})`;
            });
            channel.send(response, { code: true });
        }
    }

    removeSubscription(channel, subreddit) {
        const key = this.getKey(channel, subreddit);
        delete this.subscriptions[key];
    }
}

class RedditMessageHandler {
    constructor() {
        this.redditScheduler = new RedditScheduler();
    }
    init(client, persistance) {
        this.redditScheduler.init(client, persistance);
    }

    handleMessage(msg) {
        if (addSubRegex.test(msg.content)) {
            const match = addSubRegex.exec(msg.content);
            const query = match[1];
            const score = match[2];
            this.redditScheduler.addSubscription(msg.channel, query, score);
        }

        if (listSubsRegex.test(msg.content)) {
            this.redditScheduler.getSubscriptions(msg.channel);
        }

        if (removeSubRegex.test(msg.content)) {
            const query = removeSubRegex.exec(msg.content)[1];
            this.redditScheduler.removeSubscription(msg.channel, query);
        }
    }
}

module.exports = RedditMessageHandler;
