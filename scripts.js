var seedVideo = document.getElementById("seed");
var currentVideo = document.getElementById("current");
var STREAM_SERVER = '192.168.2.68';

currentVideo.setAttribute('src', `http://${STREAM_SERVER}:8080/?action=stream`);

var videoList = [seedVideo];
var spacePressed = false;

function spaceDown(event) {
  var space = event.keyCode === 0 || event.keyCode === 32;
  if(space){
    document.body.className = 'contact';
    if (!spacePressed) {
      var curTime = Math.floor(seedVideo.currentTime);
      fetch(`http://${STREAM_SERVER}:3000/start?time=${curTime}`);
      spacePressed = true;
    }
  }
}
function spaceUp(event) {
  var space = event.keyCode === 0 || event.keyCode === 32;
  if(space){
    document.body.className = '';
    fetch(`http://${STREAM_SERVER}:3000/stop`);
    spacePressed = false;
  }
}

window.addEventListener("keydown", spaceDown, false);
window.addEventListener("keyup", spaceUp, false);

setInterval(updateVideoList, 1000);

function updateVideoList(){
  ajax.get(
    "./videoListingRetriever.php",
    {},
    function(data){
      var files = [];
      JSON.parse(data, (key,value) => {
        if(typeof value === 'string')
          files.push(value);
      });

      var curTime = Math.floor(seedVideo.currentTime);
      for( var i = 0; i < files.length; i++ ){
        var file = files[i];
        var startTime = file.slice(0,file.indexOf('.'));
        if( startTime == curTime ){
          addVideo( file );
        }
      }
    }
  );
}
//<video class="video show" id="current" muted loop autoplay src=""></video>
function addVideo( fileName ){
  var videoContainer = document.getElementById("addedVideos");
  var videoEl = document.createElement("video");
  videoEl.className = "video";
  videoEl.muted = true;
  videoEl.autoplay = true;
  videoEl.src = "./videos/"+fileName;
  videoEl.addEventListener('ended', function (e) {
    e.target.classList.remove("show");
    window.setTimeout(function(){e.target.parentNode.removeChild( e.target );},1000);
  });
  videoContainer.insertBefore( videoEl, videoContainer.firstChild );
  while(videoContainer.children.length>6){
    videoContainer.removeChild(videoContainer.children[videoContainer.children.length-2]);
  }
  window.setTimeout(function(){videoEl.classList.add("show");},100);
  
}






var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};
