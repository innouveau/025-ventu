function App(page) {
    this.page = page;
    this.config = new Config(this);
    this.user = new User(this, user);
    this.guide = new Guide(this);
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

App.prototype.init = function() {
    this.map = new Map(this);
    this._initDomElements();
    this.list.love = new List(this, 'love', 'Interesselijst');
    this.list.hate = new List(this, 'hate', 'Prullenbak');
};


App.prototype._getService = function() {
    if (window.ventuConfig.environment.development) {
        return new DataFaker(this);
    } else {
        return new DataService(this);
    }
};

App.prototype._initDomElements = function() {
    this.domElements.stack = $('#ventu-stack');
    this.domElements.bottomBar = $('#ventu-bottom-bar');
};



// search

App.prototype.search = function(event, element) {
    if (event.keyCode === 13) {
        this.select(this.service.searchResults[0])
    } else {
        var searchQuery = $(element).val(),
            results = this.service.getSearchResults(searchQuery);
        this.domElements.searchResults.empty();
        for (var i = 0, l = results.length; i < l; i++) {
            var result = results[i],
                resultElement = $('<div class="ventu-map-search-result" onclick="ventu.select(\'' + result + '\', \'poly\')"><div class="ventu-map-search-result-text">' + result + '</div></div>');
            this.domElements.searchResults.append(resultElement);
        }
    }

};



// select

App.prototype.select = function(searchQuery) {
    var self = this,
        searchData = this.service.getSelectResults(searchQuery);
    function callback(searchData) {
        self._updateMenuBar(searchQuery, searchData.markers.length);
        self.objects = searchData.objects;
        self.map.draw(searchData);
        self.user.startTimer('filter')
    }

    if (this.page !== 'application') {
        // ajax transition to application
        $.get('./application.html').done(function(result){
            var html = $(result).filter('#dynamic-content').children();
            self.domElements.dynamicContent.html(html);
            filterListeners();
            self.init();
            $('body').removeClass().addClass('ventu-application');
            self.page = 'application';
            callback(searchData);
        });

    } else {
        callback(searchData);
    }
};


App.prototype._updateMenuBar = function(searchQuery, n) {
    var string = searchQuery;
    this.domElements.searchResults.empty();
    this.domElements.searchResults.hide();
    if (this.service.filter.searchArea.type === 'circle') {
        string += ' +' + this.service.filter.searchArea.km1 + 'km'
    } else if (this.service.filter.searchArea.type === 'rect') {
        string += ' +' + this.service.filter.searchArea.km1 + '×' + this.service.filter.searchArea.km2 + 'km'
    }
    this.domElements.search.val(string);
    this.domElements.searchFeedback.html(n + ' objecten gevonden');
};