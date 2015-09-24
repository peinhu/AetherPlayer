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
 
	var loadFontAwesome = true;//If you set this to false ,then you should download the Font Awesome CSS and add it to your HTML document manually.
	
	
	window.onload = function() {
 
		var _movetitle = false;
		
		if(loadFontAwesome)cssLoad("https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css");//Font Awesome CSS by CDN
	 
		playerAdd(playerInit);	
		
		audio.onplaying = function(){
			cdPlay();
		}
		
		audio.onpause = function(){
			cdPause();
		}
		
		audio.onended = function(){
			toNext();
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
				toPlay();
			}else if(_playstatus=='playing'){
				toPause();
			}	
		};
		
		document.querySelector('#player-btn-backward').onmousedown = function(){
			toPrev();		
		};
		
		document.querySelector('#player-btn-forward').onmousedown = function(){
			toNext();		
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
			audio = document.querySelector("#songs");
			_playstatus = 'pause';
			musicNum = playList.length;
			index = 0;
			prepareToPlay('init');
			moveLength = movelengthGet();
			albumPreload();
		}
		
		function titleReset(){
			document.querySelector('#music-title-text').style.marginLeft = '0px';
		}
		
		function toPlay(){
			_playstatus = 'playing';
			audio.play();
		}
		
		function toPause(){
			_playstatus = 'pause';
			audio.pause();
		}		
		
		function toNext(){
			++index;
			if(index>musicNum-1)index=0;
			prepareToPlay();
		}
		
		function toPrev(){
			--index;
			if(index<0)index=musicNum-1;
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
		
		function resourceLoad(){
			audio.src = playList[index].musicURL;
			document.querySelector("#player-disk").style.background = '#fff url('+playList[index].albumPic+') no-repeat center / 100% 100%';
			document.querySelector('#music-title-text').innerHTML = playList[index].musicName+" - "+playList[index].artist;
		}		
		
		function cssLoad(url){ 
			var link = document.createElement("link"); 
			link.type = "text/css"; 
			link.rel = "stylesheet"; 
			link.href = url; 
			document.querySelector("head").appendChild(link); 
		} 
		
		function cdPlay(){
			document.querySelector('#player-disk').style.animationPlayState = 'running';
			document.querySelector('#player-btn-play').innerHTML = '<i class="fa fa-pause fa-lg textshadow"></i>';			
		}
		
		function cdPause(){
			document.querySelector('#player-disk').style.animationPlayState = 'paused';
			document.querySelector('#player-btn-play').innerHTML = '<i class="fa fa-play fa-lg textshadow"></i>';		
		}

	} 
