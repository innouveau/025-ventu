window.environment = {
    development: true,
    floatFirst: false,
    autostart: true,
    launchAll: false
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