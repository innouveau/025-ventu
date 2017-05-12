function Search(element, callback) {
    this.element = element;
    this.elements = {
        icon: null,
        input: null,
        chosen: null,
        results: null
    };
    this.outerOutput = null;
    this.init();

}


Search.prototype.init = function() {
    this.create();
    this.addListeners();
};


// if we want the selection of a search result do something other
// then window.ventu.select() we can add an outer output
Search.prototype.addOutput = function(dialog) {
    this.outerOutput = dialog;
};

Search.prototype.create = function() {
    var self = this,
        placeholder = this.element.attr('ph');
    if (!placeholder) {
        placeholder = 'Zoek op plaats, naam, postcode, gebouw';
    }
    this.elements.icon = $('<div class="ventu-search-icon"></div>');
    this.elements.input = $('<input placeholder="' + placeholder + '">');
    this.elements.chosen = $('<div class="ventu-search-chosen"></div>');
    this.elements.results = $('<div class="ventu-search-results"></div>');

    this.elements.chosen.click(function(){
        self.unsetChosen();
    });

    this.element.append(this.elements.icon);
    this.element.append(this.elements.input);
    this.element.append(this.elements.chosen);
    this.element.append(this.elements.results);
};

Search.prototype.addListeners = function() {
    var val, self = this;
    this.elements.input.keyup(function() {
        val = $(this).val();
        if (val.length > 0) {
            self.setZindex(true);
            self.get(val);
        } else {
            self.setZindex(false);
            self.elements.results.empty();
        }
    })
};

Search.prototype.get = function(val) {
    // @walstra, dit is fake data, kun jij dat vervangen?
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
    if (results.length > 0) {
        this.show(results);
    } else {
        this.elements.results.empty();
    }

};

Search.prototype.show = function(results) {
    var self = this;
    this.elements.results.empty();
    for (var i = 0, l = results.length; i < l; i++) {
        var html, result = results[i];
        html = $('<div class="ventu-search-result">');
        html.append(result.Location + ' (' + result.NumberOfItems + ')');
        html.click(function(){
            self.select($(this));
            self.setZindex(false);
        });
        this.elements.results.append(html);
    }
};

Search.prototype.select = function(element) {
    // @walstra, ik weet niet zeker wat er in ventu.select() gegooid moet worden,
    // maar dat weet jij beter dan ik.
    var location = element.find('.search-address').data('city');
    this.setChosen(location);
    if (this.outerOutput) {
        this.outerOutput.selectLocation(location);
    } else {
        window.ventu.select(location);
    }
};

Search.prototype.setZindex = function(rise) {
    // this is a bit of a dirty hack. But because of z-index issues and
    // overflow issuses, the z-index of .ventu-dialog needs to rise when
    // the results-window is poppped out
    // outerOutput is the Dialog module
    if (this.outerOutput ) {
        if (rise) {
            this.outerOutput.element.css('z-index', 10);
        } else {
            this.outerOutput.element.css('z-index', 1);
        }
    }
};




Search.prototype.setChosen = function(location) {
    this.elements.input.hide();
    this.elements.chosen.html(location);
    this.elements.chosen.show();
    this.elements.results.empty();
};

Search.prototype.unsetChosen = function() {
    var string = this.elements.chosen.html();
    this.elements.chosen.hide();
    this.elements.input.val(string);
    this.elements.input.show();

};
