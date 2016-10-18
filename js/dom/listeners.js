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