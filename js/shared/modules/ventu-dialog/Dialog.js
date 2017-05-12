function Dialog(element) {
    this.element = element;

    this.sections = ['types', 'location', 'area', 'transaction'];

    this.status = {
        page: {
            current: 0
        },
        updated : {
            types: false,
            location: false,
            area: false,
            transaction: false
        },
        visited: {
            types: true,
            location: false,
            area: false,
            transaction: false
        },
        query: {
            types: [],
            location: '',
            area: [null, null],
            transaction: null
        }
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
        slides: []
    };

    this.settings = {
        size: {
            body: 500,
            frame: 0
        }
    };

    this.create();
}



// creation

Dialog.prototype.create = function() {
    var self = this;
    $(window).resize(function(){
        self.resize();
    });

    this.settings.size.frame = this.element.outerWidth();
    this.createHeader();
    this.createSlides();
    this.createButtons();
};

Dialog.prototype.resize = function() {
    this.settings.size.frame = this.element.outerWidth();
    this.elements.slideContainer.css('width', (this.sections.length + 1) * this.settings.size.frame);
    $('.ventu-dialog-slide').css('width', this.settings.size.frame );
};

Dialog.prototype.createHeader = function() {
    this.elements.header.main = $('<div class="ventu-dialog-header"></div>');
    this.elements.header.types = $('<div class="ventu-dialog-header-section"><div class="ventu-dialog-header-section-text">Ik ben op zoek naar</div><div class="ventu-dialog-header-section-labels"></div></div>');
    this.elements.header.location = $('<div class="ventu-dialog-header-section"><div class="ventu-dialog-header-section-text">In de omgeving</div><div class="ventu-dialog-header-section-labels"></div></div>');
    this.elements.header.area = $('<div class="ventu-dialog-header-section"><div class="ventu-dialog-header-section-text">Met een oppervlakte van</div><div class="ventu-dialog-header-section-labels"></div></div>');
    this.elements.header.transaction = $('<div class="ventu-dialog-header-section"><div class="ventu-dialog-header-section-text">Om te</div><div class="ventu-dialog-header-section-labels"></div></div>');

    for (var i = 0, l = this.sections.length; i < l; i++) {
        var section = this.elements.header[this.sections[i]];
        section.hide();
        this.elements.header.main.append(section);
    }
    this.element.append(this.elements.header.main);

    this.updateHeader();
};

Dialog.prototype.createButtons = function() {
    var self;
    self = this;
    this.elements.buttons.prev = $('<div class="ventu-dialog-navigation-button ventu-dialog-navigation-prev"></div>');
    this.elements.buttons.next = $('<div class="ventu-dialog-navigation-button ventu-dialog-navigation-next"></div>');
    this.elements.buttons.prev.click(function(){
        self.prev();
    });
    this.elements.buttons.next.click(function(){
        self.next();
    });

    this.elements.buttons.prev.hide();
    this.elements.buttons.next.hide();

    this.elements.slideFrame.append(this.elements.buttons.prev);
    this.elements.slideFrame.append(this.elements.buttons.next);
};

Dialog.prototype.createSlides = function() {
    this.elements.slideFrame = $('<div class="ventu-dialog-slide-frame"></div>');
    this.elements.slideContainer = $('<div class="ventu-dialog-slide-container"></div>');
    this.elements.slideContainer.css('width', (this.sections.length + 1) * this.settings.size.frame); // +1 for end frame
    this.element.append(this.elements.slideFrame);
    this.elements.slideFrame.append(this.elements.slideContainer);
    this.addCenterLine(this.elements.slideFrame);


    this.elements.slides.push(this.createTypeSlide());
    this.elements.slides.push(this.createLocationSlide());
    this.elements.slides.push(this.createAreaSlide());
    this.elements.slides.push(this.createTransactionSlide());
    this.elements.slides.push(this.createEndSlide());
};

