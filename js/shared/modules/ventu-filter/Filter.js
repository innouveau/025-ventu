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
        transaction: $('#ventu-filter-transaction .ventu-filter-label-container'),
        typesButtons: $('#ventu-filter-types-buttons'),
        transactionButtons: $('#ventu-filter-transaction-buttons')
    };
    this.createOptions();
    this.update();
}

//

Filter.prototype.execute = function() {
    window.ventuApi.querySearch(this.query);
};


// creation

Filter.prototype.createOptions = function() {
    this.createTypeOptions();
    this.createAreaOptions();
    this.createTransactionOptions();
};

Filter.prototype.createTypeOptions = function() {
    var self = this;
    this.element.typesButtons.empty();
    for (var i = 0, l = filterContent.types.length; i < l; i++) {
        var type = filterContent.types[i],
            active = this.isActiveLabel('types', type),
            button = this.getButton('type', type, active);
            button.click(function(){
                $(this).toggleClass('ventu-filter-button--active');
                self.updateQueryTypes();
            });
        this.element.typesButtons.append(button);
    }
};

Filter.prototype.isActiveLabel = function(type, label) {
    for (var i = 0, l = this.query[type].length; i < l; i++) {
        var queryLabel = this.query[type][i];
        if (label.toLowerCase() === queryLabel.toLowerCase()) {
            return true;
        }
    }
    return false;
};

Filter.prototype.createTransactionOptions = function() {
    var self = this;
    this.element.transactionButtons.empty();
    for (var i = 0, l = filterContent.transactions.length; i < l; i++) {
        var transaction = filterContent.transactions[i],
            active = this.isActiveLabel('transaction', transaction),
            button = this.getButton('transaction', transaction, active);
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



// update queries

Filter.prototype.updateQueryTypes = function() {
    var types = [];
    $('#ventu-filter-types-buttons .ventu-filter-button').each(function(){
        if ($(this).hasClass('ventu-filter-button--active')) {
            types.push($(this).attr('type'));
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
    this.updateTransaction();
    this.execute();
};

Filter.prototype.updateQueryTransaction = function() {
    var transactions = [];
    $('#ventu-filter-transaction-buttons .ventu-filter-button').each(function(){
        if ($(this).hasClass('ventu-filter-button--active')) {
            transactions.push($(this).attr('transaction'));
        }
    });
    this.query.transaction = transactions;
    this.updateTransaction();
    this.execute();
};






// update DOM

Filter.prototype.update = function() {
    this.updateResult();
    this.updateLocation();
    this.updateTypes();
    this.updateArea();
    this.updateTransaction();
};

Filter.prototype.updateResult = function() {
    this.element.result.html(this.query.result + ' objecten gevonden');
};

Filter.prototype.updateLocation = function() {
    var label = this.getLabel(this.query.location);
    this.element.location.empty().append(label);
};

Filter.prototype.updateTypes = function() {
    this.element.types.empty();
    for (var i = 0, l = this.query.types.length; i < l; i++) {
        var type = this.query.types[i],
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
    for (var i = 0, l = this.query.transaction.length; i < l; i++) {
        var transaction = this.query.transaction[i],
            label = this.getLabel(transaction);
        this.element.transaction.append(label);
    }
};



// helpers

Filter.prototype.getLabel = function(text) {
    return $('<div class="ventu-filter-label">' + text + '</div>');
};

Filter.prototype.getButton = function(type, text, active) {
    var button = $('<div class="ventu-filter-button ventu-filter-button--' + text.toLowerCase() + '" ' + type + '="' + text.toLowerCase() + '">' + text + '</div>');
    if (active) {
        button.addClass('ventu-filter-button--active');
    }
    return button;
};
