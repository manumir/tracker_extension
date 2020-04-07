chrome.runtime.sendMessage({msg: "send urls and times"}, function(response) {
  for (var i = 0; i < response.urls.length; i++) {
  	response.urls[i]
  	var p = document.createElement("p");
  	var text = document.createTextNode(response.urls[i]+': '+response.times[i]+' sec');
  	p.appendChild(text);
  	var element = document.getElementById("a");
		element.appendChild(p);
  }
});