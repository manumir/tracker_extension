setInterval(function () {
chrome.runtime.sendMessage({msg: "send urls and times"}, function(response) {
  for (var i = 0; i < response.urls.length; i++) {
	if (response.urls[i] != undefined){
		if (document.getElementById(response.urls[i]) == null){
		  	var p = document.createElement("p");
		  	p.setAttribute("id",response.urls[i]);
		  	
		  	//p.appendChild(document.createTextNode(response.urls[i]+': '+response.times[i]+' sec'));
		  	p.textContent= response.urls[i]+': '+String(Number(response.times[i])/60)+' min';
		  	var element = document.getElementById("a");
			element.appendChild(p);
		  	}
		  	else {
		  		var p = document.getElementById(response.urls[i]);
		  		p.textContent = response.urls[i]+': '+String(Number(response.times[i])/60)+' min';
	  	}
	}
  }
});
}, 1000);
