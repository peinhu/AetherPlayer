[【中文说明】](https://github.com/peinhu/AetherPlayer/wiki)
#AetherPlayer
![aetherplayer](http://2ndrenais.com/aetherplayer.png)  
  
  **AetherPlayer** is a CD-like simple HTML5 audio player which is very suitable for blogs and personal websites.  
It's intelligent, flexible and easy to use.  
Setting up AetherPlayer can be as simple as adding two lines of code to your homepage.  
#Features
* autoloading : by referencing the bootstrap file of AetherPlayer to your HTML document, the rest dependent files will be loaded automatically
* delayed load : No files will be included until the original page is completely loaded
* custom configuration : you may change the position, playmode, debug parameters in configuration
* preload : the images of albums will be loaded by order totally when the player initialize even if they are yet to be displayed

#Usage
0) Copy the whole program folder to your project, you can put it wherever you like.  

1) Reference the location to `AetherPlayer_bootstrap.js` in the HTML document which you would like to call the AetherPlayer, then give it an id named `aetherplayer-bootstrap`. AetherPlayer is smart enough to include the rest of the files automatically.  
  
  e.g. `<script src="assets/aetherplayer/js/AetherPlayer_bootstrap.js" id="aetherplayer-bootstrap"></script>`  

2) Edit the play list in `js/playlist.js`.  
  
  e.g. `var playList=[{'artist':'Adele','songName':'rolling in the deep','songURL':'http://www.xxx.com/path/to/song/rolling_in_the_deep.mp3','songAlbum':'http://www.xxx.com/path/to/album/rolling_in_the_deep.jpg'},];`  

3) Enjoy the music:)  
  
  Tip:You may change some default configurations in `js/AetherPlayer.js` if you will.
#Licence
AetherPlayer is available under the GPLv2 licence, see the LICENCE file for more information.
#Example
http://2ndrenais.com/aetherplayer/index.html  



