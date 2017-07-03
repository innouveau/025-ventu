function initialiseModules() {

    window.ventuApi = new VentuApi();

    var screen = whatScreen();

    if (screen > 0) {
        $('.ventu-dialog').each(function () {
            new Dialog($(this));
        });
    }

    // search
    $('.ventu-search').each(function(){
        // we want the search module initialis by hand
        // to add the custom callback
        if (!$(this).hasClass('initialise-manually')) {
            new Search($(this));
        }
    });

    // search opener
    $('.ventu-search-open').click(function(e){
        if ($(e.target).hasClass('ventu-search-open')) {
            $(this).toggleClass('ventu-search-open--opened');
            $(this).find('.ventu-search-results').empty();
            $(this).find('.ventu-search input').focus();
            $(this).find('.ventu-search input').val('');
        }
    });


    if (screen > 2) {
        $('.ventu-affix').each(function () {
            new Affix($(this));
        });
    }
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