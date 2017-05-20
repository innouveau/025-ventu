function Card(marker, building, index) {
    this.marker = marker;
    this.building = building;
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
    this.status = {
        event: 'instack'
    };
    this._create();
    this._addListener();
}

Card.prototype._create = function () {

    if (SearchUtil) {
        $(['LeesMeer', 'Interessant', 'NietInteressant']).each(function (index, resourceName) {
            function completed(resourceValue) {
                $('span.' + resourceName).html(resourceValue);
            }
            SearchUtil.getResourceValue('Ventu2.LocalResources.Application', resourceName, completed);
        });
    }

    var self = this,
        content = this.building.getCardContent(),
        card,
        cardImage,
        cardText,
        cardHead,
        cardFeatures,
        cardButtons,
        shade;

    card = $('<div class="ventu-card ventu-card--dynamic">');
    cardImage = $('<div class="ventu-card-image" style="background-image:url(' + content.image + ')"></div>');
    cardText = $('<div class="ventu-card-text">');
    cardHead = $('<div class="ventu-card-header"><h4>' + content.text.sub + '</h4><h3>' + content.text.head + '</h3></div>');
    cardFeatures = $('<div class="ventu-features"></div>');
        //  +
        //  +
        //     '<div class="ventu-card-text-content">' +
        //         '<div class="ventu-card-text-content-half">' + content.text.list + '</div>' +
        //         '<div class="ventu-card-text-content-half">' + content.text.address + '<a class="details" href="' + content.text.detailLinkUrl + '"><div class="ventu-card-button-icon ventu-icon ventu-icon-details"><div class="ventu-ripple"></div></div><span class="LeesMeer">Lees meer</span></a></div>' +
        //     '</div>' +
        // '</div>');
    cardButtons = $('<div class="ventu-card-buttons"></div>');
    this.buttons.love = $('<div class="ventu-card-button-container"><div class="ventu-card-button ventu-card-button--love"><div class="ventu-card-button-icon"></div></div><div class="ventu-card-button-label">Interessant</div></div></div>');
    this.buttons.hate = $('<div class="ventu-card-button-container"><div class="ventu-card-button ventu-card-button--hate"><div class="ventu-card-button-icon"></div></div><div class="ventu-card-button-label">Niet interessant</div></div></div>');
    cardButtons.append(this.buttons.hate);
    cardButtons.append(this.buttons.love);
    cardText.append(cardHead);
    cardText.append(cardFeatures);
    card.append(cardImage);
    card.append(cardText);
    card.append(cardButtons);

    shade = $('<div class="ventu-card-shade"></div>');

    // bind actions to buttons
    (function (self) {
        self.buttons.love.on('click', function (e) {
            self.resetAnimation($(this));

            setTimeout(function () {
                self._addToList('love');
                window.ventu.user.uses('buttons');
            }, 500);
        });
        self.buttons.hate.on('click', function (e) {
            self.resetAnimation($(this));

            setTimeout(function () {
                self._addToList('hate');
                window.ventu.user.uses('buttons');
            }, 500);
        });
    })(self);

    if (this.index === 0) {
        //shade.css('opacity', 1);
    }
    card.hide();
    //shade.hide();
    this.element = card;
    this.shade = shade;

    window.ventu.domElements.stack.prepend(card);
    // if (window.ventu.config.device.type > 0) {
    //     card.insertAfter($('.ventu-bottom-bar-sub-hate'));
    //     shade.insertAfter($('.ventu-bottom-bar-sub-hate'));
    // } else {
    //     window.ventu.domElements.stack.prepend(card);
    //     //window.ventu.domElements.stack.prepend(shade);
    // }

    if (window.ventu.config.isMapPresent) {
        this.marker.hasCard = true;
    }
};

