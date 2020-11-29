chrome.runtime.sendMessage({msg: "send urls and times"}, function(response) {
	for (var i = 0; i < response.urls.length; i++) {
		if (response.urls[i] != (undefined || "")){
			
			var p = document.createElement("p");
			p.setAttribute("id",response.urls[i]);
			
			if (Number(response.times[i]) <= 60){
				p.textContent= response.urls[i]+': '+String(Number(response.times[i]).toFixed(2))+' sec';
			}
			else if (Number(response.times[i]) > 60){
				var min=Math.floor(Number(response.times[i])/60);
				var sec=Number((response.times[i] % 60).toFixed(2));
				p.textContent= response.urls[i]+': '+String(min)+' min '+String(sec)+' sec';
			}
		var element = document.getElementById("a");
		element.appendChild(p);
		}
	}
});