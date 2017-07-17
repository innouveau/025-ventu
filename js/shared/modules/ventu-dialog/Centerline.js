function Centerline(parent) {
    this.parent = parent;

    this.elements = {
        centerline: {
            left: null,
            middle: null,
            right: null
        },
        buttons: {
            prev: null,
            next: null
        }
    };
    this.settings = {
        size: {
            body: 0,
            centerline: 0,
            side: 0
        }
    };
    this.create();
}

Centerline.prototype.create = function() {
    this.createCenterline();
    this.createButtons();
    this.resize();
};

Centerline.prototype.createCenterline = function() {
    var centerline, wrapper;
    centerline = $('<div class="ventu-slider-center-line"></div>');
    wrapper = $('<div class="ventu-slider-center-line-wrapper"></div>');
    this.elements.centerline.middle = $('<div class="ventu-slider-center-line-middle"></div>');
    this.elements.centerline.left = $('<div class="ventu-slider-center-line-left"></div>');
    this.elements.centerline.right = $('<div class="ventu-slider-center-line-right"></div>');

    centerline.append(wrapper);
    wrapper.append(this.elements.centerline.left).append(this.elements.centerline.middle).append(this.elements.centerline.right);
    this.parent.element.append(centerline);
};

Centerline.prototype.createButtons = function() {
    var self;
    self = this;
    this.elements.buttons.prev = $('<div class="ventu-slider-navigation-button ventu-slider-navigation-prev"></div>');
    this.elements.buttons.next = $('<div class="ventu-slider-navigation-button ventu-slider-navigation-next waving"><div class="ventu-slider-navigation-button-wave"></div></div>');
    this.elements.buttons.prev.click(function(){
        self.parent.prev();
    });
    this.elements.buttons.next.click(function(){
        self.parent.next();
    });

    this.elements.buttons.prev.hide();
    this.elements.buttons.next.hide();

    this.elements.centerline.left.append(this.elements.buttons.prev);
    this.elements.centerline.right.append(this.elements.buttons.next);
};

Centerline.prototype.resize = function() {
    this.settings.size.body = $('.ventu-slider-slide-content').outerWidth();
    this.settings.size.centerline = $('.ventu-slider-center-line-wrapper').outerWidth();
    this.parent.settings.size.side = Math.floor((this.settings.size.centerline - this.settings.size.body) / 2);

    this.elements.centerline.left.css('width', this.parent.settings.size.side).addClass('ventu-slider-center-line--hidden');
    this.elements.centerline.middle.css('width', this.settings.size.body);
    this.elements.centerline.right.css('width', 0);

    this.update();
};

Centerline.prototype.update = function() {
    var page = this.parent.status.page.current,
        allowed = this.parent.isAllowedToShowButton(),
        left = $('.ventu-slider-center-line-left'),
        middle = $('.ventu-slider-center-line-middle'),
        right = $('.ventu-slider-center-line-right');


    if (page === 0) {
        left.addClass('ventu-slider-center-line--hidden');
    } else {
        left.removeClass('ventu-slider-center-line--hidden')
    }


    if (allowed) {
        right.css('width', this.parent.settings.size.side);
    } else {
        right.css('width', 0);
    }

    if (page === 4) {
        middle.addClass('ventu-slider-center-line--hidden');
    } else {
        middle.removeClass('ventu-slider-center-line--hidden')
    }
};