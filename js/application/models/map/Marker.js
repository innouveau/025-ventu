function Marker(obj, coordinate, icon) {
    this.obj = obj;
    this.marker = null;
    this.coordinate = coordinate;
    this.icon = icon;
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
        var obj = self.obj;
        if (obj.card == null) {

            if (obj.status === 'love') {
                window.location.href = '/Interesselijst';
            } else if (obj.status === 'hate') {
                window.location.href = '/Prullenbak';
            } else {

                function callback(building) {
                    obj.createBuilding(building);
                    createAndLaunch();
                }

                function createAndLaunch() {

                    obj.createCard(window.ventu.manager.lastIndex);
                    obj.card.launch('normal');
                    window.ventu.manager.lastIndex++;

                    obj.card.swap();
                }

                if (obj.isPotentialForCard()) {
                    createAndLaunch();
                } else {
                    window.ventuApi.getObjectByUniqueId(obj.uniqueId, callback);
                }
            }
        } else {

            if (obj.status === 'love') {
                window.location.href = '/Interesselijst';
            } else if (obj.status === 'hate') {
                window.location.href = '/Prullenbak';
            } else {

                obj.card.swap();
            }
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
    this.obj.status = 'love';
    this.marker.setIcon(settings.icon.love);
    this.marker.setZIndex(10000);
};

Marker.prototype.hate = function () {
    this.obj.status = 'hate';
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
    var map = window.ventu.map.map,
        scale = Math.pow(2, map.getZoom()),
        nw = new google.maps.LatLng(
            map.getBounds().getNorthEast().lat(),
            map.getBounds().getSouthWest().lng()
        ),
        worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw),
        worldCoordinate = map.getProjection().fromLatLngToPoint(this.marker.getPosition());
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
