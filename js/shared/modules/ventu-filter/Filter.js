function Filter(searchQuery) {
    this.query = searchQuery;

    this.element = {
        result: $('#ventu-filter-result'),
        location: $('#ventu-filter-location .ventu-filter-label-container'),
        types: $('#ventu-filter-types .ventu-filter-label-container'),
        areaMin: $('#ventu-filter-area-min'),
        areaMax: $('#ventu-filter-area-max'),
        areaMinInput: $('#ventu-filter-area-min-input'),
        areaMaxInput: $('#ventu-filter-area-max-input'),
        searchType: $('#ventu-filter-search-type .ventu-filter-label-container'),
        transaction: $('#ventu-filter-transaction .ventu-filter-label-container'),
        typesButtons: $('#ventu-filter-types-buttons'),
        transactionButtons: $('#ventu-filter-transaction-buttons')
    };
    this.createOptions();
    this.update();
}

//

Filter.prototype.execute = function () {
    var query = jQuery.extend({}, this.query);
    query.location = null;
    window.ventuApi.setSearchFilter(query);

    function callback(result) {
        window.ventu.redraw(result);
    }

    window.ventuApi.getSelectResults(callback);
};


// creation

Filter.prototype.createOptions = function() {
    this.createTypeOptions();
    this.createAreaOptions();
    this.createTransactionOptions();
    this.createSearchTypeOptions();
};

Filter.prototype.createTypeOptions = function() {
    var self = this;
    this.element.typesButtons.empty();
    for (var i = 0, l = filterContent.primaryUsage.length; i < l; i++) {
        var filterObject = filterContent.primaryUsageLibrary[filterContent.primaryUsage[i]],
            active = this.isActiveLabel('types', filterObject),
            button = this.getButton('type', filterObject, active);
        button.click(function(){
            $(this).toggleClass('ventu-filter-button--active');
            self.updateQueryTypes();
        });
        this.element.typesButtons.append(button);
    }
};

Filter.prototype.isActiveLabel = function(type, filterObject) {
    for (var i = 0, l = this.query[type].length; i < l; i++) {
        var queryLabel = this.query[type][i];
        if (filterObject.id === queryLabel) {
            return true;
        }
    }
    return false;
};

Filter.prototype.createTransactionOptions = function() {
    var self = this;
    this.element.transactionButtons.empty();
    for (var i = 0, l = filterContent.objectType.length; i < l; i++) {
        var filterObject = filterContent.objectTypeLibrary[filterContent.objectType[i]],
            active = this.isActiveLabel('transactions', filterObject),
            button = this.getButton('transaction', filterObject, active);
        button.click(function(){
            $(this).toggleClass('ventu-filter-button--active');
            self.updateQueryTransaction();
        });
        this.element.transactionButtons.append(button);
    }
};

Filter.prototype.createAreaOptions = function() {
    var self = this;
    this.element.areaMinInput.val(this.query.area[0]);
    this.element.areaMaxInput.val(this.query.area[1]);

    this.element.areaMinInput.keyup(function(){
        keyup(this, 0);
    });

    this.element.areaMaxInput.keyup(function(){
        keyup(this, 1);
    });

    function keyup(el, i) {
        var san = sanitizeAreaInput($(el));
        if (san.valid) {
            self.query.area[0] = san.value;
        } else {
            self.query.area[0] = null;
            $(el).addClass('error');
        }
        self.updateQueryArea();
    }
};

Filter.prototype.createSearchTypeOptions = function() {
    var self = this;
    $('.ventu-filter-search-type-button').each(function(){
        var button = $(this),
            type = button.attr('search-type');
        if (type === self.query.searchType.type) {
            var input;
            button.addClass('ventu-filter-search-type-button--active');
            if (type !== 'none') {
                input = button.find('input');
                input.val(self.query.searchType.size);

                input.keyup(function(){
                    // only update size when the inputs button is the active button
                    if ($(this).parent().parent().hasClass('ventu-filter-search-type-button--active')) {
                        self.query.searchType.size = parseInt($(this).val());
                        self.updateSearchType();
                    }
                })
            }
        }

        button.click(function(event){
            // prevent click on input
            if (event.target.tagName.toLowerCase() !== 'input') {
                self.updateQuerySearchArea(this);
            }
        })
    })
};



