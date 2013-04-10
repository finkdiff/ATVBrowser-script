var utils = require("./utils");
const LOCAL_IP = "192.168.0.200"; // ************* Change to the IP address of the machine you are running the DNS proxy and Web server on *************

console.log("Starting ATVBrowser - Let the hacking begin :)");
utils.startDnsProxy(LOCAL_IP);
utils.startWebServer(LOCAL_IP);
