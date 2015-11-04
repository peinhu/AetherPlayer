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
		position : 'leftbottom',//[lefttop|leftbottom|righttop|rightbottom] The position of audio player.
		fontFamily : 'arial,sans-serif',//[FONTFAMILY] The fonts of your text.
		autoPlay : false,//[true|false] The play status of audio player when the data is ready. 
		playMode : 'order',//[order|repeat|random] Play mode by default.
		debug : false,//[true|false] Show the debug information in the console.
	};

	var audio,moveLength,_playstatus = 'pause',_playmode,_songindex = 0,preloadImg = new Array(),internal,debug;
 
	playerInit();	
	
	audio.onplaying = function(){
		cdPlay();
		if(debug)debugOutput('audio - playing:'+playList[_songindex].songName);
	}
	
	audio.onpause = function(){
		cdPause();
		if(debug)debugOutput('audio - pause:'+playList[_songindex].songName);
	}
	
	audio.onended = function(){
		musicNext();
		if(debug)debugOutput('audio - ended:'+playList[_songindex].songName);
	};

	audio.onerror = function(){ 
		musicNext();
		if(debug)debugOutput('audio - error:'+playList[_songindex].songName);
	}

	audio.onloadeddata = function(){ 
		if(debug)debugOutput('audio - loadeddata:'+playList[_songindex].songName);
	}
	
	audio.onstalled = function(){ 
		if(debug)debugOutput('audio - stalled:'+playList[_songindex].songName);
	}
	
	$('#aetherplayer #player-title').onmouseover = function(){
		internal = setInterval(function(){titleMove($('#player-title-text'))},20);			
	};		

	$('#aetherplayer #player-title').onmouseout = function(){
		titleReset();
		clearInterval(internal);
	};		
	
	$('#aetherplayer #player-btn-play').onmousedown = function(){
		if(_playstatus=='pause'){
			musicPlay();
			if(debug)debugOutput('button - play');
		}else if(_playstatus=='playing'){
			musicPause();
			if(debug)debugOutput('button - pause');
		}	
	};
	
	$('#aetherplayer #player-btn-backward').onmousedown = function(){
		musicPrev();
		if(debug)debugOutput('button - prev');			
	};
	
	$('#aetherplayer #player-btn-forward').onmousedown = function(){
		musicNext();
		if(debug)debugOutput('button - next');			
	};
	
	
	$('#aetherplayer #player-btn-playmode').onmousedown = function(){
		playModeChange();
		if(debug)debugOutput('button - mode:'+_playmode);				
	};
	
	function $(node){
		return document.querySelector(node);
	}
	
	function playerAdd(){
		var	html = '';
		html += '<div  class="player" id="player">';	
		html += '<div class="player-disk" >';
		html += '<img class="player-disk-image i-circle" id="player-disk-image">';
		html += '<div class="player-disk-circle-big" ><div class="player-disk-circle-small"></div></div>';
		html += '</div>';
		html += '<div class="player-title select-disable" id="player-title">';
		html += '<span class="player-title-text" id="player-title-text"></span>';
		html += '</div>';
		html += '<div class="player-btn-playmode select-disable" id="player-btn-playmode"></div>'
		html += '<div class="player-btn-backward select-disable" id="player-btn-backward" ><i class="fa fa-step-backward fa-lg player-btn-shadow"></i></div>';
		html += '<div class="player-btn-play select-disable" id="player-btn-play" ><i class="fa fa-play fa-lg player-btn-shadow"></i></div>';
		html += '<div class="player-btn-forward select-disable" id="player-btn-forward" ><i class="fa fa-step-forward fa-lg player-btn-shadow"></i></div>';
		html += '</div>';
		html += '<audio id="songs" preload="none">The technique used in program is not supported by ancient browser.</audio>';
		var newNode = document.createElement("div");
		newNode.innerHTML = html;
		newNode.id = "aetherplayer";			
		document.body.appendChild(newNode);
		audio = $("#aetherplayer #songs");
	}
	
	function playerInit(){
		playerAdd();
		configLoad();
		albumPreload();
		prepareToPlay();
	}
	
	function musicPlay(){
		_playstatus = 'playing';
		audio.play();
	}
	
	function musicPause(){
		_playstatus = 'pause';
		audio.pause();
	}		
	
	function musicNext(){
		switch(_playmode){
			case 'order' : ++_songindex;if(_songindex>playList.length-1)_songindex = 0;break;
			case 'repeat' : break;
			case 'random': _songindex = randomIndexGet();break;
			default : break;
		}
		prepareToPlay();
	}
	
	function musicPrev(){
		switch(_playmode){
			case 'order' : --_songindex;if(_songindex<0)_songindex = playList.length-1;break;
			case 'repeat' : break;
			case 'random' : _songindex = randomIndexGet();break;
			default : break;
		}
		prepareToPlay();	
	}
	
	function prepareToPlay(){
		resourceLoad();
		moveLengthGet();
		audio.load();
		if(_playstatus == 'pause')return;	
		audio.play();
	}	
	
	//move the title text
	function titleMove(nodeObj){
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
			if(imgIndex==0)albumShowControl('show');
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
		$('#aetherplayer #player-disk-image').style.animationPlayState = 'running';
		$('#aetherplayer #player-btn-play').innerHTML = '<i class="fa fa-pause fa-lg player-btn-shadow"></i>';			
	}
	
	//make the CD stop
	function cdPause(){
		$('#aetherplayer #player-disk-image').style.animationPlayState = 'paused';
		$('#aetherplayer #player-btn-play').innerHTML = '<i class="fa fa-play fa-lg player-btn-shadow"></i>';		
	}
	
	//load the configuration
	function configLoad(){
		for(var conf in config){
			eval(conf+"Config()");
		}
	}
	
	//config the autoplay
	function autoPlayConfig(){
		if(config.autoPlay){
			_playstatus = 'playing';
			return;
		}
		_playstatus = 'pause';
	}
	
	//config the position of audio player
	function positionConfig(){
		var left='auto',top='auto',bottom='auto',right='auto';
		switch(config.position){
			case 'lefttop': left = '-100px';right = 'auto';top = '-100px';bottom = 'auto';break;
			case 'leftbottom': left = '-100px';right = 'auto';top = 'auto';bottom = '-100px';break;
			case 'righttop': left = 'auto';right = '-100px';top = '-100px';bottom = 'auto';break;
			case 'rightbottom': left = 'auto';right = '-100px';top = 'auto';bottom = '-100px';break;
			default :break;
		}
		$('#aetherplayer #player').style.left = left;
		$('#aetherplayer #player').style.top = top;
		$('#aetherplayer #player').style.right = right;
		$('#aetherplayer #player').style.bottom = bottom;
		$('#aetherplayer #player').className += " player-position-"+config.position;
	}
	
	//config the fontFamily
	function fontFamilyConfig(){
		$('#aetherplayer #player-title-text').style.fontFamily = config.fontFamily;
	}
	
	//config the play mode
	function playModeConfig(){
		playModeApply(config.playMode);
	}
	
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
	
	//control the visibility of album pictures
	function albumShowControl(showstatus){
		if(showstatus=='show'){
			$("#aetherplayer #player-disk-image").style.visibility = "visible";
			return;
		}	
		$("#aetherplayer #player-disk-image").style.visibility = "hidden";
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
	

})()





