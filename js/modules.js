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
}