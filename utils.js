var xml;
var localIp = getIPAddress();
var allKeys;
var PlexAPI = require("plex-api");
var AppleIndexHeader = '<?xml version="1.0" encoding="UTF-8"?><atv><body><scroller id="com.sample.movie-shelf"><items><shelf id="shelf_1" columnCount="2"><sections><shelfSection><items>';
var AppleIndexFooter = '</items></shelfSection></sections></shelf></items></scroller></body></atv>';

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

var jsontemplate = require("./node_modules/json-template/json-template").jsontemplate;

require('http').request({
    hostname: 'www.whatismyip.org',
    agent: false
}, function(res) {
    if(res.statusCode != 200) {
        throw new Error('non-OK status: ' + res.statusCode);
    }
    res.setEncoding('utf-8');
    var ipAddress = '';
    res.on('data', function(chunk) { 
      console.log("chunk:"+chunk);
      ipAddress += chunk; 
      
    });
    res.on('end', function() {
        // ipAddress contains the external IP address
      console.log("ipAddress:"+ipAddress);  
    });
}).on('error', function(err) {
    throw err;
});


const DOMAIN_ATV = "trailers.apple.com";
const IP_DNS     = "67.204.18.162"; // *********** Change to the address of your ISP's DNS ***********

function parseRange(str, size) {
    if (str.indexOf(",") != -1) {

        return;

    }

    if (str.substr(0, 6) == "bytes=") {
    	str = str.substr(6, str.length - 6);
    }

    var range = str.split("-"),

        start = parseInt(range[0], 10),

        end = parseInt(range[1], 10);

    // Case: -100

    if (isNaN(start)) {

        start = size - end;

        end = size - 1;

    // Case: 100-

    } else if (isNaN(end)) {

        end = size - 1;

    }



    // Invalid

    if (isNaN(start) || isNaN(end) || start > end || end > size) {

        return;

    }



    return {start: start, end: end};

};

function startWebServer(localIp) {
  
	var url    = require("url");
	var http   = require("http");
	var path   = require("path");
	var fs     = require("fs");
	var ejs    = require("ejs");

	var mime   = require("./mime").types;
	var server = http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log(request.url);
		
		if (pathname.charAt(pathname.length - 1) == "/") {
			response.writeHead(200, {'Content-Type': 'text/plain'});
      response.write('hello');
		}
		
		  var directories = xml.directory;
      var length = directories.length;
		
		
		if (pathname == "/index.xml") {
		
      response.writeHead(200, {'Content-Type': 'text/xml'});
      response.write(AppleIndexHeader);

      for (var i = 0; i < length; i++) {
        console.log(directories[i].attributes);
			  response.write('<moviePoster id="shelf_item_1" accessibilityLabel="'+directories[i].attributes.title+'" featured="true" onSelect="atv.loadURL(\'http://trailers.apple.com/'+directories[i].attributes.key+'.xml\');" onPlay="atv.loadURL(\'http://trailers.apple.com/'+directories[i].attributes.key+'.xml\');"><image>'+directories[i].attributes.thumb+'</image><defaultImage>'+directories[i].attributes.thumb+'</defaultImage><title>'+directories[i].attributes.title+'</title></moviePoster>');
      }
      
      response.write(AppleIndexFooter);
		  response.end();
		}
		
		
		
		
		var realPath = path.join("assets", path.normalize(pathname.replace(/\.\./g, "")));
		console.log("realPath: "+ realPath);
		console.log("WEB: " + pathname);
		
		//to read the media and application.js files
		if (pathname == "/media.js") {
        fs.readFile('./assets/media.js', 'utf8', function (err,data) {
        if (err)
          throw err;
        if (data)
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.write(data.toString('utf8'));
        response.end();
      });
    }
    
    if (pathname == "/appletv/application.js") {
        fs.readFile('./assets/appletv/application.js', 'utf8', function (err,data) {
        if (err)
          throw err;
        if (data)
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.write(data.toString('utf8'));
        response.end();
      });
    }
    
    if (pathname == "/appletv/us/js/application.js") {
        fs.readFile('./assets/appletv/us/js/application.js', 'utf8', function (err,data) {
        if (err)
          throw err;
        if (data)
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.write(data.toString('utf8'));
        response.end();
      });
    }
    
		/*fs.stat(realPath, function(err, stats) {
			if (err) {
				response.writeHead(404, {'Content-Type': 'text/plain'});
				response.write("This request URL " + pathname + " was not found on this server.");
				response.end();						
			} else {
				response.setHeader("Server", "Node/V5");

				response.setHeader('Accept-Ranges', 'bytes');				
				
				var ext = path.extname(realPath);
				ext = ext ? ext.slice(1) : "unknown";
				var contentType = mime[ext] || "application/octet-stream";
				
				response.setHeader("Content-Type", contentType);

				response.setHeader('Content-Length', stats.size);				
				if (request.headers["range"]) {
					var range = parseRange(request.headers["range"], stats.size);

					if (range) {
						response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);

						response.setHeader("Content-Length", (range.end - range.start + 1));

						var raw = fs.createReadStream(realPath, {"start": range.start, "end": range.end});
						response.writeHead(206, "Partial Content");
						raw.pipe(response);

					} else {
						response.removeHeader("Content-Length");

						response.writeHead(416, "Request Range Not Satisfiable");

						response.end();						
					}					
				} else {
					var raw = fs.createReadStream(realPath);
					raw.pipe(response);	
					response.writeHead(200, "OK");
				}
			}
		});*/
	
	});
	server.listen(80);
}

