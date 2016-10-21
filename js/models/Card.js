function Card(app, marker, building, index) {
    this.app = app;
    this.marker = marker;
    this.building = building;
    this.launchType = this._getLaunchType(index);
    this.index = index;
    this.position = this._getPosition(index);


    this.element = null;
    this.shade = null;
    this.hammer = null;
    this.buttons = {
        love: null,
        hate: null
    };
    this._create();
    this._addListener();
}

Card.prototype._create = function() {
    var self = this,
        content = this.building.getCardContent(),
        card,
        buttonBar,
        shade;
    card = $('<div class="ventu-card">' +
        '<div class="ventu-card-image ventu-triangle ventu-triangle-bottom ventu-triangle-white" style="background-image:url(' + content.image + ')"></div>' +
        '<div class="ventu-card-text"><h4>' + content.text.sub + '</h4><h3>' + content.text.head + '</h3>' +
        '<div class="ventu-card-text-content"><div class="ventu-card-text-content-half">' + content.text.list + '</div>' +
        '<div class="ventu-card-text-content-half">' + content.text.address + '<br><br><a href="' + content.text.detailLinkUrl + '">Lees meer</a></div></div>' +
        '</div>');
    buttonBar = $('<div class="ventu-card-buttons"></div>');
    this.buttons.love = $('<div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-love"><div class="ventu-ripple"></div></div><span>interessant</span></div>');
    this.buttons.hate = $('<div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-hate"><div class="ventu-ripple"></div></div><span>niet interessant</span></div>');
    buttonBar.append(this.buttons.hate);
    buttonBar.append(this.buttons.love);
    shade = $('<div class="ventu-card-shade"></div>');

    card.append(buttonBar);

    // bind actions to buttons
    (function(self) {
        self.buttons.love.on('click', function () {
            self.addToList('love');
        });
        self.buttons.hate.on('click', function () {
            self.addToList('hate');
        });
    })(self);

    if (this.index === 0) {
        shade.css('opacity', 1);
    }
    card.hide();
    shade.hide();
    this.element = card;
    this.shade = shade;
    this.app.domElements.stack.append(shade);
    this.app.domElements.stack.append(card);
    this.marker.hasCard = true;
};

Card.prototype._getPosition = function(index) {
    return {
        rotate: index === 0 ? 0 : this.app.config.card.rotation * Math.random() - (this.app.config.card.rotation / 2),
        zIndex: index * this.app.config.card.zOffset,
        shift: index * this.app.config.card.shift
    }
};

Card.prototype._getLaunchType = function(index) {
    if (window.environment.launchAll || (index === 0 && window.environment.intro)) {
        return 0;
    } else {
        return 1;
    }
};

Card.prototype.launch = function(type) {
    var self = this,
        thisTransform;
    if (!type) {
        type = this.launchType;
    }
    thisTransform = type === 0 ? this._getMarkerTransform() : [0,0,0,0,0,0,1,1];
    // start position
    this._setTransform(this.element, thisTransform, false);
    this._setTransform(this.shade, this._projectShade(thisTransform, false), false);


    switch (type) {
        case 0:
            this.element.addClass('no-transition').fadeIn(500, function(){
                $(this).removeClass('no-transition')
            });
            this.shade.addClass('no-transition').fadeIn(500, function(){
                $(this).removeClass('no-transition')
            });
            this.element.addClass('slow-transition');
            this.shade.addClass('slow-transition');

            // launch
            setTimeout(function () {
                // keep the rotation
                self.toOrigin(false);
            }, 100);

            // launch next
            setTimeout(function () {
                self.element.removeClass('slow-transition');
                self.shade.removeClass('slow-transition');
                self._launchNext();
            }, 150);
            break;
        case 1:
            var wait = 500;
            this.element.addClass('no-transition').fadeIn(wait, function(){
                $(this).removeClass('no-transition')
            });
            this.shade.addClass('no-transition').fadeIn(wait, function(){
                $(this).removeClass('no-transition')
            });
            setTimeout(function () {
                self._launchNext();
            }, (0.5 * wait));
            break;
        case 2:
            this.element.addClass('no-transition').fadeIn(500, function(){
                $(this).removeClass('no-transition')
            });
            this.shade.addClass('no-transition').fadeIn(500, function(){
                $(this).removeClass('no-transition')
            });
            this.float();
            setTimeout(function () {
                self._launchNext();
            }, 2200);
    }

    // float
    if (this.index === 0) {
        setTimeout(function () {
            self.float();
        }, (self.app.map.cards.length * 150 + 1000));
    }
};

Card.prototype._launchNext = function() {
    var next = this._next();
    if (next) {
        next.launch();
    }
};


Card.prototype._next = function() {
    var index = this._getIndex();
    if (this.app.map.cards[index + 1]) {
        return this.app.map.cards[index + 1];
    } else {
        return null;
    }
};

Card.prototype._getIndex = function() {
    return this.app.map.cards.indexOf(this);
};

Card.prototype._remove = function() {
    var index = this._getIndex();
    this.app.map.cards.splice(index, 1);
};



// moves

Card.prototype.topOfStack = function() {
    this.position.rotate = 0;
    this.position.zIndex = 0;
    this.position.shift = 0;
    this.shade.css('opacity', 1);
    this.marker.select();
    this.toOrigin(true);
};

Card.prototype.float = function() {
    var self = this;
    this.element.addClass('ventu-card-float');
    this.shade.addClass('ventu-card-shade-float');
    setTimeout(function(){
        self._clearfloat();
    }, 4000)
};

Card.prototype._clearfloat = function() {
    this.element.removeClass('ventu-card-float');
    this.shade.removeClass('ventu-card-shade-float');
};