Card.prototype.resetAnimation = function (element) {
    var ripple = element.find('.ventu-ripple');
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

Card.prototype.launch = function (type) {
    var self = this,
        thisTransform;
    if (!type) {
        if (window.ventu.user.askIfDidSee('cardLaunch') || !window.ventu.config.isMapPresent) {
            type = 'soft';
        } else {
            type = 'cool'
        }
    }
    thisTransform = type === 'cool' ? this.marker.getTransform() : [0, 0, 0, 0, 0, 0, 1, 1];
    // start position
    this._setTransform(this.element, thisTransform, false);

    if (window.ventu.config.device.type > 0) {
        this._setTransform(this.shade, this._projectShade(thisTransform, false), false);
    }

    switch (type) {
        case 'cool':
            this._coolLaunch();
            break;
        case 'soft':
            this._softLaunch();
            break;
    }

    // float
    if (this.index === 0 && !window.ventu.user.askIfDidSee('cardFloat') && window.environment.floatFirst) {
        setTimeout(function () {
            self._moveFloat();
            window.ventu.user.didSee('cardFloat');
        }, (window.ventu.map.cards.length * 150 + 1000));
    }
};

Card.prototype._softLaunch = function () {
    var self = this,
        wait = 500;
    this.element.addClass('no-transition').fadeIn(wait, function () {
        $(this).removeClass('no-transition')
    });

    if (window.ventu.config.device.type > 0) {
        this.shade.addClass('no-transition').fadeIn(wait, function () {
            $(this).removeClass('no-transition')
        });
    }

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

    if (window.ventu.config.device.type > 0) {
        this.shade.addClass('no-transition').fadeIn(500, function () {
            $(this).removeClass('no-transition')
        });
    }

    this.element.addClass('slow-transition');

    if (window.ventu.config.device.type > 0) {
        this.shade.addClass('slow-transition');
    }

    // launch
    setTimeout(function () {
        // keep the rotation
        self._moveToOrigin(false);
    }, 100);

    // launch next
    setTimeout(function () {
        self.element.removeClass('slow-transition');

        if (window.ventu.config.device.type > 0) {
            self.shade.removeClass('slow-transition');
        }

        next = self._launchNext();
        if (!next) {
            // update user when the last card is launched
            window.ventu.user.didSee('cardLaunch');
        }
    }, 150);

    // update user
    //window.ventu.user.didSee('cardLaunch');
};

Card.prototype._launchNext = function () {
    var next = this._getNext();
    if (next) {
        next.launch();
        return true;
    } else {
        return false;
    }
};



// moves

Card.prototype.swap = function () {

    var self = this,
        topCard = window.ventu.map.currentCard,
        originalX = this.position.shiftX;
    // pull both horizontal out of stack
    topCard.position.shiftX = -500;
    this.position.shiftX = 500;
    topCard._moveToStackPosition();
    this._moveToStackPosition();

    setTimeout(function () {

        topCard._unsetCurrent(self.position.rotate, self.position.zIndex, originalX, self.position.shiftY, self.position.shadeZindex);
        self._setCurrent();

        if (window.ventu.config.device.type > 0) {
            window.ventu.domElements.stack.append(self.shade);
        }
        window.ventu.domElements.stack.append(self.element);

        self.marker.parent.cards.move(self.index, 0);

        $(self.marker.parent.cards).each(function (index, card) {
            if (card != null) {
                card.index = index;
                card.position = card._getPosition(index);
                card._moveToStackPosition();
            }
        });

    }, 500);
};

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

Card.prototype._moveToStackPosition = function () {
    console.log('move');
    var thisTransform = [0, 0, 0, 0, 0, 0, 1, 1];
    this._setTransform(this.element, thisTransform, false);

    if (window.ventu.config.device.type > 0) {
        this._setTransform(this.shade, this._projectShade(thisTransform, false), false);
    }
};

// todo compare this function with above. Double?
Card.prototype._moveToOrigin = function (unrotate) {
    var transform = [0, 0, 0, 0, 0, 0, 1, 1];
    if (unrotate) {
        this.position.rotate = 0;
    }
    this.element.removeClass('no-transition');
    if (window.ventu.config.device.type > 0) {
        this.shade.removeClass('no-transition');
    }
    this._setTransform(this.element, transform, false);
    if (window.ventu.config.device.type > 0) {
        this._setTransform(this.shade, this._projectShade(transform, true), false);
    }
    this._releaseContainers();
};


Card.prototype._moveFloat = function () {
    var self = this;
    this.element.addClass('ventu-card-float');
    if (window.ventu.config.device.type > 0) {
        this.shade.addClass('ventu-card-shade-float');
    }
    setTimeout(function () {
        self._clearfloat();
    }, 4000)
};

Card.prototype._moveDrag = function (dx, dy) {
    var x = dx,
        y = dy,
        rotY = dx / 5,
        rotX = dy / -5,
        rotZ = dx / 20,
        transform = [x, y, 0, rotX, rotY, rotZ, 1, 1];
    this.element.addClass('no-transition');
    if (window.ventu.config.device.type > 0) {
        this.shade.addClass('no-transition');
    }
    this._setTransform(this.element, transform, false);
    if (window.ventu.config.device.type > 0) {
        this._setTransform(this.shade, this._projectShade(transform, true), false);
    }
};

// Card.prototype.detail = function () {
//     this._moveToOrigin(true);
//     location.href = this.building.getContent().text.detailLinkUrl;
// };


Card.prototype._swipeHint = function (dx, dy) {
    if (dx > window.ventu.config.swipe.complete) {
        if (window.ventu.config.isCatcherPresent) {
            window.ventu.list.love.element.main.addClass('selected');
            window.ventu.list.hate.element.main.removeClass('selected');
        }
    } else if (dx > window.ventu.config.swipe.suggest) {
        this.buttons.love.addClass('hover');
    } else if (dx < -window.ventu.config.swipe.complete) {
        if (window.ventu.config.isCatcherPresent) {
            window.ventu.list.hate.element.main.addClass('selected');
            window.ventu.list.love.element.main.removeClass('selected');
        }
    } else if (dx < -window.ventu.config.swipe.suggest) {
        this.buttons.hate.addClass('hover');
    } else {
        this._releaseContainers();
        this._removeHoverTriggers();
    }

};







// helpers

Card.prototype._projectShade = function (transform, rotate) {
    var rotZ,
        scaleX,
        scaleY,
        depthFactor = 0.8;
    if (transform[6] < 0.8) {
        // reduce x shift for scaled (= closer to the ground)
        depthFactor = 1 - (transform[6] / 10);

    }


    if (rotate) {
        rotZ = 0.5 * transform[5];
        scaleX = (1.2 - Math.abs(transform[0] / 1000));
        scaleY = (1.2 - Math.abs(transform[1] / 1000));
    } else {
        rotZ = 0;
        scaleX = transform[6];
        scaleY = transform[7];
    }
    return [
        depthFactor * transform[0] + 50,
        depthFactor * transform[1] + 50,
        this.position.shadeZindex,
        0,
        0,
        rotZ,
        scaleX,
        scaleY
    ];
};



Card.prototype._addListener = function () {
    var self = this;
    this.hammer = Hammer(this.element[0]);

    this.hammer.on('dragstart', function () {
        self._clearfloat();
        window.ventu.user.didFindOut('swiping');
    });

    this.hammer.on('drag', function (event) {
        if (event != null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            self._swipeHint(dx, dy);
            self._moveDrag(dx, dy);
        }
    });

    this.hammer.on('release', function (event) {
        self._removeHoverTriggers();
        if (event != null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;

            if (dx > window.ventu.config.swipe.complete) {
                self._addToList('love');
            } else if (dx < -window.ventu.config.swipe.complete) {
                self._addToList('hate');
            } else {
                self._moveToOrigin(true);
            }
        }
    });
};




// setters

Card.prototype._setCurrent = function () {
    this.position.rotate = 0;
    this.position.zIndex = window.ventu.config.card.sealevel;
    this.position.shadeZindex = window.ventu.config.card.sealevel - window.ventu.config.card.zGap + 2;
    this.position.shiftX = 0;
    this.position.shiftY = 0;

    if (window.ventu.config.device.type > 0) {
        this.shade.fadeIn(100);
    }
    if (window.ventu.config.isMapPresent) {
        this.marker.select();
    }
    this._moveToOrigin(true);
    window.ventu.map.currentCard = this;
};

Card.prototype._unsetCurrent = function (rotate, zIndex, shiftX, shiftY, shadeZindex) {
    this.position.rotate = rotate;
    this.position.zIndex = zIndex;
    this.position.shadeZindex = shadeZindex;
    this.position.shiftX = shiftX;
    this.position.shiftY = shiftY;
    this._moveToStackPosition();
    if (window.ventu.config.isMapPresent) {
        this.marker.unselect();
    }
};

Card.prototype._setTransform = function (element, trnsf, netto) {
    var transform = this._getTransform(element, trnsf, netto);
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

Card.prototype.getName = function () {
    // used for testing only
    return this.building.getCardContent().text.head;
};

Card.prototype._getPosition = function (index) {
    var gap = index === 0 ? 0 : window.ventu.config.card.zGap,
        zIndex = window.ventu.config.card.sealevel + (index * -window.ventu.config.card.zOffset) - gap,
        shadeZindex = index === 0 ? window.ventu.config.card.sealevel - window.ventu.config.card.zGap + 2 : zIndex - window.ventu.config.card.zOffset;
    return {
        rotate: index === 0 ? 0 : window.ventu.config.card.rotation * Math.random() - (window.ventu.config.card.rotation / 2),
        zIndex: zIndex,
        shadeZindex: shadeZindex,
        shiftX: window.ventu.config.device.type === 0 ? 0 : index * window.ventu.config.card.shift, // no shfits for mobile, only rotate
        shiftY: window.ventu.config.device.type === 0 ? 0 : index * window.ventu.config.card.shift
    }
};

Card.prototype._getNext = function () {
    var index = this._getIndex();
    if (window.ventu.map.cards[index + 1]) {
        return window.ventu.map.cards[index + 1];
    } else {
        return null;
    }
};

Card.prototype._getIndex = function () {
    return window.ventu.map.cards.indexOf(this);
};

Card.prototype._getTransform = function (element, transform, netto) {
    var rotate = this.position.rotate,
        shiftX = this.position.shiftX,
        shiftY = this.position.shiftY,
        z = element === this.element ? this.position.zIndex : this.position.shadeZindex;
    if (netto) {
        rotate = 0;
        shiftX = 0;
        shiftY = 0;
        z = window.ventu.config.card.sealevel - window.ventu.config.card.zGap + 2;
    }
    return 'translateX(' + (transform[0] + shiftX) + 'px) ' +
        'translateY(' + (transform[1] + shiftY) + 'px) ' +
        'translateZ(' + z + 'px) ' +
        'rotateX(' + transform[3] + 'deg) ' +
        'rotateY(' + transform[4] + 'deg) ' +
        'rotateZ(' + (transform[5] + rotate) + 'deg) ' +
        'scale(' + transform[6] + ',' + transform[7] + ')';
};








// administration

Card.prototype._clearfloat = function () {
    this.element.removeClass('ventu-card-float');
    if (window.ventu.config.device.type > 0) {
        this.shade.removeClass('ventu-card-shade-float');
    }
};

Card.prototype._releaseContainers = function () {
    if (window.ventu.config.isCatcherPresent) {
        window.ventu.list.love.element.main.removeClass('selected');
        window.ventu.list.hate.element.main.removeClass('selected');
    }
};

Card.prototype._removeHoverTriggers = function () {
    this.buttons.hate.removeClass('hover');
    this.buttons.love.removeClass('hover');
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
    if (window.ventu.config.device.type > 0) {
        this.shade.remove();
    }
};

Card.prototype._remove = function () {
    var index = this._getIndex();
    window.ventu.map.cards.splice(index, 1);
};

Card.prototype._addToList = function (type) {
    var self = this,
        config = window.ventu.config.sizes.bottomBar[type],
        scale = config.width / window.ventu.config.sizes.card.width * 0.99, // perspective correction
        transform = [config.x, config.y, 0, 0, 0, 0, scale, scale],
        other = type === 'love' ? 'hate' : 'love',
        next = this._getNext();
    this.status.event = 'tolist';
    if (window.ventu.config.isCatcherPresent) {
        window.ventu.list[type].element.main.addClass('selected');
        window.ventu.list[other].element.main.removeClass('selected');
    }
    this.element.removeClass('no-transition');
    if (window.ventu.config.device.type > 0) {
        this.shade.removeClass('no-transition');
    }
    this._setTransform(this.element, transform, true);
    if (window.ventu.config.device.type > 0) {
        this._setTransform(this.shade, transform, true);
    }

    if (window.ventu.config.isCatcherPresent) {
        this.element.find('.ventu-card-text').fadeOut(500);
        this.element.find('.ventu-card-buttons').fadeOut(500);
    } else {
        this.element.fadeOut(400);
        if (window.ventu.config.device.type > 0) {
            this.shade.fadeOut(400);
        }
    }

    //if (window.ventu.config.isMapPresent) {
    //    this.marker.remove();
    //}


    if (window.ventu.config.isMapPresent) {
        this.marker.hasCard = false;
        if (type === 'love') {
            this.marker.favorite();
        } else {
            this.marker.trash();
        }

        window.ventu.map.createNewCard();
    }

    // update user
    window.ventu.user.uses('rating');

    setTimeout(function () {
        //window.ventu.list[type].add(self);
        if (next && next.status.event !== 'tolist') {
            next._setCurrent();
        }
    }, 800);
};