$(window).ready(function () {
    
    window.ventu = new App('');
    filterListeners();
    mapListeners();
    menuListeners();
    select2();
    window.broker = new Broker();
    broker.init(true, 2, 350);
    brokerListeners();

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

    $(".dropdown").hover(
        function () { $(this).addClass('open') },
        function () { $(this).removeClass('open') }
    );

    setTimeout(function () { document.ontouchmove = null; }, 500);    
});