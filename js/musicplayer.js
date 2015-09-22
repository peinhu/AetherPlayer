/**
 * @author		Payne
 * @email		huyang110yahoo@gmail.com
 * @github		https://github.com/peinhu
 * @site		http://2ndrenais.com
 * @date		2015-08-04
 */

	//Edit your playlist here.
	var playList = [
		{
		'artist':'',
		'musicName':'',
		'musicURL':'',
		'albumPic':'',
		}
	];
 
	var loadFontAwesome = true;//If you set this to false ,then you should download the Font Awesome CSS and add it to your HTML document manually.
 
	window.onload = function() {
 
		if(loadFontAwesome)loadCss("https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css");//Font Awesome CSS by CDN
	 
		playerAdd();

		playerInit();
		
		audio.addEventListener('ended',function(){
			toNext();
		},false);
				
		$('#music-title').mouseover(function(){
			if(textwidth > titlewidth){
			movewidth = titlewidth-textwidth;
			$('#music-title-text').animate({marginLeft:movewidth+'px'},3000);		
			}
		});
		
		$('#music-title').mouseout(function(){
			$('#music-title-text').stop();
			$('#music-title-text').css({marginLeft:'0px'});
		});		
		
		$('#player-btn-play').click(function(){
			if(playStatus=='pause'){
				toPlay();
			}else if(playStatus=='running'){
				toPause();
			}	
		});
		$('#player-btn-backward').click(function(){
			toPrev();		
		});
		
		$('#player-btn-forward').click(function(){
			toNext();		
		});
		
		function toPlay(){
			$('#player-disk').css({'animation-play-state':'running','-webkit-animation-play-state':'running'});
			$('#player-btn-play').html('<i class="fa fa-pause fa-lg textshadow"></i>');
			playStatus = 'running';
			audio.play();
		}
		
		function toPause(){
			$('#player-disk').css({'animation-play-state':'paused','-webkit-animation-play-state':'paused'});
			$('#player-btn-play').html('<i class="fa fa-play fa-lg textshadow"></i>');
			playStatus = 'pause';
			audio.pause();
		}
		
		function playerInit(){
			audio = document.getElementById("songs");
			titlewidth = $('#music-title').width();
			playStatus = 'pause';
			musicNum = playList.length;
			index = 0;
			prepareToPlay('init');
			$('#player-disk').css({'animation-play-state':'paused','-webkit-animation-play-state':'paused'});
			$('#player-btn-play').html('<i class="fa fa-play fa-lg textshadow"></i>');
			preloadImg();
		}
		
		function playerAdd(){
			html = '<div  class="music-player" id="music-player">';
			html += '<div class="i-circle" id="player-disk">';
			html += '<div class="i-circle1"><div class="i-circle2"></div></div>';
			html += '</div>';
			html += '<div class="music-title" id="music-title">';
			html += '<span  id="music-title-text"></span>';
			html += '</div>';
			html +='<div class="music-controlbar">';
			html +='<div class="player-btn-backward" id="player-btn-backward" ><i class="fa fa-step-backward fa-lg textshadow"></i></div>';
			html +='<div class="player-btn-play" id="player-btn-play" ></div>';
			html +='<div class="player-btn-forward" id="player-btn-forward" ><i class="fa fa-step-forward fa-lg textshadow"></i></div>';
			html +='</div>';
			html +='</div>';
			html +='<audio id="songs" preload="none"><source src="" type="audio/mpeg" id="song">This technique is not supported in the ancient browser.</audio>';
			$('body').prepend(html);
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
			$("#song").attr('src',playList[index].musicURL);
			$("#player-disk").css('background','#fff url('+playList[index].albumPic+') no-repeat center / 100% 100%');
			if(typeof(status) == "undefined")audio.load();
			$('#music-title-text').text(playList[index].musicName+" - "+playList[index].artist);
			textwidth = $('#music-title-text').width();
			if(playStatus=='running')audio.play();
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
			document.getElementsByTagName("head")[0].appendChild(link); 
		}; 

	} 
