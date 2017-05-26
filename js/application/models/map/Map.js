function Map() {
    this.hasMap = false;
    this.icon = {
        standard: 'img/markers/standard-marker.png',
        selected: 'img/markers/selected-marker.png',
        hate: 'img/markers/marker-hate.png',
        love: 'img/markers/marker-love.png'
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
    this.status = {
        found: 0,
        left: 0,
        love: 0,
        hate: 0,
        tilesloaded: false
    };
    this.currentCard = null;
    this.map = null;
    this.shapes = [];
    this.markers = [];
    this.cards = [];
    this.lastIndex = 0;
    this.markerClusterer = null;
    this.mapHasBeenFitToBounds = false;

    this.init();
}

Map.prototype = Object.create(_Map.prototype);

Map.prototype.draw = function(result, leaveshape) {
    var self = this,
        launchType;
    this.lastIndex = 0;
    this._cleanUp(leaveshape);
    this.status.found = result.markers.length;
    this.status.left = result.markers.length;
    this.updateDom();

    if (!leaveshape && window.showGoogleMapObjects == undefined) {
        this._drawShape(result);
    }

    if (result.markers && result.markers.length > 0) {
        this._createMarkers(result.markers);
        this._createCards();

        if (window.showGoogleMapObjects == undefined) {
            setTimeout(function () {
                self._showMarkers();
            }, 500);
        }
        if (this.cards.length > 0) {
            launchType = self._getLaunchType();
            this.currentCard = self.cards[0];
            if (!this.status.tilesloaded) {
                google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
                    self.cards[0].launch(launchType);
                    self.status.tilesloaded = true;
                });
            } else {
                this.cards[0].launch(launchType);
            }
        }
    }
};


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
        this.hasMap = true;
    } else {
        window.ventu.config.isMapPresent = false;
        this.hasMap = false;
    }
};

Map.prototype._createCards = function () {

    var n = window.ventu.objects.length > window.ventu.config.stack.max ? window.ventu.config.stack.max : window.ventu.objects.length;
    for (var i = 0; i < n; i++) {
        var obj = window.ventu.objects[i];

        var marker = null;
        for (var j = 0; j < this.markers.length; j++) {
            marker = this.markers[j];

            if (marker.UniqueId == obj.UniqueId) {
                break;
            }
        }

        if (marker != null) {
            marker.createCard(new Building(obj));
        }
    }
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
            // because this card will be on top, it would graphically interfere with
            // the added card, we have to wait until it is disappeared
            wait = 800
        }
        card = data.marker.createCard(data.building);
        setTimeout(function () {
            card.launch('normal');
        }, wait);
    }
};

Map.prototype._cleanUp = function(leaveshape) {
    if (!leaveshape) {
        this._removeShape();
    }
    this._removeMarkers();
    this._removeCards();
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
                            strokeColor: self.settings.shape.strokeColor,
                            strokeOpacity: self.settings.shape.strokeOpacity,
                            strokeWeight: self.settings.shape.strokeWeight,
                            fillColor: self.settings.shape.fillColor,
                            fillOpacity: self.settings.shape.fillOpacity
                        });
                        shape.setMap(self.map);
                        self.shapes.push(shape);
                    });
                }

                break;
            case 'circle':
                shape = new google.maps.Circle({
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
                this.shapes.push(shape);
                this.setCircleEvents(shape);

                break;
            case 'rect':
                shape = new google.maps.Rectangle({
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

                this.shapes.push(shape);
                this.setRectangleEvents(shape);
                break;
        }
    }
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

Map.prototype.setDragEndEvent = function (shape) {
    google.maps.event.addListener(shape, 'dragend', function () {

        //ventu.map.shapes = [];
        //ventu.map.shapes.push(shape);

        window.ventuApi.select();
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
    var icon, self = this;

    for (var i = 0, l = markers.length; i < l; i++) {
        icon = i === 0 ? this.icon.selected : this.icon.standard;

        var favorites = $.sessionStorage.get('ventu-favorites');

        if (favorites) {
            $(favorites).each(function (index, element) {
                if (element.uniqueId == markers[i].UniqueId) {
                    icon = self.icon.love;
                    return false;
                }
            });
        }

        var trash = $.sessionStorage.get('ventu-trash');

        if (trash) {
            $(trash).each(function (index, element) {
                if (element.uniqueId == markers[i].UniqueId) {
                    icon = self.icon.hate;
                    return false;
                }
            });
        }

        var marker = new Marker(this, markers[i], icon);
        this.markers.push(marker);
    }
};

Map.prototype._showMarkers = function () {
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