Card.prototype.drag = function(dx, dy) {
    var x = dx,
        y = dy,
        rotY = dx / 5,
        rotX = dy / -5,
        rotZ = dx / 20,
        transform = [x, y, 0, rotX, rotY, rotZ, 1, 1];
    this.element.addClass('no-transition');
    this.shade.addClass('no-transition');
    this._setTransform(this.element, transform, false);
    this._setTransform(this.shade, this._projectShade(transform, true), false);
};

Card.prototype.toOrigin = function(unrotate) {
    var transform = [0,0,0,0,0,0,1,1];
    if (unrotate) {
        this.position.rotate = 0;
    }
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this._setTransform(this.element, transform, false);
    this._setTransform(this.shade, this._projectShade(transform, true), false);
    this._releaseContainers();
};

Card.prototype.addToList = function (type) {
    var self = this,
        config = this.app.config.sizes.bottomBar[type],
        scale = config.width / this.app.config.sizes.card.width,
        transform = [config.x,config.y,0,0,0,0,scale,scale],
        other = type === 'love' ? 'hate' : 'love',
        next = this._next();
    this.app.list[type].element.main.addClass('selected');
    this.app.list[other].element.main.removeClass('selected');
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this._setTransform(this.element, transform, true);
    this._setTransform(this.shade, transform, true);
    this.element.find('.ventu-card-text').fadeOut(500);
    this.element.find('.ventu-card-buttons').fadeOut(500);
    this.marker.remove();
    this.app.map.createNewCard();

    setTimeout(function(){
        self.app.list[type].add(self);
        if (next) {
            next.topOfStack();
        }
    }, 800);

};

Card.prototype.detail = function () {
    this.toOrigin(true);
    location.href = this.building.getContent().text.detailLinkUrl;
};


Card.prototype.suggest = function(dx, dy) {
    if (Math.abs(dx) > dy) {
        if (dx > this.app.config.swipe) {
            this.app.list.love.element.main.addClass('selected');
            this.app.list.hate.element.main.removeClass('selected');
        } else if (dx < -this.app.config.swipe) {
            this.app.list.hate.element.main.addClass('selected');
            this.app.list.love.element.main.removeClass('selected');
        } else {
            this._releaseContainers();
        }
    } else {
        this._releaseContainers();
    }
};

Card.prototype._releaseContainers = function (){
    this.app.list.love.element.main.removeClass('selected');
    this.app.list.hate.element.main.removeClass('selected');
};

Card.prototype.destroy = function() {
    this.element.remove();
    this.shade.remove();
};



// helpers

Card.prototype._getMarkerTransform = function() {
    var position = this.marker.getPixelCoordinates(),
        windowWidth = $(window).outerWidth(),
        markerWidth = 48,
        cardWidth = 500,
        padding = 40,
        translateX = windowWidth - padding - (0.5 * cardWidth) - position.x - 1,
        translateY = padding,
        scale = markerWidth / cardWidth;
    return [-translateX, -translateY, 0, 0, 0, 0, scale, scale];
};



Card.prototype._getTransform = function(transform, netto) {
    var rotate = this.position.rotate,
        shift = this.position.shift,
        z = this.position.zIndex;
    if (netto) {
        rotate = 0;
        shift = 0;
        z = 0;
    }
    return 'translateX(' + (transform[0] + shift) + 'px) ' +
        'translateY(' + (transform[1] + shift) + 'px) ' +
        'translateZ(' + (transform[2] - z) + 'px) ' +
        'rotateX(' + transform[3] + 'deg) ' +
        'rotateY(' + transform[4] + 'deg) ' +
        'rotateZ(' + (transform[5] + rotate) + 'deg) ' +
        'scale(' + transform[6] + ',' + transform[7] + ')';
};

Card.prototype._setTransform = function(element, trnsf, netto) {
    var transform = this._getTransform(trnsf, netto);
    element.css({
        "webkitTransform": transform,
        "MozTransform": transform,
        "msTransform": transform,
        "OTransform": transform,
        "transform": transform
    });
};

Card.prototype._projectShade = function(transform, rotate) {
    var rotZ, scaleX, scaleY, depthFactor = 0.8;
    if (transform[6] < 0.8) {
        // reduce x shift for scaled (= closer to the ground)
        depthFactor = 1 - (transform[6] / 10);

    }
    if (rotate) {
        rotZ = 0.5 * transform[5];
        scaleX = (1.2 - Math.abs(transform[0]/1000));
        scaleY = (1.2 - Math.abs(transform[1]/1000));
    } else {
        rotZ = 0;
        scaleX = transform[6];
        scaleY = transform[7];
    }
    return [
        depthFactor * transform[0] + 50,
        depthFactor * transform[1] + 50,
        transform[2] - (0.5 * this.app.config.card.zOffset),
        0,
        0,
        rotZ,
        scaleX,
        scaleY
    ];
};

Card.prototype._addListener = function() {
    var self = this;
    this.hammer = Hammer(this.element[0]);

    this.hammer.on('dragstart', function() {
        self._clearfloat();
    });

    this.hammer.on('drag', function (event) {
        if (event != null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            self.suggest(dx, dy);
            self.drag(dx, dy);
        }
    });

    this.hammer.on('release', function(event) {
        if (event != null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            //self.domElements.suggest.css('opacity', 0);

            if (dx > self.app.config.swipe) {
                self.addToList('love');
            } else if (dx < -self.app.config.swipe) {
                self.addToList('hate');
            } else {
                if (dy > 200) {
                    self.detail();
                } else {
                    self.toOrigin(true);
                }
            }
        }
    });
};