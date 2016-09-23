$(window).ready(function(){

    window.environment = {
        development: true
    };

    document.ontouchmove = function(event){
        // prevents unwanted scrolling on tablet
        event.preventDefault();
    };

    window.ventuConfig = {
        whatScreen: whatScreen(),
        overlay: false,
        environment: {
            development: true
        }
    };
    window.ventu = new App();
    window.guide = new Guide();
    if (window.ventuConfig.whatScreen === 0) {
        // shorter stack for mobile
        ventu.limit = 35;
    }

    // listeners
    mapListeners();
    guideListeners();
    menuListeners();
    mapCreaters();
    setResponsiveness();
    createTooltips();
    ventu.init();

});

