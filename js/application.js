$(window).ready(function(){
    window.ventu = new App('application');
    filterListeners();
    mapListeners();
    ventu.init();

    if (window.environment.autostart) {
        ventu.select('1077 Amsterdam (postcode)', 'poly');
    }

    menuListeners();
    select2();
});