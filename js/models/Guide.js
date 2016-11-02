function Guide(app) {
    this.app = app;
    this.guide = null;
}

Guide.prototype.hint = function(type) {
    var text,
        position,
        direction;
    switch (type) {
        case 'swiping':
            text = 'Je kunt de kaarten ook swipen.<br>Als je de kaart naar rechts sleept en dan los laat, belandt hij in je interesselijst.<br><br>Als je naar links sleept vind je hem niet interessant.';
            position = [($(window).outerWidth() - 1000), 300];
            direction = 'right';
            break;
        case 'filter':
            text = 'Gebruik de filters om je selectie te verkleinen.';
            position = [220, 150];
            direction = 'top';
            break;
    }
    this._append(text, position, direction);
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




// Guide.prototype.init = function() {
//     // TODO check if every parent has a 'position' set, otherwise position absolute won't work
//     $('.ventu-overlay').fadeIn(500);
//     this.play(0);
//     this.body = $('body').outerWidth();
// };
//
// Guide.prototype.play = function(n) {
//     var guide,
//         prev,
//         wait = 0,
//         filterBox,
//         self = this;
//     guide = $('.ventu-guide-' + n);
//
//     if (window.ventuConfig.whatScreen < 3) {
//         if (window.ventuConfig.whatScreen === 0) {
//             // if the guide is inside the filter and we are in mobile modus
//             // we need to open the filter overlay first.
//             // overlay transition is 0.5s, check style.css
//             if (guide.parents('.ventu-filter').length) {
//                 if (!window.ventuConfig.overlay) {
//                     wait += 550;
//                     openFilterOverlay();
//                 }
//             } else if (window.ventuConfig.overlay) {
//                 wait += 550;
//                 closeFilterOverlay();
//             }
//         }
//         // if the guide is inside a filterbox we need to open it first
//         // filterbox transition is 0.5s (checks style.css)
//         filterBox = guide.parents('.ventu-filter-box');
//         if (filterBox.length) {
//             if ($(filterBox[0]).hasClass('closed')) {
//                 openFilterBox($(filterBox[0]));
//                 wait += 550;
//             }
//         }
//     }
//
//     prev = $('body > .ventu-guide-' + (n - 1));
//     if (prev) {
//         this.fadeOut(prev);
//     }
//     setTimeout(function(){
//         self.append(guide, n);
//     }, wait);
// };
//
// Guide.prototype.append = function(guide, n) {
//     var parent = guide.parent(),
//         x = parent.offset().left,
//         y = parent.offset().top,
//         offset = this.getOffset(guide),
//         clone = this.clone(guide),
//         endX = x + offset.x,
//         maxWidth;
//     if (endX < this.padding) {
//         endX = this.padding;
//     }
//     maxWidth = this.body - endX - this.padding;
//     if (clone.hasClass('ventu-guide-last')) {
//         clone.append(this.button.close);
//     } else {
//         clone.append(this.button.close);
//         clone.append(this.getButton(n));
//     }
//     clone.appendTo('body');
//     clone.css({
//         left: endX,
//         top: (y + offset.y),
//         'max-width': maxWidth
//     });
//     clone.fadeIn(500);
// };
//
// Guide.prototype.clone = function(element) {
//     // we make a copy, so the reference stays in its position (the copy is attatched to the body)
//     // so we can reuse it
//     return element.clone();
// };
//
// Guide.prototype.fadeOut = function(element) {
//     element.fadeOut(500);
//     setTimeout(function(){
//         element.remove();
//     }, 550);
// };
//
// Guide.prototype.getOffset = function(element) {
//     var offset = {};
//     if (element.hasClass('ventu-guide-left')) {
//         offset.x = 50;
//         offset.y = -40;
//         if (element.hasClass('ventu-guide-big')) {
//             offset.y = -75;
//         }
//     }
//     if (element.hasClass('ventu-guide-right')) {
//         offset.x = -300;
//         offset.y = 50;
//     }
//     if (element.hasClass('ventu-guide-top')) {
//         offset.x = -100;
//         offset.y = 70;
//     }
//     if (element.hasClass('ventu-guide-bottom')) {
//         offset.x = -140;
//         offset.y = -160;
//     }
//     if (element.attr('x')) {
//         offset.x += parseInt(element.attr('x'))
//     }
//     if (element.attr('y')) {
//         offset.y += parseInt(element.attr('y'))
//     }
//     return offset;
// };
//
// Guide.prototype.getButton = function(n) {
//     return $('<div class="ventu-guide-button ventu-guide-next" onclick="guide.play(' + (n + 1) + ')"><div class="ventu-icon ventu-icon-next ventu-icon-box ventu-icon-next ventu-icon-med"></div></div>');
// };
//
//
// Guide.prototype.stop = function() {
//     $('.ventu-guide').fadeOut(500);
//     $('.ventu-overlay').fadeOut(500);
//     setTimeout(function(){
//         // remove all clones
//         $('body > .ventu-guide').remove();
//     }, 550);
// };



