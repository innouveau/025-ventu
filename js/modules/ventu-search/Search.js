function Search(element) {
    this.element = element;
    this.elements = {
        icon: null,
        input: null,
        results: null
    };
    this.init();

}


Search.prototype.init = function() {
    this.create();
    this.addListeners();
};

Search.prototype.create = function() {
    var placeholder = this.element.attr('ph');
    this.elements.icon = $('<div class="ventu-search-icon"></div>');
    this.elements.input = $('<input placeholder="' + placeholder + '">');
    this.elements.results = $('<div class="ventu-search-results">');

    this.element.append(this.elements.icon);
    this.element.append(this.elements.input);
    this.element.append(this.elements.results);
};

Search.prototype.addListeners = function() {
    var val, self = this;
    this.elements.input.keyup(function() {
        val = $(this).val();
        if (val.length > 0) {
            self.get(val)
        } else {
            self.elements.results.empty();
        }
    })
};

Search.prototype.get = function(val) {
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
        }
    ];
    if (results.length > 0) {
        this.show(results);
    } else {
        this.elements.results.empty();
    }

};


Search.prototype.show = function(results) {
    this.elements.results.empty();
    for (var i = 0, l = results.length; i < l; i++) {
        var html, result = results[i];
        html = $('<div class="ventu-search-result">');
        html.append(result.Location + ' (' + result.NumberOfItems + ')');
        this.elements.results.append(html);
    }
};
