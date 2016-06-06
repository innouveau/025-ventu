function Ventu() {
    this.config = {
        card: {
            offset: 4,
            selectedPosition: 'rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0) translateX(0)'
        }
    };
    this.cards = 70;
    this.limit = 60;
    this.favorites = 0;
    this.elements = {};
    this.sizes = {
        card: {
            width: 500,
            height: 400
        }
    };
    this.swipe = {};
    this.shade = {
        selected: {
            y: 120,
            width: 0.6,
            height: 0.16
        },
        normal: {
            width: 0.22,
            height: 0.26
        }
    };
    this.drag = {
        x: 0,
        y: 0
    };
    this.hammertime = null;
    this.timer = null;
}


// init

Ventu.prototype.init = function() {
    this.initElements();
    this.measure();
    this.buildStackShade();
    this.buildNextShade();
    this.buildCard(0, this.cards);
};

Ventu.prototype.initElements = function() {
    this.elements.last =  null;
    this.elements.container = $('.ventu-stack-container');
    this.elements.favoritesCounter = $('.ventu-favorites-counter');
    this.elements.counter = $('.ventu-counter span');
    this.elements.suggest = $('.ventu-suggest');
    this.elements.loveButton = $('.ventu-love-button');
    this.elements.hateButton = $('.ventu-hate-button');
};

Ventu.prototype.measure = function() {
    this.sizes.body = {};
    this.sizes.body.width = $('body').outerWidth();
    this.sizes.body.height = $('body').outerHeight();
    this.sizes.container = {
        width: this.elements.container.outerWidth(),
        height: this.elements.container.outerHeight()
    };
    if (this.sizes.body.width > 768) {
        this.swipe.distance = 300;
    } else {
        // in mobile modus, the whole screen is the container, so it is fair
        // to make the swipe 60% of half the screen
        this.swipe.distance = 0.3 * this.sizes.container.width;
        if (this.swipe.distance < 100) {
            this.swipe.distance = 100;
        }
    }
};



// construction

Ventu.prototype.buildCard = function(i, end) {
    var transform,
        card,
        j = i + 1,
        self = this,
        time = 10;
    if (i < this.limit) {
        this.append(i);
    } else {
        time = Math.floor(1000 / i);
    }
    this.count(i);
    if (j < this.cards && j < 1000) {
        this.timer = setTimeout(function(){
            self.buildCard(j, end);
        }, time);
    } else {
        this.timer = setTimeout(function() {
            if ($('.ventu-card.current').length === 0) {
                self.timer = null;
                self.count(end);
                self.setCurrent();
            }
        }, 400);
    }
};

Ventu.prototype.append = function(i, before) {
    var transform = this.getTransform(i, 0.2, 0.2),
        card = $('<div class="ventu-card ventu-card-' + i + '">' +
                 '<div class="ventu-card-image ventu-triangle ventu-triangle-bottom ventu-triangle-light-grey"></div>' +
                 '<div class="ventu-card-text"></div>' +
                 '<div class="ventu-card-icons"></div></div>');
    this.setCSStransform(card, transform);
    if (before) {
        card.insertBefore(this.elements.last);
    } else {
        this.elements.container.append(card);
    }

};

Ventu.prototype.createStatic = function() {
    var l = this.cards;
    this.count(l);
    if (l > this.limit) {
        l = this.limit;
    }
    for (var i = 0; i < l; i++) {
        this.append(i);
    }
};

Ventu.prototype.initHammer = function(element) {
    var self = this;
    this.hammertime = Hammer(element[0]);
    this.hammertime.on('drag', function(event) {
        var dx = event.gesture.deltaX,
            dy = event.gesture.deltaY;
        if (dx > self.swipe.distance) {
            self.suggest(0);
        } else if (dx < -self.swipe.distance) {
            self.suggest(1);
        } else {
            if (dy > 200) {
                self.suggest(2);
            } else {
                self.elements.suggest.fadeOut(700);
                self.elements.loveButton.removeClass('shine');
                self.elements.hateButton.removeClass('shine');
            }
        }
        self.dragCard(element, event.gesture.deltaX, event.gesture.deltaY);
    });
    this.hammertime.on('release', function(event) {
        var dx = event.gesture.deltaX,
            dy = event.gesture.deltaY;
        self.elements.suggest.fadeOut(700);
        if (dx > self.swipe.distance) {
            self.love();
        } else if (dx < -self.swipe.distance) {
            self.hate();
        } else {
            if (dy > 200) {
                self.love();
                self.seeDetail();
            } else {
                self.releaseCard(element);
            }
        }
    });
};



