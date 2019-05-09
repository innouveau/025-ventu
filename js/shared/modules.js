function initialiseModules() {

    // only when not on Error page or else we'll create a redirect loop
    // if (window.location.href.indexOf('Error') === -1) {
    //     // try to detect if we can use session and local storage
    //     try {
    //         // try to use localStorage
    //         $.sessionStorage.set('ventu-session-storage', []);
    //     } catch (e) {
    //         // there was an error so...
    //         window.location = '/Error/PrivateMode';
    //         return;
    //     }
    // }

    if (window.ventuApi === undefined) {
        window.ventuApi = new VentuApi();
    }

    var screen = whatScreen();

    //if (screen > 0) {
        $('.ventu-dialog').each(function () {
            new Dialog($(this));
        });
    //}

    $('.ventu-search').each(function(){
        // we want the search module initialis by hand
        // to add the custom callback
        if (!$(this).hasClass('initialise-manually')) {
            new Search($(this));
        }
    });

    $('.ventu-search-open').click(function (e) {
        if ($(e.target).hasClass('ventu-search-open')) {
            if (window.ventu.config.device.type === 0) {
                window.ventu.closeFilter();
            }

            $(this).toggleClass('ventu-search-open--opened');
            $(this).find('.ventu-search-results').empty();

            if (!(navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)))) {
                $(this).find('.ventu-search input').focus();
            }

            $(this).find('.ventu-search input').val('');
        }
    });

    $('.ventu-tools-button--erase').click(function (e) {

        if (window.ventu.config.device.type === 0) {
            window.ventu.closeFilter();
        }

        $('.ventu-search-open').trigger('click');
    });

    $('a.navbar-brand').click(function (e) {
        e.preventDefault();

        window.ventuApi.setSearchFilter(null, window.ventuApi.getDefaultSearchFilter(), true);

        location.href = '/';
    });

    if (screen > 2) {
        $('.ventu-affix').each(function () {
            new Affix($(this));
        });
    }
}

function sanitizeAreaInput(el) {
    // @walstra heb jij een mening of we nog meer moeten checken hier, gaat over
    // de oppervlakte waarden
    var value = el.val();
    if (!isNaN(value) && value.length > 0) {
        el.parent().removeClass('ventu-slider-area-picker--error');
        return {
            value: value,
            valid: true
        }
    } else {
        el.parent().addClass('ventu-slider-area-picker--error');
        return {
            value: null,
            valid: false
        }
    }
}