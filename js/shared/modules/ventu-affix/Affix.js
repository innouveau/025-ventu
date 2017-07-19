function Affix(element) {
    this.element = element;
    this.top = 0;
    this.bottom = 0;
    this.originalScroll = 0;
    this.mainCol = null;
    this.origin = {
        top: 0,
        left: 0
    };
    this.init();
}

Affix.prototype.init = function() {
    var self = this;

    this.mainCol = $('.main-col');
    this.top = this.getTopBoundary();
    this.bottom = this.getBottomBoundary();

    this.setOrigin();

    $(window).scroll(function(){
        var scroll = $(this).scrollTop();
        self.bottom = self.getBottomBoundary();
        self.move(scroll);
    })
};

Affix.prototype.getTopBoundary = function() {
    return $('nav').outerHeight() + 20;
};

Affix.prototype.getBottomBoundary = function() {
    var buffer = 0,
        graphHeight = 250;

    return this.mainCol.offset().top +
           this.mainCol.outerHeight() + graphHeight -
           this.element.outerHeight() -
           this.top -
           buffer;
};

Affix.prototype.setOrigin = function() {
    var position = this.element.offset(),
        width = this.element.outerWidth();
    this.origin.left = position.left;
    this.origin.top = position.top;


    this.element.css({
        position: 'fixed',
        left: position.left,
        top: this.getTop(this.originalScroll),
        width: width
    });
};

Affix.prototype.move = function() {
    this.element.css('top', this.getTop());
};

Affix.prototype.getTop = function() {
    // after reaching the bottom where the content is wider again
    // move to subzero
    var scroll = $(window).scrollTop();

    if (scroll > this.bottom) {
        return this.bottom + this.top - scroll;
    } else {
        return Math.max(this.top, this.origin.top - scroll);
    }
};