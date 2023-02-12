(function () {
    // check until Player object created
    var check = setInterval(function () {
        if (typeof GetPlayer != 'undefined') {
            clearInterval(check);
            setTimeout(function () {
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

    
})();

var updateVolume = function (volume) {
    if (volume != undefined) {
        var player = GetPlayer();
        var volume = player.GetVar('volume') / 10;
        try {
            DS.appState.setVolume(volume);
        } catch (error) {
            console.log(error);
        }
    }
};