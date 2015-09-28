/**
 * @author		Payne
 * @email		huyang110yahoo@gmail.com
 * @github		https://github.com/peinhu
 * @site		http://2ndrenais.com
 * @date		2015-08-04
 */

	//Edit your playlist here.
	var playList = [
		{'artist':'','musicName':'','musicURL':'','albumPic':'',},
	];
	
	//Config your player here.
	var playerConfig = {
		position : 'left',//[lefttop|leftbottom|righttop|rightbottom] The position of audio player.
		fontFamily : 'arial,sans-serif',//[FONTFAMILY] The fonts of your text.
		loadFontAwesome : true,//[true|false] Use the online Font Awesome CSS. If you set this to false ,then you should download the Font Awesome CSS and add it to your HTML document manually.
		playMode : 'order',//[order|repeat|random] Play mode by default.
	};
	
	
	window.onload = function() {
 
		var _movetitle = false,_playstatus = 'pause',_playmode;
		
		if(playerConfig.loadFontAwesome)cssLoad("https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css");//Font Awesome CSS by CDN
	 
		playerAdd(playerInit);	
		
		audio.onplaying = function(){
			cdPlay();
		}
		
		audio.onpause = function(){
			cdPause();
		}
		
		audio.onended = function(){
			musicNext();
		};

		audio.onerror = function(){ 
			console.log('error');
			cdPause();
		}	

		audio.onwaiting = function(){//while the buffering cause a pause
			console.log('waiting');
		}
		
		document.querySelector('#music-title').onmouseover = function(){			
			_movetitle = true;	
			inernal = setInterval(function(){titleMove('#music-title-text')},20);			
		};		
	
		document.querySelector('#music-title').onmouseout = function(){
			_movetitle = false;
			titleReset();
			clearInterval(inernal);
		};		
		
		document.querySelector('#player-btn-play').onmousedown = function(){
			if(_playstatus=='pause'){
				musicPlay();
			}else if(_playstatus=='playing'){
				musicPause();
			}	
		};
		
		document.querySelector('#player-btn-backward').onmousedown = function(){
			musicPrev();		
		};
		
		document.querySelector('#player-btn-forward').onmousedown = function(){
			musicNext();		
		};
		
		
		document.querySelector('#music-playmode').onmousedown = function(){
			playModeChange();		
		};

		
		function playerAdd(callback){
			var	html = '';
			html += '<div  class="music-player" id="music-player">';
			
			html += '<div class="i-circle" id="player-disk">';
			html += '<div class="i-circle1"><div class="i-circle2"></div></div>';
			html += '</div>';
			html += '<div class="music-title select-disable" id="music-title">';
			html += '<span  id="music-title-text"></span>';
			html += '</div>';
			html += '<div class="music-playmode select-disable" id="music-playmode"></div>'
			html += '<div class="music-controlbar select-disable">';
			html += '<div class="player-btn-backward" id="player-btn-backward" ><i class="fa fa-step-backward fa-lg textshadow"></i></div>';
			html += '<div class="player-btn-play" id="player-btn-play" ><i class="fa fa-play fa-lg textshadow"></i></div>';
			html += '<div class="player-btn-forward" id="player-btn-forward" ><i class="fa fa-step-forward fa-lg textshadow"></i></div>';
			html += '</div>';
			
			html += '</div>';
			html += '<audio id="songs" preload="none"><source src="" type="audio/mpeg" id="song">This technique is not supported by this ancient browser.</audio>';
			var newNode = document.createElement("div");
			newNode.innerHTML = html; 
			document.body.appendChild(newNode);
			callback();
		}
		
		function playerInit(){

			configLoad();	
			audio = document.querySelector("#songs");
			musicNum = playList.length;
			index = 0;
			prepareToPlay('init');
			albumPreload();
		}
		
		
		function titleReset(){
			document.querySelector('#music-title-text').style.marginLeft = '0px';
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
				case 'order' : ++index;if(index>musicNum-1)index = 0;
				case 'repeat' : break;
				case 'random': index = randomIndexGet();break;
				default : break;
			}
			prepareToPlay();
		}
		
		function musicPrev(){
			switch(_playmode){
				case 'order' : --index;if(index<0)index = musicNum-1;
				case 'repeat' : break;
				case 'random' : index = randomIndexGet();break;
				default : break;
			}
			prepareToPlay();	
		}
		
		function prepareToPlay(mode){
			resourceLoad();
			moveLength = movelengthGet();
			if(mode == 'init')return;
			audio.load();
			if(_playstatus=='pause')return;	
			audio.play();
		}	
		
		function titleMove(node){
			if(!_movetitle)return;
			if(moveLength<=0)return;
			var nodeObj = document.querySelector(node);
			var mLeft = 0-nodeObj.offsetLeft;
			if(mLeft>=moveLength)return;
			mLeft += 1;
			nodeObj.style.marginLeft = '-'+mLeft+'px';
		}
		
		function movelengthGet(){
			titlewidth = document.querySelector('#music-title').offsetWidth;
			textwidth = document.querySelector('#music-title-text').offsetWidth;
			return textwidth - titlewidth;
		}
		
		function albumPreload(){
			images = new Array();			
			for (var i = 0; i < playList.length; i++) {
				images[i] = new Image();
				images[i].src = playList[i].albumPic;
			}      
		}
		
		//load the src, album and title of the audio resource
		function resourceLoad(){
			audio.src = playList[index].musicURL;
			document.querySelector("#player-disk").style.background = '#fff url('+playList[index].albumPic+') no-repeat center / 100% 100%';
			document.querySelector('#music-title-text').innerHTML = playList[index].musicName+" - "+playList[index].artist;
		}		
		
		//load the CSS in the head of html document
		function cssLoad(url){ 
			var link = document.createElement("link"); 
			link.type = "text/css"; 
			link.rel = "stylesheet"; 
			link.href = url; 
			document.querySelector("head").appendChild(link); 
		} 
		
		//make the CD turn
		function cdPlay(){
			document.querySelector('#player-disk').style.animationPlayState = 'running';
			document.querySelector('#player-btn-play').innerHTML = '<i class="fa fa-pause fa-lg textshadow"></i>';			
		}
		
		//make the CD stop
		function cdPause(){
			document.querySelector('#player-disk').style.animationPlayState = 'paused';
			document.querySelector('#player-btn-play').innerHTML = '<i class="fa fa-play fa-lg textshadow"></i>';		
		}
		
		function configLoad(){
			positionSet();
			fontFamilySet();
			playModeSet();
		}
		
		
		//set the position of audio player
		function positionSet(){
			var left='auto',top='auto',bottom='auto',right='auto';
			switch(playerConfig.position){
				case 'lefttop': left = '-100px';right = 'auto';top = '-100px';bottom = 'auto';break;
				case 'leftbottom': left = '-100px';right = 'auto';top = 'auto';bottom = '-100px';break;
				case 'righttop': left = 'auto';right = '-100px';top = '-100px';bottom = 'auto';break;
				case 'rightbottom': left = 'auto';right = '-100px';top = 'auto';bottom = '-100px';break;
				default :break;
			}
			document.querySelector('#music-player').style.left = left;
			document.querySelector('#music-player').style.top = top;
			document.querySelector('#music-player').style.right = right;
			document.querySelector('#music-player').style.bottom = bottom;
			document.querySelector('#music-player').className += " "+playerConfig.position;
		}
		
		function fontFamilySet(){
			document.querySelector('#music-title-text').style.fontFamily = playerConfig.fontFamily;
		}
		
		function playModeSet(playmode){
			if(typeof(playmode) == "undefined"){
				playmode = playerConfig.playMode;
			}
			switch(playmode){
				case 'order':_playmode = 'order';document.querySelector('#music-playmode').innerHTML = '<i class="fa fa-list textshadow"></i>';break;
				case 'repeat':_playmode = 'repeat';document.querySelector('#music-playmode').innerHTML = '<i class="fa fa-retweet textshadow"></i>';break;
				case 'random':_playmode = 'random';document.querySelector('#music-playmode').innerHTML = '<i class="fa fa-random textshadow"></i>';break;
				default:break;
			}		
		}
		
		function playModeChange(){
			var playmodeArray = new Array('order','repeat','random'),playmodeArray_index;
			for(var i=0;i<playmodeArray.length;i++){
				if(playmodeArray[i] == _playmode){playmodeArray_index = i;break;}		
			}
			++playmodeArray_index;
			if(playmodeArray_index>playmodeArray.length-1)playmodeArray_index = 0;
			playModeSet(playmodeArray[playmodeArray_index]);		
		}
		
		function randomIndexGet(){
			var randomIndex = index;
			while(randomIndex==index){ //make sure to get the different index
				randomIndex = Math.floor(Math.random()*musicNum);
			}
			return randomIndex;
		}

	} 
