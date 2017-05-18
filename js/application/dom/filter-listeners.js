function filterListeners() {
    filterLabelListener();
    filterSetFullTextLengths();
    filterReadMoreListeners();
}

function filterLabelListener() {
    $('#ventu-filter-label').click(function(){
        $(this).parent().toggleClass('ventu-filters--inactive');
    })
}

function filterSetFullTextLengths() {
    $('.ventu-filter-full-text-container').each(function(){
        var height = $(this).outerHeight();
        $(this).attr('height', height).css('height', 0);
    })
}

function filterReadMoreListeners() {
    $('.ventu-filter-read-more').click(function(){
        var fullText = $(this).parent().parent().find('.ventu-filter-full-text-container');
        $(this).toggleClass('ventu-filter-read-more--open');

        if ($(this).hasClass('ventu-filter-read-more--open')) {
            fullText.css('height', parseInt(fullText.attr('height')));
        } else {
            fullText.css('height', 0);
        }
    })
}