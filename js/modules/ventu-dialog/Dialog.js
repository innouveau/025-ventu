function Dialog(element) {
    this.element = element;

    this.sections = ['types', 'location', 'area'];

    this.status = {
        page: {
            current: 0
        },
        updated : {
            types: false,
            location: false,
            area: false
        },
        visited: {
            types: true,
            location: false,
            area: false
        },
        query: {
            types: [],
            location: '',
            area: [null, null]
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
            frame: 0
        }
    };

    this.create();
}



// creation

Dialog.prototype.create = function() {
    this.settings.size.frame = this.element.outerWidth();
    this.createHeader();
    this.createSlides();
    this.createButtons();
};

Dialog.prototype.createHeader = function() {
    this.elements.header.main = $('<div class="ventu-dialog-header"></div>');
    this.elements.header.types = $('<div class="ventu-dialog-header-section"><div class="ventu-dialog-header-section-text">Ik ben op zoek naar</div><div class="ventu-dialog-header-section-labels"></div></div>');
    this.elements.header.location = $('<div class="ventu-dialog-header-section"><div class="ventu-dialog-header-section-text">In de omgeving</div><div class="ventu-dialog-header-section-labels"></div></div>');
    this.elements.header.area = $('<div class="ventu-dialog-header-section"><div class="ventu-dialog-header-section-text">Met een oppervlakte van</div><div class="ventu-dialog-header-section-labels"></div></div>');

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
    this.elements.slideContainer.css('width', this.sections.length * this.settings.size.frame)
    this.element.append(this.elements.slideFrame);
    this.elements.slideFrame.append(this.elements.slideContainer);

    this.elements.slides.push(this.createTypeSlide());
    this.elements.slides.push(this.createLocationSlide());
    this.elements.slides.push(this.createAreaSlide());
};

Dialog.prototype.createTypeSlide = function() {
    var types, element, container;
    types = ['Winkel', 'Kantoor', 'Bedrijfsruimte', 'Horeca', 'Bouwgrond'];
    element = $('<div class="ventu-dialog-slide"></div>');

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
        self.updateType();
        self.status.updated['types'] = true;
        self.updateButtons();
    });
    return button;
};

Dialog.prototype.createLocationSlide = function() {
    var searchModule, element, search;
    element = $('<div class="ventu-dialog-slide"></div>');
    search = $('<div class="ventu-search initialise-manually ventu-search--white ventu-search-marker"></div>');
    // make it align in the center
    search.css({
        'width': 500,
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
    this.updateButtons();
};

Dialog.prototype.createAreaSlide = function() {
    var self = this, element, label1, label2, picker1, picker2, input1, input2;
    element = $('<div class="ventu-dialog-slide ventu-dialog-slide-area"></div>');
    label1 = $('<span>Vanaf</span>');
    label2 = $('<span>tot</span>');
    input1 = $('<input placeholder="...">');
    input2 = $('<input placeholder="...">');
    picker1 = $('<div class="ventu-dialog-area-picker"></div>');
    picker1.append('<div class="ventu-dialog-area-picker-label">min</div>');
    picker1.append(input1);
    picker1.append('<div class="ventu-dialog-area-picker-label">m²</div>');
    picker2 = $('<div class="ventu-dialog-area-picker"></div>');
    picker2.append('<div class="ventu-dialog-area-picker-label">max</div>');
    picker2.append(input2);
    picker2.append('<div class="ventu-dialog-area-picker-label">m²</div>');


    element.append(label1);
    element.append(picker1);
    element.append(label2);
    element.append(picker2);

    picker1.click(function(){
        input1.focus();
    });

    picker2.click(function(){
        input2.focus();
    });

    input1.keyup(function() {
        var val = $(this).val();
        if (val.length > 0) {
            val = self.sanitize(val);
            self.status.query.area[0] = val;
            picker1.addClass('ventu-dialog-area-picker--picked');
        } else {
            self.status.query.area[0] = null;
            picker1.removeClass('ventu-dialog-area-picker--picked');
        }
        self.status.updated['area'] = true;
        self.updateButtons();
    });

    input2.keyup(function() {
        var val = $(this).val();
        if (val.length > 0) {
            val = self.sanitize(val);
            self.status.query.area[1] = val;
            picker2.addClass('ventu-dialog-area-picker--picked');
        } else {
            self.status.query.area[1] = null;
            picker2.removeClass('ventu-dialog-area-picker--picked');
        }
        self.status.updated['area'] = true;
        self.updateButtons();
    });

    element.css('width', this.settings.size.frame );
    this.elements.slideContainer.append(element);
    return element;
};

Dialog.prototype.sanitize = function(val) {
    // @walstra heb jij een mening of we nog meer moeten checken hier, gaat over
    // de oppervlakte waarden
    return parseFloat(val);
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
    }
    this.status.updated[section] = false;
};



// navigation

Dialog.prototype.next = function() {
    this.status.page.current++;
    this.slide();
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
                this.elements.buttons.next.show();
            } else {
                this.elements.buttons.next.hide()
            }
            break;
        case 1:
            if (this.status.query.location.length > 0) {
                this.elements.buttons.next.show();
            } else {
                this.elements.buttons.next.hide();
            }
            break;
        case 2:
            if (this.status.query.area[0] !== null && this.status.query.area[1] !== null) {
                this.elements.buttons.next.show();
            } else {
                this.elements.buttons.next.hide();
            }
    }
};