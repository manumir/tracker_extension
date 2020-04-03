chrome.storage.sync.get('urls', function(data) {
	document.getElementById('urls').innerHTML="urls: "+data.urls;
});

chrome.storage.sync.get('times', function(data) {
	document.getElementById('times').innerHTML= "time: "+data.times;
});