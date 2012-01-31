var Hook = require('hook.io').Hook,
    http = require('http'),
    url  = require('url'),
    qs   = require('qs'),
    util = require('util');

var Webhook = exports.Webhook = function(options){

  var self = this;

  Hook.call(self, options);
  
  self.on('hook::ready', function(){
    self.findPort({ port: self.port }, function(err, port){
      self.port = port;
      self._startHTTPServer();
    })
  });

};

// Webhook inherits from Hook
util.inherits(Webhook, Hook);

Webhook.prototype._startHTTPServer = function(){
  
    var self = this;

    http.createServer(function(req, res){

        var body = '';

        // 
        //  Buffer up all the body data from incoming request
        //
        req.on('data', function(data){
          body += data;
        });

        //
        // On the end of the request, emit a hook.io message with HTTP payload
        //
        req.on('end', function(){
          var json;
          try {
            json = JSON.parse(body);

            //
            // If the json parses, assume it's conformed to JSON-RPC v1.0
            //

            //
            // Append url to ( and other interesting request information ) to params
            //
            json.params.url = req.url;

            //
            // Emit the hook.io event based on the JSON-RPC `method` attribute.
            //
            self.emit(json.method, json.params);
            res.end('{ "message": "OK" }');

          }
          catch(err) {

            //
            // If we couldnt parse the request body as JSON,
            // check if we've been passed a method query string, if so,
            // we treat the rest of the query params as JSON-RPC commands
            //
            json = qs.parse(url.parse(req.url).query);
            if(typeof json.method !== 'undefined') {
              self.emit(json.method, json, function(err, result){
                res.end('{ "err": "' + JSON.stringify(err) + '" ' + '"message": ' + JSON.stringify(result) + ' }');
              });
              return;
            } else {
              //
              // If we could't parse the JSON or find a method query param,
              // we emit a generic request event,
              // that contains the body as data
              //
              self.emit('webhook::request', {
               url: req.url,
               body: body
              });
              res.end('{ "message": "OK" }');
              return;
            }
          }

        });

      }).listen(self.port, function(err, result){
        self.emit('webhook::server::started', self.port)
      });

};
