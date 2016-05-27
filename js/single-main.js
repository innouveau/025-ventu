$(window).ready(function(){
    window.ventu = new Ventu();
    ventu.initElements();
    ventu.measure();
    // prevent responsiveness effects for static stack
    ventu.sizes.body.height = 600;
    ventu.createStatic();

    initSettings();
    initMap();
    initForm();
    initLightbox();
    initFavorites();
    initTooltips();
});