function Map(app) {
    this.app = app;
    this.poly = null;
    this.map = null;
    this.marker = {
        standard: './img/markers/standard-marker.png',
        selected: './img/markers/selected-marker.png'
    };
    this.markers = [];
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
    this._removePoly();
    this._removeMarkers();
    this._drawPoly(data);
    this._createMarkers(data.buildings);
    
    setTimeout(function(){
        self._showMarkers();
    }, 1000);
};


Map.prototype._drawPoly = function(data) {
    this.poly = new google.maps.Polygon({
        paths: data.poly,
        strokeColor: 'transparent',
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: '#000',
        fillOpacity: 0.4
    });
    this.poly.setMap(this.map);
    this.map.setCenter(data.center);
    this.map.setZoom(data.zoom);
};

Map.prototype._removePoly = function(markers) {
    if (this.poly) {
        this.poly.setMap(null);
    }
};


Map.prototype._removeMarkers = function() {
    for (var i = 0, l = this.markers.length; i < l; i++) {
        this.markers[i].setMap(null);
    }
    this.markers = [];
};

Map.prototype._createMarkers = function(markers) {
    for (var i = 0, l = markers.length; i < l; i++) {
        var icon = i === 0 ? this.marker.selected : this.marker.standard,
            marker = new Marker(this.app, this, markers[i], icon);
        this.markers.push(marker);
    }
};

Map.prototype._showMarkers = function() {
    var self = this,
        counter = 0,
        timer;
    timer = setInterval(function(){
        self.markers[counter].show();
        counter++;
        if (counter === self.markers.length) {
            clearInterval(timer);
        }
    }, 100)
};

