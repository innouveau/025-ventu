window.environment = {
    development: true,
    intro: true,
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