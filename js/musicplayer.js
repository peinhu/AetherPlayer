/**
 * @author		Payne
 * @email		huyang110yahoo@gmail.com
 * @github		https://github.com/peinhu
 * @site		http://2ndrenais.com
 * @date		2015-08-04
 */
	
	//Config your player here.
	var playerConfig = {
		position : 'leftbottom',//[lefttop|leftbottom|righttop|rightbottom] The position of audio player.
		fontFamily : 'arial,sans-serif',//[FONTFAMILY] The fonts of your text.
		autoPlay : false,//[true|false] The play status of audio player when the data is ready. 
		playMode : 'order',//[order|repeat|random] Play mode by default.
		loadFontAwesome : true,//[true|false] Use the online Font Awesome CSS. Warning: If you set this to false, then you should download the Font Awesome CSS and reference it to your HTML document manually.
	};
	
	
	window.onload = function() {
		var _movetitle = false,_playstatus = 'pause',_playmode,_songindex = 0;
		
		if(playerConfig.loadFontAwesome)cssLoad("https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css");//Font Awesome CSS by CDN
	 
		playerInit();
		
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
			cdPause();
		}	
		
		document.querySelector('#aetherplayer #player-title').onmouseover = function(){			
			_movetitle = true;	
			internal = setInterval(function(){titleMove('#player-title-text')},20);			
		};		
	
		document.querySelector('#aetherplayer #player-title').onmouseout = function(){
			_movetitle = false;
			titleReset();
			clearInterval(internal);
		};		
		
		document.querySelector('#aetherplayer #player-btn-play').onmousedown = function(){
			if(_playstatus=='pause'){
				musicPlay();
			}else if(_playstatus=='playing'){
				musicPause();
			}	
		};
		
		document.querySelector('#aetherplayer #player-btn-backward').onmousedown = function(){
			musicPrev();		
		};
		
		document.querySelector('#aetherplayer #player-btn-forward').onmousedown = function(){
			musicNext();		
		};
		
		
		document.querySelector('#aetherplayer #player-btn-playmode').onmousedown = function(){
			playModeChange();		
		};
		
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
			html += '<audio id="songs" preload="none"></audio>';
			var newNode = document.createElement("div");
			newNode.innerHTML = html;
			newNode.id = "aetherplayer";			
			document.body.appendChild(newNode);
		}
		
		function playerInit(){
			playerAdd();
			audio = document.querySelector("#aetherplayer #songs");
			configLoad();	
			albumShowControl('hide');
			albumPreload(_songindex);
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
			titlewidth = document.querySelector('#aetherplayer #player-title').offsetWidth;
			textwidth = document.querySelector('#aetherplayer #player-title-text').offsetWidth;
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
			audio.src = playList[_songindex].musicURL;
			document.querySelector("#aetherplayer #player-disk-image").src = playList[_songindex].albumPic;
			document.querySelector('#aetherplayer #player-title-text').innerHTML = playList[_songindex].musicName+" - "+playList[_songindex].artist;	
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
			document.querySelector('#aetherplayer #player-disk-image').style.animationPlayState = 'running';
			document.querySelector('#aetherplayer #player-btn-play').innerHTML = '<i class="fa fa-pause fa-lg player-btn-shadow"></i>';			
		}
		
		//make the CD stop
		function cdPause(){
			document.querySelector('#aetherplayer #player-disk-image').style.animationPlayState = 'paused';
			document.querySelector('#aetherplayer #player-btn-play').innerHTML = '<i class="fa fa-play fa-lg player-btn-shadow"></i>';		
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
			document.querySelector('#aetherplayer #player').style.left = left;
			document.querySelector('#aetherplayer #player').style.top = top;
			document.querySelector('#aetherplayer #player').style.right = right;
			document.querySelector('#aetherplayer #player').style.bottom = bottom;
			document.querySelector('#aetherplayer #player').className += " player-position-"+playerConfig.position;
		}
		
		//config the fontFamily
		function fontFamilyConfig(){
			document.querySelector('#aetherplayer #player-title-text').style.fontFamily = playerConfig.fontFamily;
		}
		
		//config the play mode
		function playModeConfig(playmode){
			if(typeof(playmode) == "undefined"){
				playmode = playerConfig.playMode;
			}
			switch(playmode){
				case 'order':_playmode = 'order';document.querySelector('#aetherplayer #player-btn-playmode').innerHTML = '<i class="fa fa-sort-amount-asc fa-lg player-btn-shadow"></i>';document.querySelector('#aetherplayer #player-btn-playmode').title = "Order";break;
				case 'repeat':_playmode = 'repeat';document.querySelector('#aetherplayer #player-btn-playmode').innerHTML = '<i class="fa fa-refresh fa-lg player-btn-shadow"></i>';document.querySelector('#aetherplayer #player-btn-playmode').title = "Repeat";break;
				case 'random':_playmode = 'random';document.querySelector('#aetherplayer #player-btn-playmode').innerHTML = '<i class="fa fa-random fa-lg player-btn-shadow"></i>';document.querySelector('#aetherplayer #player-btn-playmode').title = "Random";break;
				default:break;
			}		
		}
		
		//control the visibility of album pictures
		function albumShowControl(showstatus){
			if(showstatus=='show')
				document.querySelector("#aetherplayer #player-disk-image").style.visibility = "visible";
			else if(showstatus=='hide')
				document.querySelector("#aetherplayer #player-disk-image").style.visibility = "hidden";
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
			document.querySelector('#aetherplayer #player-title-text').style.marginLeft = '0px';
		}
		
		//get the random index
		function randomIndexGet(){
			var randomIndex = _songindex;
			while(randomIndex==_songindex){ //make sure to get the different index
				randomIndex = Math.floor(Math.random()*playList.length);
			}
			return randomIndex;
		}

	} 
