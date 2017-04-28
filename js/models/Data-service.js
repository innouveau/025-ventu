function DataService() {
    this.lastSearchResult = null;
    this.filter = {
        area: {
            min: 0,
            max: 9999999
        },
        offer: [], //['Koop', 'Huur', 'Belegging'],
        type: [],
        searchArea: {
            type: 'none',
            circleM: 3000,
            rectM1: 3000,
            rectM2: 2000,
            min: 1,
            max: 9999
        },
        organizationGuid: null,
        city: null,
        postcode: null,
        postcodes: null
    };
    this.ajaxRequest = null;
}

DataService.prototype.getOrganizationSearchResults = function (search, searchResultsCallback) {

    if (this.ajaxRequest != null) {
        this.ajaxRequest.abort();
    }

    var searchQuery = {
        searchQuery: search
    }

    this.ajaxRequest = this.ajaxPost('/Application/GetOrganizationSearchResults', searchQuery).done(function (data) {
        searchResultsCallback(data);
    }).fail(function (data) {
    }).always(function (data) {
    });
};


DataService.prototype.getSearchResults = function (searchQuery, searchResultsCallback) {

    if (this.ajaxRequest != null) {
        this.ajaxRequest.abort();
    }

    var self = this;

    if (window.ventu.map) {
        window.ventu.map.mapHasBeenFitToBounds = false;
    }

    var searchFilter = this.getSearchFilter(searchQuery);
    searchFilter.Search = searchQuery;

    this.ajaxRequest = this.ajaxPost('/Application/GetSearchResults', searchFilter).done(function (data) {
        searchResultsCallback(data);        
    }).fail(function (data) {
    }).always(function (data) {
    });
};


DataService.prototype.filterUpdate = function (leaveShape) {
    window.ventu.select(this.lastSearchResult, false, leaveShape);
};

DataService.prototype.getList = function (type) {
    if (type === 'love') {
        return [];
    } else {
        return [];
    }
};

DataService.prototype.setSearchFilters = function (searchFilter) {
    var primaryUsageids = [];

    this.filter.postcodes = searchFilter.Postcodes;
    this.filter.city = searchFilter.City;
    this.filter.organizationGuid = searchFilter.OrganizationGuid;
    this.filter.building = searchFilter.Building;
    var metragearray = (searchFilter.MetrageRange ? searchFilter.MetrageRange.split(',') : null);
    this.filter.area.min = metragearray && metragearray[0] ? metragearray[0] : 0;
    this.filter.area.max = metragearray && metragearray[1] ? metragearray[1] : 9999999;
    this.filter.searchArea.circleM = searchFilter.Radius;
    this.filter.searchArea.rectM1 = searchFilter.RectKm1;
    this.filter.searchArea.rectM2 = searchFilter.RectKm2;
    this.filter.type = (((searchFilter.ObjectUsage) && searchFilter.ObjectUsage.length > 0) ? searchFilter.ObjectUsage.split(',') : '');


    var str = (searchFilter.ObjectType) ? searchFilter.ObjectType.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    }) : null;

    this.filter.offer = (((str) && str.length>0) ? str.split(',') : ['Huur', 'Koop', 'Beleggingen']);
}

