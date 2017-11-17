const schedule = require('node-schedule');
const defaults = require('./default.subs.json');
const config = require('./config.json');
const snoowrap = require('snoowrap');
const r = new snoowrap(config.reddit);

const defaultScore = 1000;
const cron = '*/1 * * * *';
const addSubRegex = /(?:\wb\.addSub\s)(\w+)(?:\s)(\w+)/i;
const listSubsRegex = /(?:\wb\.listSubs)/i;
const removeSubRegex = /(?:\wb\.removeSub\s)(\w+)/i;

class RedditMessageHandler {
  constructor() {
    this.redditScheduler = new RedditScheduler();
  }
  init(client) {
    this.redditScheduler.init(client);
  };

  handleMessage(msg) {
    if (addSubRegex.test(msg.content)) {
      let match = addSubRegex.exec(msg.content);
      const query = match[1];
      const score = match[2]
      this.redditScheduler.addSubscription(msg.channel, query, score);
    }

    if (listSubsRegex.test(msg.content)) {
        var subs = this.redditScheduler.getSubscriptions(msg.channel);
    }

    if (removeSubRegex.test(msg.content)) {
      const query = removeSubRegex.exec(msg.content)[1];
      this.redditScheduler.removeSubscription(msg.channel, query);
    }
  };
}

class RedditScheduler {
  constructor() {
    this.scheduledJob;
    this.localClient;
    this.subscriptions = {};
    this.redditClient = new RedditClient();
  }

  getPosts(postToChannel = true) {
    Object.keys(this.subscriptions).forEach(key => {
      let sub = this.subscriptions[key];
      this.redditClient.getHotPosts(sub.subreddit, sub.score).then(posts => {
        posts.forEach(post => {
          if (postToChannel) {
            sub.channel.send(`${post.title}\nhttp://reddit.com${post.permalink}`);
          }
        });
      });
    })
  }

  getKey(channel, subreddit) {
    return `${channel.name}-${subreddit}`;
  }

  setSubscription(channel, subreddit, score) {
    let key = this.getKey(channel, subreddit);
    this.subscriptions[key] = {
      channel: channel,
      subreddit: subreddit,
      score: score
    }
  }

  init(client) {
    this.localClient = client;
    if (!this.scheduledJob) {
      this.scheduledJob = schedule.scheduleJob(cron, this.getPosts.bind(this));
      defaults.forEach(sub => {
        let channel = client.channels.filter(x => x.name == sub.channelName).first();
        if (channel) {
          this.setSubscription(channel, sub.subreddit, sub.score);
        }
      });
      this.getPosts(false);
    }
  }

  addSubscription(channel, subreddit, score) {
    this.setSubscription(channel, subreddit, score);
    this.getPosts();
  }

  getSubscriptions(channel) {
    var subs = Object.keys(this.subscriptions)
      .map(key => this.subscriptions[key])
      .filter(x => x.channel === channel);
    if (subs && subs.length) {
        let response = '';
        subs.forEach(sub => {
            response += `\nr/${sub.subreddit} (score: ${sub.score})`;
        });
        channel.send(response, {code: true});
    }
  }

  removeSubscription(channel, subreddit) {
    let key = this.getKey(channel, subreddit);
    delete this.subscriptions[key];
  }  
}

class RedditClient {
  constructor() {
    this.posts = {};
  }
  getHotPosts(subreddit, score = defaultScore) {
    return r.getHot(subreddit, {limit:100})
      .filter(x => x.score > score)
      .filter(x => !this.posts[x.id])
      .map(x => {
        return {
            id: x.id,
            title: x.title,
            score: x.score,
            preview: x.preview,
            thumbnail: x.thumbnail,
            permalink: x.permalink,
            url: x.url
        };
      })
      .map(x => {
       this.posts[x.id] = x;
       return x; 
      });
  }
}

module.exports = RedditMessageHandler;