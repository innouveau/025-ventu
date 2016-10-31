function Card(app, marker, building, index) {
    this.app = app;
    this.marker = marker;
    this.building = building;
    this.launchType = this._getLaunchType(index);
    this.index = index;
    this.position = this._getPosition(index);
    this.transform = null;

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
            self._addToList('love');
        });
        self.buttons.hate.on('click', function () {
            self._addToList('hate');
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



Card.prototype.launch = function(type) {
    var self = this,
        thisTransform;
    if (!type) {
        type = this.launchType;
    }
    thisTransform = type === 0 ? this.marker.getTransform() : [0,0,0,0,0,0,1,1];
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
                self._moveToOrigin(false);
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
    }

    // float
    if (this.index === 0 && window.environment.floatFirst) {
        setTimeout(function () {
            self._moveFloat();
        }, (self.app.map.cards.length * 150 + 1000));
    }
};

Card.prototype._launchNext = function() {
    var next = this._getNext();
    if (next) {
        next.launch();
    }
};



// moves

Card.prototype.swop = function() {
    var self = this,
        topCard = this.app.map.currentCard,
        originalX = this.position.shiftX;
    // pull both horizontal out of stack
    topCard.position.shiftX = -500;
    this.position.shiftX = 500;
    topCard._moveToStackPosition();
    this._moveToStackPosition();

    setTimeout(function(){
        topCard._unsetCurrent(self.position.rotate, self.position.zIndex, originalX, self.position.shiftY);
        self._setCurrent();
    }, 500);
};

Card.prototype._moveToStackPosition = function() {
    var thisTransform = [0,0,0,0,0,0,1,1];
    this._setTransform(this.element, thisTransform, false);
    this._setTransform(this.shade, this._projectShade(thisTransform, false), false);
};

// todo compare this function with above. Double?
Card.prototype._moveToOrigin = function(unrotate) {
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


Card.prototype._moveFloat = function() {
    var self = this;
    this.element.addClass('ventu-card-float');
    this.shade.addClass('ventu-card-shade-float');
    setTimeout(function(){
        self._clearfloat();
    }, 4000)
};

Card.prototype._moveDrag = function(dx, dy) {
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

// Card.prototype.detail = function () {
//     this._moveToOrigin(true);
//     location.href = this.building.getContent().text.detailLinkUrl;
// };


Card.prototype._swipeHint = function(dx, dy) {
    if (dx > this.app.config.swipe.complete) {
        this.app.list.love.element.main.addClass('selected');
        this.app.list.hate.element.main.removeClass('selected');
    } else if (dx > this.app.config.swipe._swipeHint) {
        this.buttons.love.addClass('hover');
    } else if (dx < -this.app.config.swipe.complete) {
        this.app.list.hate.element.main.addClass('selected');
        this.app.list.love.element.main.removeClass('selected');
    } else if (dx < -this.app.config.swipe._swipeHint) {
        this.buttons.hate.addClass('hover');
    } else {
        this._releaseContainers();
        this._removeHoverTriggers();
    }

};







// helpers

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
            self._swipeHint(dx, dy);
            self._moveDrag(dx, dy);
        }
    });

    this.hammer.on('release', function(event) {
        self._removeHoverTriggers();
        if (event != null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            //self.domElements._swipeHint.css('opacity', 0);

            if (dx > self.app.config.swipe.complete) {
                self._addToList('love');
            } else if (dx < -self.app.config.swipe.complete) {
                self._addToList('hate');
            } else {
                if (dy < 200) {
                    self._moveToOrigin(true);
                }
            }
        }
    });
};




// setters

Card.prototype._setCurrent = function() {
    this.position.rotate = 0;
    this.position.zIndex = 0;
    this.position.shiftX = 0;
    this.position.shiftY = 0;
    this.shade.css('opacity', 1);
    this.marker.select();
    this._moveToOrigin(true);
    this.app.map.currentCard = this;
};

Card.prototype._unsetCurrent = function(rotate, zIndex, shiftX, shiftY) {
    this.position.rotate = rotate;
    this.position.zIndex = zIndex;
    this.position.shiftX = shiftX;
    this.position.shiftY = shiftY;
    this._moveToStackPosition();
    this.marker.unselect();
};

Card.prototype._setTransform = function(element, trnsf, netto) {
    var transform = this._getTransform(trnsf, netto);
    this.transform = transform;
    element.css({
        "webkitTransform": transform,
        "MozTransform": transform,
        "msTransform": transform,
        "OTransform": transform,
        "transform": transform
    });
};



// getters

Card.prototype.getName = function() {
    // used for testing only
    return this.building.getCardContent().text.head;
};

Card.prototype._getPosition = function(index) {
    return {
        rotate: index === 0 ? 0 : this.app.config.card.rotation * Math.random() - (this.app.config.card.rotation / 2),
        zIndex: index * this.app.config.card.zOffset,
        shiftX: index * this.app.config.card.shift,
        shiftY: index * this.app.config.card.shift
    }
};

Card.prototype._getLaunchType = function(index) {
    if (window.environment.launchAll || (index === 0 && window.environment.floatFirst)) {
        return 0;
    } else {
        return 1;
    }
};

Card.prototype._getNext = function() {
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

Card.prototype._getTransform = function(transform, netto) {
    var rotate = this.position.rotate,
        shiftX = this.position.shiftX,
        shiftY = this.position.shiftY,
        z = this.position.zIndex;
    if (netto) {
        rotate = 0;
        shiftX = 0;
        shiftY = 0;
        z = 0;
    }
    return 'translateX(' + (transform[0] + shiftX) + 'px) ' +
        'translateY(' + (transform[1] + shiftY) + 'px) ' +
        'translateZ(' + (transform[2] - z) + 'px) ' +
        'rotateX(' + transform[3] + 'deg) ' +
        'rotateY(' + transform[4] + 'deg) ' +
        'rotateZ(' + (transform[5] + rotate) + 'deg) ' +
        'scale(' + transform[6] + ',' + transform[7] + ')';
};








// administration

Card.prototype._clearfloat = function() {
    this.element.removeClass('ventu-card-float');
    this.shade.removeClass('ventu-card-shade-float');
};

Card.prototype._releaseContainers = function (){
    this.app.list.love.element.main.removeClass('selected');
    this.app.list.hate.element.main.removeClass('selected');
};

Card.prototype._removeHoverTriggers = function (){
    this.buttons.hate.removeClass('hover');
    this.buttons.love.removeClass('hover');
};

Card.prototype.destroy = function(removeFormArray) {
    var index;
    if (removeFormArray) {
        index = this.app.map.cards.indexOf(this);
        if (index > -1) {
            this.app.map.cards.splice(index, 1);
        }
    }
    this.element.remove();
    this.shade.remove();
};

Card.prototype._remove = function() {
    var index = this._getIndex();
    this.app.map.cards.splice(index, 1);
};

Card.prototype._addToList = function (type) {
    var self = this,
        config = this.app.config.sizes.bottomBar[type],
        scale = config.width / this.app.config.sizes.card.width * 0.99, // perspective correction
        transform = [config.x,config.y,0,0,0,0,scale,scale],
        other = type === 'love' ? 'hate' : 'love',
        next = this._getNext();
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
            next._setCurrent();
        }
    }, 800);
};