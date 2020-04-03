var start;
var map = new Map();
var state;
var flag=0;
var lurl;

chrome.alarms.create({periodInMinutes:1});
chrome.alarms.onAlarm.addListener(function() {
  chrome.windows.getCurrent(function(_window){
    state=_window.state;
    console.log('state is '+ state);
  });
});

if (state != "minimized"){
  console.log('this is executed' + state);
  chrome.tabs.onActivated.addListener(function() {
    chrome.tabs.query({'active': true, 'currentWindow': true},function(tabs) {
      for(url of map.keys()){
        if(url == tabs[0].url && flag == 0){
          flag = 1;
        }
      }
      if (flag==0){   
        map.set(tabs[0].url,0);
      }
      if (start != "undefined" && lurl != 'undefined'){
        map.set(String(lurl),String(Date.now()-start));
      };
      lurl=tabs[0].url;
      start = Date.now();
      flag=0;
      chrome.storage.sync.set({'urls':urls}, function() {
        console.log('urls: ' + Array.from(map.keys()));
      });
      chrome.storage.sync.set({'times':times}, function() {
        console.log('times: ' + Array.from(map.values()));
      });
      console.log(map);
    });
  });

  chrome.tabs.onUpdated.addListener(function(){
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs){
      for(url of map.keys()){
        if(url == tabs[0].url && flag == 0){
          flag = 1;
        }
      }
      if (flag==0){   
        map.set(tabs[0].url,0);
      }
      if (start != "undefined" && lurl != 'undefined'){
        map.set(String(lurl),String(Date.now()-start));
      };
      lurl=tabs[0].url;
      start = Date.now();
      flag=0;
      chrome.storage.sync.set({'urls':urls}, function() {
        console.log('urls: ' + Array.from(map.keys()));
      });
      chrome.storage.sync.set({'times':times}, function() {
        console.log('times: ' + Array.from(map.values()));
      });
      console.log(map);
    });
  });
}