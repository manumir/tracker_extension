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
  if (tab.url != undefined){
    lurl=getRootUrl(tab.url) // or = props.url (both have a .url attribute)
  }
  //}
});

// send map to popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg == "send urls and times"){
    //map1=sortt(map);
    sendResponse({urls: Array.from(map.keys()),
                  times: Array.from(map.values())});
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
