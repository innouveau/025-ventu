function Dialog(element) {
    this.element = element;

    this.sections = ['types', 'location', 'area', 'transaction'];

    this.sections = [
        {
            title: 'types',
            header: 'Wij zijn op zoek naar een'
        }, {
            title: 'location',
            header: 'In de omgeving'
        }, {
            title: 'area',
            header: 'Met een oppervlakte vanaf'
        }, {
            title: 'transactions',
            header: 'Om te'
        }, {
            title: 'end',
            header: ''
        }
    ];

    this.query = {
        types: [],
        location: null,
        area: [null, null],
        transactions: null
    };

    this.elements = {
        header: {
            main: null,
            sections: []
        },
        buttons: {
            prev: null,
            next: null,
            types: null
        },
        centerline: {
            left: null,
            center: null,
            right: null
        },
        slides: []
    };

    this.settings = {
        size: {
            body: 600,
            frame: 0
        },
        hasSetStatus: true
    };

    this.create();
}

Dialog.prototype = Object.create(_Slider.prototype);



// creation

Dialog.prototype.createHeader = function() {
    this.elements.header.main = $('<div class="ventu-slider-header"></div>');
    for (var i = 0, l = this.sections.length; i < l; i++) {
        var section, sectionHeader;
        section = this.sections[i];
        sectionHeader = $('<div class="ventu-slider-header-section"><div class="ventu-slider-header-section-text">' + section.header + '</div><div class="ventu-slider-header-section-labels"></div></div>');
        this.elements.header.sections.push(sectionHeader);
        sectionHeader.hide();
        this.elements.header.main.append(sectionHeader);
    }
    this.element.append(this.elements.header.main);
    this.updateHeader();
};



// specific slide creations

Dialog.prototype.createSlide = function(i) {
    var section, slide;

    section = this.sections[i];
    slide = this.createBasicSlide(i);
    switch (section.title) {
        case 'types':
            this.createTypeSlide(slide.body);
            break;
        case 'location':
            this.createLocationSlide(slide.body);
            break;
        case 'area':
            this.createAreaSlide(slide.body);
            break;
        case 'transactions':
            this.createTransactionSlide(slide.body);
            break;
        case 'end':
            this.createEndSlide(slide.body);
            break;
    }
    return slide.element;
};

Dialog.prototype.createTypeSlide = function(body) {
    var container;

    container =  $('<div class="ventu-slider-slide-buttons-container"></div>');
    for (var i = 0, l = filterContent.secondaryUsage.length; i < l; i++) {
        var type = filterContent.primaryUsageLibrary[filterContent.secondaryUsage[i]];
        container.append(this.createTypeButton(type));
    }

    body.append(container);
    // make reusable selection
    this.elements.buttons.types = this.element.find('.ventu-slider-type-button');
};

Dialog.prototype.createLocationSlide = function(body) {
    var searchModule, search;

    search = $('<div class="ventu-search initialise-manually ventu-search--white ventu-search-marker"></div>');
    // make it align in the center
    search.css({
        'width': this.settings.size.body,
        'margin': '0 auto'
    });
    searchModule = new Search(search);
    searchModule.addOutput(this);
    body.append(search);
};

