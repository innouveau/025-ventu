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
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        }
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
    console.log(this.markers);
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
            building = this._getBuilding(marker.UniqueId);
        if (building) {
            this._createCard(marker, building);
        }
        
    }
};

Map.prototype._getBuilding = function(UniqueId) {
    for (var i = 0, l = this.app.objects.length; i < l; i++) {
        var obj = this.app.objects[i];
        if (obj.UniqueId === UniqueId) {
            return new Building(this.app, obj);
        }
    }
    return null;
};

Map.prototype.createNewCard = function() {
    var marker = this._getMarker();
    // create a card and launch it inmediately (type 1 is simple fade in at place)
    this._createCard(marker.marker, marker.building).launch(1);
};

Map.prototype._getMarker = function() {
    for (var i = 0, l = this.markers.length; i < l; i++) {
        var marker = this.markers[i],
            building;
        if (!marker.hasCard) {
            building = this._getBuilding(marker.UniqueId);
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


Map.prototype._createCard = function(marker, building) {
    var card = new Card(this.app, marker, building, this.lastIndex);
    this.cards.push(card);
    this.lastIndex++;
    return card;
};


