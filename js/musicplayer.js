/**
 * @author		Payne
 * @email		huyang110yahoo@gmail.com
 * @github		https://github.com/peinhu
 * @site		http://2ndrenais.com
 * @date		2015-08-04
 */

	//Edit your playlist here.
	var playList = [
		{'artist':'','musicName':'','musicURL':'','albumPic':'',}
	];
 
	var loadFontAwesome = true;//If you set this to false ,then you should download the Font Awesome CSS and add it to your HTML document manually.
 
	window.onload = function() {
 
		var _movetitle = false;
		
		if(loadFontAwesome)loadCss("https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css");//Font Awesome CSS by CDN
	 
		playerAdd(playerInit);	
		
		audio.addEventListener('ended',function(){
			toNext();
		},false);
		
		function titleMove(node,movelength){
			if(!_movetitle)return false;
			var nodeObj = document.querySelector(node);
			var mLeft = 0-nodeObj.offsetLeft;
			if(mLeft>=movelength)return false;
			mLeft += 1;
			nodeObj.style.marginLeft = '-'+mLeft+'px';
			return true;
		}		
		
		document.querySelector('#music-title').onmouseover = function(){			
			_movetitle = true;		
		};		
	
		document.querySelector('#music-title').onmouseout = function(){
			_movetitle = false;
			titleReset();
		};		
		
		document.querySelector('#player-btn-play').onclick = function(){
			if(_playstatus=='pause'){
				toPlay();
			}else if(_playstatus=='running'){
				toPause();
			}	
		};
		
		document.querySelector('#player-btn-backward').onclick = function(){
			toPrev();		
		};
		
		document.querySelector('#player-btn-forward').onclick = function(){
			toNext();		
		};
		
		function titleReset(){
			document.querySelector('#music-title-text').style.marginLeft = '0px';
		}
		
		function toPlay(){
			document.querySelector('#player-disk').style.animationPlayState = 'running';
			document.querySelector('#player-disk').style.WebkitAnimationPlayState  = 'running';
			document.querySelector('#player-btn-play').innerHTML = '<i class="fa fa-pause fa-lg textshadow"></i>';
			_playstatus = 'running';
			audio.play();
		}
		
		function toPause(){
			document.querySelector('#player-disk').style.animationPlayState = 'paused';
			document.querySelector('#player-disk').style.WebkitAnimationPlayState  = 'paused';
			document.querySelector('#player-btn-play').innerHTML = '<i class="fa fa-play fa-lg textshadow"></i>';
			_playstatus = 'pause';
			audio.pause();
		}
		
		function playerAdd(callback){
			html = '';
			html += '<div  class="music-player" id="music-player">';
			html += '<div class="i-circle" id="player-disk">';
			html += '<div class="i-circle1"><div class="i-circle2"></div></div>';
			html += '</div>';
			html += '<div class="music-title" id="music-title">';
			html += '<span  id="music-title-text"></span>';
			html += '</div>';
			html += '<div class="music-controlbar">';
			html += '<div class="player-btn-backward" id="player-btn-backward" ><i class="fa fa-step-backward fa-lg textshadow"></i></div>';
			html += '<div class="player-btn-play" id="player-btn-play" ></div>';
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
			var moveLength = moveLengthGet();
			if(moveLength>0){setInterval(function(){titleMove('#music-title-text',moveLength)},20);}
			document.querySelector('#player-disk').style.animationPlayState = 'paused';
			document.querySelector('#player-disk').style.WebkitAnimationPlayState = 'paused';
			document.querySelector('#player-btn-play').innerHTML = '<i class="fa fa-play fa-lg textshadow"></i>';
			preloadImg();
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
		
		function prepareToPlay(status){
			document.querySelector("#song").src = playList[index].musicURL;
			document.querySelector("#player-disk").style.background = '#fff url('+playList[index].albumPic+') no-repeat center / 100% 100%';
			if(typeof(status) == "undefined")audio.load();
			document.querySelector('#music-title-text').innerText = playList[index].musicName+" - "+playList[index].artist;
			if(_playstatus=='running')audio.play();
		}	
				
		function moveLengthGet(){
			var titlewidth = document.querySelector('#music-title').offsetWidth;
			var textwidth = document.querySelector('#music-title-text').offsetWidth;
			return textwidth - titlewidth;
		}
		
		function preloadImg(){
			images = new Array();			
			for (var i = 0; i < playList.length; i++) {
				images[i] = new Image();
				images[i].src = playList[i].albumPic;
			}      
		}
		
		function loadCss(url){ 
			var link = document.createElement("link"); 
			link.type = "text/css"; 
			link.rel = "stylesheet"; 
			link.href = url; 
			document.querySelectorAll("head")[0].appendChild(link); 
		}; 

	} 
