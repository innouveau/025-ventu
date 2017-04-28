function App(page) {

    // try to detect if we can use session and local storage
    try {
        // try to use localStorage
        $.sessionStorage.set('ventu-session-storage', []);
    } catch (e) {
        // there was an error so...
        window.location = '/Error/PrivateMode';
    }

    this.page = page;
    this.config = new Config();
    this.user = new User(user);
    this.guide = new Guide();
    this.service = this._getService();
    this.map = null;
    this.domElements = {
        search: $('#input-search-address'),
        searchResults: $('#ventu-search-result'),
        searchFeedback: $('.ventu-search-results-feedback'),
        dynamicContent: $('#dynamic-content')
    };
    this.objects = [];
    this.list = {
        found: [],
        love: null,
        hate: null
    };
}

App.prototype.init = function () {
    if (this.config.device.type === 0) {
        this.map = new MapMobile();
    } else {
        this.map = new Map();
    }

    this._initDomElements();

    if (this.config.device.type === 0) {
        this.list.love = new ListMobile('love', 'Interesselijst');
        this.list.hate = new ListMobile('hate', 'Prullenbak');
    } else {
        this.list.love = new List('love', 'Interesselijst');
        this.list.hate = new List('hate', 'Prullenbak');
    }
};


App.prototype._getService = function () {
    if (window.ventuConfig.environment.development) {
        return new DataFaker();
    } else {
        return new DataService();
    }
};

App.prototype._initDomElements = function () {
    this.domElements.stack = $('#ventu-stack');
    this.domElements.bottomBar = $('#ventu-bottom-bar');
};



// search

App.prototype.search = function (event, element) {
    var self = this;
    if (event.keyCode === 13 &&  $(".ventu-map-search-result").first().children().first()) {
        var obj = { Location: $(".ventu-map-search-result").first().children().first().html(), NumberOfItems: 0 };
        if (obj.Location !== undefined) {
            this.select(obj);
        }
    } else {
        var searchQuery = $(element).val();

        function searchResultsCallback(results) {
            $(element).parent().find('.ventu-map-search-results').empty();

            $(results).each(function (index, result) {

                var resultElement = $('<div class="ventu-map-search-result"><div class="ventu-map-search-result-text">' + result.Location + ' (' + result.NumberOfItems + ')</div></div>');
                resultElement.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    ventu.service.lastSearchResult = result;
                    ventu.select(result);
                });

                $(element).parent().find('.ventu-map-search-results').append(resultElement).show();
            });
        }

        this.service.getSearchResults(searchQuery, searchResultsCallback);
    }
};



// select

App.prototype.select = function (searchQuery, autoselect, leaveshape) {
    var self = this;

    if (autoselect) {
        self.service.setSearchFilters(searchQuery);
        initFilter();
    }

    function selectCallback(searchData) {
        if (searchData.markers) {
            self._updateMenuBar(searchQuery, searchData.markers.length);
        }
        self.objects = searchData.objects;
        self.map.draw(searchData, leaveshape);
        if (!self.isMobile()) {
            self.user.startTimer('filter')
        }
    }

    var primaryUsageIds = [];

    if ($('select').val() != null) {
        $.each($('select').find(":selected"), function (index, value) {
            primaryUsageIds.push($(value).data('id'));
        });
    }

    $.sessionStorage.set('ventu-primary-usage-ids', primaryUsageIds);
    $.sessionStorage.set('ventu-search-result', searchQuery);

    if (searchQuery && searchQuery.Location) {
        var searchText = $('<div>' + searchQuery.Location + '</div>').text();

        $.sessionStorage.set('ventu-search-text', searchText);
    }
    else {
        $.sessionStorage.remove('ventu-search-text');
    }

    if (this.page == 'application') {
        this.service.getSelectResults(searchQuery, selectCallback);
    } else {
        location.href = "/Application";
    }
};

App.prototype._updateMenuBar = function (searchQuery, n) {

    var _self = this;
    var string = searchQuery;
    this.domElements.searchResults.empty();
    this.domElements.searchResults.hide();
    if (this.service.filter.searchArea.type === 'circle') {
        string += ' +' + this.service.filter.searchArea.km1 + 'km'
    } else if (this.service.filter.searchArea.type === 'rect') {
        string += ' +' + this.service.filter.searchArea.km1 + '×' + this.service.filter.searchArea.km2 + 'km'
    }
    this.domElements.search.val('');

    var searchText = $.sessionStorage.get('ventu-search-text');

    if (searchText == null) {
        searchText = 'Totaal';
    }

    if (SearchUtil) {
        var timeout = SearchUtil.fetchingResources ? 500 : 0;

        setTimeout(function () {
            function completed(resourceValue) {
                _self.domElements.searchFeedback.html('<b>' + searchText + '</b><br/>' + n + ' ' + resourceValue);
            }
            SearchUtil.getResourceValue('Ventu2.LocalResources.Application', 'ObjectenGevonden', completed);
        }, timeout);
    } else {
        this.domElements.searchFeedback.html('<b>' + searchText + '</b><br/>' + n + ' objecten gevonden');
    }
};

// helpers

App.prototype.isMobile = function () {
    return this.config.device.type === 0;
};