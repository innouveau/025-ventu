function SignIn(element) {
    this.element = element;

    this.sections = [
        {
            title: 'email',
            header: 'Voer je emailadres in'
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
        case 'company':
            this.createCompanySlide(slide.body);
            break;
        case 'name':
            this.createNameSlide(slide.body);
            break;
        case 'telephone':
            this.createTelephoneSlide(slide.body);
            break;
        case 'password-registration':
            this.createPasswordRegistrationSlide(slide.body);
            break;
        case 'end-registration':
            this.createEndRegistrationSlide(slide.body);
            break;
    }
    return slide.element;
};

// Login slides

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

// Registration slides

SignIn.prototype.createCompanySlide = function(body) {
    var self = this, container, form, input;

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    form = $('<div class="ventu-form"></div>');
    this.elements.inputs.company = $('<input type="text" placeholder="bedrijfsnaam">');
    this.elements.inputs.company.keyup(function(){
        self.updateButtons();
    });
    form.append(this.elements.inputs.company);
    container.append(form);
    body.append(container);
};

SignIn.prototype.createNameSlide = function(body) {
    var self = this, container, form, input;

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    form = $('<div class="ventu-form"></div>');
    this.elements.inputs.name = $('<input type="text" placeholder="naam">');
    this.elements.inputs.name.keyup(function(){
        self.updateButtons();
    });
    form.append(this.elements.inputs.name);
    container.append(form);
    body.append(container);
};

SignIn.prototype.createTelephoneSlide = function(body) {
    var self = this, container, form, input;

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    form = $('<div class="ventu-form"></div>');
    this.elements.inputs.telephone = $('<input type="text" placeholder="telefoon">');
    this.elements.inputs.telephone.keyup(function(){
        self.updateButtons();
    });
    form.append(this.elements.inputs.telephone);
    container.append(form);
    body.append(container);
};

SignIn.prototype.createPasswordRegistrationSlide = function(body) {
    var self = this, container, form, input;

    container =  $('<div class="ventu-dialog-slide-buttons-container"></div>');
    form = $('<div class="ventu-form"></div>');
    this.elements.inputs.passwordRegistration = $('<input type="password" placeholder="wachtwoord">');
    this.elements.inputs.passwordRegistration.keyup(function(){
        self.updateButtons();
    });
    form.append(this.elements.inputs.passwordRegistration);
    container.append(form);
    body.append(container);
};

SignIn.prototype.createEndRegistrationSlide = function(body) {
    var container;
    container =  $('<div class="ventu-slider-slide-end-container">Start met zoeken!</div>');
    body.append(container);
};






// status and checks



SignIn.prototype.isAllowedToSlide = function(callback) {
    switch (this.sections[this.status.page.current].title) {
        case 'email':
            // TODO @walstra request email check
            var result =  Math.random() > 0.5;
            if (result) {
                this.addSlidesForLogin();
            } else {
                this.addSlidesForRegistration();
            }
            callback();
            // end of request
            break;
        case 'password':
            // TODO @walstra request email check
            var result = true;
            if (result) {
                callback();
            } else {
                var message = 'Verkeerde combinatie inlog en password';
                this.feedbackInput(this.elements.inputs.password, message);
            }
            break;
        case 'password-registration':
            // TODO @walstra request email check
            var result = true;
            if (result) {
                callback();
            } else {
                var message = 'Verkeerde combinatie inlog en password';
                this.feedbackInput(this.elements.inputs.passwordRegistration, message);
            }
            break;
        case 'company':
        case 'name':
        case 'telephone':
            // check on frontend side is already done by isAllowdToShowButton
            // no backend checks here, so execute callback
            callback();
            break;
    }
};

SignIn.prototype.feedbackInput = function (input, message) {
    // todo
};

SignIn.prototype.isAllowedToShowButton = function() {
    switch (this.sections[this.status.page.current].title) {
        case 'email':
            return this.isValidEmail(this.elements.inputs.email.val());
            break;
        case 'password':
            return this.isSafePassword(this.elements.inputs.password.val());
            break;
        case 'password-registration':
            return this.isSafePassword(this.elements.inputs.passwordRegistration.val());
            break;
        case 'company':
            return this.isString(this.elements.inputs.company.val());
            break;
        case 'name':
            return this.isString(this.elements.inputs.name.val());
            break;
        case 'telephone':
            return this.isTelephone(this.elements.inputs.telephone.val());
            break;
    }
};

SignIn.prototype.isString = function(string) {
    return string.length > 0;
};

SignIn.prototype.isTelephone = function(string) {
    return string.length > 0;
};

SignIn.prototype.isSafePassword = function(string) {
    return string.length > 5;
};

SignIn.prototype.isValidEmail = function(email) {
    return email.length > 0 && email.indexOf('@') > -1 && email.indexOf('.') > -1;

    //
    // if () {
    //     // TODO hier de request
    //     //var result = true;
    //     //this.addSlidesForLogin();
    //     return true;
    // } else {
    //     //this.addSlidesForRegistration();
    //     return false;
    // }
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


SignIn.prototype.addSlidesForLogin = function () {
    if (!this.status.extraSlidesAdded) {
        var extraSections = [
            {
                title: 'password',
                header: 'Wij kennen jou. Voer je wachtwoord in'
            }, {
                title: 'end',
                header: ''
            }
        ];
        this.addSlides(extraSections);
        this.status.extraSlidesAdded = true;
    } else {
     // ?
    }
};

SignIn.prototype.addSlidesForRegistration = function () {
    if (!this.status.extraSlidesAdded) {
        var extraSections = [
            {
                title: 'company',
                header: 'Je bent nieuw. Voer je bedrijfsnaam in'
            }, {
                title: 'telephone',
                header: 'Voeg een telefoonnummer toe'
            }, {
                title: 'name',
                header: 'Je eigen naam'
            }, {
                title: 'password-registration',
                header: 'Kies een wachtwoord'
            }, {
                title: 'end-registration',
                header: 'Je account is gemaakt.'
            }
        ];
        this.addSlides(extraSections);
        this.status.extraSlidesAdded = true;
    } else {
        // ?
    }
};
