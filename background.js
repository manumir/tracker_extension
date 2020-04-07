var start;
var map = new Map();
var state;
var url_in_flag=0;
var DONT_WRITE_NEXT_FLAG=0;
var lurl;

chrome.windows.onFocusChanged.addListener(function(windowId) {
  chrome.windows.getCurrent(function(_window){
    state=_window.state;
    console.log('changed to '+ window.state);
    if (state == 'minimized'){
      DONT_WRITE_NEXT_FLAG = 1;
    }
  });
});

chrome.tabs.onActivated.addListener(function() {
  chrome.tabs.query({'active': true, 'currentWindow': true},function(tabs) {
    if (DONT_WRITE_NEXT_FLAG == 0){
      for(url of map.keys()){
        if(url == tabs[0].url && url_in_flag == 0){
          url_in_flag = 1;
        }
      }
      if (url_in_flag==0){
        map.set(tabs[0].url,0);
      }
      if (start != "undefined" && lurl != 'undefined'){
        if (url_in_flag==1){
          map.set(lurl,Number(map.get(lurl)) + (Date.now()-start)/1000);
        } else {
          map.set(lurl,(Date.now()-start)/1000);
        }
      };
    } 
    else {
      DONT_WRITE_NEXT_FLAG=0
    }
    lurl=tabs[0].url;
    start = Date.now();
    url_in_flag=0;
  });
});

chrome.tabs.onUpdated.addListener(function(){
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs){
    for(url of map.keys()){
      if(url == tabs[0].url && url_in_flag == 0){
        url_in_flag = 1;
      }
    }
    if (url_in_flag==0){   
      map.set(tabs[0].url,0);
    }
    if (start != "undefined" && lurl != 'undefined'){
      if (url_in_flag==1){
        map.set(lurl,Number(map.get(lurl)) + (Date.now()-start)/1000);
      }
      else{
        map.set(lurl,(Date.now()-start)/1000);
      }
    };
    lurl=tabs[0].url;
    start = Date.now();
    url_in_flag=0;
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg == "send urls and times"){
    map.delete(undefined);
    sendResponse({urls: Array.from(map.keys()),
                  times: Array.from(map.values())});
  }
});