[【中文说明】](https://github.com/peinhu/AetherPlayer/wiki)  

[Aetherplayer for WordPress](https://github.com/peinhu/AetherPlayer-wordpress)
# AetherPlayer
![aetherplayer](http://www.2ndrenais.com/aetherplayer1.png)  
  
  **AetherPlayer** is a CD-like simple HTML5 audio player which is very suitable for blogs and personal websites.  
It's intelligent, responsive and easy to use.  
Setting up AetherPlayer can be as simple as adding two lines of code to your homepage.   
[Check out the DEMO](http://www.2ndrenais.com/aetherplayer/index.html)
# Features
* Autoloading : By referencing the bootstrap file of AetherPlayer to your HTML document, the rest dependent files will be loaded automatically.
* Delayed load : No files will be included until the original page is completely loaded.
* Custom configuration : It's very easy to change the position, playmode, debug parameters in configuration.
* Preload images: The images of albums will be loaded by order when the player initialize even if they are yet to be displayed.
* Responsive : The player is adaptive both on PC and mobile device.
* Non-jQuery : Since the jQuery file is too overstaffed and may cause some compatibility issues, AetherPlayer use the native JavaScript to cancel the dependence on jQuery now.

# Usage
0 Copy the whole program folder to your project, you can put it wherever you like.  

1 Reference the location to `AetherPlayer_bootstrap.js` in the HTML document which you would like to call the AetherPlayer. AetherPlayer is smart enough to include the rest of the files automatically.  
  
  e.g. `<script src="assets/aetherplayer/js/AetherPlayer_bootstrap.js"></script>`  

2 Edit the play list in `js/playlist.js`.  
  
  e.g. `var aetherplayer_playList_file=[{'artist':'Adele','songName':'rolling in the deep','songURL':'http://www.xxx.com/path/to/song/rolling_in_the_deep.mp3','songCover':'http://www.xxx.com/path/to/album/rolling_in_the_deep.jpg'},];`  

3 Enjoy the music:)  
  
  Tips: you may change some default configurations in `js/AetherPlayer.js` if you will.
# Licence
AetherPlayer is available under the GPLv2 licence, see the LICENCE file for more information.



