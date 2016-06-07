$(window).ready(function() {

    window.ventuConfig = {
        whatScreen: whatScreen(),
        overlay: false
    };
    window.ventu = new Ventu();
    ventu.initElements();
    ventu.measure();
    // prevent responsiveness effects for static stack
    ventu.config.sizes.body.height = 600;
    ventu.createStatic();
    ventu.buildStackShade();

    initMap();
    initForm();
    initLightbox();
    initFavorites();
    initTooltips();
    setMainImage();
});