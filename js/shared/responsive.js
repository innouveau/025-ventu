function setResponsiveness() {
    measureCard();
}

function whatScreen(){
    var width = $(window).outerWidth();
    if (width < 768){
        return 0; // mobile
    } else if (width < 1024) {
        return 1; //table portrait
    } else if (width === 1024) {
        return 2; // tablet landscape
    }else if (width < 1400) {
        return 3; // laptop / small desktop
    } else {
        return 4; // big screens
    }
}


function measureCard() {
    var width = Math.round(0.4 * $(window).outerWidth() - 80),
        height = Math.round(width * 0.8);
}


function injectStyles(rule) {
    var div = $('<div />', {
        html: '&shy;<style>' + rule + '</style>'
    }).appendTo('body');
}
