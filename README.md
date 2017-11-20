# wombot

## a discord bot for degenerates
requires a file called config.json with auth.token defined as a valid discord bot token
The reddit-watcher requires a reddit section on the config
```json
  "reddit": {
    "userAgent": "nodejs:wombot:v0.01 (by /u/yolan_tao)",
    "clientId": "",
    "clientSecret": "",
    "refreshToken": ""
  }```


## functions
* Google Maps Query: helps you find bars for happy hour
* Subreddit Lookup: turns /r/* shorthand into a workable hyperlink
* Google Finance Tickers: jams tickers into Google Finance
* BoardGameGeek: queries BGG with game titles tagged like {{Food Chain Magnate}}
* Health Check: tells you if it's alive or not when you send {{health}} to #wombot
* Docs: tells you how to interact with it when you send {{docs}} to #wombot
* Beer Search: searches beeradvocate.com for your cerveza: `.beer gone away`
* Subreddit Watcher: watches a specified subreddit and auto-posts when anything reaches specified score
   * wb.addSub {subreddit} {score} (ws.addSub gaming 10000)
   * wb.removeSub {subreddit}
   * wb.listSubs


## future state, maybe
* allow users with certain access levels to add/remove commands from a given channel (config driven commands)
* overhaul syntax to partition direct bot interactions, like health checks, from context-specific helpers, like BoardGameGeek lookups in the #board-gaming channel
    * something like `wb.health` instead of `{{health}} since the double bracket syntax is used for contextual helpers
* env configs to allow for testing that doesn't piss people off
* BGG lookup should hit their API directly and return the actual best guess game page instead of a URL of search results
* better previews on some replies, like Google Maps URLs
