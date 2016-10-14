function Card(app, building, marker, index, launchType) {
    this.app = app;
    this.building = building;
    this.marker = marker;
    this.launchType = launchType;
    this.index = index;
    this.rotate = index === 0 ? 0 : 15 * Math.random() - 7.5;
    this.element = null;
    this.shade = null;
    this.hammer = null;
    this.buttons = {
        love: null,
        hate: null,
        detail: null
    };
    this._create(launcher);
    this._addListener();
}

Card.prototype._create = function(launcher) {
    var self = this,
        content = this.building.getContent(),
        card,
        buttonBar,
        shade,
        thisTransform = launcher ? this._getMarkerTransform() : [0,0,0,0,0,0,1,1];
    card = $('<div class="ventu-card">' +
        '<div class="ventu-card-image ventu-triangle ventu-triangle-bottom ventu-triangle-white" style="background-image:url(' + content.image + ')"></div>' +
        '<div class="ventu-card-text">' + content.text.head + '</div>');
    buttonBar = $('<div class="ventu-card-buttons"></div>');
    this.buttons.love = $('<div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-love"><div class="ventu-ripple"></div></div><span>interessant</span></div>');
    this.buttons.hate = $('<div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-hate"><div class="ventu-ripple"></div></div><span>niet interessant</span></div>');
    this.buttons.detail = $('<div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-details"><div class="ventu-ripple"></div></div><span>laat details zien</span></div>');
    this.buttons.love.click(function(){

    });
    buttonBar.append(this.buttons.hate);
    buttonBar.append(this.buttons.detail);
    buttonBar.append(this.buttons.love);
    shade = $('<div class="ventu-card-shade"></div>');

    card.append(buttonBar);

    // bind actions to buttons
    (function(self) {
        self.buttons.love.on('click', function () {
            self.love();
        });
        self.buttons.hate.on('click', function () {
            self.hate();
        });
        self.buttons.detail.on('click', function () {
            self.detail();
        });
    })(self);
    this._setTransform(card, thisTransform);
    this._setTransform(shade, this._projectShade(thisTransform));
    card.hide();
    shade.hide();
    this.element = card;
    this.shade = shade;
    this.app.domElements.stack.append(shade);
    this.app.domElements.stack.append(card);
};

Card.prototype.launch = function() {
    var self = this;
    this.element.show();
    this.shade.show();

    switch (this.launchType) {
        case 0:
            this.element.addClass('slow-transition');
            this.shade.addClass('slow-transition');
            // launch
            setTimeout(function () {
                self.toOrigin();
            }, 100);
            // float
            setTimeout(function () {
                self.float();
            }, 2200);
            setTimeout(function () {
                self._launchNext();
            }, 3200);
            break;
        case 1:
            this._launchNext();
            break;
        case 2:
            this.float();
            setTimeout(function () {
                self._launchNext();
            }, 2200);
    }
};

Card.prototype._launchNext = function() {
    var next = this._next();
    if (next) {
        next.launch();
    }
};

Card.prototype._next = function() {
    var parent = this.app.map,
        index = parent.cards.indexOf(this);
    if (parent.cards[index + 1]) {
        return parent.cards[index + 1];
    } else {
        return null;
    }
};



// moves

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
        rotZ = dx / 20;
    this.element.addClass('no-transition');
    this.shade.addClass('no-transition');
    this._setTransform(this.element, [x, y, 0, rotX, rotY, rotZ, 1, 1]);
    this._setTransform(this.shade, [0.5*x+50, 0.5*y+100, -50, 0, 0, 0.5*rotZ, (1 - Math.abs(x/1000)), (1 - Math.abs(y/1000))]);
};

Card.prototype.toOrigin = function() {
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this._setTransform(this.element, [0,0,0,0,0,0,1,1]);
    this._setTransform(this.shade, [0,50,-50,0,0,0,1,1]);
    this._releaseContainers();
};

