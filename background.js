var state, lurl;
var map = new Map();
var DONT_WRITE_NEXT_FLAG=0;

setInterval(function () {
  if (lurl != undefined && DONT_WRITE_NEXT_FLAG == 0){
    if (map.get(lurl) != undefined){
      map.set(lurl,Number(map.get(lurl)+1));
    }
    else {
      map.set(lurl,1);
    }
  }
}, 1000);

chrome.tabs.onActivated.addListener(function() {
  chrome.tabs.query({'active': true, 'currentWindow': true},function(tabs) {
    lurl=getRootUrl(tabs[0].url);
  });
});

chrome.tabs.onUpdated.addListener(function(tabid,props,tab){
  //if (props.status == 'complete'){
  if (tab.url != undefined && tab.highlighted == true){ // THE "tab.highlighted" FIXES THE ERROR ON notes.txt
    lurl=getRootUrl(tab.url) // or = props.url (both have a .url attribute)
  }
  //}
});

// send map to popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg == "send urls and times"){
    map1=sortt(map);
    sendResponse({urls: Array.from(map1.keys()),
                  times: Array.from(map1.values())});
  }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  chrome.windows.getCurrent(function(_window){
    state=_window.state;
    console.log('changed to '+ window.state);
    if (state == 'minimized'){
      DONT_WRITE_NEXT_FLAG = 1;
    }
    if (state != 'minimized'){
      DONT_WRITE_NEXT_FLAG = 0;
    }
  });
});

chrome.idle.setDetectionInterval(300);
chrome.idle.onStateChanged.addListener(function (new_state){
  if (new_state != "active"){
    DONT_WRITE_NEXT_FLAG = 1;
    console.log("not active");
  }
  else{
    DONT_WRITE_NEXT_FLAG = 0;
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
  console.log(map);
});

chrome.tabs.query({'active': true, 'currentWindow': true},function(tabs) {
  lurl=getRootUrl(tabs[0].url);
});

function getRootUrl(url) {
  return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
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