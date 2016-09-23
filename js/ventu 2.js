function Ventu() {
    this.config = {
        card: {
            horizontalShift: 0, // horizontal shift card relative to container
            selectedPosition: ''
        },
        shade : {
            active: false,
            selected: {
                y: 160, // distance shade form stack
                width: 0.6,
                height: 0.16
            },
            normal: {
                width: 0.22,
                height: 0.26
            }
        },
        stack: {
            offset: 4, // pixels vertical offset inside stack
            verticalPosition :0
        },
        zoom: 0.2, // factor of magnification of stack
        swipe: 0,
        sizes: {
            card: {
                width: 0,
                height: 0
            }
        }
    };

    this.cards = 0;
    this.limit = 100; // number of cards that are represented by a div
    this.favorites = 0;
    this.elements = {};
    this.hammertime = null;
    this.timer = null;

    // JWA: added
    this.objects = [];
    this.favObjects = [];
    this.hateObjects = [];
    this.currentObjectIndex = 0;
    this.showStackIsEmptyMessage = true;
}


// init

Ventu.prototype.init = function() {
    this.initElements();
    this.measure();

    // JWA:
    // this.buildCard(0, this.cards);

    if (window.ventuConfig.whatScreen > 2) {
        this.config.shade.active = true;
        this.buildStackShade();
        this.buildNextShade();
    }
};

Ventu.prototype.redraw = function() {
    // called after window.resize
    var self = this;
    this.measure();
    this.restack();
    if (window.ventuConfig.whatScreen > 2) {
        this.config.shade.active = true;
        this.buildStackShade();
        this.buildNextShade();
    }
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
    this.config.sizes.body = {};
    this.config.sizes.body.width = $('body').outerWidth();
    this.config.sizes.body.height = $('body').outerHeight();
    this.config.sizes.container = {
        width: this.elements.container.outerWidth(),
        height: this.elements.container.outerHeight()
    };
    this.sizeCards();
    this.positionStack();
    // determine swipe distance
    if (this.config.sizes.body.width > 768) {
        this.config.swipe = 140;
    } else {
        // in mobile modus, the whole screen is the container, so it is fair
        // to make the swipe 60% of half the screen
        this.config.swipe = 0.15 * this.config.sizes.container.width;
        if (this.config.swipe < 100) {
            this.config.swipe = 60;
        }
    }
};

Ventu.prototype.sizeCards = function () {
    var cardWidth,
        cardHeight,
        maxWidth = 1500,
        ratio = 0.8,
        margin = Math.pow(0.008 * this.config.sizes.container.width, 2), // make margin exponentially bigger
        containerRatio = this.config.sizes.container.height / this.config.sizes.container.width;
    if (this.config.sizes.container.height > this.config.sizes.container.width && window.ventuConfig.whatScreen < 2) {
        // portrait mode, so we make the cards a bit portrait
        ratio = 1.3;
    }
    if (containerRatio > ratio) {
        cardWidth = this.config.sizes.container.width - (2 * margin);
        if (cardWidth > maxWidth) {
            cardWidth = maxWidth;
        }
        cardHeight = cardWidth * ratio;
    } else {
        cardHeight = this.config.sizes.container.height - (2 * margin);
        if (cardHeight > (maxWidth / ratio)) {
            cardHeight = maxWidth / ratio;
        }
        cardWidth = cardHeight / ratio;
    }
    this.config.card.horizontalShift = (this.config.sizes.container.width - cardWidth) / 2;
    this.config.card.selectedPosition = 'rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0) translateX(' + this.config.card.horizontalShift + 'px)';
    this.config.sizes.card.width = cardWidth;
    this.config.sizes.card.height = cardHeight;
    injectStyles('.ventu-card, .ventu-shade, .ventu-stack-shade { height: ' + cardHeight + 'px; width: ' + cardWidth + 'px;}');
};