// current

Ventu.prototype.setCurrent = function() {
    this.elements.last = this.getLast();
    if (this.elements.last) {
        this.launchCurrent();
    }
    // if we are above the limit, we create a card on the fly
    if (this.cards > this.limit) {
        this.append(this.limit, true);
    }

    if (this.cards <= 1) {
        this.stackIsEmpty();
    } else {
        this.stackIsNotEmpty();
    }
};

Ventu.prototype.launchCurrent = function() {
    var last = this.elements.last,
        content = this.getContent(),
        textElement = last.find('.ventu-card-text'),
        imageElement = last.find('.ventu-card-image'),
        iconElement = last.find('.ventu-card-icons'),
        self = this;
    imageElement.css('background-image', 'url(' + content.image + ')');
    textElement.html(this.buildText(content.text));
    iconElement.html(this.buildIcons(content.icons));
    setTimeout(function(){
        textElement.fadeIn(300);
    }, 400);
    // fade-in the image
    last.addClass('current');
    this.setCSStransform(last, this.config.card.selectedPosition);
    this.initHammer(last);
    this.launchShade();
    setTimeout(function(){
        self.buildNextShade();
    }, 500);
};

Ventu.prototype.buildText = function(input) {
    var text = '<h4>' + input.head + '</h4>';
    text += '<h3>' + input.sub + '</h3>';
    if (input.list.length) {
        text += '<ul>';
        for (var i = 0, l = input.list.length; i < l; i++) {
            text += '<li>' + input.list[i] + '</li>';
        }
        text += '</ul>';
    }
    return text;
};

Ventu.prototype.buildIcons = function(input) {
    var icons = '';
    for (var i = 0, l = input.length; i < l; i++) {
        icons += '<div class="ventu-icon ventu-icon-med ventu-icon-' + input[i] + '"></div>';
    }
    return icons;
};

Ventu.prototype.getContent = function() {
    // dummy content
    return {
        image: 'img/kantoor.jpg',
        text: {
            head: 'Amsterdam-Zuid',
            sub: 'De Zwanenschuur',
            list: ['Maecenas id tellus vitae', 'Ex faucibus dignissim 4.000', 'Quis non urna. Praesent at aliquet metus']
        },
        icons: ['video', 'document', '3d', 'image']
    };
};

Ventu.prototype.unsetCurrent = function() {
    var current = $('.current'),
        textElement,
        image,
        transform;
    if (current.length > 0) {
        current.removeClass('current');
        textElement = current.find('.ventu-card-text');
        textElement.html('');
        textElement.css('opacity', 0);
        current.find('.ventu-card-image').css({
            'background-image': 'none'
        });
        transform = this.getTransform(this.cards - 1, 0.2, 0.2);
        this.setCSStransform(current, transform);
        this.unsetShade();
    }
};



// events

Ventu.prototype.stackIsEmpty = function() {
    if (window.ventuConfig.whatScreen > 1) {
        this.elements.stackShade.hide();
    }
};

Ventu.prototype.stackIsNotEmpty = function() {
    if (window.ventuConfig.whatScreen > 1) {
        this.elements.stackShade.show();
    }
};

Ventu.prototype.dragCard = function(card, dx, dy) {
    var thisDx = dx,
        thisDy = dy,
        rotY = dx / 50,
        rotX = dy / -8,
        transform = 'rotateX(' + rotX + 'deg) translateZ(0) rotateY(' + rotY + 'deg) translateY(' + thisDy + 'px) translateX(' + thisDx + 'px)';
    card.addClass('no-transition');
    this.setCSStransform(card, transform);
    // shade
    if (window.ventuConfig.whatScreen > 1) {
        this.elements.shadeCurrent.addClass('no-transition');
        var shadeTransform = this.getCustomTransform(this.shade.selected.width - dy / 1500, this.shade.selected.height, this.shade.selected.y, dx);
        this.setCSStransform(this.elements.shadeCurrent, shadeTransform);
    }
};

