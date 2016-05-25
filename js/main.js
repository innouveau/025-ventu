$(window).ready(function(){

    window.ventuConfig = {
        whatScreen: whatScreen(),
        overlay: false
    };
    window.ventu = new Ventu();
    window.guide = new Guide();
    ventu.init();
    //guide.init();
    
    
    // listeners
    initSettings();
    initMap();
    initGuide();
    initFilter();

});

