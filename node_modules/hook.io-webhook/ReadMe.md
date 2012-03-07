# Installation

     npm install hook.io-webhook -g

# Usage

     hookio-webhook

*Starts up a webserver which listens for incoming HTTP requests and emits the requests to your hook.io network*

hook.io-webhook will also attempt to parse all incoming form and query string data that may conform to JSON-RPC 1.0. If it cannot parse any data, hookio-webhook will fall-back to emit a generic `request` event containing the entire body of the http request.

## Programmatically

```javascript
#! /usr/bin/env node
var Webhook = require('../lib/webhook').Webhook;

var webhookServer = new Webhook({
  name: 'webhook-server',
  port: 9001,
});

webhookServer.start();
```