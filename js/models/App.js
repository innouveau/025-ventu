function App() {
    this.config = new Config(this);
    this.service = this._getService();
    this.map = new Map(this);
    this.settings = {
        stack: {
            n: 1
        }
    };
    
    
    this.domElements = {};

    this.hammertime = null;
    this.timer = null;

    this.cards = []; // objects represented as a html card
    this.objects = [];
    this.loveList = [];
    this.hateList = [];


    this.currentObjectIndex = 0;
    this.showStackIsEmptyMessage = true;
}

App.prototype.search = function(element) {
    var searchQuery = $(element).val();
    this.service.search(searchQuery)
};

App.prototype.init = function() {
    this._initDomElements();
    this._appendLists();
    // fake:
    this.service.select('Amsterdam (stad)');
};

App.prototype._initDomElements = function() {
    this.domElements.container = $('#ventu-stack');
    this.domElements.search = $('#input-search-address');
    this.domElements.searchResults = $('#ventu-search-result');
    this.domElements.searchFeedback = $('.ventu-search-results-feedback');
    this.domElements.loveContainer = $('.ventu-bottom-bar-sub-love');
    this.domElements.hateContainer = $('.ventu-bottom-bar-sub-hate');
    this.domElements.loveList = $('.ventu-bottom-bar-sub-love .ventu-bottom-bar-list');
    this.domElements.hateList = $('.ventu-bottom-bar-sub-hate .ventu-bottom-bar-list');
    this.domElements.loveCounter = $('.ventu-bottom-bar-sub-love .ventu-list-counter');
    this.domElements.hateCounter = $('.ventu-bottom-bar-sub-hate .ventu-list-counter');
};

App.prototype._appendLists = function() {
    this.loveList = this.service.getList('love');
    this._appendList(this.loveList, this.domElements.loveList);
    this.domElements.loveCounter.html(this.loveList.length);
    this.hateList = this.service.getList('hate');
    this._appendList(this.hateList, this.domElements.hateList);
    this.domElements.hateCounter.html(this.hateList.length);
};

App.prototype._appendList = function(list, parent) {
    for (var i = 0, l = list.length; i < l; i++) {
        var item = list[i],
            content = item.getContent(),
            element = $('<div class="ventu-bottom-bar-list-item" style="background-image: url(' + content.image + ')"></div>');
        parent.append(element)
    }
};

App.prototype._getService = function() {
    if (window.ventuConfig.environment.development) {
        return new DataFaker(this);
    } else {
        return new DataService(this);
    }
};














