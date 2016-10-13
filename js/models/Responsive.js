function setResponsiveness() {
    measureCard();
    // filterCreaters();
    // filterListeners();
    //
    // function setBoxes() {
    //     // on resize boxes can be still closed, we open them first to get
    //     // the right height
    //     $('.ventu-filter-box').each(function(){
    //         $(this).css({
    //             'transition': 'none',
    //             'height': 'auto'
    //         });
    //     });
    //
    //
    //     $('.ventu-filter-box').each(function(){
    //         var height = $(this).outerHeight();
    //         $(this).attr('height', height);
    //     });
    //     $('.ventu-filter-box').each(function(i){
    //         if (i > 0) {
    //             // open the first one
    //             closeFilterBox($(this));
    //         } else {
    //             openFilterBox($(this));
    //         }
    //         $(this).css('transition', '');
    //     });
    //     if (window.ventuConfig.whatScreen === 0) {
    //         setTimeout(function(){
    //             closeFilterOverlay();
    //         }, 1000);
    //
    //     }
    // }
    //
    // function setMapSize() {
    //     var map = $('.ventu-map'),
    //         height = 0.8 * map.outerWidth();
    //     map.css('height', height);
    // }
    //
    // function init() {
    //     if (window.ventuConfig.whatScreen < 3) {
    //         setBoxes();
    //     }
    //
    //     if (window.ventuConfig.whatScreen > 2) {
    //         setMapSize();
    //     }
    // }
    //
    // init();
}

// open & close stuff
//
// function closeFilterOverlay() {
//     var filter = $('.ventu-filter'),
//         height = filter.outerHeight();
//     filter.css('top', 60 - height);
//     filter.addClass('closed');
//     window.ventuConfig.overlay = false;
// }
//
// function openFilterOverlay() {
//     var filter = $('.ventu-filter');
//     filter.css('top', 60);
//     filter.removeClass('closed');
//     window.ventuConfig.overlay = true;
// }
//
// function openFilterBox(element) {
//     var height = element.attr('height');
//     element.css('height', height);
//     element.removeClass('closed');
//     $('.ventu-filter-box').each(function(){
//         if (this !== element[0]) {
//             closeFilterBox($(this));
//         }
//     });
// }
//
// function closeFilterBox(element) {
//     element.css('height', 41);
//     element.addClass('closed');
// }

function whatScreen(){
    var width = $(window).outerWidth();
    if (width < 768){
        return 0; // mobile
    } else if (width < 1024) {
        return 1; //table portrait
    } else if (width < 1100) {
        return 2; //tablet
    } else if (width < 1400) {
        return 3; // laptop / small desktop
    } else {
        return 4; // big screens
    }
}


function measureCard() {
    var width = Math.round(0.4 * $(window).outerWidth() - 80),
        height = Math.round(width * 0.8);
    injectStyles('.ventu-card, .ventu-card-shade { height: ' + height + 'px; width: ' + width + 'px;}');
}


function injectStyles(rule) {
    var div = $('<div />', {
        html: '&shy;<style>' + rule + '</style>'
    }).appendTo('body');
};