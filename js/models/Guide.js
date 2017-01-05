function Guide(app) {
    this.app = app;
    this.guide = null;
}

Guide.prototype.hint = function(type) {

};

Guide.prototype._append = function(text, position, direction) {
    var self = this,
        close;
    this._remove();
    this.guide = $('<div class="ventu-guide ventu-guide-' + direction + '">' + text + '</div>');
    close = $('<div class="ventu-guide-button ventu-guide-close""><div class="ventu-guide-button-sub">got it.</div><div class="ventu-icon ventu-icon-remove ventu-icon-box ventu-icon-remove ventu-icon-med"></div></div>');
    this.guide.css({
        left: position[0],
        top: position[1]
    });
    this.guide.append(close);
    close.on('click', function () {
        self._remove()
    });


    $('body').append(this.guide);
    this.guide.fadeIn(100);
};

Guide.prototype._remove = function() {
    if (this.guide) {
        var guide = this.guide;
        guide.fadeOut(100);
        this.guide = null;
        setTimeout(function(){
            guide.remove();
        }, 150)
    }

};