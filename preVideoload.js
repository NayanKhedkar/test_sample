// specify video path to preload videos on storyline started
var videoPaths = [
    "story_content/WebObjects/5zfncBEF2QW/assets/video/wwa.mp4"
];

videoPaths.forEach(function (path) {
    //Create a new video element
    var video = document.createElement('video');
    video.src = path;
    video.load();
    var timer = setInterval(function () {
        if (video.readyState === 4) {
            clearInterval(timer);
            console.log('Video is preloaded!');
        } else {
            video.load();  // try to load again
        }
    }, 2000)

})