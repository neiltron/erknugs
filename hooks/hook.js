#! /usr/bin/env node
var Webhook = require('hook.io-webhook').Webhook;
querystring = require('querystring')

var webhookServer = new Webhook({
  name: 'webhook-server',
  port: 9001,
});

webhookServer.on('hook::ready', function () {
  webhookServer.on('webhook::request', function (data) {
    console.log(data)
    if (data.url == '/github') {
      webhookServer.emit('github_response',data)
    }
    console.log(querystring.parse(data.body));
  })
})

webhookServer.start();
