$(window).ready(function(){
    window.ventu = new App('application');
    filterListeners();
    mapListeners();
    ventu.init();

});