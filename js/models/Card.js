function Card(app, building, marker, index, launchType) {
    this.app = app;
    this.building = building;
    this.marker = marker;
    this.launchType = launchType;
    this.index = index;
    this.rotate = index === 0 ? 0 : 10 * Math.random() - 5;
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
        content = this.building.getContent(),
        card,
        buttonBar,
        shade;
    card = $('<div class="ventu-card">' +
        '<div class="ventu-card-image" style="background-image:url(' + content.image + ')"></div>' +
        '<div class="ventu-card-text"><h3>' + content.text.head + '</h3>' +
        '<a href="' + content.text.detailLinkUrl + '">Lees meer</a></div>');
    buttonBar = $('<div class="ventu-card-buttons"></div>');
    this.buttons.love = $('<div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-love"><div class="ventu-ripple"></div></div><span>interessant</span></div>');
    this.buttons.hate = $('<div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-hate"><div class="ventu-ripple"></div></div><span>niet interessant</span></div>');
    this.buttons.love.click(function(){

    });
    buttonBar.append(this.buttons.hate);
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
    })(self);
    card.hide();
    shade.hide();
    this.element = card;
    this.shade = shade;
    this.app.domElements.stack.append(shade);
    this.app.domElements.stack.append(card);
};

Card.prototype.launch = function() {
    var self = this,
        thisTransform = this.launchType === 0 ? this._getMarkerTransform() : [0,0,0,0,0,0,1,1];
    this._setTransform(this.element, thisTransform, false);
    this._setTransform(this.shade, this._projectShade(thisTransform), false);
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
                self.element.removeClass('slow-transition');
                self.shade.removeClass('slow-transition');
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
    this._setTransform(this.element, [x, y, 0, rotX, rotY, rotZ, 1, 1], false);
    this._setTransform(this.shade, [0.5*x+50, 0.5*y+100, -50, 0, 0, 0.5*rotZ, (1 - Math.abs(x/1000)), (1 - Math.abs(y/1000))], false);
};

Card.prototype.toOrigin = function() {
    this.rotate = 0;
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this._setTransform(this.element, [0,0,0,0,0,0,1,1], false);
    this._setTransform(this.shade, [0,50,-50,0,0,0,1.5,1], false);
    this._releaseContainers();
};

Card.prototype.addToList = function (type) {
    var self = this,
        config = this.app.config.sizes.bottomBar[type],
        scale = config.width / this.app.config.sizes.card.width,
        transform = [config.x,config.y,0,0,0,0,scale,scale];
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this._setTransform(this.element, transform, true);
    this._setTransform(this.shade, transform, true);
    this.element.find('.ventu-card-text').fadeOut(500);
    this.element.find('.ventu-card-buttons').fadeOut(500);
    setTimeout(function(){
        self.app.list[type].add(self);
    }, 800);




    // var currentObject = this.objects[this.currentObjectIndex];
    // if (currentObject) {
    //     this.app.service.post('LikeObject', currentObject.UniqueId);
    //     this.app.service.sessionStore(this.favObjects);
    //     this.favObjects.unshift(currentObject);
    // }
    //
    // this.objects.splice(this.currentObjectIndex, 1);
    // this.currentObjectIndex = 0;

};

Card.prototype.detail = function () {
    this.toOrigin();

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
    var rotate = this.rotate,
        z = this.index * 100;
    if (netto) {
        rotate = 0;
        z = 0;
    }
    return 'translateZ(' + (transform[2] - z) + 'px) ' +
        'translateY(' + transform[1] + 'px) ' +
        'translateX(' + transform[0] + 'px) ' +
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

Card.prototype._projectShade = function(transform) {
    return [
        transform[0] + 50,
        transform[1] + 50,
        transform[2] - 50,
        0,
        0,
        0,
        1.5 * transform[6],
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
                self.addToList('love');
            } else if (dx < -self.app.config.swipe) {
                self.addToList('hate');
            } else {
                if (dy > 200) {
                    self.detail();
                } else {
                    self.toOrigin();
                }
            }
        }
    });
};