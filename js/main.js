window.environment = {
    development: true,
    floatFirst: true,
    autostart: true,
    launchAll: true
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