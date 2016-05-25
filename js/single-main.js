$(window).ready(function(){
    window.ventu = new Ventu();
    ventu.initElements();
    // prevent responsiveness effects for static stack
    ventu.sizes.body = {
        width: 500,
        height: 600
    };
    ventu.sizes.container = 500;
    ventu.createStatic();

    initSettings();
    initMap();
    initForm();
    initLightbox();
    initFavorites();
});