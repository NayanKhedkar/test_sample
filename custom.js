(function () {
    // check until Player object created
    var check = setInterval(function () {
        if (typeof GetPlayer != 'undefined') {
            clearInterval(check);
            setTimeout(function () {
				hideBottomBar();
                onVolumeChange(GetPlayer());
            }, 1000)
            setDevice(GetPlayer());
        }
    }, 2000);


    // set variable if device is mobile/ipad
    function setDevice(player) {
        console.log(isMobile.desktop);
        player.SetVar('isMobile', !isMobile.desktop);
    }

    function onVolumeChange(player) {
        if (document.querySelector('#volume button')) {
            document.querySelector('#volume button').addEventListener('click', function (e, val) {
                var volume = document.querySelector('#volume .slider-bar input').value;
                player.SetVar('volume', +volume);
                window.postMessage("volume", "*");
            });
            document.querySelector('#volume .slider-bar input').addEventListener('change', function (e, val) {
                var volume = e.target.value;
                player.SetVar('volume', +volume);
                window.postMessage("volume", "*");
            });
        }
    }


})();

var updateVolume = function (_volume) {
    if (_volume != undefined) {
        var player = GetPlayer();
        var volume = _volume / 10 || player.GetVar('volume') / 10;
        try {
            DS.appState.setVolume(volume);
            if (DS.appState.get('currentVolume') != volume) {
                //update again
                DS.appState.setVolume(volume);
                DS.appState.set('currentVolume', volume);
            }
        } catch (error) {
            console.log(error);
        }
    }
};
function fixSafariBlackScreen() {
    if (DS && DS.detection.browser.isSafariMac) {
        console.log("safari fixed")
        var layers = document.querySelectorAll('.slide-layer.shown:not(.base-layer)');
        if (layers[2]) {
            layers[2].style.display = 'none';
        }
        if (layers[3]) {
            layers[3].style.display = 'none';
        }
        
        setTimeout(function () {
            layers.forEach(function(layer){
              if(layer){
                layer.style.display = '';
              }
            })
        }, 10);
    }
}
function hideBottomBar() {
    if (document.querySelector('#bottom-bar')) {
        document.querySelector('#bottom-bar').style.display = 'none';
    }
}