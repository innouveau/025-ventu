function Dialog(element) {
    this.element = element;

    this.sections = ['types', 'location', 'area', 'transaction'];

    this.query = {
        types: [],
        location: '',
        area: [null, null],
        transaction: null
    };

    this.elements = {
        header: {
            main: null,
            sections: []
        },
        buttons: {
            prev: null,
            next: null,
            type: null
        },
        centerline: {
            left: null,
            center: null,
            right: null
        },
        slides: []
    };

    this.headers = {
        types: 'Wij zijn op zoek naar een',
        location: 'In de omgeving',
        area: 'Met een oppervlakte vanaf',
        transaction: 'Om te',
        end: ''
    };

    this.settings = {
        size: {
            body: 600,
            frame: 0
        }
    };

    this.create();
}

Dialog.prototype = Object.create(_Slider.prototype);



// creation




Dialog.prototype.createHeader = function() {
    this.elements.header.main = $('<div class="ventu-slider-header"></div>');
    this.elements.header.sections.push( $('<div class="ventu-slider-header-section"><div class="ventu-slider-header-section-text">' + this.headers.types + '</div><div class="ventu-slider-header-section-labels"></div></div>') );
    this.elements.header.sections.push( $('<div class="ventu-slider-header-section"><div class="ventu-slider-header-section-text">' + this.headers.location + '</div><div class="ventu-slider-header-section-labels"></div></div>') );
    this.elements.header.sections.push( $('<div class="ventu-slider-header-section"><div class="ventu-slider-header-section-text">' + this.headers.area + '</div><div class="ventu-slider-header-section-labels"></div></div>') );
    this.elements.header.sections.push( $('<div class="ventu-slider-header-section"><div class="ventu-slider-header-section-text">' + this.headers.transaction + '</div><div class="ventu-slider-header-section-labels"></div></div>') );

    for (var i = 0, l = this.sections.length; i < l; i++) {
        var section = this.elements.header.sections[i];
        section.hide();
        this.elements.header.main.append(section);
    }
    this.element.append(this.elements.header.main);

    this.updateHeader();
};


Dialog.prototype.createSlides = function() {
    this.elements.slides.push(this.createTypeSlide());
    this.elements.slides.push(this.createLocationSlide());
    this.elements.slides.push(this.createAreaSlide());
    this.elements.slides.push(this.createTransactionSlide());
    this.elements.slides.push(this.createEndSlide());
};



// specific slide creations

Dialog.prototype.createTypeSlide = function() {
    var types, slide, container;
    slide = this.createBasicSlide('types');

    container =  $('<div class="ventu-slider-slide-buttons-container"></div>');
    slide.body.append(container);
    types = ['Winkel', 'Kantoor', 'Bedrijfsruimte', 'Horeca', 'Bouwgrond'];
    for (var i = 0, l = types.length; i < l; i++) {
        container.append(this.createTypeButton(types[i]));
    }
    // make reusable selection
    this.elements.buttons.type = this.element.find('.ventu-slider-type-button');
    return slide.element;
};

Dialog.prototype.createLocationSlide = function() {
    var slide, searchModule, search;
    slide = this.createBasicSlide('location');

    search = $('<div class="ventu-search initialise-manually ventu-search--white ventu-search-marker"></div>');
    // make it align in the center
    search.css({
        'width': this.settings.size.body,
        'margin': '0 auto'
    });
    searchModule = new Search(search);
    searchModule.addOutput(this);
    slide.body.append(search);
    return slide.element;
};

Dialog.prototype.createAreaSlide = function() {
    var self = this, slide, label1, label2, input1, input2, pickerset = {}, header;
    slide = this.createBasicSlide('area');

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
    slide.body.append(label1);
    slide.body.append(pickerset.picker0);
    slide.body.append(label2);
    slide.body.append(pickerset.picker1);

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
        var san = sanitize($(el));
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

    function sanitize(el) {
        // @walstra heb jij een mening of we nog meer moeten checken hier, gaat over
        // de oppervlakte waarden
        var value = el.val();
        if (!isNaN(value) && value.length > 0) {
            el.parent().removeClass('ventu-slider-area-picker--error');
            return {
                value: value,
                valid: true
            }
        } else {
            el.parent().addClass('ventu-slider-area-picker--error');
            return {
                value: null,
                valid: false
            }
        }
    }

    return slide.element;
};

Dialog.prototype.createTransactionSlide = function() {
    var transactions, slide, container;

    slide = this.createBasicSlide('transaction');

    container =  $('<div class="ventu-slider-slide-buttons-container"></div>');
    slide.body.append(container);
    transactions = ['Kopen', 'Huren', 'Beleggen'];
    for (var i = 0, l = transactions.length; i < l; i++) {
        container.append(this.createTransactionButton(transactions[i]));
    }
    return slide.element;
};


