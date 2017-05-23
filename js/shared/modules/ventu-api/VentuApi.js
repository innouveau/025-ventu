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

VentuApi.prototype.querySearch = function (query) {
    if (this._isThisApplication()) {
        window.ventu.redraw(fakeSearchResult);
    } else {

    }
};

VentuApi.prototype._isThisApplication = function () {
    var path = window.location.pathname.split('/'),
        lastPart = path[path.length - 1];
    if (lastPart === 'application.php' || lastPart === 'application-landing.php') {
        return true;
    } else {
        return false;
    }
};