Card.prototype.love = function (dx, dy) {
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this._setTransform(this.element, [100,600,-200,0,0,0, 0.5,0.5]);
    this._setTransform(this.shade, [100,550,-200,0,0,0, 0.5,0.5]);

    // var currentObject = this.objects[this.currentObjectIndex];
    // if (currentObject) {
    //     this.app.service.post('LikeObject', currentObject.UniqueId);
    //     this.app.service.sessionStore(this.favObjects);
    //     this.favObjects.unshift(currentObject);
    // }
    //
    // this.objects.splice(this.currentObjectIndex, 1);
    // this.currentObjectIndex = 0;
    //
    // var card = $('.ventu-card.current');
    // this.moveCard(card, true);
    // this.cards--;
    // this.favorites++;
    // this.shine();
    // this.count(this.cards);
    // this.setCurrent();
};

Card.prototype.hate = function(dx, dy) {
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this._setTransform(this.element, [-100,600,-200,0,0,0, 0.5,0.5]);
    this._setTransform(this.shade, [-100,550,-200,0,0,0, 0.5,0.5]);

    // var currentObject = this.objects[this.currentObjectIndex];
    // if (currentObject) {
    //     this.app.service.post('DislikeObject', currentObject.UniqueId);
    //     this.app.hateObjects.unshift(this.objects[this.objects.length - 1]);
    // }
    //
    // this.objects.splice(this.currentObjectIndex, 1);
    // this.currentObjectIndex = 0;
    //
    // var card = $('.ventu-card.current');
    // this.moveCard(card, false);
    // this.cards--;
    // this.count(this.cards);
    // this.setCurrent();
};

Card.prototype.suggest = function(dx, dy) {
    if (Math.abs(dx) > dy) {
        if (dx > 0) {
            this.app.domElements.loveContainer.addClass('selected');
            this.app.domElements.hateContainer.removeClass('selected');
        } else {
            this.app.domElements.hateContainer.addClass('selected');
            this.app.domElements.loveContainer.removeClass('selected');
        }
    } else {
        this._releaseContainers();
    }
};

Card.prototype._releaseContainers = function (){
    this.app.domElements.hateContainer.removeClass('selected');
    this.app.domElements.loveContainer.removeClass('selected');
};

Card.prototype.destroy = function() {
    this.element.remove();
    this.shade.remove();
};



// helpers

Card.prototype._getMarkerTransform = function() {
    var firstMarker = this.marker,
        position = firstMarker.getPixelCoordinates(),
        windowWidth = $(window).outerWidth(),
        markerWidth = 48,
        cardWidth = 500,
        padding = 40,
        translateX = windowWidth - padding - (0.5 * cardWidth) - position.x - 1,
        translateY = padding,
        scale = markerWidth / cardWidth;
    return [-translateX, -translateY, 0, 0, 0, 0, scale, scale];
};



Card.prototype._getTransform = function(transform) {
    return 'translateZ(' + (transform[2] - this.index * 100) + 'px) ' +
        'translateY(' + transform[1] + 'px) ' +
        'translateX(' + transform[0] + 'px) ' +
        'rotateX(' + transform[3] + 'deg) ' +
        'rotateY(' + transform[4] + 'deg) ' +
        'rotateZ(' + (transform[5] + this.rotate) + 'deg) ' +
        'scale(' + transform[6] + ',' + transform[7] + ')';
};

Card.prototype._setTransform = function(element, trnsf) {
    var transform = this._getTransform(trnsf);
    element.css({
        "webkitTransform": transform,
        "MozTransform": transform,
        "msTransform": transform,
        "OTransform": transform,
        "transform": transform
    });
};

Card.prototype._projectShade = function(transform) {
    return [
        0.8 * transform[0] + 50,
        0.8 * transform[1] + 100,
        transform[2],
        0,
        0,
        0,
        transform[6],
        transform[7]
    ];
};

Card.prototype._addListener = function() {
    var self = this;
    this.hammer = Hammer(this.element[0]);

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
                self.love(dx, dy);
            } else if (dx < -self.app.config.swipe) {
                self.hate(dx, dy);
            } else {
                if (dy > 200) {
                    self.seeDetail();
                } else {
                    self.toOrigin();
                }
            }
        }
    });
};