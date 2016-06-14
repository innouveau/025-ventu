function initFilter() {
    filterCreaters();
    filterListeners();


    // filter as overlay

    $('.ventu-filter-label').click(function(){
        if ($('.ventu-filter').hasClass('closed')) {
            openFilterOverlay();
        } else {
            closeFilterOverlay();
        }
    });

    function setBoxes() {
        $('.ventu-filter-box').each(function(){
            var height = $(this).outerHeight();
            $(this).attr('height', height);
        });
        $('.ventu-filter-box').each(function(i){
            console.log(i);
            if (i > 0) {
                closeFilterBox($(this));
            } else {
                openFilterBox($(this));
            }
        });
        if (window.ventuConfig.whatScreen === 0) {
            setTimeout(function(){
                closeFilterOverlay();
            }, 1000);

        }
    }

    $('.ventu-filter-box-head').click(function(){
        var parent = $(this).parent();
        if (parent.hasClass('closed')) {
            openFilterBox(parent);
        } else {
            closeFilterBox(parent);
        }
    });

    function init() {
        setMapCircle();
        if (window.ventuConfig.whatScreen < 3) {
            setBoxes();
            // change position of last guide
            $('.ventu-guide-6').removeClass('ventu-guide-right').addClass('ventu-guide-top').attr('y', 0).attr('x', 40);
        }
    }

    function setMapCircle() {
        var directions = ['n', 's', 'w', 'e'];
        $('.ventu-map-circle').each(function(){
            for (var i = 0; i < 4; i++) {
                $(this).append('<div class="ventu-map-circle-handle ventu-map-circle-handle-' + directions[i] + '"></div>');
            }
        })
    }

    $(window).resize(function(){
        init();
        ventu.redraw();
    });

    init();
}

// open & close stuff

function closeFilterOverlay() {
    var filter = $('.ventu-filter'),
        height = filter.outerHeight();
    filter.css('top', 60 - height);
    filter.addClass('closed');
    window.ventuConfig.overlay = false;
}

function openFilterOverlay() {
    var filter = $('.ventu-filter');
    filter.css('top', 60);
    filter.removeClass('closed');
    window.ventuConfig.overlay = true;
}

function openFilterBox(element) {
    var height = element.attr('height');
    element.css('height', height);
    element.removeClass('closed');
    $('.ventu-filter-box').each(function(){
        if (this !== element[0]) {
            closeFilterBox($(this));
        }
    });
}

function closeFilterBox(element) {
    element.css('height', 41);
    element.addClass('closed');
}

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