//
//
//
//
//
//
//
//
//
//
//
// App.prototype.redraw = function() {
//     // called after window.resize
//     var self = this;
//     this.measure();
//     this.restack();
//     if (window.ventuConfig.whatScreen > 2) {
//         this.config.shade.active = true;
//         this.buildStackShade();
//         this.buildNextShade();
//     }
// };
//
//
//
//
// // measuring and sizes
//
// App.prototype.measure = function() {
//     this.config.sizes.body = {};
//     this.config.sizes.body.width = $('body').outerWidth();
//     this.config.sizes.body.height = $('body').outerHeight();
//     this.config.sizes.container = {
//         width: this.domElements.container.outerWidth(),
//         height: this.domElements.container.outerHeight()
//     };
//     this.sizeCards();
//     this.positionStack();
//     // determine swipe distance
//     if (this.config.sizes.body.width > 768) {
//         this.config.swipe = 140;
//     } else {
//         // in mobile modus, the whole screen is the container, so it is fair
//         // to make the swipe 60% of half the screen
//         this.config.swipe = 0.15 * this.config.sizes.container.width;
//         if (this.config.swipe < 100) {
//             this.config.swipe = 60;
//         }
//     }
// };
//
// App.prototype.sizeCards = function () {
//     var cardWidth,
//         cardHeight,
//         maxWidth = 1500,
//         ratio = 0.8,
//         margin = Math.pow(0.008 * this.config.sizes.container.width, 2), // make margin exponentially bigger
//         containerRatio = this.config.sizes.container.height / this.config.sizes.container.width;
//     if (this.config.sizes.container.height > this.config.sizes.container.width && window.ventuConfig.whatScreen < 2) {
//         // portrait mode, so we make the cards a bit portrait
//         ratio = 1.3;
//     }
//     if (containerRatio > ratio) {
//         cardWidth = this.config.sizes.container.width - (2 * margin);
//         if (cardWidth > maxWidth) {
//             cardWidth = maxWidth;
//         }
//         cardHeight = cardWidth * ratio;
//     } else {
//         cardHeight = this.config.sizes.container.height - (2 * margin);
//         if (cardHeight > (maxWidth / ratio)) {
//             cardHeight = maxWidth / ratio;
//         }
//         cardWidth = cardHeight / ratio;
//     }
//     this.config.card.horizontalShift = (this.config.sizes.container.width - cardWidth) / 2;
//     this.config.card.selectedPosition = 'rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0) translateX(' + this.config.card.horizontalShift + 'px)';
//     this.config.sizes.card.width = cardWidth;
//     this.config.sizes.card.height = cardHeight;
//     this.helpers.injectStyles('.ventu-card, .ventu-shade, .ventu-stack-shade { height: ' + cardHeight + 'px; width: ' + cardWidth + 'px;}');
// };
//
// App.prototype.positionStack = function () {
//     var verticalPosition = (this.config.sizes.container.height * 1.6) - 400,
//         max = 10000;
//     if (verticalPosition > max) {
//         this.config.stack.verticalPosition = max;
//     } else {
//         this.config.stack.verticalPosition = verticalPosition;
//     }
// };
//
//
//
// // construction
//
// App.prototype.buildCard = function(i, end) {
//     var card,
//         j = i + 1,
//         self = this,
//         time = 10;
//     if (i < this.limit) {
//         this.append(i);
//     } else {
//         time = Math.floor(1000 / i);
//     }
//     this.count(i);
//
//     if (j < this.cards && j < this.limit) {
//         this.timer = setTimeout(function(){
//             self.buildCard(j, end);
//         }, time);
//     } else {
//         this.timer = setTimeout(function() {
//             if ($('.ventu-card.current').length === 0) {
//                 self.timer = null;
//                 self.count(end);
//                 self.setCurrent();
//             }
//         }, 400);
//     }
// };
//
// App.prototype.append = function (i, before) {
//     var transform = this.helpers.getTransform(i, this.config.zoom, this.config.zoom),
//         card = $('<div class="ventu-card ventu-card-' + i + '">' +
//             '<div class="ventu-card-image ventu-triangle ventu-triangle-bottom ventu-triangle-light-grey"></div>' +
//             '<div class="ventu-card-text"></div>' +
//             '<div class="ventu-card-icons"></div></div>');
//     this.helpers.setCSStransform(card, transform);
//     if (before) {
//         card.insertBefore(this.domElements.last);
//     } else {
//         this.domElements.container.append(card);
//     }
//
// };
//
// App.prototype.createStatic = function() {
//     var l = this.cards;
//     this.count(l);
//     if (l > this.limit) {
//         l = this.limit;
//     }
//     for (var i = 0; i < l; i++) {
//         this.append(i);
//     }
// };
//
// App.prototype.initHammer = function(element) {
//     var self = this;
//     this.hammertime = Hammer(element[0]);
//
//     this.hammertime.on('drag', function (event) {
//         if (event != null && event.gesture != null) { // JWA
//             var dx = event.gesture.deltaX,
//                 dy = event.gesture.deltaY;
//             self.suggest(dx, dy);
//             self.dragCard(element, event.gesture.deltaX, event.gesture.deltaY);
//             self.domElements.loveButton.hide();
//             self.domElements.hateButton.hide();
//         }
//     });
//
//     this.hammertime.on('release', function(event) {
//         if (event != null && event.gesture != null) { // JWA
//             var dx = event.gesture.deltaX,
//                 dy = event.gesture.deltaY;
//             self.domElements.suggest.css('opacity', 0);
//             if (window.ventuConfig.whatScreen > 2) {
//                 self.domElements.loveButton.show();
//                 self.domElements.hateButton.show();
//             }
//
//             if (dx > self.config.swipe) {
//                 self.love();
//             } else if (dx < -self.config.swipe) {
//                 self.hate();
//             } else {
//                 if (dy > 200) {
//                     //self.love(); // JWA
//                     self.seeDetail();
//                 } else {
//                     self.releaseCard(element);
//                 }
//             }
//         }
//     });
// };
//
//
//
// // current
//
// App.prototype.setCurrent = function () {
//     this.unsetCurrent();
//
//     // JWA: if (this.cards <= 1) {
//     if (this.objects.length <= 0) {
//         this.stackIsEmpty();
//     } else {
//
//         this.domElements.last = this.getLast();
//         if (this.domElements.last) {
//             this.launchCurrent();
//         }
//         // if we are above the limit, we create a card on the fly
//         if (this.cards > this.limit) {
//             this.append(this.limit, true);
//         }
//
//         this.stackIsNotEmpty();
//     }
// };
//
// App.prototype.launchCurrent = function() {
//     var last = this.domElements.last,
//         content = this.getContent(),
//         textElement = last.find('.ventu-card-text'),
//         imageElement = last.find('.ventu-card-image'),
//         iconElement = last.find('.ventu-card-icons'),
//         self = this;
//     imageElement.css('background-image', 'url(' + content.image + ')');
//     textElement.html(this.buildText(content.text));
//     iconElement.html(this.buildIcons(content.icons));
//     setTimeout(function(){
//         textElement.fadeIn(300);
//     }, 400);
//     // fade-in the image
//     last.addClass('current');
//     //last.attr('title', 'Swipe naar links, rechts of beneden');
//
//     function completed(resourceValue) {
//         last.attr('title', resourceValue);
//     }
//
//     // SearchUtil.getResourceValue('App.LocalResources.Home', 'Swipe', completed); // todo move this?
//
//     this.helpers.setCSStransform(last, this.config.card.selectedPosition);
//     this.initHammer(last);
//     this.launchShade();
//     setTimeout(function(){
//         self.buildNextShade();
//     }, 500);
// };
//
// App.prototype.buildText = function(input) {
//     var text = '<h3>' + input.head + '</h3>';
//     text += '<h3>' + input.sub + '</h3>';
//     if (input.list.length) {
//         text += '<ul>';
//         for (var i = 0, l = input.list.length; i < l; i++) {
//             text += '<li>' + input.list[i] + '</li>';
//         }
//         text += '</ul>';
//     }
//
//     text += '<div class="detailLinkUrl"><a href="/Project/' + input.detailLinkUrl + '">Naar project details</a></div>';
//     return text;
// };
//
// App.prototype.buildIcons = function(input) {
//     var icons = '';
//     for (var i = 0, l = input.length; i < l; i++) {
//         icons += '<a class="ventu-icon ventu-icon-med ventu-icon-' + input[i].style + '"  href="/Project/' + input[i].url + '"></a>';
//     }
//     return icons;
// };
//
// App.prototype.getContent = function () {
//     var currentObject = this.objects[this.currentObjectIndex],
//         result = null;
//     if (currentObject) {
//         result = currentObject.getContent();
//     }
//     return result;
// };
//
// App.prototype.unsetCurrent = function() {
//     var current = $('.current'),
//         textElement,
//         image,
//         transform;
//     if (current.length > 0) {
//         current.removeClass('current');
//         textElement = current.find('.ventu-card-text');
//         textElement.html('');
//         //textElement.css('opacity', 0);
//         current.find('.ventu-card-image').css({
//             'background-image': 'none'
//         });
//         transform = this.helpers.getTransform(this.cards - 1, this.config.zoom, this.config.zoom);
//         this.helpers.setCSStransform(current, transform);
//         this.unsetShade();
//     }
// };
//
//
//
// // events
//
// App.prototype.stackIsEmpty = function() {
//     if (this.config.shade.active) {
//         this.domElements.stackShade.hide();
//     }
//
//     // JWA
//     this.domElements.loveButton.hide();
//     this.domElements.hateButton.hide();
//
//     if (this.showStackIsEmptyMessage) {
//         // todo show on stack...
//
//         //$('.ventu-overlay').fadeIn(500);
//         //$('#ventu-guide-filter-more').show();
//     }
// };
//
// App.prototype.stackIsNotEmpty = function() {
//     if (this.config.shade.active) {
//         this.domElements.stackShade.show();
//     }
//
//     // JWA
//     this.domElements.loveButton.show();
//     this.domElements.hateButton.show();
// };
//
// App.prototype.dragCard = function(card, dx, dy) {
//     var thisDx = dx,
//         thisDy = dy,
//         rotY = dx / 50,
//         rotX = dy / -8,
//         transform = 'rotateX(' + rotX + 'deg) translateZ(0) rotateY(' + rotY + 'deg) translateY(' + thisDy + 'px) translateX(' + (this.config.card.horizontalShift + thisDx) + 'px)';
//     card.addClass('no-transition');
//     this.helpers.setCSStransform(card, transform);
//     // shade
//     if (this.config.shade.active) {
//         this.domElements.shadeCurrent.addClass('no-transition');
//         var shadeTransform = this.helpers.getCustomTransform(this.config.shade.selected.width - dy / 1500, this.config.shade.selected.height, this.config.shade.selected.y, dx);
//         this.helpers.setCSStransform(this.domElements.shadeCurrent, shadeTransform);
//     }
// };
//
// App.prototype.releaseCard = function(card) {
//     card.removeClass('no-transition');
//     this.helpers.setCSStransform(card, this.config.card.selectedPosition);
//     // shade
//     if (this.config.shade.active) {
//         this.domElements.shadeCurrent.removeClass('no-transition');
//         var shadeTransform = this.helpers.getCustomTransform(this.config.shade.selected.width, this.config.shade.selected.height, this.config.shade.selected.y, 0);
//         this.helpers.setCSStransform(this.domElements.shadeCurrent, shadeTransform);
//     }
// };
//
// App.prototype.love = function () {
//     var currentObject = this.objects[this.currentObjectIndex];
//     if (currentObject) {
//         this.service.post('LikeObject', currentObject.UniqueId);
//         this.service.sessionStore(this.favObjects);
//         this.favObjects.unshift(currentObject);
//     }
//
//     this.objects.splice(this.currentObjectIndex, 1);
//     this.currentObjectIndex = 0;
//
//     var card = $('.ventu-card.current');
//     this.moveCard(card, true);
//     this.cards--;
//     this.favorites++;
//     this.shine();
//     this.count(this.cards);
//     this.setCurrent();
// };
//
// App.prototype.hate = function() {
//     var currentObject = this.objects[this.currentObjectIndex];
//     if (currentObject) {
//         this.service.post('DislikeObject', currentObject.UniqueId);
//         this.hateObjects.unshift(this.objects[this.objects.length - 1]);
//     }
//
//     this.objects.splice(this.currentObjectIndex, 1);
//     this.currentObjectIndex = 0;
//
//     var card = $('.ventu-card.current');
//     this.moveCard(card, false);
//     this.cards--;
//     this.count(this.cards);
//     this.setCurrent();
// };
//
// App.prototype.suggest = function(dx, dy) {
//     var text,
//         power;
//     // detect direction
//     if (Math.abs(dx) > dy) {
//         if (dx > 0) {
//             text = this.service.translate('VindIkLeuk')
//         } else {
//             text = this.service.translate('LaatLinksLiggen');
//         }
//         power = dx / this.config.swipe;
//     } else {
//
//         function completed(resourceValue) {
//             text = resourceValue;
//         }
//         text = this.service.translate('IkWilDetailsZien');
//         power = dy / this.config.swipe;
//     }
//     power = Math.abs(power);
//     power -= 0.4;
//     if (power > 1) { power = 1; }
//     else if (power < 0) { power = 0; }
//
//     this.domElements.suggest.html(text);
//     this.domElements.suggest.css('opacity', power);
// };
//
//
// App.prototype.moveCard = function(card, love) {
//     var transform,
//         shade = this.domElements.shadeCurrent,
//         textElement = card.find('.ventu-card-text'),
//         self = this;
//     if (love) {
//         transform = 'rotateX(80deg) translateZ(-700px) translateY(-300px) translateX(1200px)';
//     } else {
//         transform = 'rotateX(0) rotateY(-10deg) translateZ(-100px) translateY(500px) translateX(-2000px)';
//     }
//     //card.removeClass('current');
//     if (this.config.shade.active) {
//         shade.removeClass('no-transition current');
//     }
//     card.addClass('ventu-removing');
//     //textElement.fadeOut(50);
//     card.css({
//         transition: 'all 0.6s ease-in, opacity 1s',
//         opacity: 0
//     });
//     this.helpers.setCSStransform(card, transform);
//     setTimeout(function () {
//         card.remove();
//         if (self.config.shade.active) {
//             shade.remove();
//         }
//
//     }, 500);
//     self.domElements.suggest.css('opacity', 0);
//     self.domElements.loveButton.removeClass('shine');
//     self.domElements.hateButton.removeClass('shine');
// };
//
// App.prototype.seeDetail = function () {
//
//     var currentObject = this.objects[this.currentObjectIndex];
//
//     if (currentObject) {
//
//         SearchUtil.post('/Services/GoogleSearch.svc/LikeObject', currentObject.UniqueId);
//
//         this.favObjects.unshift(currentObject);
//         $.sessionStorage.set('ventu-favorites', this.favObjects);
//
//         // get specific page
//         window.location.href = '/Project/' + currentObject.DetailLinkUrl;
//     }
// };
//
//
//
// // stack handlers
//
// App.prototype.setStack = function(n) {
//     var wait = 0,
//         self = this;
//     // cancel running previous processes
//     if (this.timer !== null) {
//         this.timer = null;
//         this.restack();
//         wait = 1000;
//     }
//     setTimeout(function(){
//         if (n > self.cards) {
//             self.addStack(n);
//         } else if (n < self.cards) {
//             self.subtractStack(n);
//         }
//     }, wait);
// };
//
// App.prototype.addStack = function(n) {
//     var q = this.cards - 1;
//     this.unsetCurrent();
//     this.cards = n;
//     this.buildCard(q, n);
// };
//
// App.prototype.subtractStack = function(n) {
//     var self = this,
//         set,
//         rnd,
//         card;
//     this.unsetCurrent();
//
//     while (this.cards > n) {
//         set = $('.ventu-card');
//         rnd = Math.round(set.length * Math.random());
//         card = $(set[rnd]);
//         if (!card.hasClass('current') && !card.hasClass('destroyed')) {
//             self.destroyCard(card);
//         }
//     }
//     setTimeout(function(){
//         self.setCurrent();
//     }, 2000);
//
//     setTimeout(function(){
//         self.restack();
//     }, 1000);
// };
//
// App.prototype.destroyCard = function(card) {
//     card.addClass('destroyed');
//     this.cards--;
//     this.count(this.cards);
//     card.css('opacity', 0);
//     setTimeout(function(){
//         card.remove();
//     }, 500);
// };
//
// App.prototype.restack = function() {
//     var self = this,
//         i = 0;
//     $('.ventu-card').each(function() {
//         if (!$(this).hasClass('current')) {
//             var transform = self.helpers.getTransform(i, self.config.zoom, self.config.zoom);
//             self.helpers.setCSStransform($(this), transform);
//             i++;
//         }
//     });
// };
//
// App.prototype.shuffle = function() {
//     var self = this,
//         i = 0,
//         q;
//     $('.ventu-card').each(function() {
//         if (!$(this).hasClass('current')) {
//             q = Math.round(i + 60 * Math.random());
//             var transform = self.helpers.getTransform(q, self.config.zoom, self.config.zoom);
//             self.helpers.setCSStransform($(this), transform);
//             i++;
//         }
//     });
//     setTimeout(function(){
//         self.restack();
//     }, 400);
// };
//
//
//
// // shade
//
// App.prototype.buildStackShade = function() {
//     var transform = this.helpers.getCustomTransform(this.config.shade.normal.width, this.config.shade.normal.height, 15, 0),
//         stackShade = $('<div class="ventu-stack-shade"></div>');
//     $('.ventu-stack-shade').remove();
//     this.helpers.setCSStransform(stackShade, transform);
//     this.domElements.container.append(stackShade);
//     this.domElements.stackShade = stackShade;
// };
//
// App.prototype.buildNextShade = function() {
//     var transform = this.helpers.getCustomTransform(this.config.shade.normal.width, this.config.shade.normal.height, 15, 0),
//         shade = $('<div class="ventu-shade next"></div>');
//     $('.ventu-shade.next').remove();
//     this.helpers.setCSStransform(shade, transform);
//     this.domElements.container.prepend(shade);
//     this.domElements.shadeNext = shade;
// };
//
// App.prototype.launchShade = function() {
//     if (this.config.shade.active) {
//         var transform = this.helpers.getCustomTransform(this.config.shade.selected.width, this.config.shade.selected.height, this.config.shade.selected.y, 0);
//         this.domElements.shadeCurrent = this.domElements.shadeNext;
//         this.helpers.setCSStransform(this.domElements.shadeCurrent, transform);
//         this.domElements.shadeCurrent.addClass('current');
//         this.domElements.shadeCurrent.removeClass('next');
//     }
// };
//
// App.prototype.unsetShade = function() {
//     if (this.config.shade.active) {
//         var transform = this.helpers.getCustomTransform(this.config.shade.normal.width, this.config.shade.normal.height, 0, 0),
//             shade = this.domElements.shadeCurrent;
//         this.helpers.setCSStransform(shade, transform);
//         shade.removeClass('current');
//         setTimeout(function() {
//             shade.remove();
//         }, 500);
//     }
// };
//
//
//
// // helper functions
//
// App.prototype.shine = function(){
//     var self = this;
//     this.domElements.favoritesCounter.addClass('shine');
//     setTimeout(function(){
//         self.domElements.favoritesCounter.removeClass('shine');
//     }, 500);
//     // counter
//     this.domElements.favoritesCounter.html(this.favorites);
// };
//
// App.prototype.count = function(i) {
//     this.domElements.counter.html(i);
// };
//
// App.prototype.getLast = function() {
//     var set = $('.ventu-stack-container .ventu-card');
//     for (var i = (set.length - 1); i > -1; i--) {
//         var card = $(set[i]);
//         if (!card.hasClass('ventu-removing')) {
//             return card;
//         }
//     }
//     return null;
// };