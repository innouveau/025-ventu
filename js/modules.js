function initialiseModules() {
    $('.ventu-dialog').each(function(){
        new Dialog($(this));
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
    })
    // TODO we could manually set the width of the search-box inside the search-opener
    // so it fits perfect between the ventu logo and the buttons on its right
}