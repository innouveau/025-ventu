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

    // fixes history.back cache loading
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };

    initialiseModules();
    initialiseModals();
    setFullscreenAndContinueButton();

    var searchFilter = window.ventuApi.getSearchFilter();

    // external search engines should refresh the GUI filter
    if (typeof loadExternalSearchEngine !== 'undefined') {
        searchFilter.RefreshGUIFilter = true;
        window.ventuApi.setSearchFilter(null, searchFilter, true);
    }

    if (typeof autoSearchFilter === 'undefined') {

        var searchQuery = window.ventuApi.getSearchQuery();

        window.filter = new Filter(searchQuery);
        window.ventu = new App();
        window.ventu.init();

        if ((typeof loadExternalSearchEngine !== 'undefined') ||
            (searchFilter.Building !== null ||
                searchFilter.City !== null ||
                searchFilter.Postcode !== null ||
                searchFilter.Street !== null)) {

            function callback(result) {
                window.ventu.redraw(result);
            }

            window.ventuApi.getSelectResults(callback);

        } else {
            $('.ventu-search-open').trigger('click');
        }

        // keep this one after window.ventu
        // because it needs to know the ventu.config
        filterListeners();
    }

    slidePanelListener();

});