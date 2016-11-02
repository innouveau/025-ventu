function mapListeners() {

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

// menu

function menuListeners(){
    $('.ventu-close-popup').click(function(){
        closePopups();
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            closePopups();
        }
    });
}

function closePopups() {
    $('.ventu-popup').fadeOut(100, function(){
        $('.ventu-overlay').fadeOut(100);
    });
}

function openLogin() {
    $('.ventu-overlay').fadeIn(100, function(){
        $('.ventu-login').fadeIn(100)
    })
}

function openSettings() {
    $('.ventu-overlay').fadeIn(100, function(){
        $('.ventu-settings').fadeIn(100)
    })
}




// select2

function select2() {
    $('select').select2({
        placeholder: "Kies type...",
        minimumResultsForSearch: -1,
        maximumSelectionLength: 3,
        language: {
            maximumSelected: function () {
                return 'Kies maximaal 3 types';
            }
        }
    });
}

function paralax() {
    $(window).ready(function() {
        var paralax = $('.ventu-img-stretch');
        if (paralax.length > 0) {
            function update(){
                var pos = $(window).scrollTop();
                paralax.css('backgroundPosition', '50% ' +  pos * 0.25 + 'px');

            }

            $(window).bind('scroll', update);

        }

    })
}
