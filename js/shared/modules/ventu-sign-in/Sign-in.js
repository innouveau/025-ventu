function SignIn(element) {
    this.element = element;

    this.sections = [
        {
            title: 'email',
            header: 'Voer je emailadres in'
        },{
            title: 'password',
            header: 'Voer je wachtwoord in'
        },{
            title: 'end',
            header: ''
        }
    ];

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
            email: null,
            password: null
        },
        slides: []
    };


    this.settings = {
        size: {
            body: 600,
            frame: 0
        },
        hasSetStatus: false
    };

    this.create();
}

SignIn.prototype = Object.create(_Slider.prototype);


SignIn.prototype.createHeader = function() {

};

SignIn.prototype.createSlide = function(i) {
    var section, slide;

    section = this.sections[i];
    slide = this.createBasicSlide(i);
    switch (section.title) {
        case 'email':
            this.createEmailSlide(slide.body);
            break;
        case 'password':
            this.createPasswordSlide(slide.body);
            break;
        case 'end':
            this.createEndSlide(slide.body);
            break;
    }
    return slide.element;
};

SignIn.prototype.createEmailSlide = function(body) {
    var self = this, container, form, input;

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    form = $('<div class="ventu-form"></div>');
    this.elements.inputs.email = $('<input type="email" placeholder="email">');
    this.elements.inputs.email.keyup(function(){
        self.updateButtons();
    });
    form.append(this.elements.inputs.email);
    container.append(form);
    body.append(container);
};

SignIn.prototype.createPasswordSlide = function(body) {
    var self = this, container, form, input;

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    form = $('<div class="ventu-form"></div>');
    this.elements.inputs.password = $('<input type="password" placeholder="password">');
    this.elements.inputs.password.keyup(function(){
        self.updateButtons();
    });
    form.append(this.elements.inputs.password);
    container.append(form);
    body.append(container);
};

SignIn.prototype.createEndSlide = function(body) {
    var container;
    container =  $('<div class="ventu-slider-slide-end-container">Je bent nu ingelogd</div>');
    body.append(container);
};




// status and checks

SignIn.prototype.isAllowed = function() {
    switch (this.status.page.current) {
        case 0:
            return this.isValidEmail(this.elements.inputs.email.val());
            break;
        case 1:
            return this.isValidPassword(this.elements.inputs.email.val(), this.elements.inputs.password.val());
            break;
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

SignIn.prototype.isValidPassword = function(email, password) {
    if (email.length > 0 && email.indexOf('@') > -1 && email.indexOf('.') > -1 && password.length > 0) {
        // TODO hier de request
        var result = true;
        return result;
    } else {
        return false;
    }
};

SignIn.prototype.updateHeader = function() {

};

