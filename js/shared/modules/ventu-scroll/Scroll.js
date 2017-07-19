function Scroll() {
    this.element = $('#ventu-scroll-anchors');
    this.top = 0;
    this.anchors = [];
    this.init();
}

Scroll.prototype.init = function() {
    this.top = this.getPosition();
    this.addListener();
    this.findAnchors();
};

Scroll.prototype.addListener = function() {
    var self = this;

    $(window).scroll(function(){
        var scroll = $(this).scrollTop();
        self.move(scroll);
    })
};

Scroll.prototype.findAnchors = function() {
    var self = this;
    $('a.ventu-scroll-anchor').each(function(){
        self.anchors.push(new Anchor(self, $(this)))
    })
};

Scroll.prototype.move = function() {
    var navbar = 60,
        scroll = $(window).scrollTop() + navbar;
    if (scroll > this.top) {
        this.element.addClass('ventu-scroll-anchors--fixed');
    } else {
        this.element.removeClass('ventu-scroll-anchors--fixed');
    }
};


Scroll.prototype.getPosition = function() {
    return this.element.offset().top;
};