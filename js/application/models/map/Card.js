function Card(marker, building, index) {
    this.type = 'card';
    this.marker = marker;
    this.building = building;
    this.index = index;

    this.element = null;
    this.shade = null;

    this.buttons = {
        love: null,
        hate: null,
        readMore: null
    };
    this.status = {
        stackPosition: this._getStackPosition(index),
        transform: [0, 0, 0, 0, 0, 0, 1, 1],
        event: 'instack'
    };
    this._create();
    this._addListener();
}

Card.prototype = Object.create(_Element.prototype);

// creation

Card.prototype._create = function () {
    var self = this,
        card,
        cardFront,
        cardBlocker,
        cardBack,
        cardImage,
        cardText,
        cardHead,
        cardFeatures,
        cardButtons;

    if (window.ventuApi) {
        $(['LeesMeer', 'Interessant', 'NietInteressant']).each(function (index, resourceName) {
            $('span.' + resourceName).html(window.ventuApi.getResourceValue('Ventu3.LocalResources.Application', resourceName));
        });
    }

    card = $('<div class="ventu-card ventu-card--dynamic">');
    cardFront = $('<div class="ventu-card-front"></div>');
    cardBlocker = $('<div class="ventu-card-blocker"></div>');
    cardBack = $('<div class="ventu-card-back"></div>');
    cardImage = $('<div class="ventu-card-image" style="background-image:url(' + this.building.getCardImage() + ')"></div>');
    cardText = $('<div class="ventu-card-text">');
    cardHead = $('<div class="ventu-card-header"><h4>' + this.building.getCardCity() + '</h4><h3>' + this.building.getCardAddress() + '</h3></div>');
    cardFeatures = $('<div class="ventu-features"></div>');
    cardFeatures.append(this.building.getCardFeatures());
    cardButtons = $('<div class="ventu-card-buttons ventu-card-buttons-3"></div>');
    this.buttons.love = $('<div class="ventu-card-button-container ventu-card-button--love"><div class="ventu-card-button"><div class="ventu-card-button-icon"></div></div><div class="ventu-card-button-label"><span class="Interessant">Interessant</span></div></div></div>');
    this.buttons.readMore = $('<div class="ventu-card-button-container ventu-card-button--read-more"><div class="ventu-card-button"><div class="ventu-card-button-icon"></div></div><div class="ventu-card-button-label"><span class="LeesMeer">Lees meer</span></div></div></div>');
    this.buttons.hate = $('<div class="ventu-card-button-container ventu-card-button--hate"><div class="ventu-card-button"><div class="ventu-card-button-icon"></div></div><div class="ventu-card-button-label"><span class="NietInteressant">Niet interessant</span></div></div></div>');
    cardButtons.append(this.buttons.hate);
    cardButtons.append(this.buttons.readMore);
    cardButtons.append(this.buttons.love);
    cardText.append(cardHead);
    cardText.append(cardFeatures);
    cardFront.append(cardImage);
    cardFront.append(cardText);
    cardFront.append(cardButtons);
    cardFront.append(cardBlocker);
    card.append(cardBack);
    card.append(cardFront);



    // bind actions to buttons
    (function (self) {
        self.buttons.love.on('click', function (e) {
            self._resetAnimation($(this));

            setTimeout(function () {
                self._addToList('love');
                window.ventu.user.uses('buttons');
            }, 50);
        });
        self.buttons.hate.on('click', function (e) {
            self._resetAnimation($(this));

            setTimeout(function () {
                self._addToList('hate');
                window.ventu.user.uses('buttons');
            }, 50);
        });
        self.buttons.readMore.on('click', function (e) {
            self._resetAnimation($(this));

            setTimeout(function () {
                window.ventuApi.seeDetail(self.building.getDetailUrl());
            }, 50);
        });

    })(self);

    // first get the class
    if (this.index === 0) {
        cardBlocker.hide();
    }
    // second one is already unrotated
    else if (this.index === 1) {
        this.status.stackPosition.rotate = 0;
    }

    card.hide();
    this.element = card;

    window.ventu.domElements.stack.prepend(this.element);
    if (settings.card.shade) {
        this.shade = new Shade(this, card);
    }

    if (window.ventu.config.isMapPresent) {
        this.marker.hasCard = true;
    }
};

Card.prototype._addListener = function () {
    var self, hammer;
    self = this;
    hammer = Hammer(this.element[0]);

    hammer.on('dragstart', function () {
        self._stopFloat();
        window.ventu.user.didFindOut('swiping');
    });

    hammer.on('drag', function (event) {
        if (event !== null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            self._swipeHint(dx, dy);
            self._drag(dx, dy);
        }
    });

    hammer.on('release', function (event) {
        self._removeHoverTriggers();
        if (event !== null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            if (dx > window.ventu.config.swipe.complete) {
                self._addToList('love');
            } else if (dx < -window.ventu.config.swipe.complete) {
                self._addToList('hate');
            } else if (dy > window.ventu.config.swipe.complete) {
                self._swipeDown();
            } else {
                self._backToOrigin(true);
            }
        }
    });
};



