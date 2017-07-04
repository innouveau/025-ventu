function Search(element, callback) {
    this.element = element;
    this.elements = {
        icon: null,
        input: null,
        chosen: null,
        results: null,
        resultsList: []
    };

    this.status = {
        originalSearchString: '',
        focus: false,
        numberOfResults: 0,
        indexOfFocus: -1,
        tagOfFocus: null
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
    this.elements.input = $('<input placeholder="' + placeholder + '" tabindex=-1>');
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
    var val,
        _this = this;


    this.elements.input.keyup(function(event) {
        var key = event.keyCode;

        //manage tab when search module is inside the Dialog
        if (_this.outerOutput) {
            _this.outerOutput.checkTab(event, 1);
        }

        if (key === 40) {
            // down
            event.preventDefault();
            _this.status.indexOfFocus++;
            _this.updateFocus();
            _this.autoScroll();
        } else if (key === 38) {
            // up
            event.preventDefault();
            _this.status.indexOfFocus--;
            _this.updateFocus();
            _this.autoScroll();
        } else if (key === 13) {
            // enter
            event.preventDefault();
            var tag = _this.status.tagOfFocus;
            _this.select(tag);
        } else {
            val = $(this).val();
            if (val.length > 0) {
                _this.setZindex(true);
                _this.get(val);
                _this.status.originalSearchString = val;
            } else {
                _this.setZindex(false);
                _this.elements.results.empty();
            }
        }
    })
};


// main functions

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
    this.elements.resultsList = [];

    $(results).each(function (index, result) {
        var obj = {};

        if (typeof (VentuBrokerApi) !== 'undefined') {
            // console.log('is ventubrokerapi');

            obj.element = $('<div class="ventu-search-result">');
            obj.value = result.Name;
            obj.obj = result;
            obj.element.append(result.Name);

        } else {
            // console.log('is ventuapi');

            var tempSelector = _this.createTagElement(result.Location);
            obj.element = $('<div class="ventu-search-result">');
            obj.value = _this.dataObjectToString(tempSelector);
            obj.obj = result;
            obj.element.append(result.Location + ' (' + result.NumberOfItems + ')');

        }

        obj.element.click(function () {
            _this.select(result);
            _this.setZindex(false);
        });

        obj.element.mouseover(function() {
            _this.status.indexOfFocus = index;
            _this.updateFocus();
        });

        obj.element.mouseout(function() {
            obj.element.removeClass('ventu-search-result--active');
        });

        _this.elements.results.append(obj.element);
        _this.elements.resultsList.push(obj);
    });

    this.resetFocus(results.length);
};

Search.prototype.select = function (obj) {

    if (typeof (VentuBrokerApi) !== 'undefined') {

        window.ventuApi.select(obj);

    } else {

        var htmlElement = this.createTagElement(obj.Location);
        var location = this.dataObjectToString(htmlElement);
        this.setChosen(location);

        if (this.outerOutput) {
            this.outerOutput.selectLocation(obj);
        } else {
            var query = {
                location: obj.Location,
                Search: this.status.originalSearchString
            };

            window.ventuApi.select(query);
        }
    }
};

Search.prototype.createTagElement = function(location) {
    return $('<div>' + location + '</div>')
};



// focus

Search.prototype.updateFocus = function() {
    // loop the focus
    // -1 is the input itself
    if (this.status.indexOfFocus > (this.status.numberOfResults - 1)) {
        this.status.indexOfFocus = -1;
    } else if (this.status.indexOfFocus < -1) {
        this.status.indexOfFocus = this.status.numberOfResults - 1;
    }
    if (this.status.indexOfFocus === -1) {
        this.elements.input.focus();
        this.elements.input.val(this.status.originalSearchString);

    } else {
        for (var i = 0, l = this.elements.resultsList.length; i < l; i++) {
            var result = this.elements.resultsList[i];
            if (i === this.status.indexOfFocus) {
                result.element.addClass('ventu-search-result--active');
                this.elements.input.val(result.value);
                this.status.tagOfFocus = result.obj;
            } else {
                result.element.removeClass('ventu-search-result--active');
            }
        }
    }
};

Search.prototype.resetFocus = function(resultsLength) {
    this.status.focus = false;
    this.status.numberOfResults =  resultsLength;
    this.status.indexOfFocus =  -1;
    this.status.tagOfFocus = null;
};

Search.prototype.autoScroll = function() {
    if (this.status.indexOfFocus > -1) {



        var element = this.elements.resultsList[this.status.indexOfFocus].element,
            scroll = this.elements.results.scrollTop(),
            elementHeight = element.outerHeight(),
            elementTop = element.position().top,
            elementBottom = scroll + elementHeight + elementTop,
            containerHeight = this.elements.results.outerHeight();
        if (elementBottom > containerHeight + scroll) {
            this.elements.results.animate({
                scrollTop: elementBottom - containerHeight
            });
        } else if (elementTop < 0) {


            this.elements.results.animate({
                scrollTop: scroll + elementTop
            });
        }
    }

};



// helpers

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

Search.prototype.dataObjectToString = function(selector) {
    var dataObject = $(selector.children()[0]).data(),
        string = '';
    for (var key in dataObject) {
        string += dataObject[key] + ' ';
    }
    return string;
};


// dom

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
