function _Slider() {}



// creation

_Slider.prototype.create = function() {
    var self = this;
    $(window).resize(function(){
        self.resize();
    });
    this.initStatus();
    this.element.addClass('ventu-slider');
    this.settings.size.frame = this.element.outerWidth();
    this.createHeader();
    this.createSlider();
    this.createSlides();
    this.addCenterLine(this.elements.slideFrame);
    this.createButtons();
};

_Slider.prototype.initStatus = function() {
    this.status = {
        page: {
            current: 0
        },
        updated : [],
        visited: [],
        set: []
    };
    for (var i = 0, l = this.sections.length; i < l; i++) {
        var section = this.sections[i];
        this.status.updated[i] = false;
        this.status.visited[i] = false;
        this.status.set[i] = false;
    }
};

_Slider.prototype.createSlider = function() {
    this.elements.slideFrame = $('<div class="ventu-slider-slide-frame"></div>');
    this.elements.slideContainer = $('<div class="ventu-slider-slide-container"></div>');
    this.elements.slideContainer.css('width', this.sections.length * this.settings.size.frame);
    this.element.append(this.elements.slideFrame);
    this.elements.slideFrame.append(this.elements.slideContainer);
};

_Slider.prototype.resize = function() {
    this.settings.size.frame = this.element.outerWidth();
    this.elements.slideContainer.css('width', (this.sections.length + 1) * this.settings.size.frame);
    this.element.find('.ventu-slider-slide').css('width', this.settings.size.frame );
};

_Slider.prototype.createSlides = function() {
    for (var i = 0, l = this.sections.length; i < l; i++) {
        var slide = this.createSlide(i);
        this.elements.slides.push( slide );
    }
};

_Slider.prototype.createBasicSlide = function(section) {
    var element, content, header, body;

    element = $('<div id="ventu-slider-slide-' + this.sections[section].title + '" class="ventu-slider-slide"></div>');
    content = $('<div class="ventu-slider-slide-content"></div>');
    header = $('<div class="ventu-slider-slide-header"><div class="ventu-slider-header-section-text">' + this.sections[section].header + '</div></div>');
    body = $('<div class="ventu-slider-slide-body"></div>');

    element.append(content);
    content.append(header);
    content.append(body);
    this.elements.slideContainer.append(element);
    element.css('width', this.settings.size.frame );
    return {
        element: element,
        body: body
    };
};

_Slider.prototype.createButtons = function() {
    var self;
    self = this;
    this.elements.buttons.prev = $('<div class="ventu-slider-navigation-button ventu-slider-navigation-prev"></div>');
    this.elements.buttons.next = $('<div class="ventu-slider-navigation-button ventu-slider-navigation-next waving"><div class="ventu-slider-navigation-button-wave"></div></div>');
    this.elements.buttons.prev.click(function(){
        self.prev();
    });
    this.elements.buttons.next.click(function(){
        self.next();
    });

    this.elements.buttons.prev.hide();
    this.elements.buttons.next.hide();

    this.elements.centerline.left.append(this.elements.buttons.prev);
    this.elements.centerline.right.append(this.elements.buttons.next);
};

_Slider.prototype.addCenterLine = function(element) {
    var centerline = $('<div class="ventu-slider-center-line"></div>');
    this.elements.centerline.middle = $('<div class="ventu-slider-center-line-middle"></div>');
    this.elements.centerline.left = $('<div class="ventu-slider-center-line-left"></div>');
    this.elements.centerline.right = $('<div class="ventu-slider-center-line-right"></div>');



    centerline.append(this.elements.centerline.left);
    centerline.append(this.elements.centerline.middle);
    centerline.append(this.elements.centerline.right);
    element.append(centerline);

    this.settings.size.centerline = $('.ventu-slider-center-line').outerWidth();
    this.settings.size.side = Math.floor((this.settings.size.centerline - this.settings.size.body) / 2);
    this.elements.centerline.left.css('width', this.settings.size.side);
    this.elements.centerline.left.addClass('ventu-slider-center-line--hidden');
    this.elements.centerline.middle.css('width', this.settings.size.body);
    this.elements.centerline.right.css('width', 0);
};




// navigation

_Slider.prototype.next = function() {
    var self = this;
    this.elements.buttons.next.removeClass('waving');

    this.isAllowedToSlide(callback);


    function callback() {
        self.status.page.current++;
        self.slide();
    }
};

_Slider.prototype.prev = function() {
    this.status.page.current--;
    this.slide();
};

_Slider.prototype.slide = function() {
    this.status.visited[this.status.page.current] = true;
    this.elements.slideContainer.css('left', -this.status.page.current * this.settings.size.frame);
    this.digest();
};

_Slider.prototype.setCenterline = function(page, allowed) {
    var left = $('.ventu-slider-center-line-left'),
        middle = $('.ventu-slider-center-line-middle'),
        right = $('.ventu-slider-center-line-right');


    if (page === 0) {
        left.addClass('ventu-slider-center-line--hidden');
    } else {
        left.removeClass('ventu-slider-center-line--hidden')
    }


    if (allowed) {
        right.css('width', this.settings.size.side);
    } else {
        right.css('width', 0);
    }

    if (page === 4) {
        middle.addClass('ventu-slider-center-line--hidden');
    } else {
        middle.removeClass('ventu-slider-center-line--hidden')
    }
};



// status

_Slider.prototype.updateButtons = function() {
    var allowed;
    if (this.settings.hasSetStatus) {
        this.updateSetStatus();
    }
    // prev
    if (this.status.page.current > 0) {
        this.elements.buttons.prev.show();
    } else {
        this.elements.buttons.prev.hide();
    }

    allowed = this.isAllowedToShowButton();

    if (allowed) {
        this.elements.buttons.next.show();
    } else {
        this.elements.buttons.next.hide();
    }
    this.setCenterline(this.status.page.current, allowed);
};

_Slider.prototype.digest = function() {
    if (this.settings.hasSetStatus) {
        this.updateSetStatus();
    }
    this.updateButtons(true);
    this.updateHeader();
};



//

_Slider.prototype.addSlides = function(sections) {
    for (var i = 0, l = sections.length; i < l; i++) {
        var extraSection,slide, index;
        extraSection = sections[i];
        // put them into the sections
        this.sections.push(extraSection);
        index = this.sections.length - 1;
        // create the slide
        slide = this.createSlide(index);
        this.elements.slides.push( slide );
        // add their status
        this.status.updated[index] = false;
        this.status.visited[index] = false;
        this.status.set[index] = false;
    }
    this.elements.slideContainer.css('width', this.sections.length * this.settings.size.frame);
};