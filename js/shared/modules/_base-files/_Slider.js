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
    this.centerline = new Centerline(this);
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
    this.elements.slideContainer.css('left', -this.status.page.current * this.settings.size.frame);
    this.centerline.resize();
};

_Slider.prototype.getBodySize = function() {
    return Math.max(this.element.outerWidth(), 600);
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










// navigation

_Slider.prototype.next = function() {
    var self = this;
    this.centerline.elements.buttons.next.removeClass('waving');

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





// status

_Slider.prototype.updateButtons = function() {
    var allowed;
    if (this.settings.hasSetStatus) {
        this.updateSetStatus();
    }
    // prev
    if (this.status.page.current > 0) {
        this.centerline.elements.buttons.prev.show();
    } else {
        this.centerline.elements.buttons.prev.hide();
    }

    allowed = this.isAllowedToShowButton();

    if (allowed) {
        this.centerline.elements.buttons.next.show();
    } else {
        this.centerline.elements.buttons.next.hide();
    }
    this.centerline.update();
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