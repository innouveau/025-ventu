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
        $('.ventu-popup').fadeOut(100, function(){
            $('.ventu-overlay').fadeOut(100);
        });
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
