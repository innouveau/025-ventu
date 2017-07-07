function initialiseModules() {

    // // try to detect if we can use session and local storage
    // try {
    //     // try to use localStorage
    //     $.sessionStorage.set('ventu-session-storage', []);
    // } catch (e) {
    //     // there was an error so...
    //     window.location = '/Error/PrivateMode';
    //     return;
    // }

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
