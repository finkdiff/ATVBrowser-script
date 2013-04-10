ATVBrowser - An ATV2/3 trailer app hack.

CREDITS:-
I take no credit for writing the DNS Proxy and Web server code, that was written by a guy/gal on the Weiphone BBS by the username of lionphone. I just modified the code to work for me. This is the original forum post:- http://bbs.weiphone.com/read-htm-tid-5128270.html

DISCLAIMER:- 
Standard disclaimer here, by using this code/source package you do so at your own risk. If you lose data, your computer melts, your house blows up or your current planet of residents is destroyed I take no responsibility. Basically don't blame me if anything goes wrong :)


INSTRUCTIONS:-

1. Download the ATVBrowser zip file.

2. Windows:- Unzip the package to any location you like, just keep the directory structure intact.
   Mac:-     Unzip the package to your Home folder, keep the directory structure intact.
   
3. You need two pieces of information, the IP address of the computer your running the DNS Proxy and Web server on and the DNS address of your ISP.

4. Open up the following file /ATVBrowser/atv.js and change the IP address on the second line to the IP address of your computer.

5. Open up the following file /ATVBrowser/utils.js and change the IP address on the second line to the IP address of your ISP's DNS.

6. You will need any m4v video file that will play on the ATV, it can be a iTunes store purchased file with DRM if you like.

7. Rename the video file to test.m4v and copy it into the /ATBrowser/assets directory.

Now we need to install Node.js

1. Goto www.nodejs.org/download

2. Windows:- Download the Windows Binary(.exe) 32 or 64 bit version depending on your OS, save the node.exe file into the /ATVBrowser/ Directory. The same location as the atv.js file. VERY IMPORTANT!!! You only need the Windows Binary and not the full installer.
   Mac:-     Download and install the Mac OSX Installer(.pkg) Universal package. VERY IMPORTANT!!! You need the full installer and not just the binaries.
   
Running it all

Windows:-
1. Open a command prompt and cd into the ATVBrowser directory.
2. Type:- node atv.js then press enter.
3. If all goes well you'll get a message saying the DNS Proxy and Web server are running.

Mac:-
1. Open Terminal. The terminal should start up in your home directory.
2. Type:- cd ATVBrowser followed by enter.
3. Type:- sudo node atv.js followed by enter. You'll need to enter your user password. VERY IMPORTANT!!! You need to use sudo.
4. If all goes well you'll get a message saying the DNS Proxy and Web server are running.

Now goto Setting/General/Network on your ATV and change the DNS address to the IP address of your computer, the one you entered into atv.js.
Browse over to the Trailer app on the ATV and have fun.




   