Ventu.prototype.releaseCard = function(card) {
    card.removeClass('no-transition');
    this.setCSStransform(card, this.config.card.selectedPosition);
    // shade
    this.elements.shadeCurrent.removeClass('no-transition');
    var shadeTransform = this.getCustomTransform(this.shade.selected.width, this.shade.selected.height, this.shade.selected.y, 0);
    this.setCSStransform(this.elements.shadeCurrent, shadeTransform);
};

Ventu.prototype.love = function() {
    var card = $('.ventu-card.current');
    this.moveCard(card, true);
    this.cards--;
    this.favorites++;
    this.shine();
    this.count(this.cards);
    this.setCurrent();
};

Ventu.prototype.hate = function() {
    var card = $('.ventu-card.current');
    this.moveCard(card, false);
    this.cards--;
    this.count(this.cards);
    this.setCurrent();
};

Ventu.prototype.suggest = function(type) {
    this.elements.suggest.fadeIn(700);
    switch(type) {
        case 0:
            //this.elements.suggest.html('Love it!');
            this.elements.loveButton.addClass('shine');
            break;
        case 1:
            //this.elements.suggest.html('Nah...');
            this.elements.hateButton.addClass('shine');
            break;
        case 2:
            this.elements.suggest.html('Laat details zien...');
            break;
    }
};

Ventu.prototype.moveCard = function(card, love) {
    var transform,
        shade = this.elements.shadeCurrent,
        textElement = card.find('.ventu-card-text');
    if (love) {
        transform = 'rotateX(80deg) translateZ(-700px) translateY(-300px) translateX(1200px)';
    } else {
        transform = 'rotateX(0) rotateY(-10deg) translateZ(-100px) translateY(500px) translateX(-2000px)';
    }
    //card.removeClass('current');
    if (window.ventuConfig.whatScreen > 1) {
        shade.removeClass('no-transition current');
    }
    card.addClass('ventu-removing');
    //textElement.fadeOut(50);
    card.css({
        transition: 'all 0.6s ease-in, opacity 1s',
        opacity: 0
    });
    this.setCSStransform(card, transform);
    setTimeout(function () {
        card.remove();
        shade.remove();
    }, 500);
};

Ventu.prototype.seeDetail = function() {
    // get specific page
    window.location.href = 'single.html';
};



// stack handlers

Ventu.prototype.setStack = function(n) {
    var wait = 0,
        self = this;
    // cancel running previous processes
    if (this.timer !== null) {
        this.timer = null;
        this.restack();
        wait = 1000;
    }
    setTimeout(function(){
        if (n > self.cards) {
            self.addStack(n);
        } else if (n < self.cards) {
            self.subtractStack(n);
        }
    }, wait);
};

Ventu.prototype.addStack = function(n) {
    var q = this.cards - 1;
    this.unsetCurrent();
    this.cards = n;
    this.buildCard(q, n);
};

Ventu.prototype.subtractStack = function(n) {
    var self = this,
        set,
        rnd,
        card;
    this.unsetCurrent();

    while (this.cards > n) {
        set = $('.ventu-card');
        rnd = Math.round(set.length * Math.random());
        card = $(set[rnd]);
        if (!card.hasClass('current') && !card.hasClass('destroyed')) {
            self.destroyCard(card);
        }
    }
    setTimeout(function(){
        self.setCurrent();
    }, 2000);

    setTimeout(function(){
        self.restack();
    }, 1000);
};

Ventu.prototype.destroyCard = function(card) {
    card.addClass('destroyed');
    this.cards--;
    this.count(this.cards);
    card.css('opacity', 0);
    setTimeout(function(){
        card.remove();
    }, 500);
};

Ventu.prototype.restack = function() {
    var self = this,
        i = 0;
    $('.ventu-card').each(function() {
        if (!$(this).hasClass('current')) {
            var transform = self.getTransform(i, 0.2, 0.2);
            self.setCSStransform($(this), transform);
            i++;
        }
    });
};



