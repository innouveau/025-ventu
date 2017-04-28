
// search

function mapListeners() {

    $('.ventu-map-input').on('focus', function (e) {
        if ($(this).parents('.navbar').length) {
            $('.navbar').css('position', 'absolute');
        }
    });

    $('.ventu-map-input').on('blur', function (e) {
        if ($(this).parents('.navbar').length) {
            $('.navbar').css('position', 'absolute');
        }
    });

    $('.ventu-map-input').on('input', function () {
        if ($(this).val() !== '') {
            $(this).parent().find('.ventu-map-search-results').show();
        } else {
            $(this).parent().find('.ventu-map-search-results').hide();
        }
    });

}

function brokerListeners() {
    if (window.broker != null) {
        broker.searchBox.on('keyup', function (e) {
            e.preventDefault();
            var _value = $(this).val().trim();

            if (broker.performSeachHandler != null) {
                clearTimeout(broker.performSeachHandler)
            }

            broker.performSeachHandler = setTimeout(function () {
                broker.search(_value);
            }, broker.keystrokeTimeout);
        });

        broker.resultElement.on('click', function (e) {
            e.preventDefault();

            var _value = broker.searchBox.val().trim();
            broker.search(_value);
        });

        $('#clear-ventu-map-input').on('click', function (e) {
            e.preventDefault();

            broker.searchBox.val('');
            broker.resultElement.html('').hide();
        });
    }
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

    if (window.ventu.config.device.type === 0) {
        $('#to-filter').click(function(){
            $('body').addClass('to-filter');
            ventu.config.setTouchMove(true);
        });

        $('#to-app').click(function(){
            $('body').removeClass('to-filter');
            ventu.config.setTouchMove(false);
        });
    }
}

function closePopups() {
    $('.ventu-popup').fadeOut(100, function(){
        $('.ventu-overlay').fadeOut(100);
    });
}

function openLogin() {
    $('.navbar-collapse').collapse('hide');

    $('.ventu-overlay').fadeIn(100, function(){
        $('.ventu-login').fadeIn(100)
    })
}

function openSettings() {
    $('.navbar-collapse').collapse('hide');

    $('.ventu-overlay').fadeIn(100, function(){
        $('.ventu-settings').fadeIn(100)
    })
}




// select2

function select2() {

    if (SearchUtil) {
        var timeout = SearchUtil.fetchingResources ? 500 : 0;

        setTimeout(function () {
            function completed2(resourceValue) {
                innerSelect2(resourceValue);
            }
            SearchUtil.getResourceValue('Ventu2.LocalResources.Application', 'KiesType', completed2);
        }, timeout);
    } else {
        innerSelect2('Kies type...');
    }
}

function innerSelect2(placeholder) {
    $('select').select2({
        placeholder: placeholder,
        minimumResultsForSearch: -1,
        maximumSelectionLength: 3,
        language: {
            maximumSelected: function () {
                return 'Kies maximaal 3 types';
            }
        }
    }).on("change", function (e) {
        if (window.ventu) {

            var values = [];
            if ($('select').val() != null && $('select').val() !== undefined) {
                $.each($('select').find(":selected"), function (index, value) {
                    values.push($(value).text());
                });
            }

            window.ventu.service.filter.type = values;

            if (window.ventu.page == 'application') {
                window.ventu.service.filterUpdate();
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
