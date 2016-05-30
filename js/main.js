$(window).ready(function(){

    window.ventuConfig = {
        whatScreen: whatScreen(),
        overlay: false
    };
    window.ventu = new Ventu();
    window.guide = new Guide();
    if (window.ventuConfig.whatScreen === 'mobile') {
        // shorter stack for mobile
        ventu.limit = 35;
    }
    ventu.init();

    
    // listeners
    initSettings();
    initMap();
    initGuide();
    initFilter();
    initTooltips();

});

