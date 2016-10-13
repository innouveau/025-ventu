function Card(app, building) {
    this.app = app;
    this.building = building;
    this.element = null;
    this.shade = null;
    this.hammer = null;
    this.create();
    this.addListener();
    //this.float();
}

Card.prototype.create = function() {
    var content = this.building.getContent(),
        card = $('<div class="ventu-card">' +
            '<div class="ventu-card-image ventu-triangle ventu-triangle-bottom ventu-triangle-white" style="background-image:url(' + content.image + ')"></div>' +
            '<div class="ventu-card-text">' + content.text.head + '</div>' +
            '<div class="ventu-card-buttons"><div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-hate"><div class="ventu-ripple"></div></div><span>niet interessant</span></div><div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-details"><div class="ventu-ripple"></div></div><span>laat details zien</span></div><div class="ventu-card-button"><div class="ventu-card-button-icon ventu-icon-love"><div class="ventu-ripple"></div></div><span>interessant</span></div></div>' +
            '<div class="ventu-card-icons"></div></div>'),
        shade = $('<div class="ventu-card-shade"></div>');
    this.app.domElements.container.append(card);
    this.app.domElements.container.prepend(shade);
    this.element = card;
    this.setTransform(shade, 0,100,-100,0,0,1,1);
    this.shade = shade;
};

Card.prototype.addListener = function() {
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
                    self.release();
                }
            }
        }
    });
};

Card.prototype.float = function() {
    var self = this;
    this.element.removeClass('no-transition');
    this.element.addClass('ventu-card-float');
    setTimeout(function(){
        self._clearfloat();
    }, 4000)
};

Card.prototype._clearfloat = function() {
    this.element.addClass('no-transition');
    this.element.removeClass('ventu-card-float');
};

Card.prototype.release = function() {
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this.setTransform(this.element,0,0,0,0,0,1,1);
    this.setTransform(this.shade,0,100,-100,0,0,1,1);
};

Card.prototype.drag = function(dx, dy) {
    var x = dx,
        y = dy,
        rotY = dx / 5,
        rotX = dy / -5,
        rotZ = dx / 20;
    this.element.addClass('no-transition');
    this.shade.addClass('no-transition');
    this.setTransform(this.element, x,y,0,rotX,rotY, rotZ, 1,1);
    this.setTransform(this.shade, 0.5*x,0.5*y + 100,-100,0,0,0.5*rotZ,(1 - Math.abs(x/1000)), (1 - Math.abs(y/1000)));
};

Card.prototype.release = function() {
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this.setTransform(this.element,0,0,0,0,0,0,1,1);
    this.setTransform(this.shade,0,100,-100,0,0,0,1,1);
};

Card.prototype.love = function (dx, dy) {
    this.element.removeClass('no-transition');
    this.shade.removeClass('no-transition');
    this.setTransform(this.element,100,600,-200,0,0,0, 0.5,0.5);
    this.setTransform(this.shade,100,550,-200,0,0,0, 0.5,0.5);

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
    this.setTransform(this.element,-100,600,-200,0,0,0, 0.5,0.5);
    this.setTransform(this.shade,-100,550,-200,0,0,0, 0.5,0.5);

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
    // var text,
    //     power;
    // // detect direction
    // if (Math.abs(dx) > dy) {
    //     if (dx > 0) {
    //         text = this.app.service.translate('VindIkLeuk')
    //     } else {
    //         text = this.app.service.translate('LaatLinksLiggen');
    //     }
    //     power = dx / this.app.config.swipe;
    // } else {
    //     function completed(resourceValue) {
    //         text = resourceValue;
    //     }
    //     text = this.app.service.translate('IkWilDetailsZien');
    //     power = dy / this.app.config.swipe;
    // }
    // power = Math.abs(power);
    // power -= 0.4;
    // if (power > 1) { power = 1; }
    // else if (power < 0) { power = 0; }
    //
    // this.domElements.suggest.html(text);
    // this.domElements.suggest.css('opacity', power);
};


Card.prototype.moveCard = function(card, love) {
    var transform,
        shade = this.domElements.shadeCurrent,
        textElement = card.find('.ventu-card-text'),
        self = this;
    if (love) {
        transform = 'rotateX(80deg) translateZ(-700px) translateY(-300px) translateX(1200px)';
    } else {
        transform = 'rotateX(0) rotateY(-10deg) translateZ(-100px) translateY(500px) translateX(-2000px)';
    }
    //card.removeClass('current');
    if (this.app.config.shade.active) {
        shade.removeClass('no-transition current');
    }
    card.addClass('ventu-removing');
    //textElement.fadeOut(50);
    card.css({
        transition: 'all 0.6s ease-in, opacity 1s',
        opacity: 0
    });
    this.setTransform(card, transform);
    setTimeout(function () {
        card.remove();
        if (self.app.config.shade.active) {
            shade.remove();
        }

    }, 500);
    self.domElements.suggest.css('opacity', 0);
    self.domElements.loveButton.removeClass('shine');
    self.domElements.hateButton.removeClass('shine');
};




Card.prototype._getTransform = function(x, y, z, rotX, rotY, rotZ, scaleX, scaleY) {
    return 'translateZ(' + z + 'px) ' +
        'translateY(' + y + 'px) ' +
        'translateX(' + x + 'px) ' +
        'rotateX(' + rotX + 'deg) ' +
        'rotateY(' + rotY + 'deg) ' +
        'rotateZ(' + rotZ + 'deg) ' +
        'scale(' + scaleX + ',' + scaleY + ')';
};

Card.prototype.setTransform = function(element, x, y, z, rotX, rotY, rotZ, scaleX, scaleY) {
    var transform = this._getTransform(x, y, z, rotX, rotY, rotZ, scaleX, scaleY);
    element.css({
        "webkitTransform": transform,
        "MozTransform": transform,
        "msTransform": transform,
        "OTransform": transform,
        "transform": transform
    });
};