Dialog.prototype.addCenterLine = function(element) {
    var centerline = $('<div class="ventu-dialog-center-line"></div>'),
        middle = $('<div class="ventu-dialog-center-line-middle"></div>'),
        left = $('<div class="ventu-dialog-center-line-left"></div>'),
        right = $('<div class="ventu-dialog-center-line-right"></div>');



    centerline.append(left);
    centerline.append(middle);
    centerline.append(right);
    element.append(centerline);

    this.settings.size.centerline = $('.ventu-dialog-center-line').outerWidth();
    this.settings.size.side = Math.floor((this.settings.size.centerline - this.settings.size.body) / 2);
    left.css('width', this.settings.size.side);
    left.addClass('ventu-dialog-center-line--hidden');
    middle.css('width', this.settings.size.body);
    right.css('width', 0);
};

Dialog.prototype.createTypeSlide = function() {
    var types, element, container;
    types = ['Winkel', 'Kantoor', 'Bedrijfsruimte', 'Horeca', 'Bouwgrond'];
    element = $('<div id="ventu-dialog-slide-type" class="ventu-dialog-slide"></div>');

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    element.append(container);
    for (var i = 0, l = types.length; i < l; i++) {
        container.append(this.createTypeButton(types[i]));
    }
    this.elements.slideContainer.append(element);
    // make reusable selection
    this.elements.buttons.type = this.element.find('.ventu-dialog-type-button');
    element.css('width', this.settings.size.frame );
    return element;
};

Dialog.prototype.createTypeButton = function(type) {
    var self, button, icon, label;
    self = this;
    button = $('<div class="ventu-dialog-type-button" type="' + type + '"></div>');
    icon = $('<div class="ventu-dialog-type-button-icon"><img src="img/dialog/types/' + type.toLowerCase() + '.svg"></div>');
    label = $('<div class="ventu-dialog-type-button-label">' + type + '</div>');
    button.append(icon);
    button.append(label);
    button.click(function(){
        $(this).toggleClass('ventu-dialog-type-button--active');
        self.removeHeaderSection('types');
        self.updateType();
        self.status.updated['types'] = true;
        self.updateButtons();
    });
    return button;
};

Dialog.prototype.createLocationSlide = function() {
    var searchModule, element, search;
    element = $('<div id="ventu-dialog-slide-location" class="ventu-dialog-slide"></div>');
    search = $('<div class="ventu-search initialise-manually ventu-search--white ventu-search-marker"></div>');
    // make it align in the center
    search.css({
        'width': this.settings.size.body,
        'margin': '0 auto'
    });
    searchModule = new Search(search);
    searchModule.addOutput(this);

    element.css('width', this.settings.size.frame );
    element.append(search);
    this.elements.slideContainer.append(element);
    return element;
};

Dialog.prototype.selectLocation = function(location) {
    this.status.query.location = location;
    this.status.updated['location'] = true;
    this.removeHeaderSection('location');
    this.updateButtons();
};

Dialog.prototype.createAreaSlide = function() {
    var self = this, element, label1, label2, picker0, picker1, input1, input2, pickerset = {};
    element = $('<div id="ventu-dialog-slide-area" class="ventu-dialog-slide ventu-dialog-slide-area"></div>');
    label1 = $('<span>Vanaf</span>');
    label2 = $('<span>tot</span>');
    input1 = $('<input placeholder="...">');
    input2 = $('<input placeholder="...">');
    pickerset.picker0 = $('<div class="ventu-dialog-area-picker"></div>');
    pickerset.picker0.append('<div class="ventu-dialog-area-picker-label">min</div>');
    pickerset.picker0.append(input1);
    pickerset.picker0.append('<div class="ventu-dialog-area-picker-label">m²</div>');
    pickerset.picker1 = $('<div class="ventu-dialog-area-picker"></div>');
    pickerset.picker1.append('<div class="ventu-dialog-area-picker-label">max</div>');
    pickerset.picker1.append(input2);
    pickerset.picker1.append('<div class="ventu-dialog-area-picker-label">m²</div>');


    element.append(label1);
    element.append(pickerset.picker0);
    element.append(label2);
    element.append(pickerset.picker1);

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
            self.status.query.area[i] = san.value;
            pickerset['picker' + i].addClass('ventu-dialog-area-picker--picked');
        } else {
            self.status.query.area[i] = null;
            pickerset['picker' + i].removeClass('ventu-dialog-area-picker--picked');
        }
        self.status.updated['area'] = true;
        self.updateButtons();
        self.removeHeaderSection('area');
    }

    function sanitize(el) {
        // @walstra heb jij een mening of we nog meer moeten checken hier, gaat over
        // de oppervlakte waarden
        var value = el.val();
        if (!isNaN(value) && value.length > 0) {
            el.parent().removeClass('ventu-dialog-area-picker--error');
            return {
                value: value,
                valid: true
            }
        } else {
            el.parent().addClass('ventu-dialog-area-picker--error');
            return {
                value: null,
                valid: false
            }
        }
    }



    element.css('width', this.settings.size.frame );
    this.elements.slideContainer.append(element);
    return element;
};


