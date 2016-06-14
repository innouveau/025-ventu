// create stuff

function createTooltips() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({
            viewport: {
                selector: 'body', padding: 20
            }
        });
    });
}

function filterCreaters() {
    $('#area-slider').slider({
        tooltip: 'always',
        tooltip_split: true
    });
}

function mapCreaters() {
    // TODO: probably development has to do this within the google API
    var directions = ['n', 's', 'w', 'e'];
    $('.ventu-map-circle').each(function(){
        for (var i = 0; i < 4; i++) {
            $(this).append('<div class="ventu-map-circle-handle ventu-map-circle-handle-' + directions[i] + '"></div>');
        }
    })
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



// listeners

function filterListeners() {
    $('.ventu-filter-type').click(function(){
        $(this).toggleClass('active');
    });


    $('.ventu-filter-type').click(function(){
        //fake todo remove this
        var n = Math.round(75 * Math.random());
        ventu.setStack(n);
    });

    $('.ventu-filter-label').click(function(){
        if ($('.ventu-filter').hasClass('closed')) {
            openFilterOverlay();
        } else {
            closeFilterOverlay();
        }
    });

    if (window.ventuConfig.whatScreen < 3) {
        $('.ventu-filter-box-head').click(function () {
            var parent = $(this).parent();
            if (parent.hasClass('closed')) {
                openFilterBox(parent);
            } else {
                closeFilterBox(parent);
            }
        });
    }
}

function mapListeners() {
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

    $('.get-locations').click(function(){
        // loading animation of circle
        var button = $(this);
        $('.ventu-map-circle').addClass('ventu-get-locations');
        // fake killing
        setTimeout(function(){
            $('.ventu-map-circle').removeClass('ventu-get-locations');
        }, 5000);
    });
}

function formListeners() {
    // close button of direct reageren
    $('.ventu-form-respond .ventu-icon-close').click(function(){
        closeForms();
    });

    $('.ventu-open-form').click(function(){
        openForm($('.ventu-form-respond'));
    });

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
    
    closeForms();
}

function lightboxListeners() {
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

function favoritesListeners() {
    var favorites = {
        current: 3,
        total: 7
    };

    $('.ventu-favorites-navigation .ventu-icon-next').click(function(){
        favorites.current++;
        if (favorites.current > favorites.total) {
            favorites.current = 1;
        }

        function reloadPage() {
            // fake
            $('.ventu-single-page').css('opacity', 0);
            setTimeout(function(){
                $('.ventu-single-page').css('opacity', 1);
            }, 1000);
        }

        function count() {
            $('.ventu-favorites-counter').html(favorites.current + '/' + favorites.total);
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

function guideListeners() {
    $('.start-guide').click(function () {
        guide.init();
    });
}
