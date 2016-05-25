function initFilter() {
    $('#area-slider').slider({
        tooltip: 'always'
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
        openFilterBox($($('.ventu-filter-box')[0]));
        if (window.ventuConfig.whatScreen === 'mobile') {
            closeFilterOverlay();
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
        if (window.ventuConfig.whatScreen !== 'desktop') {
            setBoxes();
            // change position of last guide
            $('.ventu-guide-6').removeClass('ventu-guide-right').addClass('ventu-guide-top').attr('y', 0).attr('x', 40);
            if (window.ventuConfig.whatScreen === 'desktop') {
                sizeCards();
            }
        }
    }

    function injectStyles(rule) {
        var div = $('<div />', {
            html: '&shy;<style>' + rule + '</style>'
        }).appendTo('body');
    }

    function sizeCards() {
        var width = 1.2 * ($('body').outerWidth() - 40);
        injectStyles('.ventu-card.current { height: ' + width + 'px;}');
    }

    $(window).resize(function(){
        init();
    });

    init();
}

function initSettings() {
    $('.ventu-dropdown-toggle').click(function () {
        showDropdown(this);
    });

    $('body').click(function (event) {
        var element = $(event.target);
        if (!element.hasClass('ventu-dropdown-toggle') && element.parents('.ventu-dropdown-toggle').length === 0) {
            showDropdown(null);
        }
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
        openForm($('.ventu-form'));
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
    $('.ventu-single-content').css('opacity', 0);
    setTimeout(function(){
        $('.ventu-single-content').css('opacity', 1);
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
    element.css('height', 49);
    element.addClass('closed');
}

function whatScreen(){
    var width = $(window).outerWidth();
    if (width < 768){
        return 'mobile';
    } else if (width < 1024) {
        return 'tablet-p';
    } else if (width < 1100) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}