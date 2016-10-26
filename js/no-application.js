$(window).ready(function(){
    window.ventu = new App('list');
    filterListeners();
    mapListeners();
    menuListeners();
    select2();
});