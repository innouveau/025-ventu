function Marker(obj, coordinate, icon) {
    this.obj = obj;
    this.marker = null;
    this.coordinate = coordinate;
    this.icon = icon;
    this.hasCard = false;
    this.isFavorite = icon == settings.icon.love;
    this.isTrash = icon == settings.icon.hate;
    this.create();
}

Marker.prototype.create = function() {
    var self = this;
    this.marker = new google.maps.Marker({
        position: this.coordinate,
        map: window.ventu.map.map,
        icon: this.icon,
        title: ''
    });


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

                var building = window.ventu.getBuildingById(self.UniqueId);

                function callback(building) {
                    var card = self.createCard(building);
                    card.launch('normal');
                    card.swap();
                }

                if (building === null) {
                    window.ventuApi.getObjectByUniqueId(self.UniqueId, callback);
                } else {
                    callback(building);
                }
            }

        } else {

            self.card.swap();
        }
    });
};

Marker.prototype.show = function() {
    this.marker.setVisible(true);
};

Marker.prototype.select = function() {
    this.marker.setIcon(settings.icon.selected);
    this.marker.setZIndex(10000);
};

Marker.prototype.unselect = function() {
    this.marker.setIcon(settings.icon.standard);
    this.marker.setZIndex(0);
};

Marker.prototype.love = function () {
    this.isFavorite = true;
    this.marker.setIcon(settings.icon.love);
    this.marker.setZIndex(10000);
};

Marker.prototype.hate = function () {
    this.isTrash = true;
    this.marker.setIcon(settings.icon.hate);
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