Dialog.prototype.createAreaSlide = function(body) {
    var self = this, label1, label2, input1, input2, pickerset = {};

    label1 = $('<span>Vanaf</span>');
    label2 = $('<span>tot</span>');
    input1 = $('<input placeholder="...">');
    input2 = $('<input placeholder="...">');
    pickerset.picker0 = $('<div class="ventu-slider-area-picker"></div>');
    pickerset.picker0.append('<div class="ventu-slider-area-picker-label">min</div>');
    pickerset.picker0.append(input1);
    pickerset.picker0.append('<div class="ventu-slider-area-picker-label">m²</div>');
    pickerset.picker1 = $('<div class="ventu-slider-area-picker"></div>');
    pickerset.picker1.append('<div class="ventu-slider-area-picker-label">max</div>');
    pickerset.picker1.append(input2);
    pickerset.picker1.append('<div class="ventu-slider-area-picker-label">m²</div>');
    body.append(label1);
    body.append(pickerset.picker0);
    body.append(label2);
    body.append(pickerset.picker1);

    pickerset.picker0.click(function(){
        input1.focus();
    });

    pickerset.picker1.click(function(){
        input2.focus();
    });

    input1.keyup(function() {
        keyup(this, 0);
    });

    input2.keyup(function() {
        keyup(this, 1);
    });

    function keyup(el, i) {
        var san = sanitizeAreaInput($(el));
        if (san.valid) {
            self.query.area[i] = san.value;
            pickerset['picker' + i].addClass('ventu-slider-area-picker--picked');
        } else {
            self.query.area[i] = null;
            pickerset['picker' + i].removeClass('ventu-slider-area-picker--picked');
        }
        self.status.updated[2] = true;
        self.updateButtons();
        self.removeHeaderSection(2);
    }
};

Dialog.prototype.createTransactionSlide = function(body) {
    var container;
    container =  $('<div class="ventu-slider-slide-buttons-container"></div>');
    for (var i = 0, l = filterContent.objectType.length; i < l; i++) {
        var transaction = filterContent.objectTypeLibrary[filterContent.objectType[i]];
        container.append(this.createTransactionButton(transaction));
    }
    body.append(container);
    // make reusable selection
    this.elements.buttons.transactions = this.element.find('.ventu-slider-transaction-button');
};


Dialog.prototype.createEndSlide = function(body) {
    var container;
    container =  $('<div class="ventu-slider-slide-end-container">Aan het zoeken naar resultaten</div>');
    body.append(container);
};





// slide elements creations

Dialog.prototype.createTypeButton = function(type) {
    var self, button, icon, label;
    self = this;
    button = $('<div class="ventu-slider-type-button" type="' + type.id + '"></div>');
    icon = $('<div class="ventu-slider-type-button-icon"><img src="img/icons/types/' + type.slug + '-white.svg"></div>');
    label = $('<div class="ventu-slider-type-button-label">' + type.translation + '</div>');
    button.append(icon);
    button.append(label);
    button.click(function(){
        $(this).toggleClass('ventu-slider-type-button--active');
        self.removeHeaderSection(0);
        self.updateType();
        self.status.updated[0] = true;
        self.updateButtons();
    });
    return button;
};

Dialog.prototype.updateType = function() {
    var types = [];
    // find active types
    this.elements.buttons.types.each(function(){
        if ($(this).hasClass('ventu-slider-type-button--active')) {
            types.push($(this).attr('type'));
        }
    });
    this.query.types = types;
};



Dialog.prototype.selectLocation = function(obj) {
    this.query.location = obj.Location;
    this.status.updated[1] = true;
    this.removeHeaderSection(1);
    this.updateButtons();
};

Dialog.prototype.createTransactionButton = function(transaction) {
    var self, button;
    self = this;
    button = $('<div class="ventu-slider-transaction-button" transaction="' + transaction.id + '">' + transaction.translation + '</div>');
    button.click(function(){
        $(this).toggleClass('ventu-slider-transaction-button--active');
        self.removeHeaderSection(3);
        self.updateTransaction();
        self.status.updated[3] = true;
        self.updateButtons();
    });
    return button;
};

Dialog.prototype.updateTransaction = function() {
    var transactions = [];
    // find active transaction
    this.elements.buttons.transactions.each(function(){
        if ($(this).hasClass('ventu-slider-transaction-button--active')) {
            transactions.push($(this).attr('transaction'));
        }
    });
    this.query.transactions = transactions;
};






// status


Dialog.prototype.updateSetStatus = function() {
    for (var i = 0, l = this.sections.length; i < l; i++) {
        switch (i) {
            case 0:
                this.status.set[i] = this.query.types.length > 0;
                break;
            case 1:
                this.status.set[i] = this.query.location !== null;
                break;
            case 2:
                this.status.set[i] = this.query.area[0] !== null && this.query.area[1] !== null;
                break;
            case 3:
                this.status.set[i] = this.query.transactions !== null;
                break;
            case 4:
                this.status.set[i] = false;
                break;
        }
    }
};