// 3d movements

Card.prototype._setCurrent = function () {
    var next;

    this.status.stackPosition.rotate = 0;
    this.status.stackPosition.zIndex = window.ventu.config.card.sealevel;
    this.status.stackPosition.shadeZindex = window.ventu.config.card.sealevel - window.ventu.config.card.zGap + 2;
    this.status.stackPosition.shiftX = 0;
    this.status.stackPosition.shiftY = 0;

    if (this.shade) {
        this.shade.element.fadeIn(100);
    }
    if (window.ventu.config.isMapPresent) {
        this.marker.select();
    }
    this._backToOrigin(true);
    this.marker.parent.currentCard = this;
    this.element.find('.ventu-card-blocker').fadeOut(200);
    // already unrotate the next card (for nicer effect)
    next = this._getNext();
    if (next) {
        next._backToOrigin(true);
        //next.element.addClass('ventu-card--current');
    }
};

Card.prototype.launch = function (type) {
    var self = this,
        wait = window.ventu.map.cards.length * 150 + 1000,
        thisTransform = type === 'cool' ? this.marker.getTransform() : [0, 0, 0, 0, 0, 0, 1, 1];
    // start position
    this.setTransform(thisTransform, false);
    if (this.shade) {
        this.shade.project(thisTransform, false);
    }

    switch (type) {
        case 'cool':
            this._coolLaunch();
            break;
        case 'normal':
            this._normalLaunch();
            break;
    }

    // float
    if (this.index === 0 && !window.ventu.user.askIfDidSee('cardFloat') && window.environment.floatFirst) {
        setTimeout(function () {
            self._float();
            window.ventu.user.didSee('cardFloat');
        }, wait);
    }
};

Card.prototype._normalLaunch = function () {
    var self = this,
        wait = 250;
    this.element.addClass('no-transition').fadeIn(wait, function () {
        $(this).removeClass('no-transition')
    });

    setTimeout(function () {
        self._launchNext();
    }, (0.5 * wait));
};

Card.prototype._coolLaunch = function () {
    var self = this,
        next;
    this.element.addClass('no-transition').fadeIn(500, function () {
        $(this).removeClass('no-transition')
    });

    if (this.shade) {
        this.shade.element.fadeIn();
    }

    this.element.addClass('slow-transition');

    // launch
    setTimeout(function () {
        // keep the rotation
        self._backToOrigin(false);
    }, 100);

    // launch next
    setTimeout(function () {
        self.element.removeClass('slow-transition');

        next = self._launchNext();
        if (!next) {
            // update user when the last card is launched
            window.ventu.user.didSee('cardLaunch');
        }
    }, 150);

    // update user
    window.ventu.user.didSee('cardLaunch');
};

Card.prototype._float = function () {
    var self = this;
    this.element.addClass('ventu-card-float');
    if (this.shade) {
        this.shade.element.addClass('ventu-card-shade-float');
    }
    setTimeout(function () {
        self._stopFloat();
    }, 4000)
};

Card.prototype._launchNext = function () {
    var next = this._getNext();
    if (next) {
        next.launch('normal');
        return true;
    } else {
        return false;
    }
};




// 2d movements

Card.prototype._drag = function (dx, dy) {
    var x = dx,
        y = dy,
        rotY = dx / 5,
        rotX = dy / -5,
        rotZ = dx / 20,
        transform = [x, y, 0, rotX, rotY, rotZ, 1, 1];
    this.element.addClass('no-transition');
    this.status.transform = transform;
    if (this.shade) {
        this.shade.element.addClass('no-transition');
    }
    this.setTransform(transform, false);
    if (this.shade) {
        this.shade.project(transform, true);
    }
};

Card.prototype._backToOrigin = function (unrotate) {
    var transform = [0, 0, 0, 0, 0, 0, 1, 1];
    this._swipeRelease();
    if (unrotate) {
        this.status.stackPosition.rotate = 0;
    }
    this.element.removeClass('no-transition');
    if (this.shade) {
        this.shade.element.removeClass('no-transition');
    }
    this.setTransform(transform, false);
    if (this.shade) {
        this.shade.project(transform, true);
    }
};

Card.prototype._stopFloat = function () {
    this.element.removeClass('ventu-card-float');
    if (this.shade) {
        this.shade.element.removeClass('ventu-card-shade-float');
    }
};



// swiping

Card.prototype._swipeHint = function (dx, dy) {
    if (dx > window.ventu.config.swipe.complete) {
        // love complete
        this._swipeHintType('love', 'hate', dx);
    } else if (dx > 0) {
        // love almost
        this._swipeHintType('love', 'hate', dx);
    } else if (dx < -window.ventu.config.swipe.complete) {
        // hate complete
        this._swipeHintType('hate', 'love', -dx);
    } else if (dx < 0) {
        // hate almost
        this._swipeHintType('hate', 'love', -dx);
    } else {
        this._swipeRelease();
    }

};

