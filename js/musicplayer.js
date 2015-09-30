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
		position : 'leftbottom',//[lefttop|leftbottom|righttop|rightbottom] The position of audio player.
		fontFamily : 'arial,sans-serif',//[FONTFAMILY] The fonts of your text.
		autoPlay : false,//[true|false] The play status of audio player when the data is ready. 
		playMode : 'order',//[order|repeat|random] Play mode by default.
		loadFontAwesome : true,//[true|false] Use the online Font Awesome CSS. If you set this to false ,then you should download the Font Awesome CSS and add it to your HTML document manually.
	};
	
	
	window.onload = function() {
 
		var _movetitle = false,_playstatus = 'pause',_playmode,_index = 0;
		
		if(playerConfig.loadFontAwesome)cssLoad("https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css");//Font Awesome CSS by CDN
	 
		playerInit();
		
		audio.onplaying = function(){
			cdPlay();
		}
		
		audio.onpause = function(){
			cdPause();console.log('pause');
		}
		
		audio.onended = function(){
			musicNext();
		};

		audio.onerror = function(){ 
			console.log('error');
			cdPause();
		}	

		audio.onprogress=function(){
			//console.log('progress');	
		}
		
		document.querySelector('#music-title').onmouseover = function(){			
			_movetitle = true;	
			internal = setInterval(function(){titleMove('#music-title-text')},20);			
		};		
	
		document.querySelector('#music-title').onmouseout = function(){
			_movetitle = false;
			titleReset();
			clearInterval(internal);
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

		document.querySelector('#player-disk').onerror = function(){
			console.log('fail to load the album picture');
		}
		
		function playerAdd(){
			var	html = '';
			html += '<div  class="music-player" id="music-player">';	
			html += '<div class="music-player-cd" >';
			html += '<img class="i-circle" id="player-disk">';
			html += '<div class="i-circle1"><div class="i-circle2"></div></div>';
			html += '</div>';
			html += '<div class="music-title select-disable" id="music-title">';
			html += '<span  id="music-title-text"></span>';
			html += '</div>';
			html += '<div class="player-btn-playmode select-disable" id="music-playmode"></div>'
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
		}
		
		function playerInit(){
			playerAdd();
			audio = document.querySelector("#songs");
			configLoad();	
			albumShowControl('hide');
			albumPreload(_index);
			prepareToPlay('init');
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
				case 'order' : ++_index;if(_index>playList.length-1)_index = 0;break;
				case 'repeat' : break;
				case 'random': _index = randomIndexGet();break;
				default : break;
			}
			prepareToPlay();
		}
		
		function musicPrev(){
			switch(_playmode){
				case 'order' : --_index;if(_index<0)_index = playList.length-1;break;
				case 'repeat' : break;
				case 'random' : _index = randomIndexGet();break;
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
		
		//move the title text
		function titleMove(node){
			if(!_movetitle)return;
			if(moveLength<=0)return;
			var nodeObj = document.querySelector(node);
			var mLeft = 0-nodeObj.offsetLeft;
			if(mLeft>=moveLength)return;
			mLeft += 1;
			nodeObj.style.marginLeft = '-'+mLeft+'px';
		}
		
		//get the move length of title text
		function movelengthGet(){
			titlewidth = document.querySelector('#music-title').offsetWidth;
			textwidth = document.querySelector('#music-title-text').offsetWidth;
			return textwidth - titlewidth;
		}

		//preload the album picture by order and set cache
		function albumPreload(imgIndex){
			var img = new Array();
			if(imgIndex>=playList.length)return;
			img[imgIndex] = new Image();
			img[imgIndex].src = playList[imgIndex].albumPic;
			img[imgIndex].onload = function() {
				if(imgIndex==0)albumShowControl('show');
				++imgIndex;
				albumPreload(imgIndex);
			}			
		}
		
		//load the src, album and title of the audio resource
		function resourceLoad(){
			audio.src = playList[_index].musicURL;
			document.querySelector("#player-disk").src = playList[_index].albumPic;
			document.querySelector('#music-title-text').innerHTML = playList[_index].musicName+" - "+playList[_index].artist;	
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
		
		//load the configuration
		function configLoad(){
			positionConfig();
			fontFamilyConfig();
			playModeConfig();
			autoPlayConfig();
		}
		
		//config the autoplay
		function autoPlayConfig(){
			if(playerConfig.autoPlay)
				audio.autoplay = true;
			else
				audio.autoplay = false;
		}
		
		//config the position of audio player
		function positionConfig(){
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
		
		//config the fontFamily
		function fontFamilyConfig(){
			document.querySelector('#music-title-text').style.fontFamily = playerConfig.fontFamily;
		}
		
		//config the play mode
		function playModeConfig(playmode){
			if(typeof(playmode) == "undefined"){
				playmode = playerConfig.playMode;
			}
			switch(playmode){
				case 'order':_playmode = 'order';document.querySelector('#music-playmode').innerHTML = '<i class="fa fa-sort-amount-asc fa-lg textshadow"></i>';document.querySelector('#music-playmode').title = "Order";break;
				case 'repeat':_playmode = 'repeat';document.querySelector('#music-playmode').innerHTML = '<i class="fa fa-refresh fa-lg textshadow"></i>';document.querySelector('#music-playmode').title = "Repeat";break;
				case 'random':_playmode = 'random';document.querySelector('#music-playmode').innerHTML = '<i class="fa fa-random fa-lg textshadow"></i>';document.querySelector('#music-playmode').title = "Random";break;
				default:break;
			}		
		}
		
		//control the visibility of album pictures
		function albumShowControl(showstatus){
			if(showstatus=='show')
				document.querySelector("#player-disk").style.visibility = "visible";
			else if(showstatus=='hide')
				document.querySelector("#player-disk").style.visibility = "hidden";
		}
		
		//change the play mode of audio player
		function playModeChange(){
			var playmodeArray = new Array('order','repeat','random'),playmodeArray_index;
			for(var i=0;i<playmodeArray.length;i++){
				if(playmodeArray[i] == _playmode){playmodeArray_index = i;break;}		
			}
			++playmodeArray_index;
			if(playmodeArray_index>playmodeArray.length-1)playmodeArray_index = 0;
			playModeConfig(playmodeArray[playmodeArray_index]);		
		}
		
		//reset the position of title text
		function titleReset(){
			document.querySelector('#music-title-text').style.marginLeft = '0px';
		}
		
		//get the random index
		function randomIndexGet(){
			var randomIndex = _index;
			while(randomIndex==_index){ //make sure to get the different index
				randomIndex = Math.floor(Math.random()*playList.length);
			}
			return randomIndex;
		}

	} 
