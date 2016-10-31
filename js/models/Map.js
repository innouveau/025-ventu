function Map(app) {
    this.app = app;
    this.icon = {
        standard: './img/markers/standard-marker.png',
        selected: './img/markers/selected-marker.png'
    };
    this.settings = {
        shape: {
            strokeColor: 'transparent',
            strokeOpacity: 0,
            strokeWeight: 0,
            fillColor: '#000',
            fillOpacity: 0.4
        }
    };
    this.currentCard = null;
    this.map = null;
    this.shape = null;
    this.markers = [];
    this.cards = [];
    this.lastIndex = 0;
    this.init();
}

Map.prototype.init = function() {
    var myOptions = {
        zoom: 8,
        center: new google.maps.LatLng(51.7,4.6),
        sensor: 'true',
        draggable: true,
        streetViewControl: false
    };
    this.map = new google.maps.Map(document.getElementById("ventu-canvas"), myOptions);
};


Map.prototype.draw = function(data) {
    var self = this;
    this.lastIndex = 0;
    this._removeShape();
    this._removeMarkers();
    this._removeCards();
    this._drawShape(data);
    this._createMarkers(data.markers);
    this._createCards();
    
    setTimeout(function(){
        self._showMarkers();
    }, 1000);

    setTimeout(function(){
        // init launch cascade
        self.currentCard = self.cards[0];
        self.cards[0].launch();
    }, 2000);
};



// poly

Map.prototype._drawShape = function(data) {
    switch (data.shape.type) {
        case 'poly':
            this.shape = new google.maps.Polygon({
                paths: data.shape.data.points,
                strokeColor: this.settings.shape.strokeColor,
                strokeOpacity: this.settings.shape.strokeOpacity,
                strokeWeight: this.settings.shape.strokeWeight,
                fillColor: this.settings.shape.fillColor,
                fillOpacity: this.settings.shape.fillOpacity
            });
            this.shape.setMap(this.map);
            break;
        case 'circle':
            this.shape = new google.maps.Circle({
                strokeColor: this.settings.shape.strokeColor,
                strokeOpacity: this.settings.shape.strokeOpacity,
                strokeWeight: this.settings.shape.strokeWeight,
                fillColor: this.settings.shape.fillColor,
                fillOpacity: this.settings.shape.fillOpacity,
                center: data.shape.data.center,
                radius: data.shape.data.radius,
                map: this.map
            });
            break;
    }

    this.map.setCenter(data.zoomCenter);
    this.map.setZoom(data.zoom);
};

Map.prototype._removeShape = function() {
    if (this.shape) {
        this.shape.setMap(null);
    }
};



// markers

Map.prototype._removeMarkers = function() {
    for (var i = 0, l = this.markers.length; i < l; i++) {
        this.markers[i].eject();
    }
    this.markers = [];
};

Map.prototype._createMarkers = function(markers) {
    for (var i = 0, l = markers.length; i < l; i++) {
        var icon = i === 0 ? this.icon.selected : this.icon.standard,
            marker = new Marker(this.app, this, markers[i], icon);
        this.markers.push(marker);
    }
};

Map.prototype._showMarkers = function() {
    var self = this,
        counter = 0,
        timer,
        interval = 1000 / this.markers.lenght;
    timer = setInterval(function(){
        self.markers[counter].show();
        counter++;
        if (counter === self.markers.length) {
            clearInterval(timer);
        }
    }, interval)
};



// cards

Map.prototype._removeCards = function() {
    for (var i = 0, l = this.cards.length; i < l; i++) {
        this.cards[i].destroy();
    }
    this.cards = [];
};

Map.prototype._createCards = function() {
    var n = this.markers.length > this.app.config.stack.max ? this.app.config.stack.max : this.markers.length;
    for (var i = 0; i < n; i++) {
        var marker = this.markers[i],
            building = this.getBuilding(marker.UniqueId);
        if (building) {
            marker.createCard(building);
        }
        
    }
};

Map.prototype.getBuilding = function(UniqueId) {
    for (var i = 0, l = this.app.objects.length; i < l; i++) {
        var obj = this.app.objects[i];
        if (obj.UniqueId === UniqueId) {
            return new Building(this.app, obj);
        }
    }
    return null;
};

Map.prototype.createNewCard = function() {
    var data = this._getMarker(),
        card,
        wait = 0;
    // the old card is still present when the new card is created. So 1 means
    // the new card will be the only one on the stack, therefor we reset the index
    // so the new card will be created on top of the stack
    if (this.cards.length === 1) {
        this.lastIndex = 0;
        // because this card will be on top, it would graphically interfer with
        // the added card, we have to wait until it is disappeared
        wait = 800
    }
    card = data.marker.createCard(data.building);
    setTimeout(function(){
        card.launch(1);
    }, wait);


};

Map.prototype._getMarker = function() {
    for (var i = 0, l = this.markers.length; i < l; i++) {
        var marker = this.markers[i],
            building;
        if (!marker.hasCard) {
            building = this.getBuilding(marker.UniqueId);
            if (building) {
                return  {
                    marker: marker,
                    building: building
                };
            }
        }
    }
    return null;
};





