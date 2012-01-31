#!/usr/bin/env node
  
var querystring = require('querystring')
var Hook = require('hook.io-irc').IRC;

var hook = new Hook( {
  name: 'erknugs'
});

hook.on('hook::ready', function(){
  hook.on('**::irc::msg', function(data){
    //nothing going on here yet
  })

  hook.on('*::github_response', function (data) {
    data = querystring.parse(data.body)
    data = JSON.parse(data.payload);

    hook.say({"to":"#dev", "msg": "[github] " + data.repository.name + " (" + data.ref + ") has been updated to " + data.after})
  })
});

hook.start();