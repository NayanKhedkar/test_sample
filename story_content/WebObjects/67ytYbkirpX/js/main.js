/** Note: Update storyline variables name as per required */

var VIDEO_COMPLETED_VARIABLE_NAME = "video_1_completed";
var ACTIVE_SEEK_BAR_VARIABLE_NAME = "isActiveSeekBar_video_1";
var CAPTION_SHOW_HIDE_VARIABLE_NAME = "displayCaption";
var UPDATE_VOLUME_VARIABLE_NAME = "volume";
var MUTE_UNMUTE_VARIABLE_NAME = "isMute";
var IS_VIDEO_PLAYING_VARIABLE_NAME = "isVideoPlaying";
var CURRENT_TIME_VARIABLE_NAME = "elapsedTime_video_1";

/** END */

/** Note: Update ableplayer settings variables value as per required */
var MAX_PlAYBACK_RATE = 2;
var IS_DISABLE_SEEK_BAR = true;
var IS_PLAYER_DISABLE = false;
var PREFERENCES = {
    prefVisibleDesc: 0,
    prefAutoScrollTranscript: 1,
    prefDescRate: 1, // 0.1 to 10 (1 is normal speech; 2 is fast but decipherable; >2 is super fast)
    prefTranscript:0
}
/** END */

var defaultMediaContainerHeight; // video + caption
var defaultMediaHeight;
var defaultCaptionHeight;
var defaultToolbarHeight;
var defaultDescHeight;
var defaultAbleWrapperHeight;
var windowHeight = window.parent.document.querySelector('.webobject').clientHeight || $(window).height();


if (!window.parent.GetPlayer) {
    window.parent.GetPlayer = function () {
        return {
            GetVar: function () { return; },
            SetVar: function (val) { }
        }
    }
}

// disable right click
document.addEventListener('contextmenu', function (event) { event.preventDefault() });

// when player setup Done
function setupDone(playerObj) {
    disableEnableSeekBar(IS_DISABLE_SEEK_BAR);
    var player = window.parent.GetPlayer();
    toggleCaption();
    updateVolume();
    onPlayerCaptionClick();
    if (getUserAgent().browser.name == "Safari") {
        setTimeout(function () {
            playerObj.setMediaAttributes();
        }, 1000);
    }
    defaultMediaContainerHeight = playerObj.$captionsContainer.height();
    defaultMediaHeight = playerObj.$media.height();
    defaultCaptionHeight = playerObj.$captionsWrapper.height();
    defaultToolbarHeight = playerObj.$playerDiv.height();
    defaultDescHeight = playerObj.$descDiv.height();
    defaultAbleWrapperHeight = playerObj.$ableWrapper.height();
    setCurrentTime(player.GetVar(CURRENT_TIME_VARIABLE_NAME));
    resizePlayer();
    play()
}

function onHideTranscript(playerObj) {
    $('#player').addClass('full-width');
    if(playerObj.fullscreen){
        playerObj.resizePlayer();
        //playerObj.refreshControls('fullscreen');
    }else{
        resizePlayer();
    }
}

function onShowTranscript(playerObj) {
    $('#player').removeClass('full-width');
    if (playerObj.fullscreen) {
        playerObj.resizePlayer();
        //playerObj.refreshControls('fullscreen');
    }else{
        resizePlayer();
    }
}

function onPlay(playerObj) {
    var player = window.parent.GetPlayer();
    if (player) {
        player.SetVar(IS_VIDEO_PLAYING_VARIABLE_NAME, true);
    }
}

function onPause(playerObj) {
    var player = window.parent.GetPlayer();
    if (player) {
        player.SetVar(IS_VIDEO_PLAYING_VARIABLE_NAME, false);
    }
}

