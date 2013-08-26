/* required installation: npm install plex-api */

var utils = require("./utils");

var localIp = getIPAddress();
  console.log(localIp);


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

utils.startDnsProxy(localIp);
utils.startWebServer(localIp);
console.log("Starting ATVBrowser - Let the hacking begin :)");