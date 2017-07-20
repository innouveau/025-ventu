function _Element() {}

_Element.prototype._getTransform = function (transform, netto) {
    if (settings.card.spatial) {
        var rotate = this.status.stackPosition.rotate,
            shiftX = this.status.stackPosition.shiftX,
            shiftY = this.status.stackPosition.shiftY,
            z = this.status.stackPosition.zIndex;
        // netto is only used by addToList()
        if (netto) {
            rotate = 0;
            shiftX = 0;
            shiftY = 0;
            z = window.ventu.config.card.sealevel - window.ventu.config.card.zGap + 2;
        }
        var scaleSX = transform[6], scaleSY = transform[7];

        // fix for iphone4 screens
        if (screen.height <= 480) {
            scaleSX = scaleSY = 0.75;
        }

        return 'translateX(' + (transform[0] + shiftX) + 'px) ' +
            'translateY(' + (transform[1] + shiftY) + 'px) ' +
            'translateZ(' + z + 'px) ' +
            'rotateX(' + transform[3] + 'deg) ' +
            'rotateY(' + transform[4] + 'deg) ' +
            'rotateZ(' + (transform[5] + rotate) + 'deg) ' +
            'scale(' + scaleSX + ',' + scaleSY + ')';
    } else {
        return 'translateX(' + transform[0] + 'px) translateY(' + transform[1] + 'px) translateZ(' + this.status.stackPosition.zIndex + 'px)';
    }
};

_Element.prototype.setTransform = function (trnsf, netto) {
    var transform = this._getTransform(trnsf, netto);
    this.transform = transform;
    this.element.css({
        "webkitTransform": transform,
        "MozTransform": transform,
        "msTransform": transform,
        "OTransform": transform,
        "transform": transform
    });
};