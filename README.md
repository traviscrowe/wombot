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
  }
```

## functions
* Google Maps Query: helps you find bars for happy hour with `:beers: @ barName`
* Subreddit Lookup: turns /r/* shorthand into a workable hyperlink
* Google Finance Tickers: jams tickers into Google Finance like $NAK
* BoardGameGeek: queries BGG with game titles tagged like {{Food Chain Magnate}}
* Beer Search: searches beeradvocate.com for your cerveza: `.beer gone away`
* Subreddit Watcher: watches a specified subreddit and auto-posts when anything reaches specified score
  * wb.addSub {subreddit} {score} (ws.addSub gaming 10000)
  * wb.removeSub {subreddit}
  * wb.listSubs
* Wombot State: commands to interact with the state of or information about wombot
  * wb.health
  * wb.docs

## future state, maybe
* allow users with certain access levels to add/remove commands from a given channel (config driven commands)
* better previews on some replies, like Google Maps URLs