// update queries

Filter.prototype.updateQueryTypes = function() {
    var types = [];
    $('#ventu-filter-types-buttons .ventu-filter-button').each(function(){
        if ($(this).hasClass('ventu-filter-button--active')) {
            types.push(parseInt($(this).attr('type')));
        }
    });
    this.query.types = types;
    this.updateTypes();
    this.execute();
};

Filter.prototype.updateQueryArea = function() {
    var min = this.element.areaMinInput.val(),
        max = this.element.areaMaxInput.val();
    this.element.areaMin.html(min + '  m²');
    this.element.areaMax.html(max + '  m²');
    this.query.area[0] = min;
    this.query.area[1] = max;
    this.updateArea();
    this.execute();
};

Filter.prototype.updateQueryTransaction = function() {
    var transactions = [];
    $('#ventu-filter-transaction-buttons .ventu-filter-button').each(function(){
        if ($(this).hasClass('ventu-filter-button--active')) {
            transactions.push(parseInt($(this).attr('transaction')));
        }
    });
    this.query.transactions = transactions;
    this.updateTransaction();
    this.execute();
};

Filter.prototype.updateQuerySearchArea = function(current) {
    var self = this;
    $('.ventu-filter-search-type-button').each(function(){
        if (this === current) {
            var input, type = $(this).attr('search-type');
            $(this).addClass('ventu-filter-search-type-button--active');
            self.query.searchType.type = type;
            if (type !== 'none') {
                input = $(this).find('input');
                self.query.searchType.size = input.val();
            }
        } else {
            $(this).removeClass('ventu-filter-search-type-button--active');
        }
    });
    this.updateSearchType();
    this.execute();
};





// update DOM

Filter.prototype.update = function() {
    this.updateLocation();
    this.updateTypes();
    this.updateArea();
    this.updateTransaction();
    this.updateSearchType();
};

Filter.prototype.updateLocation = function () {
    if (this.query.location != null) {
        var label = this.getLabel(this.query.location);
        this.element.location.empty().append(label);
    }
};

Filter.prototype.updateTypes = function() {
    this.element.types.empty();
    for (var i = 0, l = this.query.types.length; i < l; i++) {
        var type = filterContent.primaryUsageLibrary[this.query.types[i]].translation,
            label = this.getLabel(type);
        this.element.types.append(label);
    }
};

Filter.prototype.updateArea = function() {
    this.element.areaMin.html(this.query.area[0] + '  m²');
    this.element.areaMax.html(this.query.area[1] + '  m²');
};

Filter.prototype.updateTransaction = function() {
    this.element.transaction.empty();
    for (var i = 0, l = this.query.transactions.length; i < l; i++) {
        var transaction = filterContent.objectTypeLibrary[this.query.transactions[i]].translation,
            label = this.getLabel(transaction);
        this.element.transaction.append(label);
    }
};

Filter.prototype.updateSearchType = function() {
    var label;
    this.element.searchType.empty();
    switch (this.query.searchType.type) {
        case 'none':
            label = this.getLabel('Geen aangepast zoekgebied');
            break;
        case 'circle':
            label = this.getLabel('Cirkel: ' + this.query.searchType.size + 'km');
            break;
    }
    this.element.searchType.append(label);
};



// helpers

Filter.prototype.getLabel = function(text) {
    return $('<div class="ventu-filter-label">' + text + '</div>');
};

Filter.prototype.getButton = function(type, filterObject, active) {
    var button = $('<div class="ventu-filter-button ventu-filter-button--' +filterObject.slug + '" ' + type + '="' + filterObject.id + '">' + filterObject.translation + '</div>');
    if (active) {
        button.addClass('ventu-filter-button--active');
    }
    return button;
};
