function Manager() {
    this.status = {
        found: 0,
        left: 0,
        love: window.ventuApi.getFavoriteBuildings().length,
        hate: window.ventuApi.getTrashBuildings().length
    };
    this.currentCard = null;
    window.ventu.cards = [];
    this.lastIndex = 0;
}

Manager.prototype.update = function(result) {
    this.lastIndex = 0;
    this.status.found = result.markers.length;
    this.status.left = result.markers.length;
    this.updateDom();
    this.createInitialCards();
    this.launch();
};



// cards

Manager.prototype.createInitialCards = function() {
    var initialSet, objects;
    initialSet = window.ventu.objects.length > window.ventu.config.stack.max ? window.ventu.config.stack.max : window.ventu.objects.length;
    objects = this.getObjectsWithBuilding(initialSet);

    for (var i = 0, l = objects.length; i < l; i++) {
        var obj = objects[i];
        obj.createCard(this.lastIndex);
        this.lastIndex++;
    }
};

Manager.prototype.getObjectsWithBuilding = function(n) {
    var objects = [],
        i = 0;
    while (objects.length <= n && i < window.ventu.objects.length) {
        var obj = window.ventu.objects[i];
        if (obj.building) {
            objects.push(obj);

        }
        i++;
    }
    return objects;
};









Manager.prototype.launch = function() {
    var launchType;
    if (window.ventu.cards.length > 0) {
        launchType = this._getLaunchType();
        window.ventu.currentCard = window.ventu.cards[0];

        if (window.ventu.config.isMapPresent && !window.ventu.map.status.tilesloaded) {
            // check if the google maps tiles are loaded
            // and wait for it to launch
            google.maps.event.addListenerOnce(window.ventu.map.map, 'tilesloaded', function () {
                window.ventu.cards[0].launch(launchType);
                window.ventu.map.status.tilesloaded = true;
            });
        } else {
            window.ventu.currentCard.launch(launchType);
        }
    }
};

Manager.prototype.removeCards = function() {
    for (var i = 0, l = window.ventu.cards.length; i < l; i++) {
        window.ventu.cards[i].destroy(false);
    }
    window.ventu.cards = [];
};

Manager.prototype.createNewCard = function() {
    var card;
    if (window.ventu.config.isMapPresent) {
        var data = window.ventu.map.getUnusedMarkerObject(),
            wait = 0;
        if (data) {
            // the old card is still present when the new card is created. So 1 means
            // the new card will be the only one on the stack, therefor we reset the index
            // so the new card will be created on top of the stack
            if (window.ventu.cards.length === 1) {
                this.lastIndex = 0;
                // because this card will be on top, it would graphically interfere with
                // the added card, we have to wait until it is disappeared
                wait = 800
            }
            card = data.marker.createCard(data.building);
            setTimeout(function () {
                card.launch('normal');
            }, wait);
        }
    } else {
            var obj, building;
            if (window.ventu.objects[this.lastIndex]) {
                obj = window.ventu.objects[this.lastIndex];
                building = new Building(obj);
                card = new Card(this, building, this.lastIndex);
                card.launch('normal');
                window.ventu.cards.push(card);
                this.lastIndex++;
            }
    }
};


// getters



Manager.prototype._getLaunchType = function() {
    if (window.ventu.user.askIfDidSee('cardLaunch') || !window.ventu.config.isMapPresent) {
        return 'normal';
    } else {
        return 'cool'
    }
};





// dom

Manager.prototype.updateDom = function() {
    this.updateResultBar();
    this.updateBottomBar();
    this.updateBottomBarType('love');
    this.updateBottomBarType('hate');
};


Manager.prototype.updateResultBar = function() {
    $('#ventu-filter-result').html(this.status.found);
};

Manager.prototype.updateBottomBar = function() {
    $('#ventu-bottom-bar-counter-label').html(this.status.left + ' objecten over');
};

Manager.prototype.updateBottomBarType = function(type) {
    var container = $('#ventu-bottom-bar-' + type + ' .ventu-bottom-bar-label-container'),
        label;
    if (container.hasClass('ventu-bottom-bar-label-container--rotated')) {
        label = container.find('.venu-bottom-bar-label-front .ventu-bottom-bar-label-text');
    } else {
        label = container.find('.venu-bottom-bar-label-back .ventu-bottom-bar-label-text');
    }
    if (parseInt(label.html()) !== this.status[type]) {
        label.html(this.status[type]);
        container.toggleClass('ventu-bottom-bar-label-container--rotated');
    }
};


