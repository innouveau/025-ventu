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


// init

Manager.prototype.updateAfterDraw = function(result) {
    this.lastIndex = 0;
    this.status.found = result.markers.length;
    this.status.left = result.markers.length;
    console.log(result.markers.length + ' Objects, with ' + result.objects.length + ' buildings');
    this.updateDom();
    this.createInitialCards();
    this.launch();
};


Manager.prototype.update = function() {

};

Manager.prototype.createInitialCards = function() {
    var initialSet, objects;
    initialSet = window.ventu.objects.length > window.ventu.config.stack.max ? window.ventu.config.stack.max : window.ventu.objects.length;
    objects = this.getObjectsForNewCard(initialSet);
    console.log('created ' + objects.length + ' cards.');
    for (var i = 0, l = objects.length; i < l; i++) {
        var obj = objects[i];
        obj.createCard(this.lastIndex);
        this.lastIndex++;
    }
};




// managing objects and buildings

Manager.prototype.next = function() {
    var self = this,
        wait = 0,
        report,
        obj = this.getSingleObjectForNewCard();

    this.report();

    function nextCard(newObj) {
        if (window.ventu.cards.length === 1) {
            // the old card is still present when the new card is created. So 1 means
            // the new card will be the only one on the stack, therefor we reset the index
            // so the new card will be created on top of the stack
            self.lastIndex = 0;
            // because this card will be on top, it would graphically interfere with
            // the added card, we have to wait until it is disappeared
            wait = 800
        }
        newObj.createCard(self.lastIndex);
        setTimeout(function () {
            newObj.card.launch('normal');
        }, wait);
        self.lastIndex++;
    }

    if (obj) {
        nextCard(obj)
    } else {
        console.log('no more cards to create from this set');
        report = this.report();
        // we need more building info from the api
        if (report.objects > report.withBuilding) {

            function callbackAfterInject(result) {
                window.ventu.createAndMatchBuildings(result.objects);
                obj = self.getSingleObjectForNewCard();
                if (obj) {
                    nextCard(obj);
                } else {
                    // this shouldnt be possible irl situations
                    console.log('something went wrong. The newly added buildings couldnt be matched with the existing objects');
                }

            }

            console.log('got new cards!');
            window.ventuApi.getSelectResults(callbackAfterInject, true); // todo remove this second argument, for testing only
        } else if (report.objects === report.addedToList) {
            modal.message('Alles gezien', 'Start een nieuwe zoekopdracht om nieuwe kaarten te bekijken', false, true)
        }
    }
};

Manager.prototype.getSingleObjectForNewCard = function() {
    var objects = this.getObjectsForNewCard(1);
    if (objects.length) {
        return objects[0];
    } else {
        return null;
    }

};

Manager.prototype.getObjectsForNewCard = function(n) {
    var objects = [],
        i = 0;
    while (objects.length < n && i < window.ventu.objects.length) {
        var obj = window.ventu.objects[i];
        if (obj.isPotentialForCard()) {
            objects.push(obj);

        }
        i++;
    }
    return objects;
};

Manager.prototype.report = function() {
    var report = {
        objects: 0,
        withBuilding: 0,
        withCard: 0,
        addedToList: 0,
        potentialCards: 0
    };
    for (var i = 0, l = window.ventu.objects.length; i < l; i++) {
        var obj = window.ventu.objects[i];
        report.objects++;
        if (obj.card) {
            report.withCard++;
        }
        if (obj.building) {
            report.withBuilding++;
        }
        if (obj.addedToList) {
            report.addedToList++;
        }
        if (obj.building && !obj.card) {
            report.potentialCards++;
        }
    }
    console.log(report);
    return report;
};








// card actions

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