Dialog.prototype.createEndSlide = function() {
    var slide, container;
    slide = this.createBasicSlide('end');

    container =  $('<div class="ventu-slider-slide-end-container">Aan het zoeken naar resultaten</div>');
    slide.body.append(container);
    return slide.element;
};





// slide elements creations

Dialog.prototype.createTypeButton = function(type) {
    var self, button, icon, label;
    self = this;
    button = $('<div class="ventu-slider-type-button" type="' + type + '"></div>');
    icon = $('<div class="ventu-slider-type-button-icon"><img src="img/dialog/types/' + type.toLowerCase() + '.svg"></div>');
    label = $('<div class="ventu-slider-type-button-label">' + type + '</div>');
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
    this.elements.buttons.type.each(function(){
        if ($(this).hasClass('ventu-slider-type-button--active')) {
            types.push($(this).attr('type'));
        }
    });
    this.query.types = types;
};



Dialog.prototype.selectLocation = function(location) {
    this.query.location = location;
    this.status.updated[0] = true;
    this.removeHeaderSection(1);
    this.updateButtons();
};

Dialog.prototype.createTransactionButton = function(transaction) {
    var self, button;
    self = this;
    button = $('<div class="ventu-slider-transaction-button" transaction="' + transaction + '">' + transaction + '</div>');
    button.click(function(){
        var btn = this;
        $('.ventu-slider-transaction-button').each(function(){
            if (this === btn) {
                $(this).addClass('ventu-slider-transaction-button--active');
                self.query.transaction = $(this).attr('transaction');
                self.updateButtons();
                self.status.updated[3] = true;
                self.removeHeaderSection(3);
            } else {
                $(this).removeClass('ventu-slider-transaction-button--active');
            }
        });
    });
    return button;
};






// status



Dialog.prototype.digest = function() {
    this.updateSetStatus();
    this.updateButtons();
    this.updateHeader();
};

Dialog.prototype.updateSetStatus = function() {
    for (var i = 0, l = this.sections.length; i < l; i++) {
        switch (i) {
            case 0:
                this.status.set[i] = this.query.types.length > 0;
                break;
            case 1:
                this.status.set[i] = this.query.location.length > 0;
                break;
            case 2:
                this.status.set[i] = this.query.area[0] !== null && this.query.area[1] !== null;
                break;
            case 3:
                this.status.set[i] = this.query.transaction !== null;
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
    $('#ventu-slider-slide-' + this.sections[section] + ' .ventu-slider-header-section-text').hide();
};

Dialog.prototype.showSlideHeader = function(section) {
    this.elements.header.sections[section].hide();
    $('#ventu-slider-slide-' + this.sections[section] + ' .ventu-slider-header-section-text').show();
};

Dialog.prototype.updateHeaderSection = function(section) {
    var container, timer, label, labels, counter, i, l;

    labels = [];
    counter = 0;
    container = this.elements.header.sections[section].find('.ventu-slider-header-section-labels');
    container.empty();

    console.log(section);

    switch (section) {
        case 0:
            for (i = 0, l = this.query.types.length; i < l; i++) {
                label = $('<div class="ventu-slider-header-section-label">' + this.query.types[i] + '</div>');
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
            label = $('<div class="ventu-slider-header-section-label">' + this.query.location + '</div>');

            if (label.length > 0) {
                container.append(label);
                label.addClass('show-label');
            }
            break;
        case 2:
            for (i = 0, l = this.query.area.length; i < l; i++) {
                label = $('<div class="ventu-slider-header-section-label">' + this.query.area[i] + 'm²</div>');
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
            label = $('<div class="ventu-slider-header-section-label">' + this.query.transaction + '</div>');

            if (label.length > 0) {
                container.append(label);
                label.addClass('show-label');
            }
            break;
    }
};

Dialog.prototype.removeHeaderSection = function(section) {
    var n, labels, container, timer;
    container = this.elements.header.sections[section].find('.ventu-slider-header-section-labels');
    labels = container.find('.ventu-slider-header-section-label');
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

Dialog.prototype.updateButtons = function() {
    var allowed;
    this.updateSetStatus();
    // prev
    if (this.status.page.current > 0) {
        this.elements.buttons.prev.show();
    } else {
        this.elements.buttons.prev.hide();
    }

    allowed = this.status.set[this.status.page.current];

    if (allowed) {
        this.elements.buttons.next.show();
    } else {
        this.elements.buttons.next.hide();
    }
    this.setCenterline(this.status.page.current, allowed);
};