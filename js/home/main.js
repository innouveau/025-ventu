$(window).ready(function(){

    initialiseModules();

});

function initialiseModules() {
    $('.ventu-dialog').each(function(){
        new Dialog($(this));
    });

    $('.ventu-search').each(function(){
        new Search($(this));
    });
}