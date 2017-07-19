$(window).ready(function() {
    var screen = whatScreen();

    if (screen === 0) {
        new Scroll();
    }

    initialiseModules();
    initialiseModals();
    setFullscreenAndContinueButton();
    addPopoverListenerForShare();


});

function addPopoverListenerForShare() {
    $('#shareButton').popover({
        container: 'body',
        html: true,
        placement: 'top',
        trigger: 'click',
        template: '<div class="popover popover--grey-dark" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        content: function () {
            return '<div id="socialMedia" class=""><ul class="social-media-icons"><li><a href="https://www.facebook.com/sharer.php?p%5Btitle%5D=Ga+naar+ventu.nl+voor+Le+Mirage%2c+Vliegend+Hertlaan++15-97+te+Utrecht%2c+Kantoor%2c+3.432+m%26sup2%3b+%23Vanaf%23+150m%26sup2%3b%2c+te+Huur&amp;p%5Burl%5D=http%3a%2f%2flocalhost%3a49841%2fProject%2fUtrecht%2fVliegend-Hertlaan%2f15-97%2f937e7273-d7d1-4e72-a5e5-afc9b47f8572&amp;s=100&amp;p%5Bimages%5D%5B0%5D=https%3a%2f%2fventu.nl" rel="nofollow" target="_blank"><img src="img/icons/social-media/facebook.svg">Facebook</a></li><li><a href="https://www.linkedin.com/shareArticle?mini=true&amp;url=http%3a%2f%2flocalhost%3a49841%2fProject%2fUtrecht%2fVliegend-Hertlaan%2f15-97%2f937e7273-d7d1-4e72-a5e5-afc9b47f8572&amp;title=Ga+naar+ventu.nl+voor+Le+Mirage%2c+Vliegend+Hertlaan++15-97+te+Utrecht%2c+Kantoor%2c+3.432+m%26sup2%3b+%23Vanaf%23+150m%26sup2%3b%2c+te+Huur&amp;source=https%3A%2F%2Fventu.nl" rel="nofollow" target="_blank"><img src="img/icons/social-media/linked-in.svg">LinkedIn</a></li><li><a href="https://twitter.com/intent/tweet/?url=https%3a%2f%2fnaar.ventu.nl%2fRTIEA&amp;text=Ga+naar+ventu.nl+voor+Le+Mirage%2c+Vliegend+Hertlaan++15-97+te+Utrecht%2c+Kantoor%2c+3.432+m2+%23Vanaf%23+150m2%2c+te+Huur&amp;via=VentuOnline" rel="nofollow" target="_blank"><img src="img/icons/social-media/twitter.svg">Twitter</a></li><li><a href="https://plus.google.com/share?url=http%3a%2f%2flocalhost%3a49841%2fProject%2fUtrecht%2fVliegend-Hertlaan%2f15-97%2f937e7273-d7d1-4e72-a5e5-afc9b47f8572" rel="nofollow" target="_blank"><img src="img/icons/social-media/google.svg">Google plus </a> </li> <li> <a href="https://pinterest.com/pin/create/button/?url=http%3a%2f%2flocalhost%3a49841%2fProject%2fUtrecht%2fVliegend-Hertlaan%2f15-97%2f937e7273-d7d1-4e72-a5e5-afc9b47f8572&amp;media=https%3a%2f%2fventu.nl" target="_blank" count-layout="horizontal"><img src="img/icons/social-media/pinterest.svg">Pinterest</a></li></ul> </div>';
        }
    });
}