Card.prototype._swipeHintType = function (type, other, value) {
    var perc = Math.min(((value / window.ventu.config.swipe.complete) * 100), 100);
    $('#ventu-bottom-bar-' + type + ' .ventu-bottom-bar-sub-status').css('width', perc + '%');
    $('#ventu-bottom-bar-' + other + ' .ventu-bottom-bar-sub-status').css('width', 0)
};

Card.prototype._swipeRelease = function () {
    $('#ventu-bottom-bar-love .ventu-bottom-bar-sub-status').css('width', 0);
    $('#ventu-bottom-bar-hate .ventu-bottom-bar-sub-status').css('width', 0)
};



// administration

Card.prototype._addToList = function (type) {
    var self = this,
        transform,
        map = this.marker.parent,
        next = this._getNext();

    this._swipeRelease();
    this.status.event = 'tolist';

    // fade out and remove
    transform = this.status.transform;
    transform[0] *= 2; // increase x offset
    transform[3] /= 3; // decline rotations
    transform[4] /= 3;
    transform[5] /= 3;
    transform[6] = 0;
    transform[7] = 0;

    this.element.removeClass('no-transition');
    this.setTransform(transform, false);
    if (this.shade) {
        this.shade.project(transform, false);
    }
    setTimeout(function () {
        self.element.remove();
        self.shade.element.remove();
    }, 1500);

    // update markers
    if (window.ventu.config.isMapPresent) {
        this.marker.hasCard = false;
        if (type === 'love') {
            this.marker.love();
        } else {
            this.marker.hate();
        }
        window.ventu.map.createNewCard();
    }

    // update user
    window.ventu.user.uses('rating');

    // update bottom bar
    map.status.left--;
    map.status[type]++;
    map.updateBottomBar();
    map.updateBottomBarType(type);

    // trigger next
    setTimeout(function () {
        if (next && next.status.event !== 'tolist') {
            next._setCurrent();
        }
    }, settings.card.speed.next);
};

Card.prototype._swipeDown = function () {
    this._backToOrigin(true);
    window.ventuApi.seeDetail(this.building.getDetailUrl());
};


Card.prototype.destroy = function (removeFormArray) {
    var index;
    if (removeFormArray) {
        index = window.ventu.map.cards.indexOf(this);
        if (index > -1) {
            window.ventu.map.cards.splice(index, 1);
        }
    }

    this.element.remove();
    if (this.shade) {
        this.shade.element.remove();
    }
};




// getters

Card.prototype._getStackPosition = function () {
    var gap = this.index === 0 ? 0 : window.ventu.config.card.zGap,
        zIndex = window.ventu.config.card.sealevel + (this.index * -window.ventu.config.card.zOffset) - gap;
    return {
        rotate: this.index === 0 ? 0 : window.ventu.config.card.rotation * Math.random() - (window.ventu.config.card.rotation / 2),
        zIndex: zIndex,
        shiftX: window.ventu.config.device.type === 0 ? 0 : this.index * window.ventu.config.card.shift, // no shfits for mobile, only rotate
        shiftY: window.ventu.config.device.type === 0 ? 0 : this.index * window.ventu.config.card.shift
    }
};

Card.prototype._getNext = function () {
    var map = this.marker.parent,
        index = map.cards.indexOf(this);
    if (map.cards[index + 1]) {
        return map.cards[index + 1];
    } else {
        return null;
    }
};



// other

Card.prototype._resetAnimation = function (button) {
    var ripple = button.find('.ventu-ripple');
    if (ripple.length > 0) {
        ripple[0].style.webkitAnimation = 'none';
        ripple[0].style.mozAnimation = 'none';
        ripple[0].style.oAnimation = 'none';
        ripple[0].style.animation = 'none';

        setTimeout(function () {
            ripple[0].style.webkitAnimation = '';
            ripple[0].style.mozAnimation = '';
            ripple[0].style.oAnimation = '';
            ripple[0].style.animation = '';
        }, 10);
    }
};

Card.prototype._removeHoverTriggers = function () {
    $('.ventu-bottom-bar-icon--hate').css({
        'width': '',
        'height': ''
    })
};

// @walstra: wat doet dit?
Array.prototype.move = function (pos1, pos2) {
    // local variables
    var i, tmp;
    // cast input parameters to integers
    pos1 = parseInt(pos1, 10);
    pos2 = parseInt(pos2, 10);
    // if positions are different and inside array
    if (pos1 !== pos2 &&
        0 <= pos1 && pos1 <= this.length &&
        0 <= pos2 && pos2 <= this.length) {
        // save element from position 1
        tmp = this[pos1];
        // move element down and shift other elements up
        if (pos1 < pos2) {
            for (i = pos1; i < pos2; i++) {
                this[i] = this[i + 1];
            }
        }
        // move element up and shift other elements down
        else {
            for (i = pos1; i > pos2; i--) {
                this[i] = this[i - 1];
            }
        }
        // put element from position 1 to destination
        this[pos2] = tmp;
    }
};