DataService.prototype.getSearchFilter = function () {

    var primaryUsageIds = [];

    //if ($('select').val() != null && $('select').val() !== undefined) {
    //    $.each($('select').find(":selected"), function (index, value) {
    //        primaryUsageIds.push($(value).data('id'));
    //    });
    //}
    //else

    if (this.filter.type.length > 0) {
        $.each(this.filter.type, function (index, type) {
            if (type.toLowerCase() == 'kantoor') {
                primaryUsageIds.push(1);
            }
            if (type.toLowerCase() == 'bedrijfsruimte') {
                primaryUsageIds.push(2);
            }
            if (type.toLowerCase() == 'winkel') {
                primaryUsageIds.push(3);
            }
            if (type.toLowerCase() == 'distributie') {
                primaryUsageIds.push(9);
            }
            if (type.toLowerCase() == 'horeca') {
                primaryUsageIds.push(4);
            }
            if (type.toLowerCase() == 'overig') {
                primaryUsageIds.push(5);
            }
            if (type.toLowerCase() == 'grond') {
                primaryUsageIds.push(8);
            }

        });
    }

    var objectTypeIds = [];
    $.each(this.filter.offer, function (index, offer) {
        if (offer.toLowerCase() == 'huur') {
            objectTypeIds.push(2);
        }
        if (offer.toLowerCase() == 'koop') {
            objectTypeIds.push(1);
        }
        if (offer.toLowerCase() == 'belegging') {
            objectTypeIds.push(4);
        }
    });

    var hasMap = window.ventu.map != null && window.ventu.map.map != null && window.ventu.map.map.getCenter();

    var shape = 0;
    if (hasMap) {
        shape = $('input[name=search-area]:checked').val() == 'circle' ? 1 : ($('input[name=search-area]:checked').val() == 'rect' ? 2 : 0);
    }

    if (shape == 1 && hasMap && window.ventu.map.mapHasBeenFitToBounds) {
        var x = Math.floor(window.ventu.map.map.getDiv().offsetWidth / 6);
        window.ventu.map.map.panBy(-x, 0);
    }

    var latlng = hasMap ? window.ventu.map.map.getCenter() : null;

    if (shape == 1) {

        $(window.ventu.map.shapes).each(function (index, shape) {

            if (shape instanceof google.maps.Polygon) {
            } else if (shape instanceof google.maps.Circle) {
                latlng = shape.getCenter();
            } else if (shape instanceof google.maps.Rectangle) {
                
            }
        });
    }

    var uniqueObjectIds = [];

    var favorites = $.sessionStorage.get('ventu-favorites');

    if (favorites) {
        $(favorites).each(function (index, element) {
            uniqueObjectIds.push(element.uniqueId);
        });
    }

    var trash = $.sessionStorage.get('ventu-trash');

    if (trash) {
        $(trash).each(function (index, element) {
            uniqueObjectIds.push(element.uniqueId);
        });
    }

    var searchFilter = {
        UniqueObjectIds: uniqueObjectIds,
        Postcodes: this.filter.postcodes,
        City: this.filter.city,
        OrganizationGuid: this.filter.organizationGuid,
        PrimaryUsageIds: primaryUsageIds,
        ObjectTypeIds: objectTypeIds,
        MetrageRange: this.filter.area.min + ',' + this.filter.area.max,
        Shape: shape,
        CircleLat: shape == 1 ? latlng.lat() : 0,
        CircleLng: shape == 1 ? latlng.lng() : 0,
        Radius: shape == 1 ? this.filter.searchArea.circleM : 0,
        RectKm1: shape == 2 ? this.filter.searchArea.rectM1 : 0,
        RectKm2: shape == 2 ? this.filter.searchArea.rectM2 : 0
    };

    return searchFilter;
}


DataService.prototype.getSelectResults = function (searchQuery, callback) {

    var self = this;

    function completed() {

        if (self.ajaxRequest != null) {
            self.ajaxRequest.abort();
        }

        var searchFilter = self.getSearchFilter();

        if (searchQuery && searchQuery.Location) {
            searchFilter.City = $(searchQuery.Location).data('city');
            searchFilter.Street = $(searchQuery.Location).data('street');
            searchFilter.Postcode = $(searchQuery.Location).data('postcode');
            searchFilter.Building = $(searchQuery.Location).data('building');
        }

        self.ajaxSelect(searchFilter, callback);
    }

    if (SearchUtil) {
        var timeout = SearchUtil.fetchingResources ? 500 : 0;

        setTimeout(function () {
            SearchUtil.getResources('Ventu2.LocalResources.Home', completed);
        }, timeout);
    } else {
        completed();
    }
    
};

DataService.prototype.ajaxSelect = function (searchFilter, callback) {

    var self = this;

    this.ajaxRequest = this.ajaxPost('/Application/GetSelectResults', searchFilter).done(function (data) {

        var shape;

        switch (self.filter.searchArea.type) {
            case 'circle':
                shape = {
                    type: 'circle',
                    data: {
                        center: { lat: searchFilter.CircleLat, lng: searchFilter.CircleLng },
                        radius: self.filter.searchArea.circleM
                    }
                };
                break;
            case 'none':
                shape = {
                    type: 'poly',
                    data: {
                        points: data.GoogleMapsShape
                    }
                };
                break;
            case 'rect':
                shape = {
                    type: 'rect',
                    data: {
                        north: 52.32179,
                        south: 52.36179,
                        west: 4.8454733,
                        east: 4.9254733
                    }
                };
                break
        }

        window.ventu.config.stack.max = data.SearchObjects.length;

        callback({
            shape: shape,
            zoomCenter: null,
            zoom: null,
            markers: data.GoogleMapsObjects,
            objects: data.SearchObjects
        });

    }).fail(function (data) {
    }).always(function (data) {
    });
}

DataService.prototype.translate = function (string) {
    // no need to translate in development modus
    return string;
};

DataService.prototype.post = function (id) {
    var n = Math.round((this.buildings.length - 1) * Math.random());
    window.ventu.objects.push(new Building(this.buildings[n]))
};

DataService.prototype.sessionStore = function (objects) {
    // do nothing
};

DataService.prototype.GetObjectByUniqueId = function (uniqueId, callback) {

    var self = this;

    self.ajaxPost('/Application/GetObjectByUniqueId', { uniqueId: uniqueId }).done(function (data) {
        window.ventu.objects.push(data);

        callback(window.ventu.map.getBuilding(uniqueId));
    }).fail(function (data) {
    }).always(function (data) {
    });
}

DataService.prototype.ajaxPost = function (url, data) {
    return $.ajax({
        url: url,
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data)
    });
}