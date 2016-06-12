function initTooltips() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({
            viewport: {
                selector: 'body', padding: 20
            }
        });
    });
}

function initFilter() {
    $('#area-slider').slider({
        tooltip: 'always',
        tooltip_split: true
    });

    // type

    $('.ventu-filter-type').click(function(){
        $(this).toggleClass('active');
    });


    $('.ventu-filter-type').click(function(){
        //fake
        var n = Math.round(75 * Math.random());
        ventu.setStack(n);
    });


    $('.get-locations').click(function(){
       // loading animation of circle
       var button = $(this);
       $('.ventu-map-circle').addClass('ventu-get-locations');
       // fake killing
       setTimeout(function(){
           $('.ventu-map-circle').removeClass('ventu-get-locations');
       }, 5000);
    });


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

function setMainImage() {
    function setImage(){
        $('.ventu-single-main-image').css('height', $(window).outerHeight());
    }

    setImage();

    $(window).resize(function(){
        setImage();
    });
}

function initMap() {
    $('.ventu-map-input').focus(function(){
        $(this).parent().addClass('active');
        setTimeout(function(){
            $('.ventu-map-search .ventu-icon-remove').fadeIn(50).css('display', 'inline-block');
        }, 200);
    });

    $('.ventu-map-input').blur(function() {
        if ($(this).val() === '') {
            $(this).parent().removeClass('active');
            $('.ventu-map-search .ventu-icon-remove').fadeOut(10);
        }
    });

    $('.ventu-map-input').on('input', function() {
        if ($(this).val() !== '') {
            $('.ventu-map-search-results').show();
        } else {
            $('.ventu-map-search-results').hide();
        }
    });
}

function initForm() {
    // close button in settings
    $('.ventu-settings .ventu-icon-close').click(function(){
        showDropdown(null);
    });

    // close button of direct reageren
    $('.ventu-form-respond .ventu-icon-close').click(function(){
        closeForms();
    });

    $('.ventu-open-form').click(function(){
        openForm($('.ventu-form-respond'));
    });
    closeForms();
}

function initLightbox() {
    $('.ventu-open-lightbox').click(function(){
        $('.ventu-lightbox').fadeIn(500);
    });

    $('.ventu-lightbox .ventu-icon-close').click(function(){
        $('.ventu-lightbox').fadeOut(250);
    });


    function setLightbox() {
        var windowWidth = $(window).outerWidth(),
            windowHeight = $(window).outerHeight(),
            ratio = windowHeight / windowWidth,
            width,
            height,
            margin = 40;
        if (ratio > 0.75) {
            width = windowWidth - (2 * margin);
            height = width * 0.75;
            margin = ((windowHeight - height) / 2) + 'px ' + margin + 'px';
        } else {
            height = windowHeight -  (2 * margin);
            width = height / 0.75;
            margin = margin + 'px auto';
        }
        $('.ventu-lightbox-card').css({
            width: width,
            height: height,
            margin: margin
        });
    }

    $(window).resize(function(){
        setLightbox();
    });

    setLightbox();

}

function initFavorites() {
    $('.ventu-favorites-navigation .ventu-icon-next').click(function(){
        favorites.current++;
        if (favorites.current > favorites.total) {
            favorites.current = 1;
        }
        count();
        reloadPage();
    });

    $('.ventu-favorites-navigation .ventu-icon-prev').click(function(){
        favorites.current--;
        if (favorites.current < 1) {
            favorites.current = favorites.total;
        }
        count();
        reloadPage();
    });
}

function initGuide() {
    $('.start-guide').click(function () {
        guide.init();
        showDropdown(null);
    });
}



// globals

var favorites = {
    current: 3,
    total: 7
};

function count() {
    $('.ventu-favorites-counter').html(favorites.current + '/' + favorites.total);
}

function reloadPage() {
    // fake
    $('.ventu-single-page').css('opacity', 0);
    setTimeout(function(){
        $('.ventu-single-page').css('opacity', 1);
    }, 1000);
}

function openForm(form) {
    var height = form.attr('height');
    form.css('height', height);

}

function closeForms(){
    $('.ventu-form.ventu-form-hidden').each(function(){
        var height = $(this).outerHeight();
        $(this).attr('height', height);
        $(this).css('height', 0);
    })
}

function showDropdown(element) {
    $('.ventu-dropdown-toggle').each(function () {
        var dropdown = $(this).find('.ventu-dropdown');
        if (this === element) {
            $(this).addClass('active');
            dropdown.fadeIn(500);
        } else {
            $(this).removeClass('active');
            dropdown.fadeOut(500);
        }
    })
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