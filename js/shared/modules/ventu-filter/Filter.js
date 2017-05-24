function Filter(searchQuery) {
    this.query = searchQuery;

    this.element = {
        result: $('#ventu-filter-result'),
        location: $('#ventu-filter-location .ventu-filter-label-container'),
        types: $('#ventu-filter-types .ventu-filter-label-container'),
        searchArea: $('#ventu-filter-search-area .ventu-filter-label-container'),
        areaMin: $('#ventu-filter-area-min'),
        areaMax: $('#ventu-filter-area-max'),
        areaMinInput: $('#ventu-filter-area-min-input'),
        areaMaxInput: $('#ventu-filter-area-max-input'),
        transaction: $('#ventu-filter-transaction .ventu-filter-label-container'),
        typesButtons: $('#ventu-filter-types-buttons'),
        transactionButtons: $('#ventu-filter-transaction-buttons'),
        searchTypeButtons: $('.ventu-filter-search-type-button')
    };
    this.createOptions();
    this.update();
}

//

<<<<<<< HEAD
Filter.prototype.execute = function() {
    window.ventuApi.getSelectResults(this.query);
=======
Filter.prototype.execute = function () {
    var query = jQuery.extend({}, this.query);
    query.location = null;
    window.ventuApi.setSearchFilter(query);

    function callback(result) {
        window.ventu.redraw(result);
    }

    window.ventuApi.getSelectResults(callback);
>>>>>>> origin/master
};


// creation

Filter.prototype.createOptions = function() {
    this.createTypeOptions();
    this.createAreaOptions(); // no creation but listeners actually
    this.createTransactionOptions();
    this.createSearchTypeOptions(); // no creation but listeners actually
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

    this.element.searchTypeButtons.each(function(){
        var type = $(this).attr('search-type');
        if (type === self.query.searchType[0]) {
            $(this).addClass('ventu-filter-search-type-button--active');
            if (type !== 'none') {
                $(this).find('input').val(self.query.searchType[1]);
            }
        }
    });

    this.element.searchTypeButtons.click(function(event){
        // prevent a click on the ipnut to trigger
        if (event.target !== 'input') { // TODO
            var currentType = $(this).attr('search-type');
            self.query.searchType[0] = currentType;
            if (currentType !== 'none') {
                self.query.searchType[1] = parseInt($(this).find('input').val());
            } else {
                self.query.searchType[1] = 0;
            }
            self.updateSearchType();
            self.execute();
        }
    });

    this.element.searchTypeButtons.find('input').each(function(){
        $(this).keyup(function(){
            var val = parseInt($(this).val()); // TODO validate more
            self.query.searchType[1] = val;
        })
    });
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
    //this.execute();
};

Filter.prototype.updateQueryArea = function() {
    var min = this.element.areaMinInput.val(),
        max = this.element.areaMaxInput.val();
    this.element.areaMin.html(min + '  m²');
    this.element.areaMax.html(max + '  m²');
    this.query.area[0] = min;
    this.query.area[1] = max;
    this.updateArea();
    //this.updateTransaction();
    //this.execute();
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
    //this.execute();
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
    this.element.searchArea.empty();
    switch (this.query.searchType[0]) {
        case 'none':
            label = this.getLabel('Niet actief');
            break;
        case 'circle':
            label = this.getLabel('Cirkel ' + this.query.searchType[1] + 'km');
            break;
    }
    this.element.searchArea.append(label);
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
