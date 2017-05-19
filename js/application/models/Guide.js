function Guide() {
    this.guide = null;
}

Guide.prototype.hint = function(type) {
    var text,
        position,
        direction;
    switch (type) {
        case 'swiping':
            text = 'Je kunt de kaarten ook swipen.<br>Als je de kaart naar rechts sleept en dan los laat, belandt hij in je interesselijst.<br><br>Als je naar links sleept vind je hem niet interessant.';
            position = window.ventu.isMobile() ? [((window.ventu.config.device.width - 300) / 2), 200] : [(window.ventu.config.device.width - 1000), 300];
            direction = window.ventu.isMobile() ? 'top' : 'right';
            break;
        case 'filter':
            text = 'Gebruik de filters om je selectie te verkleinen.';
            position = [220, 150];
            direction = 'top';
            break;
        case 'lists':
            text = 'Bekijk hier je lijst met interessante objecten';
            position = window.ventu.isMobile() ? [(window.ventu.config.device.width - 305), (window.ventu.config.device.height - 170)] : [(window.ventu.config.device.width - 375), (window.ventu.config.device.height - 170)]; // because this is bottom: attention: adjust y positin to length text
            direction = 'bottom-right';
            break;
    }

    if (type == 'filter' && window.showGoogleMapObjects == undefined) {
        this._append(text, position, direction);
    }
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

