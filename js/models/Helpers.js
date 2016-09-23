function Helpers(app) {
    this.app = app;
}

Helpers.prototype.setCSStransform = function(element, transform) {
    element.css({
        "webkitTransform": transform,
        "MozTransform": transform,
        "msTransform": transform,
        "OTransform": transform,
        "transform": transform
    });
};

Helpers.prototype.getTransform = function(i, scaleX, scaleY) {
    var verticalPosition = this.app.config.stack.verticalPosition;

    //console.log('getTransform', i, scaleX, scaleY, this.app.config.stack);

    //console.log('getTransform - container height', this.app.config.sizes.container.height);
    //console.log('getTransform - body height', this.app.config.sizes.body.height);

    //verticalPosition = this.app.config.sizes.container.height;

    return 'rotateX(80deg) ' +
        'translateZ(' + (-verticalPosition + i * this.app.config.stack.offset) + 'px) ' +
        'translateY(' + (-0.5 * verticalPosition + i * this.app.config.stack.offset) + 'px) ' +
        'translateX(' + ((this.app.config.sizes.container.width / 2) - (this.app.config.sizes.card.width / 2)) + 'px) ' +
        'scale(' + scaleX + ',' + scaleY + ')';
};

Helpers.prototype.getCustomTransform = function(scaleX, scaleY, shiftY, shiftX) {
    var verticalPosition = this.app.config.stack.verticalPosition;

    //console.log('getCustomTransform', scaleX, scaleY, shiftY, shiftX, this.app.config.stack);

    //verticalPosition = this.app.config.sizes.container.height;

    return 'rotateX(80deg) ' +
        'translateZ(' + (-verticalPosition) + 'px) ' +
        'translateY(' + (-0.5 * verticalPosition + shiftY) + 'px) ' +
        'translateX(' + ((this.app.config.sizes.container.width / 2) - (this.app.config.sizes.card.width / 2) + shiftX) + 'px) ' +
        'scale(' + scaleX + ',' + scaleY + ')';
};

Helpers.prototype.injectStyles = function(rule) {
    var div = $('<div />', {
        html: '&shy;<style>' + rule + '</style>'
    }).appendTo('body');
};


