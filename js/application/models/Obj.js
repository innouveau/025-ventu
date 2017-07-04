function Obj(obj) {
    this.uniqueId = obj.UniqueId;
    this.coordinate = {lat: parseFloat(obj.Latitude), lng: parseFloat(obj.Longitude)};
    this.card = null;
    this.marker = null;
    this.building = null;
    this.createMarker();
}

Obj.prototype.createMarker = function() {
    if (window.ventu.config.isMapPresent) {
        this.marker = new Marker(this, this.coordinate, settings.icon.standard);
    }
};

Obj.prototype.createCard = function(index) {
    this.card = new Card(this, index);

};