Ventu.prototype.positionStack = function () {
    var verticalPosition = (this.config.sizes.container.height * 1.6) - 400,
        max = 10000;
    if (verticalPosition > max) {
        this.config.stack.verticalPosition = max;
    } else {
        this.config.stack.verticalPosition = verticalPosition;
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

    // JWA: set to this.limit
    if (j < this.cards && j < this.limit) {
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

Ventu.prototype.append = function (i, before) {
    var transform = this.getTransform(i, this.config.zoom, this.config.zoom),
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

    this.hammertime.on('drag', function (event) {
        if (event != null && event.gesture != null) { // JWA
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            self.suggest(dx, dy);
            self.dragCard(element, event.gesture.deltaX, event.gesture.deltaY);
            self.elements.loveButton.hide();
            self.elements.hateButton.hide();
        }
    });

    this.hammertime.on('release', function(event) {
        if (event != null && event.gesture != null) { // JWA
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            self.elements.suggest.css('opacity', 0);
            if (window.ventuConfig.whatScreen > 2) {
                self.elements.loveButton.show();
                self.elements.hateButton.show();
            }

            if (dx > self.config.swipe) {
                self.love();
            } else if (dx < -self.config.swipe) {
                self.hate();
            } else {
                if (dy > 200) {
                    //self.love(); // JWA
                    self.seeDetail();
                } else {
                    self.releaseCard(element);
                }
            }
        }
    });
};



// current

Ventu.prototype.setCurrent = function () {
    this.unsetCurrent();

    // JWA: if (this.cards <= 1) {
    if (this.objects.length <= 0) {
        this.stackIsEmpty();
    } else {

        this.elements.last = this.getLast();
        if (this.elements.last) {
            this.launchCurrent();
        }
        // if we are above the limit, we create a card on the fly
        if (this.cards > this.limit) {
            this.append(this.limit, true);
        }

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
    //last.attr('title', 'Swipe naar links, rechts of beneden');

    function completed(resourceValue) {
        last.attr('title', resourceValue);
    }

    SearchUtil.getResourceValue('Ventu.LocalResources.Home', 'Swipe', completed);

    this.setCSStransform(last, this.config.card.selectedPosition);
    this.initHammer(last);
    this.launchShade();
    setTimeout(function(){
        self.buildNextShade();
    }, 500);
};

Ventu.prototype.buildText = function(input) {
    var text = '<h3>' + input.head + '</h3>';
    text += '<h3>' + input.sub + '</h3>';
    if (input.list.length) {
        text += '<ul>';
        for (var i = 0, l = input.list.length; i < l; i++) {
            text += '<li>' + input.list[i] + '</li>';
        }
        text += '</ul>';
    }

    text += '<div class="detailLinkUrl"><a href="/Project/' + input.detailLinkUrl + '">Naar project details</a></div>';
    return text;
};

Ventu.prototype.buildIcons = function(input) {
    var icons = '';
    for (var i = 0, l = input.length; i < l; i++) {
        icons += '<a class="ventu-icon ventu-icon-med ventu-icon-' + input[i].style + '"  href="/Project/' + input[i].url + '"></a>';
    }
    return icons;
};

Ventu.prototype.getContent = function () {

    // JWA: added info from object
    var currentObject = this.objects[this.currentObjectIndex];

    var result = null;

    if (currentObject) {

        var hasPrimaryUsageData = currentObject.PrimaryUsage != null && currentObject.PrimaryUsage != undefined && currentObject.PrimaryUsage.length > 0;
        var hasSaleData = currentObject.SaleOrRent != null && currentObject.SaleOrRent != undefined && currentObject.SaleOrRent.length > 0;
        var hasMetrageInfo = currentObject.MetrageInfo != null && currentObject.MetrageInfo != undefined && currentObject.MetrageInfo.length > 0;
        var hasPriceInfo = currentObject.PriceInfo != null && currentObject.PriceInfo != undefined && currentObject.PriceInfo.length > 0;

        var list = [];

        if (hasPrimaryUsageData || hasSaleData) {
            list.push((hasPrimaryUsageData ? currentObject.PrimaryUsage : '') + (hasSaleData ? ' | ' + currentObject.SaleOrRent : ''));
        }

        if (hasMetrageInfo) {
            var metrageInfoText = currentObject.MetrageInfo;

            if (metrageInfoText.indexOf('#') > -1) {
                var result = metrageInfoText.match(/#(.*?)#/g).map(function (val) {
                    return val.replace(/#/g, '');
                });

                $(result).each(function (index, resourceName) {

                    function completed(resourceValue) {
                        metrageInfoText = metrageInfoText.replace('#' + resourceName + '#', resourceValue);
                    }

                    SearchUtil.getResourceValue('Ventu.LocalResources.Home', resourceName, completed);
                });
            }

            list.push(metrageInfoText);
        }

        if (hasPriceInfo) {

            var priceInfoText = currentObject.PriceInfo;

            if (priceInfoText.indexOf('#') > -1) {
                var result = priceInfoText.match(/#(.*?)#/g).map(function (val) {
                    return val.replace(/#/g, '');
                });

                $(result).each(function (index, resourceName) {

                    function completed(resourceValue) {
                        priceInfoText = priceInfoText.replace('#' + resourceName + '#', resourceValue);
                    }

                    SearchUtil.getResourceValue('Ventu.LocalResources.Home', resourceName, completed);
                });
            }

            list.push(priceInfoText);
        }

        var icons = [];
        var iconResult = { style: 'image', url: currentObject.DetailLinkUrl + '#photos' };

        // image is always available
        icons.push(iconResult);
        //icons.push('image');

        if (currentObject.BrochureUrl) {
            iconResult = { style: 'document', url: currentObject.DetailLinkUrl + '#brochure' }
            icons.push(iconResult);
            //icons.push('document');
        }

        if (currentObject.VideoUrl) {
            iconResult = { style: 'video', url: currentObject.DetailLinkUrl + '#objectmovie' }
            icons.push(iconResult);
            //icons.push('video');
        }

        if (currentObject.TourUrl) {
            iconResult = { style: 'video', url: currentObject.DetailLinkUrl + '#objectmovie' }
            icons.push(iconResult);
            //icons.push('3d');
        }

        result = {
            image: currentObject.ImageURL == null ? '/img/misc/ventu-stock-thumb.jpg' : currentObject.ImageURL,
            text: {
                head: currentObject.City,
                sub: currentObject.BuildingAddressInfo,
                list: list,
                detailLinkUrl: currentObject.DetailLinkUrl
            },
            icons: icons
        };
    }

    return result;
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
        //textElement.css('opacity', 0);
        current.find('.ventu-card-image').css({
            'background-image': 'none'
        });
        transform = this.getTransform(this.cards - 1, this.config.zoom, this.config.zoom);
        this.setCSStransform(current, transform);
        this.unsetShade();
    }
};



// events

Ventu.prototype.stackIsEmpty = function() {
    if (this.config.shade.active) {
        this.elements.stackShade.hide();
    }

    // JWA
    this.elements.loveButton.hide();
    this.elements.hateButton.hide();

    if (this.showStackIsEmptyMessage) {
        // todo show on stack...

        //$('.ventu-overlay').fadeIn(500);
        //$('#ventu-guide-filter-more').show();
    }
};

Ventu.prototype.stackIsNotEmpty = function() {
    if (this.config.shade.active) {
        this.elements.stackShade.show();
    }

    // JWA
    this.elements.loveButton.show();
    this.elements.hateButton.show();
};

Ventu.prototype.dragCard = function(card, dx, dy) {
    var thisDx = dx,
        thisDy = dy,
        rotY = dx / 50,
        rotX = dy / -8,
        transform = 'rotateX(' + rotX + 'deg) translateZ(0) rotateY(' + rotY + 'deg) translateY(' + thisDy + 'px) translateX(' + (this.config.card.horizontalShift + thisDx) + 'px)';
    card.addClass('no-transition');
    this.setCSStransform(card, transform);
    // shade
    if (this.config.shade.active) {
        this.elements.shadeCurrent.addClass('no-transition');
        var shadeTransform = this.getCustomTransform(this.config.shade.selected.width - dy / 1500, this.config.shade.selected.height, this.config.shade.selected.y, dx);
        this.setCSStransform(this.elements.shadeCurrent, shadeTransform);
    }
};

Ventu.prototype.releaseCard = function(card) {
    card.removeClass('no-transition');
    this.setCSStransform(card, this.config.card.selectedPosition);
    // shade
    if (this.config.shade.active) {
        this.elements.shadeCurrent.removeClass('no-transition');
        var shadeTransform = this.getCustomTransform(this.config.shade.selected.width, this.config.shade.selected.height, this.config.shade.selected.y, 0);
        this.setCSStransform(this.elements.shadeCurrent, shadeTransform);
    }
};

Ventu.prototype.love = function () {
    var currentObject = this.objects[this.currentObjectIndex];

    if (currentObject) {
        SearchUtil.post('/Services/GoogleSearch.svc/LikeObject', currentObject.UniqueId);

        this.favObjects.unshift(currentObject);
        $.sessionStorage.set('ventu-favorites', this.favObjects);
    }

    this.objects.splice(this.currentObjectIndex, 1);
    this.currentObjectIndex = 0;

    var card = $('.ventu-card.current');
    this.moveCard(card, true);
    this.cards--;
    this.favorites++;
    this.shine();
    this.count(this.cards);
    this.setCurrent();
};

Ventu.prototype.hate = function() {

    var currentObject = this.objects[this.currentObjectIndex];

    if (currentObject) {
        SearchUtil.post('/Services/GoogleSearch.svc/DislikeObject', currentObject.UniqueId);

        this.hateObjects.unshift(this.objects[this.objects.length - 1]);
    }

    this.objects.splice(this.currentObjectIndex, 1);
    this.currentObjectIndex = 0;

    var card = $('.ventu-card.current');
    this.moveCard(card, false);
    this.cards--;
    this.count(this.cards);
    this.setCurrent();
};

Ventu.prototype.suggest = function(dx, dy) {
    var text,
        power;
    // detect direction
    if (Math.abs(dx) > dy) {
        if (dx > 0) {

            function completed(resourceValue) {
                text = resourceValue;
            }

            SearchUtil.getResourceValue('Ventu.LocalResources.Home', 'VindIkLeuk', completed);
            //text = 'Vind ik leuk';
        } else {

            function completed(resourceValue) {
                text = resourceValue;
            }

            SearchUtil.getResourceValue('Ventu.LocalResources.Home', 'LaatLinksLiggen', completed);
            //            text = 'Laat links liggen';
        }
        power = dx / this.config.swipe;
    } else {

        function completed(resourceValue) {
            text = resourceValue;
        }

        SearchUtil.getResourceValue('Ventu.LocalResources.Home', 'IkWilDetailsZien', completed);
        //        text = 'Ik wil de details zien...';
        power = dy / this.config.swipe;
    }
    power = Math.abs(power);
    power -= 0.4;
    if (power > 1) { power = 1; }
    else if (power < 0) { power = 0; }

    this.elements.suggest.html(text);
    this.elements.suggest.css('opacity', power);
};


Ventu.prototype.moveCard = function(card, love) {
    var transform,
        shade = this.elements.shadeCurrent,
        textElement = card.find('.ventu-card-text'),
        self = this;
    if (love) {
        transform = 'rotateX(80deg) translateZ(-700px) translateY(-300px) translateX(1200px)';
    } else {
        transform = 'rotateX(0) rotateY(-10deg) translateZ(-100px) translateY(500px) translateX(-2000px)';
    }
    //card.removeClass('current');
    if (this.config.shade.active) {
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
        if (self.config.shade.active) {
            shade.remove();
        }

    }, 500);
    self.elements.suggest.css('opacity', 0);
    self.elements.loveButton.removeClass('shine');
    self.elements.hateButton.removeClass('shine');
};

Ventu.prototype.seeDetail = function () {

    var currentObject = this.objects[this.currentObjectIndex];

    if (currentObject) {

        SearchUtil.post('/Services/GoogleSearch.svc/LikeObject', currentObject.UniqueId);

        this.favObjects.unshift(currentObject);
        $.sessionStorage.set('ventu-favorites', this.favObjects);

        // get specific page
        window.location.href = '/Project/' + currentObject.DetailLinkUrl;
    }
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
            var transform = self.getTransform(i, self.config.zoom, self.config.zoom);
            self.setCSStransform($(this), transform);
            i++;
        }
    });
};

