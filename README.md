#AetherPlayer
![aetherplayer](http://2ndrenais.com/aetherplayer.png)  
AetherPlayer is a CD-like simple html5 audio player which is very suitable for blogs and personal websites. It's intelligent, flexible and easy to use. Setting up AetherPlayer can be as simple as adding two lines of code to your homepage.
#Usage
0 Copy the whole program folder to your project, you can put it wherever you like.  

1 Reference the location to `AetherPlayer_bootstrap.js` in the HTML document which you would like to call the AetherPlayer, then give it an id named `aetherplayer-bootstrap`. AetherPlayer is smart enough to include the rest of the files automatically.  
  
  e.g. `<script src="assets/aetherplayer/js/AetherPlayer_bootstrap.js" id="aetherplayer-bootstrap"></script>`  

2 Edit the play list in `js/playlist.js`.  
  
  e.g. `var playList=[{'artist':'Adele','songName':'rolling in the deep','songURL':'http://www.xxx.com/path/to/song/rolling_in_the_deep.mp3','songAlbum':'http://www.xxx.com/path/to/album/rolling_in_the_deep.jpg'},];`  

3 Enjoy the music:)  
  
  Tip:You may change some default configurations in `js/AetherPlayer.js` if you will.
#Licence
GPLv2
#Example
http://2ndrenais.com/aetherplayer/index.html


