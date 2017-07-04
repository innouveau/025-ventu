window.environment = {
    development: true, // uses the fake backend
    autostart: true, // starts with a automated selection
    floatFirst: true // respects user setting see.cardAnimation
};

window.ventuConfig = {
    whatScreen: whatScreen(),
    overlay: false,
    environment: {
        development: true
    }
};

$(window).ready(function () {

    initialiseModules();
    initialiseModals();
    setFullscreenAndContinueButton();

    var searchFilter = window.ventuApi.getSearchFilter();
    
    if (typeof autoSearchFilter === 'undefined') {

        var searchQuery = window.ventuApi.getSearchQuery();

        window.filter = new Filter(searchQuery);
        window.ventu = new App();
        window.ventu.init();

        if (searchFilter.Building !== null ||
            searchFilter.City !== null ||
            searchFilter.Postcode !== null ||
            searchFilter.Street !== null) {

            function callback(result) {
                window.ventu.redraw(result);
            }

            window.ventuApi.getSelectResults(callback);
        }
        else {
            $('.ventu-search-open').trigger('click');
        }

        // keep this one after window.ventu
        // because it needs to know the ventu.config
        filterListeners();
    }

    slidePanelListener();
    // listListeners();
    
});