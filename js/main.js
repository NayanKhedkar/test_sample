
window.parent.GetPlayer = function () {
    return {
        GetVar: function (key) {
            return localStorage.getItem(key);
        },
        SetVar: function (key, value) {
            localStorage.setItem(key, value);
        }
    }
}

function onHideTranscript(playerObj) {
    $('#player').addClass('full-width');
}

function onShowTranscript(playerObj) {
    $('#player').removeClass('full-width');
}

function onHideDescription(playerObj) {
    if (playerObj.fullscreen) {
        playerObj.$vidcapContainer.css({
            'height': ($(window).height() - playerObj.$playerDiv.height() - 20 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
        });
        playerObj.$media.css({
            'height': ($(window).height() - playerObj.$playerDiv.height() - 20 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
        });
    }
}

function onShowDescription(playerObj) {
    if (playerObj.fullscreen) {
        if (playerObj.fullscreen) {
            playerObj.$vidcapContainer.css({
                'height': ($(window).height() - playerObj.$playerDiv.height() - 44 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
            });
            playerObj.$media.css({
                'height': ($(window).height() - playerObj.$playerDiv.height() - 44 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
            });
        }
    }
}

//window.postMessage("hello there!", "http://example.com");
//window.postMessage("mute", "*");  var isMute = player.GetVar('isMute');
//window.postMessage("volume", "*");  var volume = player.GetVar('volume');
//document.querySelectorAll(".cs-volume input")[0].value = 0
window.parent.addEventListener("message", function (event) {
    switch (event.data) {
        case 'mute':
            toggleMute();
            break;
        case 'volume':
            updateVolume();
        default:
            break;
    }
}, false);

function updateVolume() {
    var player = parent.GetPlayer();
    var volume = player.GetVar('volume');
    AblePlayerInstances[0].setVolume(volume);
    AblePlayerInstances[0].refreshVolumeSlider(volume);
}

function toggleMute() {
    var player = parent.GetPlayer();
    var isMute = player.GetVar('isMute');
    AblePlayerInstances[0].setMute(isMute);
}