Dialog.prototype.createTransactionSlide = function() {
    var transactions, element, container;
    transactions = ['Kopen', 'Huren', 'Beleggen'];
    element = $('<div id="ventu-dialog-slide-transaction"  class="ventu-dialog-slide"></div>');

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    element.append(container);
    for (var i = 0, l = transactions.length; i < l; i++) {
        container.append(this.createTransactionButton(transactions[i]));
    }
    element.css('width', this.settings.size.frame );
    this.elements.slideContainer.append(element);
    return element;
};

Dialog.prototype.createTransactionButton = function(transaction) {
    var self, button;
    self = this;
    button = $('<div class="ventu-dialog-transaction-button" transaction="' + transaction + '">' + transaction + '</div>');
    button.click(function(){
        var btn = this;
        $('.ventu-dialog-transaction-button').each(function(){
            if (this === btn) {
                $(this).addClass('ventu-dialog-transaction-button--active');
                self.status.query.transaction = $(this).attr('transaction');
                self.updateButtons();
                self.status.updated['transaction'] = true;
                self.removeHeaderSection('transaction');
            } else {
                $(this).removeClass('ventu-dialog-transaction-button--active');
            }
        });
    });
    return button;
};

Dialog.prototype.createEndSlide = function() {
    var element, container;
    element = $('<div id="ventu-dialog-slide-end" class="ventu-dialog-slide"></div>');

    container =  $('<div class="ventu-dialog-slide-end-container">Aan het zoeken naar resultaten</div>');
    element.append(container);
    this.elements.slideContainer.append(element);
    element.css('width', this.settings.size.frame );
    return element;
};






// status

Dialog.prototype.updateType = function() {
    var types = [];
    // find active types
    this.elements.buttons.type.each(function(){
        if ($(this).hasClass('ventu-dialog-type-button--active')) {
            types.push($(this).attr('type'));
        }
    });
    this.status.query.types = types;
};

Dialog.prototype.updateHeader = function() {
    for (var i = 0, l = this.sections.length; i < l; i++) {
        var section = this.sections[i],
            updated = this.status.updated[section],
            visited = this.status.visited[section];
        if (visited) {
            this.elements.header[section].show();
        }

        if (updated) {
            this.updateHeaderSection(section);
        }
    }
};

