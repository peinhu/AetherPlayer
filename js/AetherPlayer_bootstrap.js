
/**
 * Auto Require Tool
 * Detect relative path and load CSS and JS documents in a synchronous manner.
 */
var aetherPlayer = (function(){

	var path_bootstrap = document.querySelector('#aetherplayer-bootstrap').src;
	var path_to_docs = path_bootstrap.substring(0,path_bootstrap.indexOf('/js/'));
	
	filesLoad([path_to_docs+'/css/AetherPlayer.css','https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',path_to_docs+'/js/playlist.js',path_to_docs+'/js/AetherPlayer.js']); 
	
	//load files by order
	function filesLoad(arr){
		var type_arr = arr[0].split('.');
		var type = type_arr[type_arr.length-1];	
		if(type=="css")var dom = cssDomCreate(arr[0]);
		else if(type=="js")var dom = jsDomCreate(arr[0]);
		if(arr.length==1)return;
		dom.onload = function(){
			arr.splice(0,1);
			filesLoad(arr);
		}
	}
	
	//create JS dom in the body tag
	function jsDomCreate(url){
		var script = document.createElement("script"); 
		script.type = "text/javascript"; 
		script.src = url; 
		document.querySelector("body").appendChild(script);
		return script;
	}
	
	//create CSS dom in the head tag
	function cssDomCreate(url){ 
		var link = document.createElement("link"); 
		link.type = "text/css"; 
		link.rel = "stylesheet"; 
		link.href = url; 
		document.querySelector("head").appendChild(link);
		return link;		
	}
	
})

window.addEventListener("load",aetherPlayer(),false);
