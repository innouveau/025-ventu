function Anchor(parent, element) {
    this.parent = parent;
    this.element = element;
    this.name = this.capitalize(element.attr('name'));
    this.init();
}

Anchor.prototype.init = function() {
    var self = this,
        button = $('<div class="ventu-scroll-anchor-button">' + this.name + '</div>');
    this.parent.element.append(button);
    button.click(function(){
        self.goto();
    })
};

Anchor.prototype.goto = function() {
    $('html, body').animate({
        scrollTop: this.getPosition()
    }, 500);
};

Anchor.prototype.getPosition = function() {
    return this.element.offset().top - 100;
};

Anchor.prototype.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

