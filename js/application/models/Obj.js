function Obj(obj) {
    this.uniqueId = obj.UniqueId;
    this.coordinate = {lat: parseFloat(obj.Latitude), lng: parseFloat(obj.Longitude)};
    this.status = this.getStatus();
    this.addedToList = false;
    this.card = null;
    this.marker = null;
    this.building = null;
    this.createMarker();
}

Obj.prototype.getStatus = function(index) {
    if (this.isOfType('love')) {
        return 'love';
    } else if (this.isOfType('hate')) {
        return 'hate';
    } else {
        return 'standard';
    }
};

Obj.prototype.isOfType = function(type) {
    if (window.ventu[type + 'Objects']) {
        for (var i = 0, l = window.ventu.user[type + 'Objects'].length; i < l; i++) {
            if (this.uniqueId === window.ventu.user[type + 'Objects'][i].uniqueId) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
};

Obj.prototype.createMarker = function() {
    if (window.ventu.config.isMapPresent) {
        this.marker = new Marker(this, this.coordinate, this.status);
        window.ventu.map.markers.push(this.marker);
    }
};

Obj.prototype.createCard = function(index) {
    this.card = new Card(this, index);
    window.ventu.cards.push(this.card);
};

Obj.prototype.createBuilding = function(building) {
    this.building = new Building(this, building);
};

// status

Obj.prototype.isPotentialForCard = function() {
    return this.building && !this.card;
};

Obj.prototype.needsToLoad = function() {
    return !this.building;
};

