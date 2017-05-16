function SignIn(element) {
    this.element = element;

    this.sections = ['email', 'wachtwoord'];

    this.headers = {
        email: 'Voer je emailadres in'
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
        inputs : {
            email: null
        },
        slides: []
    };


    this.settings = {
        size: {
            body: 600,
            frame: 0
        }
    };

    this.create();
}

SignIn.prototype = Object.create(_Slider.prototype);


SignIn.prototype.createHeader = function() {

};

SignIn.prototype.createSlides = function() {
    this.elements.slides.push(this.createEmailSlide());
};

SignIn.prototype.createEmailSlide = function() {
    var self = this, slide, container, form, input;
    slide = this.createBasicSlide('email');

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    form = $('<div class="ventu-form"></div>');
    this.elements.inputs.email = $('<input type="email" placeholder="email">');
    this.elements.inputs.email.keyup(function(){
        self.updateButtons();
    });

    form.append(this.elements.inputs.email);
    container.append(form);
    slide.body.append(container);

    return slide.element;
};

SignIn.prototype.updateButtons = function() {
    var allowed;
    // prev
    if (this.status.page.current > 0) {
        this.elements.buttons.prev.show();
    } else {
        this.elements.buttons.prev.hide();
    }

    allowed = this.isAllowed();
    console.log(allowed);

    if (allowed) {
        this.elements.buttons.next.show();
    } else {
        this.elements.buttons.next.hide();
    }
    this.setCenterline(this.status.page.current, allowed);
};

SignIn.prototype.isAllowed = function() {
    switch (this.status.page.current) {
        case 0:
            return this.isValidEmail(this.elements.inputs.email.val());

    }
};

SignIn.prototype.isValidEmail = function(email) {
    if (email.length > 0 && email.indexOf('@') > -1 && email.indexOf('.') > -1) {
        // TODO hier de request
        var result = true;
        return result;
    } else {
        return false;
    }

};

