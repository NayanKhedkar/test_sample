(function () {

    var check = setInterval(function () {
        if (GetPlayer) {
            setDevice(GetPlayer());
            clearInterval(check);
        }
    }, 2000);


    // set variable if device is mobile/ipad
    function setDevice(player) {
        console.log(isMobile.desktop);
        player.SetVar('isMobile', !isMobile.desktop);
    }
})();

//