// all these are called from the specific main.js page
// fullscreen & continue button

function setFullscreenAndContinueButton() {
    var panelHeight = $(window).outerHeight();
    $('#ventu-dialog-entry').css('height', panelHeight);
    addContinueListener(panelHeight);
}

function addContinueListener(panelHeight) {
    $('.ventu-continue-button').click(function(){
        $('html, body').animate({
            scrollTop: panelHeight
        }, 500);
    })
}

