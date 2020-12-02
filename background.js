var start, state, lurl;
var map = new Map();
var DONT_WRITE_NEXT_FLAG=0;

// on tab changed, write
chrome.tabs.onActivated.addListener(function() {
  chrome.tabs.query({'active': true, 'currentWindow': true},function(tabs) {
    write2map(map);
    lurl=getRootUrl(tabs[0].url);
  });
});

// on url change, write
chrome.tabs.onUpdated.addListener(function(tabID,props,tab){
  //if (props.status == 'complete'){
		if (tab.url != undefined && tab.highlighted == true){
			write2map(map);
			lurl=getRootUrl(tab.url);
		}
  //}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg == "send urls and times"){
    write2map(map);
    map1=sortt(map);
    sendResponse({urls: Array.from(map1.keys()),
                  times: Array.from(map1.values())});
  }
});

// get all tabs urls at browser startup
chrome.tabs.query({'currentWindow': true},function(tabs) {
  for (var i = tabs.length - 1; i >= 0; i--) {
    tabs[i].url=getRootUrl(tabs[i].url);
    if (tabs[i].url != undefined){
      map.set(tabs[i].url,0);
    }
  }
});

// start counting on the tab the browser starts
chrome.tabs.query({'active': true, 'currentWindow': true},function(tabs) {
  lurl=getRootUrl(tabs[0].url);
  start = Date.now();
});

// don't write to map if machine is idle
chrome.idle.setDetectionInterval(240);
chrome.idle.onStateChanged.addListener(function (new_state){
	write2map(map);
  if (new_state != "active"){
		console.log(1);
    DONT_WRITE_NEXT_FLAG = 1;
  }
});

// don't write if window is not focused (e.g. if not on screen) for >10 seconds
setInterval(function(){
  chrome.windows.getLastFocused(function(_window) {
    if (_window.focused == false){
			write2map(map);
			console.log(3);
      DONT_WRITE_NEXT_FLAG = 1;
    }
  });
}, 10000);

// don't write if it is minimized
chrome.windows.onFocusChanged.addListener(function(windowId) {
  chrome.windows.getLastFocused(function(_window) {
    state=_window.state;
		write2map(map);
    if (state == 'minimized'){
			console.log(2);
      DONT_WRITE_NEXT_FLAG = 1;
    }
  });
});

function write2map(map){
  if (DONT_WRITE_NEXT_FLAG == 0 && start != undefined && lurl != undefined){
      if (map.get(lurl) != null){
				console.log(lurl+","+String(Date.now()-start)/1000);
        map.set(lurl,Number(map.get(lurl)) + (Date.now()-start)/1000);
      }
			else {
        map.set(lurl,(Date.now()-start)/1000);
      }
  }
  else {
    DONT_WRITE_NEXT_FLAG = 0;
    console.log('did not write');
  }
  start = Date.now();
}

function sortt(map_arg){
  var new_map = new Map();
  var url_max;
  var n=map_arg.size;
  var max=0;
  var keys_=Array.from(map_arg.keys());

  for (var i = 0; i<n; i++,max=-1){
    for (url of keys_){
      if (map_arg.get(url) > max) {
        max = map_arg.get(url);
        url_max = url;
      }
    }
    new_map.set(url_max,map_arg.get(url_max));
    for (var j = keys_.length - 1; j >= 0; j--) {
      if (keys_[j] == url_max){
        keys_.splice(j,1);
      }
    }
  }
  return new_map;
}

function getRootUrl(url) {
  return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
}
