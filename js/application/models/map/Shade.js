function Shade(card, cardElement) {
    this.type = 'shade';
    this.card = card;
    this.element = null;
    this.transform = null;
    this.status = {
        stackPosition: this._getStackPosition()
    };
    this.create();
}

Shade.prototype = Object.create(_Element.prototype);


Shade.prototype.create = function() {
    this.element = $('<div class="ventu-card-shade"></div>');
    this.element.hide();
    window.ventu.domElements.stack.prepend(this.element);
};

Shade.prototype.fadeIn = function() {
    this.element.addClass('no-transition').fadeIn(500, function () {
        $(this).removeClass('no-transition')
    });
};

Shade.prototype.project = function (transform, rotate) {
    var projected,
        rotZ,
        scaleX,
        scaleY,
        depthFactor = 0.8;
    if (transform[6] < 0.8) {
        // reduce x shift for scaled (= closer to the ground)
        depthFactor = 1 - (transform[6] / 10);

    }


    if (rotate) {
        rotZ = 0.5 * transform[5];
        scaleX = (1.2 - Math.abs(transform[0] / 1000));
        scaleY = (1.2 - Math.abs(transform[1] / 1000));
    } else {
        rotZ = 0;
        scaleX = transform[6];
        scaleY = transform[7];
    }

    projected = [
        depthFactor * transform[0] - 50,
        depthFactor * transform[1] + 50,
        this.status.stackPosition.zIndex,
        0,
        0,
        rotZ,
        scaleX,
        scaleY
    ];
    this.setTransform(projected, false);
};

Shade.prototype._getStackPosition = function() {
    var zIndex = this.card.index === 0 ? window.ventu.config.card.sealevel - window.ventu.config.card.zGap + 2 : this.card.status.stackPosition.zIndex - window.ventu.config.card.zOffset;
    return {
        rotate: this.card.status.stackPosition.rotate,
        shiftX: this.card.status.stackPosition.shiftX,
        shiftY: this.card.status.stackPosition.shiftY,
        zIndex: zIndex
    }
};
