function Affix(element) {
    this.element = element;
    this.top = 0;
    this.bottom = 0;
    this.originalScroll = 0;
    this.origin = {
        top: 0,
        left: 0
    };
    this.init();
}

Affix.prototype.init = function() {
    var mainCol = $('.main-col'),
        buffer = 20,
        graphHeight = 250,
        self = this;
    this.originalScroll = $(window).scrollTop();
    this.setOrigin();

    this.top = $('nav').outerHeight() + 20;
    this.bottom = mainCol.offset().top + mainCol.outerHeight() + graphHeight + this.originalScroll - this.element.outerHeight() - buffer;


    $(window).scroll(function(){
        var scroll = $(this).scrollTop();
        self.move(scroll);
    })
};

Affix.prototype.setOrigin = function() {
    var position = this.element.offset(),
        width = this.element.outerWidth();
    this.origin.left = position.left;
    this.origin.top = position.top + this.originalScroll;

    this.element.css({
        position: 'fixed',
        left: position.left,
        top: position.top,
        width: width
    });
};

Affix.prototype.move = function(scroll) {
    var top;

    // after reaching the bottom where the content is wider again
    // move to subzero
    if (scroll > this.bottom) {
        this.element.css('top', this.bottom + this.top - scroll);
    } else {
        top = Math.max(this.top, this.origin.top - scroll);
        this.element.css('top', top);
    }
};