function MapMobile(app) {
    this.app = app;
    this.init();
    this.lastIndex = 0;
    this.cards = [];
}

MapMobile.prototype.init = function() {
    this.app.config.isMapPresent = false;
};


MapMobile.prototype.draw = function(data) {
    var self = this;
    this.lastIndex = 0;
    this._removeCards();
    this._createCards();
    this.currentCard = self.cards[0];
    this.cards[0].launch();
};




// cards

MapMobile.prototype._removeCards = function() {
    for (var i = 0, l = this.cards.length; i < l; i++) {
        this.cards[i].destroy(false);
    }
    this.cards = [];
};

MapMobile.prototype._createCards = function() {
    var n = this.app.objects.length > this.app.config.stack.max ? this.app.config.stack.max : this.app.objects.length;
    for (var i = 0; i < n; i++) {
        var obj = this.app.objects[i],
            building = new Building(this.app, obj);
        this.createCard(building);
    }
};

MapMobile.prototype.createCard = function(building) {
    // second argument is the marker. For mobile there are no markers
    var card = new Card(this.app, null, building, this.lastIndex);
    this.cards.push(card);
    this.lastIndex++;
    return card;
};

MapMobile.prototype.createNewCard = function() {
    if (this.lastIndex < this.app.objects.length) {
        var obj = this.app.objects[this.lastIndex],
            building = new Building(this.app, obj),
            wait = 0,
            card;
        // the old card is still present when the new card is created. So 1 means
        // the new card will be the only one on the stack, therefor we reset the index
        // so the new card will be created on top of the stack
        if (this.cards.length === 1) {
            this.lastIndex = 0;
            // because this card will be on top, it would graphically interfere with
            // the added card, we have to wait until it is disappeared
            wait = 800
        }
        card = this.createCard(building);
        setTimeout(function () {
            card.launch('soft');
        }, wait);
    }

};






