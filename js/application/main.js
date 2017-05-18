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

$(window).ready(function(){
    window.ventu = new App();

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