// shade

Ventu.prototype.buildStackShade = function() {
    if (window.ventuConfig.whatScreen > 1) {
        var transform = this.getCustomTransform(this.shade.normal.width, this.shade.normal.height, 15, 0),
            stackShade = $('<div class="ventu-stack-shade"></div>');
        this.setCSStransform(stackShade, transform);
        this.elements.container.append(stackShade);
        this.elements.stackShade = stackShade;
    }
};

Ventu.prototype.buildNextShade = function() {
    if (window.ventuConfig.whatScreen > 1) {
        var transform = this.getCustomTransform(this.shade.normal.width, this.shade.normal.height, 15, 0),
            shade = $('<div class="ventu-shade next"></div>');
        this.setCSStransform(shade, transform);
        this.elements.container.prepend(shade);
        this.elements.shadeNext = shade;
    }
};

Ventu.prototype.launchShade = function() {
    if (window.ventuConfig.whatScreen > 1) {
        var transform = this.getCustomTransform(this.shade.selected.width, this.shade.selected.height, this.shade.selected.y, 0);
        this.elements.shadeCurrent = this.elements.shadeNext;
        this.setCSStransform(this.elements.shadeCurrent, transform);
        this.elements.shadeCurrent.addClass('current');
        this.elements.shadeCurrent.removeClass('next');
    }
};

Ventu.prototype.unsetShade = function() {
    if (window.ventuConfig.whatScreen > 1) {
        var transform = this.getCustomTransform(this.shade.normal.width, this.shade.normal.height, 0, 0),
            shade = this.elements.shade;
        this.setCSStransform(shade, transform);
        shade.removeClass('current');
        setTimeout(function() {
            shade.remove();
        }, 500);
    }
};



// helper functions

Ventu.prototype.shine = function(){
    var self = this;
    this.elements.favoritesCounter.addClass('shine');
    setTimeout(function(){
        self.elements.favoritesCounter.removeClass('shine');
    }, 500);
    // counter
    this.elements.favoritesCounter.html(this.favorites);
};

Ventu.prototype.count = function(i) {
    this.elements.counter.html(i);
};

Ventu.prototype.getLast = function() {
    var set = $('.ventu-stack-container .ventu-card');
    for (var i = (set.length - 1); i > -1; i--) {
        var card = $(set[i]);
        if (!card.hasClass('ventu-removing')) {
            return card;
        }
    }
    return null;
};

Ventu.prototype.setCSStransform = function(element, transform) {
    element.css({
        "webkitTransform": transform,
        "MozTransform": transform,
        "msTransform": transform,
        "OTransform": transform,
        "transform": transform
    });
};

Ventu.prototype.getTransform = function(i, scaleX, scaleY) {
    var verticalPosition = this.getVertical();
    return 'rotateX(80deg) ' +
        'translateZ(' + (-verticalPosition + i * this.config.card.offset) + 'px) ' +
        'translateY(' + (-0.5 * verticalPosition + i * this.config.card.offset) + 'px) ' +
        'translateX(' + ((this.sizes.container.width / 2) - (this.sizes.card.width / 2)) + 'px) ' +
        'scale(' + scaleX + ',' + scaleY + ')';
};

Ventu.prototype.getCustomTransform = function(scaleX, scaleY, shiftY, shiftX) {
    var verticalPosition = this.getVertical();
    return 'rotateX(80deg) ' +
        'translateZ(' + (-verticalPosition) + 'px) ' +
        'translateY(' + (-0.5 * verticalPosition + shiftY) + 'px) ' +
        'translateX(' + ((this.sizes.container.width / 2) - (this.sizes.card.width / 2) + shiftX) + 'px) ' +
        'scale(' + scaleX + ',' + scaleY + ')';
};

Ventu.prototype.getVertical = function(scaleX, scaleY, shiftY, shiftX) {
    var verticalPosition = this.sizes.container.height * 3.1 - 900;
    if (verticalPosition > 500) {
        return 500;
    } else {
        return verticalPosition;
    }
};



