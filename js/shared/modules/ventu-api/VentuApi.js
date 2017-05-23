function VentuApi() {}

VentuApi.prototype.getSearchResults = function (string, callback) {
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

VentuApi.prototype.select = function (obj) {


};

VentuApi.prototype.seeDetail = function(url) {
    window.location.href = url;
};

VentuApi.prototype.querySearch = function (query) {
    console.log('function querySearch is deprecated, use getSelectResults instead...');

    this.getSelectResults(query);
};

VentuApi.prototype.setSearchFilter = function (query) {

    var searchFilter = {
        UniqueObjectIds: [],
        Building: null,
        Postcodes: [],
        City: null,
        objectusage: null,
        CircleLat: 0,
        CircleLng: 0,
        MetrageRange: null,
        ObjectTypeIds: [],
        Postcode: null,
        PrimaryUsageIds: [],
        Radius: 0,
        RectKm1: 0,
        RectKm2: 0,
        Shape: 0,
        Street: null,
        OrganizationGuid: null
    };

    if (query) {

        $(query.types).each(function (index, typeId) {
            searchFilter.PrimaryUsageIds.push(typeId / 1);
        });

        $(query.transactions).each(function (index, transactionId) {
            searchFilter.ObjectTypeIds.push(transactionId / 1)
        });

        if (query && query.location) {
            searchFilter.City = $(query.location).data('city') ? $(query.location).data('city') : null;
            searchFilter.Street = $(query.location).data('street') ? $(query.location).data('street') : null;
            searchFilter.Postcode = $(query.location).data('postcode') ? $(query.location).data('postcode') : null;
            searchFilter.Building = $(query.location).data('building') ? $(query.location).data('building') : null;
        }

        if (query.area && query.area.length == 2) {
            searchFilter.MeMetrageRange = query.area[0] + ',' + query.area[1];
        }
    }

    $.sessionStorage.set('ventu-search-filter', JSON.stringify(searchFilter));

}

VentuApi.prototype.getSelectResults = function (query) {
    this.setSearchFilter(query);

    if (this._isThisApplication()) {
        window.ventu.redraw(fakeSearchResult);
    } else {
        location.href = 'application.php';
    }
}

VentuApi.prototype._isThisApplication = function () {

    if (window.location.pathname.toLowerCase().indexOf('application') > 0) {
        return true;
    } else {
        return false;
    }

    /*
    var path = window.location.pathname.split('/'),
        lastPart = path[path.length - 1];
    if (lastPart === 'application.php' || lastPart === 'application-landing.php') {
        return true;
    } else {
        return false;
    }
    */
};