function filterListeners() {
    filterSetFullTextLengths();
    filterReadMoreListeners();
    filterButtonListeners();
}

function filterSetFullTextLengths() {
    $('.ventu-filter-full-text-container').each(function () {
        $(this).css('height', 0);
    })
}

function filterReadMoreListeners() {
    $('.ventu-filter-read-more').click(function () {
        var section = $(this).parent().parent();

        var fullText = section.find('.ventu-filter-full-text-container');
        $(this).toggleClass('ventu-filter-read-more--open');

        if ($(this).hasClass('ventu-filter-read-more--open')) {
            fullText.css('height', 'auto');
        } else {
            fullText.css('height', 0);
        }

        setTimeout(function () {
            $('#ventu-filter-content').animate({ scrollTop: section.prop('offsetTop') }, 'slow');
        }, 1);

    });

    if (window.ventu.config.device.type === 0) {
        $('#ventu-filters').hide();
    }
}

function filterButtonListeners() {
    $('.ventu-filter-button-container .btn').on('click', function (e) {
        e.preventDefault();

        window.filter.execute();
    });
}
