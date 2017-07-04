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

    mapContainer = document.getElementById("ventu-canvas");
    if (mapContainer) {
        this.map = new google.maps.Map(mapContainer, myOptions);
        window.ventu.config.isMapPresent = true;
    } else {
        window.ventu.config.isMapPresent = false;
    }
};

Map.prototype.draw = function(result, leaveshape) {
    var self = this,
        launchType;
    this._cleanUp(leaveshape);

    if (!leaveshape && window.showGoogleMapObjects === undefined) {
        this._drawShape(result);
    }

    if (result.markers && result.markers.length > 0) {
        this.createMarkers(result.markers);


        if (window.showGoogleMapObjects === undefined) {
            setTimeout(function () {
                self.showMarkers();
            }, 500);
        }
    }
};







Map.prototype._cleanUp = function(leaveshape) {
    if (!leaveshape) {
        this._removeShape();
    }
    this._removeMarkers();
    window.ventu.manager.removeCards();
};

Map.prototype._drawShape = function(data) {
    var self = this,
        shape;
    if (data.shape) {
        switch (data.shape.type) {
            case 'poly':
                if (data.shape.data.points !== null && data.shape.data.points.length > 0) {
                    $.each(data.shape.data.points, function (index, points) {
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
                    center: data.shape.data.center,
                    radius: data.shape.data.radius,
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
                        north: data.shape.data.north,
                        south: data.shape.data.south,
                        east: data.shape.data.east,
                        west: data.shape.data.west
                    },
                    draggable: true,
                    editable: true

                });

                this.shapes.push(shape);
                this.setRectangleEvents(shape);
                break;
        }
    }
};

Map.prototype.setCircleEvents = function (shape) {
    google.maps.event.addListener(shape, 'radius_changed', function () {
        var radius = shape.getRadius();

        if (window.filter) {
            if (radius > window.filter.query.area[1]) {
                radius = window.filter.query.area[1];
            }
            else if (radius < window.filter.query.area[0]) {
                radius = window.filter.query.area[0];
            }
            radius = Math.ceil(radius / 1000);

            window.filter.query.searchType.size = radius;
            $('#ventu-filter-search-type-cirkel').val(radius);

            window.filter.execute();
        }
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

Map.prototype.createMarkers = function(markers) {
    var icon, self = this;

    for (var i = 0, l = markers.length; i < l; i++) {
        icon = i === 0 ? settings.icon.selected : settings.icon.standard;

        var favorites = $.sessionStorage.get('ventu-favorites');

        if (favorites) {
            $(favorites).each(function (index, element) {
                if (element.uniqueId === markers[i].UniqueId) {
                    icon = self.icon.love;
                    return false;
                }
            });
        }

        var trash = $.sessionStorage.get('ventu-trash');

        if (trash) {
            $(trash).each(function (index, element) {
                if (element.uniqueId === markers[i].UniqueId) {
                    icon = self.icon.hate;
                    return false;
                }
            });
        }

        var marker = new Marker(this, markers[i], icon);
        this.markers.push(marker);
    }
};

Map.prototype.showMarkers = function () {
    if (this.markerClusterer !== null) {
        this.markerClusterer.clearMarkers();
    }

    var internalMarkers = [];

    $.each(this.markers, function (index, marker) {
        internalMarkers.push(marker.marker);
    });

    var styles = [{
        url: 'img/markers/markerclusterer/m1.png',
        height: 25,
        width: 25,
        textColor: '#ffffff',
        textSize: 10
    }];


    if (this.markerClusterer === null) {
        this.markerClusterer = new MarkerClusterer(this.map, internalMarkers, {
            imagePath: '/img/markers/markerclusterer/m',
            gridSize: 30,
            styles: styles
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



// getters

Map.prototype.getUnusedMarkerObject = function() {
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
