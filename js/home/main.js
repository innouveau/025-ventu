$(window).ready(function(){
    initialiseModules();
    initialiseModals();

    setFullscreen();
});


function setFullscreen() {
    var windowHeight = $(window).outerHeight();
    $('#ventu-dialog-entry').css('min-height', windowHeight-60);
}
