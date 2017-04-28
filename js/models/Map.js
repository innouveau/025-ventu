function Map() {
    this.icon = {
        standard: '/img/markers/standard-marker.png',
        selected: '/img/markers/selected-marker.png',
        trash: '/img/markers/trash-marker.png',
        favorite: '/img/markers/favorite-marker.png',
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
    this.shapes = [];
    this.markers = [];
    this.cards = [];
    this.lastIndex = 0;
    this.markerClusterer = null;
    this.init();
    this.mapHasBeenFitToBounds = false;
}

Map.prototype.init = function() {
    var myOptions = {
        zoom: 9,
        center: new google.maps.LatLng(52, 5),
        sensor: 'true',
        draggable: true,
        streetViewControl: false
    };

    var mapContainer = document.getElementById("ventu-canvas");
    if (mapContainer)
    {
        this.map = new google.maps.Map(mapContainer, myOptions);
        window.ventu.config.isMapPresent = true;
    }
    else {
        window.ventu.config.isMapPresent = false;
    }


};

Map.prototype.draw = function(data, leaveshape) {
    var self = this;
    this.lastIndex = 0;
    if (!leaveshape) {
        this._removeShape();
    }
    this._removeMarkers();
    this._removeCards();

    if (!leaveshape && window.showGoogleMapObjects == undefined) {
        this._drawShape(data);
    }

    if (data.markers && data.markers.length > 0) {
        this._createMarkers(data.markers);
        this._createCards();

        if (window.showGoogleMapObjects == undefined) {
            setTimeout(function () {
                self._showMarkers();
            }, 500);
        }

        if (self.cards.length > 0) {
            setTimeout(function () {
                // init launch cascade
                self.currentCard = self.cards[0];
                self.cards[0].launch();
            }, 1000);
        }
    }
};



// poly

Map.prototype._drawShape = function (data) {

    var self = this;
    if (data.shape) {
        switch (data.shape.type) {
            case 'poly':

                if (data.shape.data.points != null && data.shape.data.points.length > 0) {
                    $.each(data.shape.data.points, function (index, points) {
                        var shape = new google.maps.Polygon({
                            paths: points,
                            strokeColor: self.settings.shape.strokeColor,
                            strokeOpacity: self.settings.shape.strokeOpacity,
                            strokeWeight: self.settings.shape.strokeWeight,
                            fillColor: self.settings.shape.fillColor,
                            fillOpacity: self.settings.shape.fillOpacity
                        });
                        shape.setMap(self.map);
                        self.shapes.push(shape);
                        //self.setPolygonEvents(shape);
                    });
                }

                break;
            case 'circle':
                var shape = new google.maps.Circle({
                    strokeColor: self.settings.shape.strokeColor,
                    strokeOpacity: self.settings.shape.strokeOpacity,
                    strokeWeight: self.settings.shape.strokeWeight,
                    fillColor: self.settings.shape.fillColor,
                    fillOpacity: self.settings.shape.fillOpacity,
                    center: data.shape.data.center,
                    radius: data.shape.data.radius,
                    map: self.map,
                    editable: true,
                    draggable: true
                });
                self.shapes.push(shape);
                self.setCircleEvents(shape);

                break;
            case 'rect':
                var shape = new google.maps.Rectangle({
                    strokeColor: self.settings.shape.strokeColor,
                    strokeOpacity: self.settings.shape.strokeOpacity,
                    strokeWeight: self.settings.shape.strokeWeight,
                    fillColor: self.settings.shape.fillColor,
                    fillOpacity: self.settings.shape.fillOpacity,
                    map: self.map,
                    bounds: {
                        north: data.shape.data.north,
                        south: data.shape.data.south,
                        east: data.shape.data.east,
                        west: data.shape.data.west
                    },
                    draggable: true,
                    editable: true

                });

                self.shapes.push(shape);
                self.setRectangleEvents(shape);
                break;
        }
    }
    //self.map.setCenter(data.zoomCenter);
    //self.map.setZoom(data.zoom);
};

Map.prototype.setCircleEvents = function (shape) {
    google.maps.event.addListener(shape, 'radius_changed', function () {
        var radius = shape.getRadius();
        if (radius > ventu.service.filter.searchArea.max)
        {
            radius = ventu.service.filter.searchArea.max;
        }
        else if (radius < ventu.service.filter.searchArea.min)
        {
            radius = ventu.service.filter.searchArea.min;
        }
        radius = Math.ceil(radius);

        $('#ventu-filter-circle-km').val(radius);
        ventu.service.filter.searchArea.circleM = radius;

        //ventu.map.shapes = [];
        //ventu.map.shapes.push(shape);

        saveAllFilters();
    });
    this.setDragEndEvent(shape);
};

Map.prototype.setRectangleEvents = function (shape) {
    //var timeout;
    //google.maps.event.addListener(shape, 'bounds_changed', function () {
    //    window.clearTimeout(timeout);
    //    timeout = window.setTimeout(function () {
    //        alert("get all objects within this rectangle");
    //    });
    //}, 500);
    this.setDragEndEvent(shape);
};

//Map.prototype.setPolygonEvents = function (shape) {
//    google.maps.event.addListener(shape, 'radius_changed', function () {
//        alert("get all objects within this polygon");
//    });
//    this.setDragEndEvent(shape);
//};

Map.prototype.setDragEndEvent = function (shape) {
    google.maps.event.addListener(shape, 'dragend', function () {

        //ventu.map.shapes = [];
        //ventu.map.shapes.push(shape);
        
        ventu.service.filterUpdate(true);
    });
};

Map.prototype._removeShape = function () {
    $(this.shapes).each(function (index, shape) {
        shape.setMap(null);
    });

    this.shapes = [];
};



// markers

Map.prototype._removeMarkers = function() {
    for (var i = 0, l = this.markers.length; i < l; i++) {
        this.markers[i].eject();
    }
    this.markers = [];
};

Map.prototype._createMarkers = function(markers) {
    var self = this;

    for (var i = 0, l = markers.length; i < l; i++) {
        var icon = i === 0 ? this.icon.selected : this.icon.standard;

        var favorites = $.sessionStorage.get('ventu-favorites');

        if (favorites) {
            $(favorites).each(function (index, element) {
                if (element.uniqueId == markers[i].UniqueId) {
                    icon = self.icon.favorite;
                    return false;
                }
            });
        }

        var trash = $.sessionStorage.get('ventu-trash');

        if (trash) {
            $(trash).each(function (index, element) {
                if (element.uniqueId == markers[i].UniqueId) {
                    icon = self.icon.trash;
                    return false;
                }
            });
        }

        var marker = new Marker(this, markers[i], icon);
        this.markers.push(marker);
    }
};

Map.prototype._showMarkers = function () {

    if (this.markerClusterer != null) {
        this.markerClusterer.clearMarkers();
    }

    var internalMarkers = [];

    $.each(this.markers, function (index, marker) {
        internalMarkers.push(marker.marker);
    });

    var styles = [{
        url: '/img/markerclusterer/m1.png',
        height: 25,
        width: 25,
        textColor: '#ffffff',
        textSize: 10,
    }];


    if (this.markerClusterer == null) {
        this.markerClusterer = new MarkerClusterer(this.map, internalMarkers, {
            imagePath: '/img/markerclusterer/m',
            gridSize: 30,
            styles: styles
        });
    } else {
        this.markerClusterer.addMarkers(internalMarkers);
    }

    //markerClusterer.fitMapToMarkers();

    this.fitMapToBounds();
};

Map.prototype.fitMapToBounds = function () {

    this.mapHasBeenFitToBounds = true;

    var bounds = new google.maps.LatLngBounds();

    if (this.shapes.length > 0) {

        $(this.shapes).each(function (index, shape) {

            if (shape instanceof google.maps.Polygon) {
                var path = shape.getPath();

                for (var i = 0; i < path.getLength() ; i++) {
                    var xy = path.getAt(i);

                    bounds.extend(new google.maps.LatLng(xy.lat(), xy.lng()));
                }
            } else if (shape instanceof google.maps.Circle) {
                bounds = shape.getBounds();
            } else if (shape instanceof google.maps.Rectangle) {
                bounds = shape.getBounds();
            }
        });

    } else {

        var internalMarkers = [];

        $.each(this.markers, function (index, marker) {
            bounds.extend(marker.marker.getPosition());
        });

    }

    this.map.fitBounds(bounds);

    //if (this.shapes.length == 0) {
    //    this.map.setZoom(12);
    //}

    var x = Math.floor(this.map.getDiv().offsetWidth / 6);
    this.map.panBy(x, 0);
};


// cards

Map.prototype._removeCards = function() {
    for (var i = 0, l = this.cards.length; i < l; i++) {
        this.cards[i].destroy(false);
    }
    this.cards = [];
};

Map.prototype._createCards = function() {
    var n = this.markers.length > window.ventu.config.stack.max ? window.ventu.config.stack.max : this.markers.length;

    for (var i = 0; i < n; i++) {
        var marker = this.markers[i],
            building = this.getBuilding(marker.UniqueId);

        if (building) {
            marker.createCard(building);
        }
        
    }
};

Map.prototype.getBuilding = function(UniqueId) {
    for (var i = 0, l = window.ventu.objects.length; i < l; i++) {
        var obj = window.ventu.objects[i];
        if (obj.UniqueId === UniqueId) {
            return new Building(obj);
        }
    }
    return null;
};

Map.prototype.createNewCard = function() {
    var data = this._getMarker(),
        card,
        wait = 0;
    if (data) {
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
        setTimeout(function () {
            card.launch('soft');
        }, wait);
    }

};

Map.prototype._getMarker = function() {
    for (var i = 0, l = this.markers.length; i < l; i++) {
        var marker = this.markers[i],
            building;
        if (!marker.hasCard && !marker.isFavorite && !marker.isTrash) {
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





