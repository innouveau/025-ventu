$(window).ready(function(){
    window.ventu = new App('application');
    filterListeners();
    mapListeners();
    ventu.init();

    if (window.environment.autostart) {
        ventu.select('Amsterdam (stad)', 'poly');
    }

    menuListeners();
    select2();

});