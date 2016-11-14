window.environment = {
    development: true, // uses the fake backend
    autostart: true, // starts with a automated selection
    floatFirst: true // respects user setting see.cardAnimation
};

// document.ontouchmove = function(event){
//     // prevents unwanted scrolling on tablet
//     //event.preventDefault();
// };


window.ventuConfig = {
    whatScreen: whatScreen(),
    overlay: false,
    environment: {
        development: true
    }
};