function initialiseModules() {
    window.ventuApi = new VentuApi();

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
    console.log("!");
    var logoLarge, logoSmall, logoSrc, img;
    logoLarge = $('.ventu-identity .hidden-xs');
    logoSmall = $('.ventu-identity .visible-xs');
    // check if the desktop or mobile logo is visible
    if (logoLarge.css('display') === 'none') {
        logoSrc = logoSmall.attr('src');
    } else {
        logoSrc = logoLarge.attr('src');
    }
    img = new Image();
    img.onload = function() {
        // do measuring when the logo image is loaded
        // so we know the width of the navbar-brand part
        var remainingSpace = Math.floor($('body').innerWidth());
        remainingSpace -= Math.ceil($('.navbar-brand').outerWidth());
        remainingSpace -=  Math.ceil($('#navbar').outerWidth());
        remainingSpace -= 0.5;

        searchOpener.parent().css('width', remainingSpace);
    };
    img.src = logoSrc;
}

function sanitizeAreaInput(el) {
    // @walstra heb jij een mening of we nog meer moeten checken hier, gaat over
    // de oppervlakte waarden
    var value = el.val();
    if (!isNaN(value) && value.length > 0) {
        el.parent().removeClass('ventu-slider-area-picker--error');
        return {
            value: value,
            valid: true
        }
    } else {
        el.parent().addClass('ventu-slider-area-picker--error');
        return {
            value: null,
            valid: false
        }
    }
}