#! /usr/bin/env node
var Webhook = require('hook.io-webhook').Webhook,
	querystring = require('querystring'),
	IRC = require('hook.io-irc').IRC;


var Erknugs = exports.Erknugs = function (opts) {
	var erk = new IRC({ name: "erknugs" });

	erk.on('hook::ready', function(){
	  //TODO add channel/privmsg commands
	  erk.on('**::irc::msg', function(data){
            if ( data.to.match(/^[#&]/) ) {
              //channel msg
              if ( data.text.match(/erknugs/i) ) {
                erk.say({ "to": data.to, "msg" : "JA" })
              }
            }
	  })

	  erk.on('*::github_response', function (data) {
	    data = querystring.parse(data.body)
	    data = JSON.parse(data.payload);

	    erk.say({"to":"#dev", "msg": "[github] " + data.pusher.name + ' pushed to ' + data.repository.name + " (" + data.ref + "). sha: " + data.after})
	  })

	  erk.on('*::heroku_response', function (data) {
	    data = querystring.parse(data.body)

	    erk.say({"to":"#dev", "msg": "[heroku] " + data.user + ' deployed to ' + data.app + ", sha: " + data.head_long})
	  })

	  erk.on('*::exceptional_response', function (data) {
	    data = querystring.parse(data.body)

	    erk.say({"to":"#dev", "msg": "[exception] " + data.error.app.name + ": " + data.error.title + " -- " + data.error.url })
	  })
	});



	var webhookServer = new Webhook({
	  name: 'webhook-server',
	  port: 9001,
	});

	webhookServer.on('hook::ready', function () {
	  webhookServer.on('webhook::request', function (data) {
	    if (data.url == '/github') {
	      webhookServer.emit('github_response',data)
	    }

	    else if (data.url == '/heroku') {
              console.log(data)
	      webhookServer.emit('heroku_response',data)
	    }

	    else if (data.url == '/exceptional') {
              console.log(data)
	      webhookServer.emit('exceptional_response',data)
	    }
	  })
	})


	this.start = function () {
		webhookServer.start()
                erk.start()
	}
};
