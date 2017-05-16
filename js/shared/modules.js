function initialiseModules() {
    $('.ventu-dialog').each(function(){
        new Dialog($(this));
    });

    $('.ventu-sign-in').each(function(){
        new SignIn($(this));
    });

    $('.ventu-search').each(function(){
        // we want the search module initialis by hand
        // to add the custom callback
        if (!$(this).hasClass('initialise-manually')) {
            new Search($(this));
        }
    });

    $('.ventu-search-open').click(function(e){
        if ($(e.target).hasClass('ventu-search-open')) {
            $(this).toggleClass('ventu-search-open--opened');
            $(this).find('.ventu-search-results').empty();
            $(this).find('.ventu-search input').val('');
        }
    });

    $(window).resize(function(){
        setSearchOpeners();
    });

    setSearchOpeners();
}

function setSearchOpeners() {
    $('.ventu-search-open').each(function () {
        setSearchOpenerInNavbar($(this));
    })

}

function setSearchOpenerInNavbar(searchOpener) {
    var remainingSpace = $(window).outerWidth();
    remainingSpace -= $('.navbar-brand').outerWidth();
    remainingSpace -=  $('#navbar').outerWidth();
    searchOpener.parent().css('width', remainingSpace);
}