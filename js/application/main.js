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

var searchQuery = {
    result: 21,
    types: [3],
    location: 'plaats: Hulst',
    area: [100, 400],
    transaction: [2],
    searchType: ['none', 0]
};

$(window).ready(function () {

    initialiseModules();
    initialiseModals();
    setFullscreenAndContinueButton();

    var searchQuery = window.ventuApi.getSearchQuery();

    window.filter = new Filter(searchQuery);
    window.ventu = new App();
    window.ventu.init();

    ventuApi.getSelectResults(searchQuery);
    function callback(result) {
        window.ventu.redraw(result);
    }

    window.ventuApi.getSelectResults(callback);

    filterListeners();
    slidePanelListener();
    listListeners();
    
});