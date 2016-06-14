$(window).ready(function(){

    document.ontouchmove = function(event){
        // prevents unwanted scrolling on tablet
        event.preventDefault();
    };

    window.ventuConfig = {
        whatScreen: whatScreen(),
        overlay: false
    };
    window.ventu = new Ventu();
    window.guide = new Guide();
    if (window.ventuConfig.whatScreen === 0) {
        // shorter stack for mobile
        ventu.limit = 35;
    }

    // listeners
    mapListeners();
    guideListeners();
    initFilter();
    createTooltips();
    ventu.init();

});