Dialog.prototype.updateHeader = function() {
    for (var i = 0, l = this.sections.length; i < l; i++) {
        var updated = this.status.updated[i],
            visited = this.status.visited[i],
            setStatus = this.status.set[i];
        if (visited) {
            //this.elements.header[section].show();
        }

        if (setStatus) {
            this.showTopHeader(i);
        } else {
            this.showSlideHeader(i);
        }

        if (updated) {
            this.updateHeaderSection(i);
            this.status.updated[i] = false;
        }
    }
};

Dialog.prototype.showTopHeader = function(section) {
    this.elements.header.sections[section].show();
    $('#ventu-slider-slide-' + this.sections[section].title + ' .ventu-slider-header-section-text').hide();
};

Dialog.prototype.showSlideHeader = function(section) {
    this.elements.header.sections[section].hide();
    $('#ventu-slider-slide-' + this.sections[section].title + ' .ventu-slider-header-section-text').show();
};

Dialog.prototype.updateHeaderSection = function(section) {
    var container, timer, label, labels, counter, i, l;

    labels = [];
    counter = 0;
    container = this.elements.header.sections[section].find('.ventu-slider-header-section-labels');
    container.empty();

    switch (section) {
        case 0:
            for (i = 0, l = this.query.types.length; i < l; i++) {
                label = $('<div class="ventu-filter-label">' + filterContent.primaryUsageLibrary[this.query.types[i]].translation + '</div>');
                container.append(label);
                labels.push(label);
            }
            if (labels.length > 0) {
                timer = setInterval(function () {
                    labels[counter].addClass('show-label');
                    counter++;
                    if (counter >= l) {
                        clearInterval(timer);
                    }
                }, 50);
            }
            break;
        case 1:
            var htmlElement = $('<div>' + this.query.location + '</div>'),
                location = htmlElement.text();
            label = $('<div class="ventu-filter-label">' + location + '</div>');

            if (label.length > 0) {
                container.append(label);
                label.addClass('show-label');
            }
            break;
        case 2:
            for (i = 0, l = this.query.area.length; i < l; i++) {
                label = $('<div class="ventu-filter-label">' + this.query.area[i] + 'm²</div>');
                container.append(label);
                if (i === 0) {
                    container.append('<span>tot</span>')
                }
                labels.push(label);
            }

            if (labels.length > 0) {
                timer = setInterval(function () {
                    labels[counter].addClass('show-label');
                    counter++;
                    if (counter >= l) {
                        clearInterval(timer);
                    }
                }, 50);
            }
            break;
        case 3:
            for (i = 0, l = this.query.transactions.length; i < l; i++) {
                label = $('<div class="ventu-filter-label">' + filterContent.objectTypeLibrary[this.query.transactions[i]].translation + '</div>');
                container.append(label);
                labels.push(label);
            }
            if (labels.length > 0) {
                timer = setInterval(function () {
                    labels[counter].addClass('show-label');
                    counter++;
                    if (counter >= l) {
                        clearInterval(timer);
                    }
                }, 50);
            }
            break;
    }
};

Dialog.prototype.removeHeaderSection = function(section) {
    var n, labels, container, timer;
    container = this.elements.header.sections[section].find('.ventu-slider-header-section-labels');
    labels = container.find('.ventu-filter-label');
    n = labels.length - 1;
    if (n > -1) {
        timer = setInterval(function () {
            $(labels[n]).removeClass('show-label');
            n--;
            if (n < 0) {
                clearInterval(timer);
                container.empty();
            }
        }, 50);
    }
};

Dialog.prototype.isAllowedToShowButton = function() {
    return this.status.set[this.status.page.current];
};

Dialog.prototype.isAllowedToSlide = function(slideCallback) {
    if (this.status.page.current === 3) {
        
        window.ventuApi.getSelectResults(this.query);

        

    } else {
        slideCallback();
    }
};