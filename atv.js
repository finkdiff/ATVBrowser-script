/* required installation: npm install plex-api */

var utils = require("./utils");

function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}
var LOCAL_IP = getIPAddress();
//const LOCAL_IP = "192.168.2.4";

console.log("localIP address obtained:"+LOCAL_IP);
console.log("Starting ATVBrowser - Let the hacking begin :)");
utils.startDnsProxy(LOCAL_IP);
utils.startWebServer(LOCAL_IP);

var PlexAPI = require("plex-api");
var client = new PlexAPI(LOCAL_IP);

var result = client.query("/", function (error, result) {
	if (error) {
		throw new Error("Could not connect to server");
	}

	result.attributes; 	// MediaContainer attributes
	result.directory; 	// array of child Directory items
	console.log("attributes: "+result.attributes);
	console.log("directory: "+result.directory);
	
	console.log(result);
	
	return result;

});

//console.log(result);

/*
//setup the XML server
var express = require('express');
var app = express.createServer();

app.get('/index.xml', function(req, res){
  res.render('index.ejs');
});

app.get('/assets/appletv/application.js', function(req,res) {
  res.sendfile('assets/appletv/application.js');
});

app.get('/assets/appletv/us/js/application.js', function(req,res) {
  res.sendfile('assets/appletv/us/js/application.js');
});

app.get('/assets/media.js', function(req,res) {
  res.sendfile('assets/media.js');
});

app.listen(3000);
*/