Ventu.prototype.shuffle = function() {
    var self = this,
        i = 0,
        q;
    $('.ventu-card').each(function() {
        if (!$(this).hasClass('current')) {
            q = Math.round(i + 60 * Math.random());
            var transform = self.getTransform(q, self.config.zoom, self.config.zoom);
            self.setCSStransform($(this), transform);
            i++;
        }
    });
    setTimeout(function(){
        self.restack();
    }, 400);
};



// shade

Ventu.prototype.buildStackShade = function() {
    var transform = this.getCustomTransform(this.config.shade.normal.width, this.config.shade.normal.height, 15, 0),
        stackShade = $('<div class="ventu-stack-shade"></div>');
    $('.ventu-stack-shade').remove();
    this.setCSStransform(stackShade, transform);
    this.elements.container.append(stackShade);
    this.elements.stackShade = stackShade;
};

Ventu.prototype.buildNextShade = function() {
    var transform = this.getCustomTransform(this.config.shade.normal.width, this.config.shade.normal.height, 15, 0),
        shade = $('<div class="ventu-shade next"></div>');
    $('.ventu-shade.next').remove();
    this.setCSStransform(shade, transform);
    this.elements.container.prepend(shade);
    this.elements.shadeNext = shade;
};

Ventu.prototype.launchShade = function() {
    if (this.config.shade.active) {
        var transform = this.getCustomTransform(this.config.shade.selected.width, this.config.shade.selected.height, this.config.shade.selected.y, 0);
        this.elements.shadeCurrent = this.elements.shadeNext;
        this.setCSStransform(this.elements.shadeCurrent, transform);
        this.elements.shadeCurrent.addClass('current');
        this.elements.shadeCurrent.removeClass('next');
    }
};

