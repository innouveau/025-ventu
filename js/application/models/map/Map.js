function Map() {
    this.status = {
        tilesloaded: false,
        mapHasBeenFitToBounds: false
    };

    this.map = null;
    this.shapes = [];
    this.markers = [];
    this.markerClusterer = null;
    this.init();
}

Map.prototype.init = function() {
    var mapContainer,
        myOptions = {
            zoom: 9,
            center: new google.maps.LatLng(52, 5),
            sensor: 'true',
            draggable: true,
            streetViewControl: false,
            mapTypeControl: false
        };

    mapContainer = document.getElementById('ventu-canvas');
    if (mapContainer) {
        this.map = new google.maps.Map(mapContainer, myOptions);
        window.ventu.config.isMapPresent = true;
    } else {
        window.ventu.config.isMapPresent = false;
    }
};

Map.prototype.draw = function(result, leaveshape) {
    var self = this;
    this._cleanUp(leaveshape);

    if (!leaveshape) {
        if (result.shape) {
            this._drawShape(result.shape);
        }

    }

    if (result.markers.length > 0) {
        setTimeout(function () { // needs timeout to fire async
            self.showMarkers();
        }, 1);
    }
};

Map.prototype._cleanUp = function(leaveshape) {
    if (!leaveshape) {
        this._removeShape();
    }
    this._removeMarkers();
    window.ventu.manager.removeCards();
};

Map.prototype._drawShape = function(initialShape) {
    var self = this,
        shape;
    switch (initialShape.type) {
        case 'poly':
            if (initialShape.data.points !== null && initialShape.data.points.length > 0) {
                $.each(initialShape.data.points, function (index, points) {
                    var shape = new google.maps.Polygon({
                        paths: points,
                        strokeColor: settings.shape.strokeColor,
                        strokeOpacity: settings.shape.strokeOpacity,
                        strokeWeight: settings.shape.strokeWeight,
                        fillColor: settings.shape.fillColor,
                        fillOpacity: settings.shape.fillOpacity
                    });
                    shape.setMap(self.map);
                    self.shapes.push(shape);
                });
            }

            break;
        case 'circle':
            shape = new google.maps.Circle({
                strokeColor: settings.shape.strokeColor,
                strokeOpacity: settings.shape.strokeOpacity,
                strokeWeight: settings.shape.strokeWeight,
                fillColor: settings.shape.fillColor,
                fillOpacity: settings.shape.fillOpacity,
                center: initialShape.data.center,
                radius: initialShape.data.radius,
                map: self.map,
                editable: true,
                draggable: true
            });
            this.shapes.push(shape);
            this.setCircleEvents(shape);

            break;
        case 'rect':
            shape = new google.maps.Rectangle({
                strokeColor: settings.shape.strokeColor,
                strokeOpacity: settings.shape.strokeOpacity,
                strokeWeight: settings.shape.strokeWeight,
                fillColor: settings.shape.fillColor,
                fillOpacity: settings.shape.fillOpacity,
                map: self.map,
                bounds: {
                    north: initialShape.data.north,
                    south: initialShape.data.south,
                    east: initialShape.data.east,
                    west: initialShape.data.west
                },
                draggable: true,
                editable: true

            });

            this.shapes.push(shape);
            this.setRectangleEvents(shape);
            break;
    }
};

Map.prototype.setCircleEvents = function (shape) {
    google.maps.event.addListener(shape, 'radius_changed', function () {
        var radius = shape.getRadius();

        if (window.filter) {
            radius = Math.ceil(radius / 1000);

            window.filter.query.searchType.size = radius;
            window.filter.updateSearchType();
            $('#ventu-filter-search-type-cirkel').val(radius);

            window.filter.execute();
        }
    });
    this.setDragEndEvent(shape);
};

Map.prototype.setRectangleEvents = function (shape) {
    this.setDragEndEvent(shape);
};

Map.prototype.setDragEndEvent = function (shape) {
    google.maps.event.addListener(shape, 'dragend', function () {

        if (window.filter) {
            window.filter.execute();
        }

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

Map.prototype.showMarkers = function () {
    if (this.markerClusterer !== null) {
        this.markerClusterer.clearMarkers();
    }

    var internalMarkers = [];

    $.each(this.markers, function (index, marker) {
        internalMarkers.push(marker.marker);
    });

    if (this.markerClusterer === null) {
        this.markerClusterer = new MarkerClusterer(this.map, internalMarkers, {
            imagePath: '/img/markers/markerclusterer/m',
            gridSize: 30,
            styles: settings.markerClusterStyles
        });
    } else {
        this.markerClusterer.addMarkers(internalMarkers);
    }
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
    var x = Math.floor(this.map.getDiv().offsetWidth / 6);
    this.map.panBy(x, 0);
};
