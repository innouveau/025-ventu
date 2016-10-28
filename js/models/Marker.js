function Marker(app, parent, data, icon) {
    this.app = app;
    this.parent = parent;
    this.card = null;
    this.marker = null;
    this.coordinate = {lat: parseFloat(data.Latitude), lng: parseFloat(data.Longitude)};
    this.UniqueId = data.UniqueId;
    this.icon = icon;
    this.hasCard = false;
    this.create();
}

Marker.prototype.create = function() {
    var self = this;
    this.marker = new google.maps.Marker({
        position: this.coordinate,
        map: this.parent.map,
        icon: this.icon,
        title: ''
    });
    this.marker.setVisible(false);
    this.marker.addListener('click', function() {
        if (!self.hasCard) {
            var building = self.parent.getBuilding(self.UniqueId);
            self.createCard(building);
        }
        self.card.swop();
        
    });

};


Marker.prototype.createCard = function(building) {
    var card = new Card(this.app, this, building, this.parent.lastIndex);
    this.card = card;
    this.parent.cards.push(card);
    this.parent.lastIndex++;
    this.hasCard = true;
    return card;
};

Marker.prototype.show = function() {
    this.marker.setVisible(true);
};

Marker.prototype.select = function() {
    this.marker.setIcon(this.app.map.icon.selected);
    this.marker.setZIndex(10000);
};

Marker.prototype.unselect = function() {
    this.marker.setIcon(this.app.map.icon.standard);
    this.marker.setZIndex(0);
};


Marker.prototype.remove = function() {
    var index = this.app.map.markers.indexOf(this);
    this.eject();
    this.app.map.markers.splice(index, 1);
};

Marker.prototype.eject = function() {
    this.marker.setMap(null);
};

Marker.prototype.getPixelCoordinates = function(marker) {
    var scale = Math.pow(2, this.parent.map.getZoom()),
        nw = new google.maps.LatLng(
            this.parent.map.getBounds().getNorthEast().lat(),
            this.parent.map.getBounds().getSouthWest().lng()
        ),
        worldCoordinateNW = this.parent.map.getProjection().fromLatLngToPoint(nw),
        worldCoordinate = this.parent.map.getProjection().fromLatLngToPoint(this.marker.getPosition());
    return {
        x: Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        y: Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    }
};