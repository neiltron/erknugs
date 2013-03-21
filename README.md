***This is no longer maintained***. I took my own advice and started using hubot instead.

Erknugs is an irc bot for announcing development-related events to your team's irc channel.

It implements an irc client and a webhook server. The webhook server currently listens for commit messages from Github, deploy notifications from Heroku, and exceptions from Exceptional and Sentry.

# Usage

```
git clone git@github.com:neiltron/erknugs.git; cd erknugs; vim config.json; node bin/erknugs
```

# Disclaimer
This is one of few times I've used node.js. It isn't pretty. I won't be supporting this in any way outside of my own hacks and needs, though I'll gladly accept pull requests.

You should really probably just use [hubot](http://hubot.github.com/). 


