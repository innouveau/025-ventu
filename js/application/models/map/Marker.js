function Marker(parent, data, icon) {
    this.parent = parent;
    this.card = null;
    this.marker = null;
    this.coordinate = {lat: parseFloat(data.Latitude), lng: parseFloat(data.Longitude)};
    this.UniqueId = data.UniqueId;
    this.icon = icon;
    this.hasCard = false;
    this.isFavorite = icon == window.ventu.map.icon.favorite;
    this.isTrash = icon == window.ventu.map.icon.trash;
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

    //var lat = this.marker.position.lat();

    //if (lat == 0) {
    //    console.log('self.UniqueId ', self.UniqueId, self.coordinate.lat);
    //}

    if (window.showGoogleMapObjects !== undefined && !showGoogleMapObjects) {
        this.marker.setVisible(false);
    }

    this.marker.addListener('click', function() {
        if (!self.hasCard) {

            if (self.isFavorite) {
                window.location.href = '/Interesselijst';
            } else if (self.isTrash) {
                window.location.href = '/Prullenbak';
            } else {

                var building = self.parent.getBuilding(self.UniqueId);

                function callback(building) {
                    var card = self.createCard(building);
                    card.launch('soft');
                    card.swap();
                }

                if (building == null) {
                    window.ventu.service.GetObjectByUniqueId(self.UniqueId, callback);
                } else {
                    callback(building);
                }
            }

        } else {

            self.card.swap();
        }
    });
};

// TODO move to Map?
Marker.prototype.createCard = function(building) {
    var card = new Card(this, building, this.parent.lastIndex);
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
    this.marker.setIcon(window.ventu.map.icon.selected);
    this.marker.setZIndex(10000);
};

Marker.prototype.unselect = function() {
    this.marker.setIcon(window.ventu.map.icon.standard);
    this.marker.setZIndex(0);
};

Marker.prototype.favorite = function () {
    this.isFavorite = true;
    this.marker.setIcon(window.ventu.map.icon.favorite);
    this.marker.setZIndex(10000);
};

Marker.prototype.trash = function () {
    this.isTrash = true;
    this.marker.setIcon(window.ventu.map.icon.trash);
    this.marker.setZIndex(0);
};


Marker.prototype.remove = function() {
    var index = window.ventu.map.markers.indexOf(this);
    this.eject();
    window.ventu.map.markers.splice(index, 1);
};

Marker.prototype.eject = function() {
    this.marker.setMap(null);
};



// getters

Marker.prototype._getPixelCoordinates = function(marker) {
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

Marker.prototype.getTransform = function() {
    var position = this._getPixelCoordinates(),
        windowWidth = $(window).outerWidth(),
        markerWidth = 48,
        cardWidth = 500,
        padding = 40,
        translateX = windowWidth - padding - (0.5 * cardWidth) - position.x - 1,
        translateY = padding,
        scale = markerWidth / cardWidth;
    return [-translateX, -translateY, 0, 0, 0, 0, scale, scale];
};