Ventu.prototype.unsetShade = function() {
    if (this.config.shade.active) {
        var transform = this.getCustomTransform(this.config.shade.normal.width, this.config.shade.normal.height, 0, 0),
            shade = this.elements.shadeCurrent;
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
    var verticalPosition = this.config.stack.verticalPosition;

    //console.log('getTransform', i, scaleX, scaleY, this.config.stack);

    //console.log('getTransform - container height', this.config.sizes.container.height);
    //console.log('getTransform - body height', this.config.sizes.body.height);

    //verticalPosition = this.config.sizes.container.height;

    return 'rotateX(80deg) ' +
        'translateZ(' + (-verticalPosition + i * this.config.stack.offset) + 'px) ' +
        'translateY(' + (-0.5 * verticalPosition + i * this.config.stack.offset) + 'px) ' +
        'translateX(' + ((this.config.sizes.container.width / 2) - (this.config.sizes.card.width / 2)) + 'px) ' +
        'scale(' + scaleX + ',' + scaleY + ')';
};

Ventu.prototype.getCustomTransform = function(scaleX, scaleY, shiftY, shiftX) {
    var verticalPosition = this.config.stack.verticalPosition;

    //console.log('getCustomTransform', scaleX, scaleY, shiftY, shiftX, this.config.stack);

    //verticalPosition = this.config.sizes.container.height;

    return 'rotateX(80deg) ' +
        'translateZ(' + (-verticalPosition) + 'px) ' +
        'translateY(' + (-0.5 * verticalPosition + shiftY) + 'px) ' +
        'translateX(' + ((this.config.sizes.container.width / 2) - (this.config.sizes.card.width / 2) + shiftX) + 'px) ' +
        'scale(' + scaleX + ',' + scaleY + ')';
};

function injectStyles(rule) {
    var div = $('<div />', {
        html: '&shy;<style>' + rule + '</style>'
    }).appendTo('body');
}



