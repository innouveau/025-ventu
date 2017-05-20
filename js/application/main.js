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
    result: 311,
    types: [1,5,8],
    location: 'plaats: Hoogezand',
    area: [100, 400],
    transaction: [1],
    searchArea: false
};

$(window).ready(function() {
    window.filter = new Filter(searchQuery);
    window.ventu = new App();
    ventu.init();
    window.ventuApi = new VentuApi();
    window.SearchUtil = new SearchUtil();


    ventuApi.querySearch();

    initialiseModules();
    initialiseModals();
    setFullscreenAndContinueButton();

    filterListeners();


    // mapListeners();
    // ventu.init();
    //
    // if (window.environment.autostart) {
    //     ventu.select('1077 Amsterdam (postcode)', 'poly');
    // }
    //
    // menuListeners();
    // select2();
});