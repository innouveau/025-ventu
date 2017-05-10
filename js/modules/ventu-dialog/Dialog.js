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
            area: []
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
    var self, prev, next;
    self = this;
    prev = $('<div class="ventu-dialog-navigation-button ventu-dialog-navigation-prev"></div>');
    next = $('<div class="ventu-dialog-navigation-button ventu-dialog-navigation-next"></div>');
    prev.click(function(){
        self.prev();
    });
    next.click(function(){
        self.next();
    });

    this.elements.slideFrame.append(next);
    this.elements.slideFrame.append(prev);
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
    });
    return button;
};

Dialog.prototype.createLocationSlide = function() {
    var self = this, searchModule, element, search;
    element = $('<div class="ventu-dialog-slide"></div>');
    search = $('<div class="ventu-search initialise-manually ventu-search--white ventu-search-marker" ph="Zoek op plaats, naam, postcode, gebouw"></div>');
    // make it align in the center
    search.css({
        'width': 500,
        'margin': '0 auto'
    });
    searchModule = new Search(search);
    searchModule.addCallback(self.selectLocation);

    element.css('width', this.settings.size.frame );
    element.append(search);
    this.elements.slideContainer.append(element);
    return element;
};

Dialog.prototype.selectLocation = function(location) {
    console.log(location);
};

Dialog.prototype.createAreaSlide = function() {

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
    var container, timer, labels, counter;

    labels = [];
    counter = 0;
    container = this.elements.header[section].find('.ventu-dialog-header-section-labels');
    container.empty();

    switch (section) {
        case 'types':
            for (var i = 0, l = this.status.query.types.length; i < l; i++) {
                var label = $('<div class="ventu-dialog-header-section-label">' + this.status.query.types[i] + '</div>');
                container.append(label);
                labels.push(label);
            }

            timer = setInterval(function(){
                labels[counter].addClass('show-label');
                counter++;
                if (counter >= l) {
                    clearInterval(timer);
                }
            }, 50)
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
};