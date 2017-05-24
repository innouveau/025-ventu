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

    var searchQuery = window.ventuApi.getSearchQuery();

    window.filter = new Filter(searchQuery);
    window.ventu = new App();
    window.ventu.init();

    function callback(result) {
        window.ventu.redraw(result);
    }

    window.ventuApi.getSelectResults(callback);

    filterListeners();
    slidePanelListener();
    listListeners();
    
});