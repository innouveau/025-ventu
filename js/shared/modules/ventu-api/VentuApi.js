function VentuApi() {
    this.searchFilter = null;
}

/* localization resources */

VentuApi.prototype.getResourceValue = function (resourceFile, resourceName) {
    var result = resourceName;

    if (localizationResources &&
        localizationResources[resourceFile] &&
        localizationResources[resourceFile][resourceName]) {

        result = localizationResources[resourceFile][resourceName];
    }

    return result;
};

/* search filter */

VentuApi.prototype.getSearchFilter = function () {
    var _this = this;

    var searchFilter = _this.searchFilter;
    var sessionSearchFilter = $.sessionStorage.get('ventu-search-filter');

    if (sessionSearchFilter !== null) {
        searchFilter = sessionSearchFilter;
    }

    // defaults
    if (searchFilter === null) {
        searchFilter = _this.getDefaultSearchFilter();
    }

    var uniqueObjectIds = [];

    var sessionFavorites = $.sessionStorage.get('ventu-favorites');
    if (sessionFavorites !== null) {
        $(sessionFavorites).each(function (index, building) {
            uniqueObjectIds.push(building.uniqueId);
        });
    }

    var sessionTrash = $.sessionStorage.get('ventu-trash');
    if (sessionTrash !== null) {
        $(sessionTrash).each(function (index, building) {
            uniqueObjectIds.push(building.uniqueId);
        });
    }

    searchFilter.UniqueObjectIds = uniqueObjectIds;

    return searchFilter;
};

VentuApi.prototype.getDefaultSearchFilter = function () {
    return {
        UniqueObjectIds: [],
        Building: null,
        Postcodes: [],
        City: null,
        objectusage: null,
        CircleLat: 0,
        CircleLng: 0,
        MetrageRange: 0 + ',' + 9999999,
        ObjectTypeIds: [],
        Postcode: null,
        PrimaryUsageIds: [],
        Radius: 0,
        RectKm1: 0,
        RectKm2: 0,
        Shape: 0,
        Street: null,
        OrganizationGuid: null,
        ObjectType: null,
        Search: null
    };

};

VentuApi.prototype.setSearchFilter = function (query, autoSearchFilter) {
    var _this = this;

    var searchFilter = _this.getSearchFilter();

    if (query) {

        if (query.types && query.types.length > 0) {
            searchFilter.PrimaryUsageIds = [];

            $(query.types).each(function (index, typeId) {
                searchFilter.PrimaryUsageIds.push(typeId / 1);
            });
        }

        if (query.transactions && query.transactions.length > 0) {
            searchFilter.ObjectTypeIds = [];

            $(query.transactions).each(function (index, transactionId) {
                searchFilter.ObjectTypeIds.push(transactionId / 1)
            });
        }

        if (query && query.location) {
            searchFilter.City = $(query.location).data('city') ? $(query.location).data('city') : null;
            searchFilter.Street = $(query.location).data('street') ? $(query.location).data('street') : null;
            searchFilter.Postcode = $(query.location).data('postcode') ? $(query.location).data('postcode') : null;
            searchFilter.Building = $(query.location).data('building') ? $(query.location).data('building') : null;
        }

        if (query.area && query.area.length === 2) {
            searchFilter.MetrageRange = query.area[0] + ',' + query.area[1];
        }
    }

    if (autoSearchFilter) {
        searchFilter = autoSearchFilter;
    }

    _this.searchFilter = searchFilter;

    $.sessionStorage.set('ventu-search-filter', JSON.stringify(_this.searchFilter));
};

/* search query */

VentuApi.prototype.getSearchQuery = function () {
    var _this = this;

    var searchFilter = _this.getSearchFilter();

    var metrageRange = searchFilter.MetrageRange.split(',');
    var metrageStart = metrageRange.length > 0 ? metrageRange[0] / 1 : 0;
    var metrageEnd = metrageRange.length > 1 ? metrageRange[1] / 1 : 999999;

    var location = null;

    if (searchFilter.City) {
        location = 'plaats: ' + searchFilter.City;
    }

    if (searchFilter.Building) {
        location = 'gebouw: ' + searchFilter.Building + ', ' + searchFilter.City;
    }

    if (searchFilter.Postcode) {
        location = 'postcode: ' + searchFilter.Postcode + ', ' + searchFilter.City;
    }

    if (searchFilter.Street) {
        location = 'straat: ' + searchFilter.Street + ', ' + searchFilter.City;
    }

    return {
        result: 0,
        types: searchFilter.PrimaryUsageIds,
        location: location,
        area: [metrageStart, metrageEnd],
        transactions: searchFilter.ObjectTypeIds,
        searchType: {
            type: 'circle',
            size: 40
        }
    };
};

/* api calls */

VentuApi.prototype.select = function (query) {
    var _this = this;

    _this.setSearchFilter(query);
    location.href = 'application.php';
};

VentuApi.prototype.getSearchResults = function (search, callback) {
    var results = [
        {
            'Location': '<span class="search-address" data-city="Amsterdam">plaats:</span> Amsterdam',
            'NumberOfItems': 732
        }, {
            'Location': '<span class="search-address" data-city="Amstelveen">plaats:</span> Amstelveen',
            'NumberOfItems': 106
        }, {
            'Location': '<span class="search-address" data-city="Amsterdam-Duivendrecht">plaats:</span> Amsterdam-Duivendrecht',
            'NumberOfItems': 32
        }, {
            'Location': '<span class="search-address" data-city="Amsterdam-Duivendrecht">plaats:</span> Amsterdam-Duivendrecht',
            'NumberOfItems': 32
        }, {
            'Location': '<span class="search-address" data-city="Amsterdam-Duivendrecht">plaats:</span> Amsterdam-Duivendrecht',
            'NumberOfItems': 32
        }, {
            'Location': '<span class="search-address" data-city="Amsterdam-Duivendrecht">plaats:</span> Amsterdam-Duivendrecht',
            'NumberOfItems': 32
        }, {
            'Location': '<span class="search-address" data-city="Amsterdam-Duivendrecht">plaats:</span> Amsterdam-Duivendrecht',
            'NumberOfItems': 32
        }, {
            'Location': '<span class="search-address" data-city="Amsterdam-Duivendrecht">plaats:</span> Amsterdam-Duivendrecht',
            'NumberOfItems': 32
        }
    ];

    callback(results);
};

VentuApi.prototype.getSelectResults = function (callback) {
    callback(fakeSearchResult);
};

VentuApi.prototype.seeDetail = function(url) {
    window.location.href = url;
};

VentuApi.prototype.likeObject = function (building) {
};

VentuApi.prototype.disLikeObject = function (building) {
};

VentuApi.prototype.getObjectByUniqueId = function(uniqueId, callback) {
};