function resolveDNSDomain(msg) {
	var domain = [];
	var index  = 12;
	var offset;
	while (offset = msg.readUInt8(index++)) {
		var sub = "";
		for (var i = 0; i <  offset; i++) {
			sub += String.fromCharCode(msg.readUInt8(index++));
		}
		sub && domain.push(sub)
	}
	return domain.join(".");
}

var _domain = "";
var _ip     = "";
function resolveDNSIp(msg) {
	if (msg.readUInt16LE(2) != 0x8081) return -1;
	
	var domain = [];
	var index  = 12;
	var offset;
	while (offset = msg.readUInt8(index++)) {
		var sub = "";
		for (var i = 0; i < offset; i++) {
			sub += String.fromCharCode(msg.readUInt8(index++));
		}
		sub && domain.push(sub);
	}
	_domain = domain.join(".");
	index += 4;
	while (msg.readUInt32BE(index + 2) != 0x00010001) {
		index += 10;
		var rdLength = msg.readUInt16BE(index);
		index += (rdLength + 2);
		
		if (index >= msg.length) return -1;
	}
	if (msg.readUInt16BE(index + 10) != 4) return -1;
	
	index += 12;
	_ip = msg.readUInt8(index) + "."
	     +msg.readUInt8(index + 1) + "."
	     +msg.readUInt8(index + 2) + "."
	     +msg.readUInt8(index + 3);
	return index;
}

function dot2num(dot) {

	var d = dot.split('.');

	return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
}

function getMsg(tag, domain, ip) {
	var msg = { size: 0, msg: ""};
	var offset = 0;
	
	msg.size = 128;
	msg.msg  = new Buffer(msg.size);
	msg.msg.writeUInt16BE(tag, offset);
	offset += 2;
	msg.msg.writeUInt16BE(0x8180, offset);
	offset += 2;
	msg.msg.writeUInt32BE(0x00010001, offset);
	offset += 4;
	msg.msg.writeUInt32BE(0x00000000, offset);
	offset += 4;
	
	//write domain
	var d = domain.split('.');
	for (var i = 0; i < d.length; i++) {
		var length = d[i].length;
		msg.msg.writeUInt8(length, offset++);
		msg.msg.write(d[i], offset, length);
		offset += length;
	}
	msg.msg.writeUInt8(0, offset++);
	
	msg.msg.writeUInt32BE(0x00010001, offset);
	offset += 4;
	msg.msg.writeUInt16BE(0xC00C, offset);
	offset += 2;
	msg.msg.writeUInt32BE(0x00010001, offset);
	offset += 4;
	msg.msg.writeUInt32BE(0x00000C82, offset);
	offset += 4;
	msg.msg.writeUInt16BE(0x0004, offset);
	offset += 2;
	msg.msg.writeUInt32BE(ip, offset);
	offset += 4;
	
	msg.size = offset;
	return msg;
}

function startDnsProxy(localIp) {

	var dgram = require("dgram");
	
	dgram.createSocket("udp4", function(msg, rinfo) {
		var domain  = resolveDNSDomain(msg);
		var server  = this;
		var address = rinfo.address;
		var port    = rinfo.port;
	
		console.log("DNS: " + domain);
		if (domain == DOMAIN_ATV) {
			var tag = msg.readUInt16BE(0);
			var ip  = dot2num(localIp);
			var newMsg = getMsg(tag, domain, ip);

			console.log("DNS: " + DOMAIN_ATV + " from " + _ip + " change to " + localIp);
			server.send(newMsg.msg, 0, newMsg.size, port, address);
			return;
		} 
		dgram.createSocket("udp4", function(msg, rinfo) {
			server.send(msg, 0, rinfo.size, port, address);
			this.close();
		}).send(msg, 0, rinfo.size, 53, IP_DNS);
	}).bind(53, localIp);
	console.log("DnsProxy binding on " + localIp + ":53");
}


var client = new PlexAPI(localIp);
//first run query
queryPlex("/library/sections");

function queryPlex(key) {
  client.query(key, function (error, result) {
    if (error) {
      throw new Error("Could not connect to server");
    }
      //result.attributes; 	// MediaContainer attributes
      //result.directory; 	// array of child Directory items	
      xml = result;
      parseXML(); 
    });
}

function parseXML() {
    //console.log(xml);
    allKeys = xml.directory;
    console.log("allKeys:"+allKeys);
}


exports.startWebServer = startWebServer;
exports.startDnsProxy = startDnsProxy;