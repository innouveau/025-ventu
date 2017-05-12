// all these are called from the specific main.js page
// fullscreen & continue button

function setFullscreen() {
    var panelHeight = $(window).outerHeight() - 60;
    $('#ventu-dialog-entry').css('min-height', panelHeight);
    addContinueListener(panelHeight);
}

function addContinueListener(panelHeight) {
    $('.ventu-continue-button').click(function(){
        $('html, body').animate({
            scrollTop: panelHeight
        }, 500);
    })
}