Dialog.prototype.updateHeaderSection = function(section) {
    var container, timer, label, labels, counter, i, l;

    labels = [];
    counter = 0;
    container = this.elements.header[section].find('.ventu-dialog-header-section-labels');
    container.empty();

    switch (section) {
        case 'types':
            for (i = 0, l = this.status.query.types.length; i < l; i++) {
                label = $('<div class="ventu-dialog-header-section-label">' + this.status.query.types[i] + '</div>');
                container.append(label);
                labels.push(label);
            }

            timer = setInterval(function(){
                labels[counter].addClass('show-label');
                counter++;
                if (counter >= l) {
                    clearInterval(timer);
                }
            }, 50);
            break;
        case 'location':
            label = $('<div class="ventu-dialog-header-section-label">' + this.status.query.location + '</div>');
            container.append(label);
            label.addClass('show-label');
            break;
        case 'area':
            for (i = 0, l = this.status.query.area.length; i < l; i++) {
                label = $('<div class="ventu-dialog-header-section-label">' + this.status.query.area[i] + 'm²</div>');
                container.append(label);
                labels.push(label);
            }

            timer = setInterval(function(){
                labels[counter].addClass('show-label');
                counter++;
                if (counter >= l) {
                    clearInterval(timer);
                }
            }, 50);
            break;
        case 'transaction':
            label = $('<div class="ventu-dialog-header-section-label">' + this.status.query.transaction + '</div>');
            container.append(label);
            label.addClass('show-label');
            break;
    }
    this.status.updated[section] = false;
};

Dialog.prototype.removeHeaderSection = function(section) {
    var n, labels, container, timer;
    container = this.elements.header[section].find('.ventu-dialog-header-section-labels');
    labels = container.find('.ventu-dialog-header-section-label');
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



// navigation

Dialog.prototype.next = function() {
    this.status.page.current++;
    this.slide();
    if (this.status.page.current === 4) {
        // TODO request @walstra
        var result = 'Berekend resultaat over 38.240 panden';
        $('.ventu-dialog-slide-end-container').html(result);
    }
};

Dialog.prototype.prev = function() {
    this.status.page.current--;
    this.slide();
};

Dialog.prototype.slide = function() {
    this.status.visited[this.sections[this.status.page.current]] = true;
    this.elements.slideContainer.css('left', -this.status.page.current * this.settings.size.frame);
    this.updateHeader();
    this.updateButtons();
};

Dialog.prototype.updateButtons = function() {
    // prev
    if (this.status.page.current > 0) {
        this.elements.buttons.prev.show();
    } else {
        this.elements.buttons.prev.hide();
    }

    // next
    switch (this.status.page.current) {
        case 0:
            if (this.status.query.types.length > 0) {
                this.setCenterline(this.status.page.current, true);
                this.elements.buttons.next.show();
            } else {
                this.setCenterline(this.status.page.current, false);
                this.elements.buttons.next.hide()
            }
            break;
        case 1:
            if (this.status.query.location.length > 0) {
                this.setCenterline(this.status.page.current, true);
                this.elements.buttons.next.show();
            } else {
                this.setCenterline(this.status.page.current, false);
                this.elements.buttons.next.hide();
            }
            break;
        case 2:
            if (this.status.query.area[0] !== null && this.status.query.area[1] !== null) {
                this.setCenterline(this.status.page.current, true);
                this.elements.buttons.next.show();
            } else {
                this.setCenterline(this.status.page.current, false);
                this.elements.buttons.next.hide();
            }
            break;
        case 3:
            if (this.status.query.transaction !== null) {
                this.setCenterline(this.status.page.current, true);
                this.elements.buttons.next.show();
            } else {
                this.setCenterline(this.status.page.current, false);
                this.elements.buttons.next.hide();
            }
            break;
        case 4:
            this.setCenterline(this.status.page.current, false);
            this.elements.buttons.next.hide();
            break;
    }
};

Dialog.prototype.setCenterline = function(page, allowed) {
    var left = $('.ventu-dialog-center-line-left'),
        middle = $('.ventu-dialog-center-line-middle'),
        right = $('.ventu-dialog-center-line-right');


    if (page === 0) {
        left.addClass('ventu-dialog-center-line--hidden');
    } else {
        left.removeClass('ventu-dialog-center-line--hidden')
    }


    if (allowed) {
        right.css('width', this.settings.size.side);
    } else {
        right.css('width', 0);
    }

    if (page === 4) {
        middle.addClass('ventu-dialog-center-line--hidden');
    } else {
        middle.removeClass('ventu-dialog-center-line--hidden')
    }


};