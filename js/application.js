$(window).ready(function () {

    if (SearchUtil)
    {
        var timeout = SearchUtil.fetchingResources ? 500 : 0;

        setTimeout(function () {
            SearchUtil.getResources('Ventu2.LocalResources.Application');
        }, timeout);
    }

    function loadApplication() {

        window.ventu = new App('application');
        filterListeners();
        mapListeners();
        ventu.init();

        if (window.environment.autostart) {
            if (window.autoSearchFilter) {
                ventu.select(window.autoSearchFilter, true);
            }
        }

        menuListeners();
        select2();
    }

    setTimeout(function () { loadApplication(); }, 250);

    $('.clear-session').click(function (e) {
        e.preventDefault();

        $.sessionStorage.remove('ventu-favorites');
        $.sessionStorage.remove('ventu-trash');

        if (window.location.hostname.indexOf('ventu.nl') == -1 && window.location.hostname.indexOf('esteo.nl') == -1) {
            $.sessionStorage.remove('ventu-primary-usage-ids');
            $.sessionStorage.remove('ventu-search-result');
            $.sessionStorage.remove('ventu-search-text');
        }

        ventu.service.ajaxPost('/Account/ClearStacks', null);

        window.location.reload();
    });

    $('.dropdown').hover(
        function () { $(this).addClass('open') },
        function () { $(this).removeClass('open') }
    );

    $(document).on("click", '.ventu-card a.details', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var self = $(this);

        var ripple = $(this).find('.ventu-ripple');
        if (ripple.length > 0) {
            ripple[0].style.webkitAnimation = 'none';
            ripple[0].style.mozAnimation = 'none';
            ripple[0].style.oAnimation = 'none';
            ripple[0].style.animation = 'none';

            setTimeout(function () {
                ripple[0].style.webkitAnimation = '';
                ripple[0].style.mozAnimation = '';
                ripple[0].style.oAnimation = '';
                ripple[0].style.animation = '';
            }, 50);
        }

        setTimeout(function () {
            location.href = self.attr('href');
        }, 1000);
    });
});