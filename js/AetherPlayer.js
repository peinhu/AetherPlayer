/**
* @author	Payne
* @email	huyang110yahoo@gmail.com
* @github	https://github.com/peinhu
* @site		http://2ndrenais.com
* @date		2015-08-04
*/

(function() {

	'use strict';

	//Config your player here.
	var config = {
		dataStorage : 'file',//[file|database] The way to storage playlist. If you choose database, then you should declare and assign a JavaScript variable named aetherplayer_playList_database in script tag.
		position : 'leftbottom',//[lefttop|leftbottom|righttop|rightbottom] The position of audio player.
		fontFamily : 'microsoft yahei,arial,sans-serif',//[FONTFAMILY] The fonts of your text.
		autoPlay : false,//[true|false] Start playing music immediately when the data is ready. 
		playMode : 'order',//[order|repeat|random] The play mode by default.
		debug : false,//[true|false] Show the debug information in the console.
	};

	var audio,moveLength,_playstatus = 'pause',_playmode,_songindex = 0,preloadImg = new Array(),internal,debug,playList=[];
 
	playerInit();	
	
	//initialization process of the player
	function playerInit(){
		playerAdd();
		audioEventBind();
		buttonEventBind();
		configLoad();
		if(playList.length==0)return;
		albumPreload();
		prepareToPlay();
	}
	
	function audioEventBind(){
	
		audio.addEventListener('playing',function(){  
			if(debug)debugOutput('audio - playing:'+playList[_songindex].songName);
		},true );

		audio.addEventListener('pause',function(){
			if(debug)debugOutput('audio - pause:'+playList[_songindex].songName);
		},true );
		
		audio.addEventListener('ended',function(){
			musicNext();
			if(debug)debugOutput('audio - ended:'+playList[_songindex].songName);
		});

		audio.addEventListener('error',function(){
			musicNext();
			if(debug)debugOutput('audio - error:'+playList[_songindex].songName);
		});

		audio.addEventListener('loadeddata',function(){
			if(debug)debugOutput('audio - loadeddata:'+playList[_songindex].songName);
		});
		
		audio.addEventListener('stalled',function(){
			if(debug)debugOutput('audio - stalled:'+playList[_songindex].songName);
		}); 
	
	}
	
	function buttonEventBind(){
		
		var eventType = "",isSupportTouch = "ontouchend" in document ? true : false;
		
		(isSupportTouch==true)?eventType = "touchstart":eventType = "mousedown";

		$('#aetherplayer #player-title').addEventListener('mouseover',
			function(){
			internal = setInterval(function(){titleMove()},20);			
			}
		);		

		$('#aetherplayer #player-title').addEventListener('mouseout',
			function(){
			titleReset();
			clearInterval(internal);
			}
		)
		
		var playBtnFunc = function(){
			if(_playstatus=='pause'){
				musicPlay();
				if(debug)debugOutput('button - play');
			}else if(_playstatus=='playing'){
				musicPause();
				if(debug)debugOutput('button - pause');
			}	
		};
		
		var prevBtnFunc = function(){
			musicPrev();
			if(debug)debugOutput('button - prev');			
		};
		
		var nextBtnFunc = function(){
			musicNext();
			if(debug)debugOutput('button - next');			
		};
		
		var playModeBtnFunc = function(){
			playModeChange();
			if(debug)debugOutput('button - mode:'+_playmode);				
		};

		var AlbumShowFunc = function(){	
			$('#aetherplayer .player').style.visibility = "visible";	
			$('#aetherplayer .player-mask').style.display = "block";
		};
		
		var AlbumHideFunc = function(){
			$('#aetherplayer .player').style.visibility = "hidden";	
			$('#aetherplayer .player-mask').style.display = "none";
		}
		
		$('#aetherplayer #player-btn-play').addEventListener(eventType,playBtnFunc);		
		$('#aetherplayer #player-btn-backward').addEventListener(eventType,prevBtnFunc);		
		$('#aetherplayer #player-btn-forward').addEventListener(eventType,nextBtnFunc);		
		$('#aetherplayer #player-btn-playmode').addEventListener(eventType,playModeBtnFunc);		
		$('#aetherplayer .player-tiny').addEventListener(eventType,AlbumShowFunc);	
		$('#aetherplayer .player-mask').addEventListener(eventType,AlbumHideFunc);	
		$('#aetherplayer .player-disk-image').addEventListener("animationend", function(){	
			this.className = this.className.replace('fadein', ''); 
		});
	}
	
	
	
	function $(node){
		return document.querySelector(node);
	}
	
	function playerAdd(){
		var html = '<div  class="player" id="player">'
		+ '<div class="player-disk i-circle" >'
		+ '<img class="player-disk-image fadein" id="player-disk-image">'
		+ '</div>'
		+ '<div class="player-disk-circle-big" ><div class="player-disk-circle-small"></div></div>'
		+ '<div class="player-title select-disable" id="player-title">'
		+ '<span class="player-title-text" id="player-title-text"></span>'
		+ '</div>'
		+ '<div class="player-btn-playmode select-disable" id="player-btn-playmode"></div>'
		+ '<div class="player-btn-backward select-disable" id="player-btn-backward" ><i class="fa fa-step-backward fa-lg player-btn-shadow"></i></div>'
		+ '<div class="player-btn-play select-disable" id="player-btn-play" ><i class="fa fa-play fa-lg player-btn-shadow"></i></div>'
		+ '<div class="player-btn-forward select-disable" id="player-btn-forward" ><i class="fa fa-step-forward fa-lg player-btn-shadow"></i></div>'
		+ '</div>'
		+ '<audio id="songs" preload="none">The technique used in program is not supported by ancient browser.</audio>'
		+ '<div class="player-tiny"><i class="fa fa-volume-up fa-large"></i></div>'
		+ '<div class="player-mask" id="player-mask"></div>';
		var newNode = document.createElement("div");
		newNode.innerHTML = html;
		newNode.id = "aetherplayer";			
		document.body.appendChild(newNode);
		audio = $("#aetherplayer #songs");
	}
	
	//play the song
	function musicPlay(){
		_playstatus = 'playing';
		$('#aetherplayer .fa-volume-up').id = 'twinkling';
		cdPlay();
		audio.play();
	}
	
	//pause the song
	function musicPause(){
		_playstatus = 'pause';
		$('#aetherplayer .fa-volume-up').id = '';
		cdPause();
		audio.pause();
	}		
	
	//change to the next song
	function musicNext(){
		switch(_playmode){
			case 'order' : ++_songindex;if(_songindex>playList.length-1)_songindex = 0;break;
			case 'repeat' : break;
			case 'random': _songindex = randomIndexGet();break;
			default : break;
		}
		$('#aetherplayer .player-disk-image').className = "player-disk-image fadein";
		prepareToPlay();
	}
	
	//change to the previous song
	function musicPrev(){
		switch(_playmode){
			case 'order' : --_songindex;if(_songindex<0)_songindex = playList.length-1;break;
			case 'repeat' : break;
			case 'random' : _songindex = randomIndexGet();break;
			default : break;
		}
		$('#aetherplayer .player-disk-image').className = "player-disk-image fadein";
		prepareToPlay();	
	}
	
	//do some preprocessing before playing a song
	function prepareToPlay(){
		resourceLoad();
		moveLengthGet();
		audio.load();
		if(_playstatus == 'pause')return;	
		audio.play();
	}	
	
	//move the title text
	function titleMove(){
		var nodeObj = $('#player-title-text');
		if(moveLength<=0)return;
		var mLeft = 0-nodeObj.offsetLeft;
		if(mLeft>=moveLength)return;
		mLeft += 1;
		nodeObj.style.marginLeft = '-'+mLeft+'px';
	}
	
	//get the move length of title text
	function moveLengthGet(){
		var titlewidth = $('#aetherplayer #player-title').offsetWidth;
		var textwidth = $('#aetherplayer #player-title-text').offsetWidth;
		return moveLength = textwidth - titlewidth;
	}

	//preload the album picture by order and set cache
	function albumPreload(index){
		var imgIndex = arguments[0] ? arguments[0] : 0;
		if(imgIndex>=playList.length)return;
		preloadImg[imgIndex] = new Image();
		preloadImg[imgIndex].src = playList[imgIndex].songCover;
		preloadImg[imgIndex].onload = function() {
			if(imgIndex==0)$("#aetherplayer #player-disk-image").style.display = "block";
			++imgIndex;
			albumPreload(imgIndex);
		}			
	}
	
	//load the src, album and title of the audio resource
	function resourceLoad(){
		audio.src = playList[_songindex].songURL;
		$("#aetherplayer #player-disk-image").src = playList[_songindex].songCover;
		$('#aetherplayer #player-title-text').innerHTML = playList[_songindex].songName+" - "+playList[_songindex].artist;			
	}		
	
	//make the CD turn
	function cdPlay(){
		$('#aetherplayer #player-btn-play').innerHTML = '<i class="fa fa-pause fa-lg player-btn-shadow"></i>';
		$('#aetherplayer .i-circle').style.animationPlayState = 'running';
		$('#aetherplayer .i-circle').style.webkitAnimationPlayState = 'running';			
	}
	
	//make the CD stop
	function cdPause(){
		$('#aetherplayer #player-btn-play').innerHTML = '<i class="fa fa-play fa-lg player-btn-shadow"></i>';
		$('#aetherplayer .i-circle').style.animationPlayState = 'paused';
		$('#aetherplayer .i-circle').style.webkitAnimationPlayState = 'paused';		
	}
	
	//load the configuration
	function configLoad(){
		for(var conf in config){
			eval(conf+"Config()");
		}
	}
	
	//configure the autoplay
	function autoPlayConfig(){
		if(config.autoPlay){
			_playstatus = 'playing';
			return;
		}
		_playstatus = 'pause';
	}
	
	//configure the position of audio player
	function positionConfig(){
		$('#aetherplayer #player').className += " player-position-"+config.position;	
	}
	
	//configure the fontFamily
	function fontFamilyConfig(){
		$('#aetherplayer #player').style.fontFamily = config.fontFamily;
	}
	
	//configure the play mode
	function playModeConfig(){
		playModeApply(config.playMode);
	}
	
	//configure the debug status
	function debugConfig(){		
		debug = config.debug;
		if(debug)debugOutput('debugging');			
	}
	
	function debugOutput(info){
		console.log("AetherPlayer : "+info);
	}
	
	//apply the play mode
	function playModeApply(playmode){
		switch(playmode){
			case 'order':_playmode = 'order';$('#aetherplayer #player-btn-playmode').innerHTML = '<i class="fa fa-sort-amount-asc fa-lg player-btn-shadow"></i>';$('#aetherplayer #player-btn-playmode').title = "Order";break;
			case 'repeat':_playmode = 'repeat';$('#aetherplayer #player-btn-playmode').innerHTML = '<i class="fa fa-refresh fa-lg player-btn-shadow"></i>';$('#aetherplayer #player-btn-playmode').title = "Repeat";break;
			case 'random':_playmode = 'random';$('#aetherplayer #player-btn-playmode').innerHTML = '<i class="fa fa-random fa-lg player-btn-shadow"></i>';$('#aetherplayer #player-btn-playmode').title = "Random";break;
			default:break;
		}		
	}
	
	//change the play mode of audio player
	function playModeChange(){
		var playmodeArray = new Array('order','repeat','random'),playmodeArray_index;
		for(var i=0;i<playmodeArray.length;i++){
			if(playmodeArray[i] == _playmode){playmodeArray_index = i;break;}		
		}
		++playmodeArray_index;
		if(playmodeArray_index>playmodeArray.length-1)playmodeArray_index = 0;
		playModeApply(playmodeArray[playmodeArray_index]);		
	}
	
	//reset the position of title text
	function titleReset(){
		$('#aetherplayer #player-title-text').style.marginLeft = '0px';
	}
	
	//get the random index
	function randomIndexGet(){
		var randomIndex = _songindex;
		while(randomIndex==_songindex){ //make sure to get the different index
			randomIndex = Math.floor(Math.random()*playList.length);
		}
		return randomIndex;
	}
	
	//configure the way to storage data
	function dataStorageConfig(){
		switch(config.dataStorage){
			case "file":playList = aetherplayer_playList_file;break;
			case "database":playList = aetherplayer_playList_database;break;
			default:break;
		}
	}
	

})()





