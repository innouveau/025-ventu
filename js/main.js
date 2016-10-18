$(window).ready(function(){

    window.environment = {
        development: true,
        intro: false,
        autostart: true
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


    filterListeners();
    mapListeners();

    ventu.init();

});