function onHideDescription(playerObj) {
    if (playerObj.fullscreen) {
        playerObj.$captionsContainer.css({
            'height': ($(window).height() - playerObj.$playerDiv.height() - 20 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
        });
        playerObj.$media.css({
            'height': ($(window).height() - playerObj.$playerDiv.height() - 20 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
        });
    }  
    resizePlayer();
    //pauseAudioDescription();
}

function onShowDescription(playerObj) {
    if (playerObj.fullscreen) {
        playerObj.$captionsContainer.css({
            'height': ($(window).height() - playerObj.$playerDiv.height() - 44 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
        });
        playerObj.$media.css({
            'height': ($(window).height() - playerObj.$playerDiv.height() - 44 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
        });
    }

    resizePlayer();
}

function onHideCaption(playerObj) {
    resizePlayer();
    console.log("on hide caption");
}

function onShowCaption(playerObj) {
    console.log("on show caption");
   resizePlayer();
}


function handleFullscreenToggle(playerObj) {
    console.log("Toggle fullscreen");
    if (playerObj.fullscreen) {
        setTimeout(function () {
            playerObj.$captionsContainer.css({
                'height': ($(window).height() - playerObj.$playerDiv.height() - 44 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
            });
            playerObj.$media.css({
                'height': ($(window).height() - playerObj.$playerDiv.height() - 44 - (playerObj.descOn ? playerObj.$descDiv.height() : 0)) + 'px'
            });
        }, 500)
    } else {
        resizePlayer();
    }
}

function updateDefaultCookie(playerObj) {
    Object.keys(PREFERENCES).forEach(function (key) {
        playerObj.updateCookie(key);
    });
}

//window.postMessage("hello there!", "http://example.com");
//window.postMessage("mute", "*");  var isMute = player.GetVar('isMute');
//window.postMessage("volume", "*");  var volume = player.GetVar('volume');
//window.postMessage("caption", "*");
//window.postMessage("pauseAD", "*");
//window.postMessage("resumeAD", "*");
//window.postMessage("disableplayer", "*");
//window.postMessage("enableplayer", "*");
//document.querySelectorAll(".cs-volume input")[0].value = 0
window.parent.addEventListener("message", function (event) {
    switch (event.data) {
        case 'mute':
            toggleMute();
            break;
        case 'caption':
            toggleCaption();
            break;
        case 'volume':
            updateVolume();
            break;
        case 'play':
            play();
            break;
        case 'pause':
            pause();
            break;
        case 'seekbar':
            disableEnableSeekBar();
            break;
        case 'pauseAD':
            pauseAudioDescription();
            break;
        case 'resumeAD':
            resumeAudioDescription();
            break;
        case 'disableplayer':
            toggleDisabled(true);
            break;
        case 'enableplayer':
            toggleDisabled(false);
            break;
        default:
            break;
    }
}, false);

function updateVolume() {
    var player = window.parent.GetPlayer();
    var volume = player.GetVar(UPDATE_VOLUME_VARIABLE_NAME);
    if (AblePlayerInstances[0] && AblePlayerInstances[0].$volumeButton) {
        AblePlayerInstances[0].setVolume(volume);
        //AblePlayerInstances[0].refreshVolumeSlider(volume);
        if (volume <= 0) {
            AblePlayerInstances[0].setMute(true);
        } else {
            AblePlayerInstances[0].setMute(false);
        }
        AblePlayerInstances[0].refreshControls('volume');
    }
}

function toggleMute() {
    var player = window.parent.GetPlayer();
    var isMute = player.GetVar(MUTE_UNMUTE_VARIABLE_NAME);
    updateVolume();
    if (AblePlayerInstances[0] && AblePlayerInstances[0].$volumeButton) {
        AblePlayerInstances[0].setMute(isMute);
    }
}

function toggleCaption() {

    if (AblePlayerInstances[0]) {
        var player = window.parent.GetPlayer();
        var displayCaption = player.GetVar(CAPTION_SHOW_HIDE_VARIABLE_NAME);
        if (!AblePlayerInstances[0].captionsOn && displayCaption) {
            AblePlayerInstances[0].$ccButton.click();
        } else if (AblePlayerInstances[0].captionsOn && !displayCaption) {
            AblePlayerInstances[0].$ccButton.click();
        }
    }
}

//synch able player caption button with parent frame CC button
function onPlayerCaptionClick() {
    if (AblePlayerInstances[0]) {
        AblePlayerInstances[0].$ccButton.on('click', function () {
            var player = window.parent.GetPlayer();
            player.SetVar(CAPTION_SHOW_HIDE_VARIABLE_NAME, AblePlayerInstances[0].captionsOn);
        });
    }
}

//update variables
function mediaCompleted() {
    var player = window.parent.GetPlayer();
    player.SetVar(VIDEO_COMPLETED_VARIABLE_NAME, true);
}

function onVolumeChange(volume) {
    var player = window.parent.GetPlayer();
    player.SetVar(UPDATE_VOLUME_VARIABLE_NAME, volume);
    window.parent.updateVolume(volume);
}

function onMuteUnmute(isMute) {
    var player = window.parent.GetPlayer();
    player.SetVar(MUTE_UNMUTE_VARIABLE_NAME, isMute);
}

function play() {
    if (AblePlayerInstances[0]) {
        AblePlayerInstances[0].playMedia();
    }
}

function pause() {
    if (AblePlayerInstances[0]) {
        AblePlayerInstances[0].pauseMedia();
    }
}

function pauseAudioDescription() {
    if (AblePlayerInstances[0] && AblePlayerInstances[0].synth) {
        AblePlayerInstances[0].synth.pause();
        //synth.cancel();
    }
}

function resumeAudioDescription() {
    if (AblePlayerInstances[0] && AblePlayerInstances[0].synth) {
        AblePlayerInstances[0].synth.resume();
    }

}

window.addEventListener('beforeunload', function (event) {
    //pauseAudioDescription();
});

function toggleDisabled(status) {
    var element = AblePlayerInstances[0].$controllerDiv.find('div[role="button"]');
    if (element) {
        if (status) {
            element.attr('aria-disabled', 'true');
            IS_PLAYER_DISABLE = true;
        } else {
            element.removeAttr('aria-disabled');
            IS_PLAYER_DISABLE = false;
        }
    }
}

//window.postMessage("seekbar", "*");
function disableEnableSeekBar() {
    var player = window.parent.GetPlayer();
    var seekBar = player.GetVar(ACTIVE_SEEK_BAR_VARIABLE_NAME);
    IS_DISABLE_SEEK_BAR = seekBar != undefined ? seekBar : true;
}

function setCurrentTime(time) {
    var time = Number(time);
    if (isNaN(time)) return;
    AblePlayerInstances[0].$media[0].currentTime = time;
}

function updateMediaTime(playerObj) {
    console.log("TimeUpdate : elapsed", playerObj.elapsed);
    var player = window.parent.GetPlayer();
    player.SetVar(CURRENT_TIME_VARIABLE_NAME, playerObj.elapsed);
}

function resizePlayer() {
    var playerObj = AblePlayerInstances[0];
    //var windowHeight = $(window).height();
    if (playerObj.fullscreen) return;
    var discHeight = 0;
    var captionHeight = 0;
    var constFactor = 10;
    if (playerObj.$captionsWrapper && playerObj.$captionsWrapper.is(':visible')) {
        captionHeight = playerObj.$captionsWrapper.height();
    }
    if (playerObj.$descDiv && playerObj.$descDiv.is(':visible')) {
        discHeight = playerObj.$descDiv.height();
        constFactor = 60;
    }
    console.log("Test",windowHeight);
    var height = (windowHeight - constFactor - defaultToolbarHeight - captionHeight - discHeight);
    console.log("height",height);
    playerObj.$captionsContainer.css({
        'height': height + captionHeight + 'px'
    });
    playerObj.$media.css({
        'height': height + 'px'
    });
    playerObj.$bigPlayButton.css({
        'height': height + 'px',
        'width':  playerObj.$captionsContainer.width() + 'px'
    });
}

function getUserAgent() {

    var userAgent = {};
    userAgent.browser = {};

    // Test for common browsers
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
        userAgent.browser.name = 'Firefox';
        userAgent.browser.version = RegExp.$1; // capture x.x portion
    } else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x (IE10 or lower)
        userAgent.browser.name = 'Internet Explorer';
        userAgent.browser.version = RegExp.$1;
    } else if (/Trident.*rv[ :]*(\d+\.\d+)/.test(navigator.userAgent)) { // test for IE11 or higher
        userAgent.browser.name = 'Internet Explorer';
        userAgent.browser.version = RegExp.$1;
    } else if (/Edge[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { // test for MS Edge
        userAgent.browser.name = 'Edge';
        userAgent.browser.version = RegExp.$1;
    } else if (/OPR\/(\d+\.\d+)/i.test(navigator.userAgent)) { // Opera 15 or over
        userAgent.browser.name = 'Opera';
        userAgent.browser.version = RegExp.$1;
    } else if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
        userAgent.browser.name = 'Chrome';
        if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            userAgent.browser.version = RegExp.$1;
        }
    } else if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        userAgent.browser.name = 'Safari';
        if (/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            userAgent.browser.version = RegExp.$1;
        }
    } else {
        userAgent.browser.name = 'Unknown';
        userAgent.browser.version = 'Unknown';
    }

    // Now test for common operating systems
    if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) {
        userAgent.os = "Windows 8";
    } else if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) {
        userAgent.os = "Windows 7";
    } else if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) {
        userAgent.os = "Windows Vista";
    } else if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) {
        userAgent.os = "Windows XP";
    } else if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) {
        userAgent.os = "Windows 2000";
    } else if (window.navigator.userAgent.indexOf("Mac") != -1) {
        userAgent.os = "Mac/iOS";
    } else if (window.navigator.userAgent.indexOf("X11") != -1) {
        userAgent.os = "UNIX";
    } else if (window.navigator.userAgent.indexOf("Linux") != -1) {
        userAgent.os = "Linux";
    }
    return userAgent;
}