
/**
 *  Bootstrap Anonymous Function
 *  Detect relative path and load documents in a synchronous manner automatically.
 */

 
//load files which are depended on AetherPlayer
var aetherPlayerBoot = (function(path_bootstrap){

	var path_to_docs = path_bootstrap.substring(0,path_bootstrap.indexOf('/js/'));
	
	filesLoad([path_to_docs+'/css/AetherPlayer.css',path_to_docs+'/js/playlist.js',path_to_docs+'/js/AetherPlayer.js','https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css']); 
	
	//load files by order in a synchronous manner
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

var aetherplayer_path_bootstrap = document.scripts[document.scripts.length - 1].src;//get the absolute path of AetherPlayer_bootstrap.js

//make sure that the original page is completely loaded
document.onreadystatechange = function() {

	if (document.readyState == "complete") {
	
	   aetherPlayerBoot(aetherplayer_path_bootstrap);
	   
	}
	
}
