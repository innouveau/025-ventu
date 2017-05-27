$(window).ready(function(){

    $('.ventu-hangout-tip').each(function(){
        var hangoutTip = $(this),
            closeButton = $('<div class="ventu-hangout-tip-close"></div>');
        // console.log(hangoutTip);
        hangoutTip.append(closeButton);

        closeButton.click(function(){
            hangoutTip.fadeOut(200);
        })

    });


})
