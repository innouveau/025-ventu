function Marker(app, parent, data, icon) {
    this.app = app;
    this.parent = parent;
    this.marker = null;
    this.coordinate = {lat: parseFloat(data.Latitude), lng: parseFloat(data.Longitude)};
    this.UniqueId = data.UniqueId;
    this.icon = icon;
    this.hasCard = false;
    this.create();
}

Marker.prototype.create = function() {
    this.marker = new google.maps.Marker({
        position: this.coordinate,
        map: this.parent.map,
        icon: this.icon,
        title: ''
    });
    this.marker.setVisible(false)
};

Marker.prototype.show = function() {
    this.marker.setVisible(true);
};

Marker.prototype.select = function() {
    this.marker.setIcon(this.app.map.icon.selected);
    this.marker.setZIndex(10000);
};


Marker.prototype.remove = function() {
    var index = this.app.map.markers.indexOf(this);
    this.marker.setMap(null);
    this.app.map.markers.splice(index, 1);

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