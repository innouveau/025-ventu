function initialiseModals() {
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            closePopups();
        }
    });

    $('.ventu-close-popup').click(function(){
        closePopups();
    });
}

function openLogin() {
    $('.ventu-overlay').fadeIn(100, function(){
        $('.ventu-login').fadeIn(100)
    })
}

function closePopups() {
    $('.ventu-popup').fadeOut(100, function(){
        $('.ventu-overlay').fadeOut(100);
    });
}