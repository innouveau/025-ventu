// all these are called from the specific main.js page
// fullscreen & continue button

function setFullscreenAndContinueButton() {
    var panelHeight = $(window).outerHeight();
    $('#ventu-dialog-entry').css('height', panelHeight);
    addContinueListener(panelHeight);
}

function addContinueListener(panelHeight) {
    $('.ventu-continue-button').click(function(){
        $('html, body').animate({
            scrollTop: panelHeight
        }, 500);
    })
}

function slidePanelListener() {
    $('.ventu-slide-panel-label').click(function(){
        $(this).parent().toggleClass('ventu-slide-panel--inactive');
    })
}


$(window).ready(function(){
    $('.ventu-card-button--share').popover({
        container: 'body',
        html: true,
        placement: 'top',
        trigger: 'click',
        content: function () {
            return '<div class="not-in-team"><ul><li><a class="to-teamstack" href="javascript:void(0);" data-team="8E335D59-B7C3-41E3-AF40-33292663B7FB" data-object="7b53a68f-6d0a-4903-87e4-7324bda7d439" data-user="c9ac20fc-88a6-4e52-9513-afbd4310dbcc"><span class="ventu-icon ventu-icon--in-text ventu-icon--add"></span>Nieuw kantoor voor Ventu.nl</a> </li> <li><a class="to-teamstack" href="javascript:void(0);" data-team="0F8A7755-B5FB-4022-AD80-1816D529A361" data-object="7b53a68f-6d0a-4903-87e4-7324bda7d439" data-user="c9ac20fc-88a6-4e52-9513-afbd4310dbcc"><span class="ventu-icon ventu-icon--in-text ventu-icon--follow"></span>Calcasa verhuist in Delft</a> </li> </ul></div>';
        }
    });
});
