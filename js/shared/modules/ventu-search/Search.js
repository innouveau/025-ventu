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
    var _this = this,
        placeholder = this.element.attr('ph');
    if (!placeholder) {
        placeholder = 'Zoek op plaats, naam, postcode, gebouw';
    }
    this.elements.icon = $('<div class="ventu-search-icon"></div>');
    this.elements.input = $('<input placeholder="' + placeholder + '">');
    this.elements.chosen = $('<div class="ventu-search-chosen"></div>');
    this.elements.results = $('<div class="ventu-search-results"></div>');

    this.elements.chosen.click(function(){
        _this.unsetChosen();
    });

    this.element.append(this.elements.icon);
    this.element.append(this.elements.input);
    this.element.append(this.elements.chosen);
    this.element.append(this.elements.results);
};

Search.prototype.addListeners = function() {
    var val, _this = this;
    this.elements.input.keyup(function() {
        val = $(this).val();
        if (val.length > 0) {
            _this.setZindex(true);
            _this.get(val);
        } else {
            _this.setZindex(false);
            _this.elements.results.empty();
        }
    })
};

Search.prototype.get = function(val) {
    var _this = this;

    function callback(results) {
        if (results.length > 0) {
            _this.show(results);
        } else {
            _this.elements.results.empty();
        }
    }

    window.ventuApi.getSearchResults(val, callback);
};

Search.prototype.show = function(results) {
    var _this = this;
    this.elements.results.empty();

    $(results).each(function (index, result) {

        var html = $('<div class="ventu-search-result">');
        html.append(result.Location + ' (' + result.NumberOfItems + ')');
        html.click(function () {
            _this.select(result);
            _this.setZindex(false);
        });
        _this.elements.results.append(html);

    });
};

Search.prototype.select = function(obj) {
    var htmlElement = $('<div>' + obj.Location + '</div>');
    var location = htmlElement.text();

    this.setChosen(location);

    if (this.outerOutput) {
        this.outerOutput.selectLocation(obj);
    } else {
        var query = {
            location: obj.Location
        };

        window.ventuApi.select(query);
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
    this.elements.chosen.hide();
    this.elements.input.val('');
    this.elements.input.show();
    if (this.outerOutput) {
        this.outerOutput.query.location = null;
        this.outerOutput.removeHeaderSection(1);
        this.outerOutput.status.updated[1] = true;
        this.outerOutput.updateButtons();
    }
};
