function _Element() {}

_Element.prototype._getTransform = function (transform, netto) {
    var rotate = this.position.rotate,
        shiftX = this.position.shiftX,
        shiftY = this.position.shiftY,
        z = this.position.zIndex;
    // netto is only used by addToList()
    if (netto) {
        rotate = 0;
        shiftX = 0;
        shiftY = 0;
        z = window.ventu.config.card.sealevel - window.ventu.config.card.zGap + 2;
    }
    return 'translateX(' + (transform[0] + shiftX) + 'px) ' +
        'translateY(' + (transform[1] + shiftY) + 'px) ' +
        'translateZ(' + z + 'px) ' +
        'rotateX(' + transform[3] + 'deg) ' +
        'rotateY(' + transform[4] + 'deg) ' +
        'rotateZ(' + (transform[5] + rotate) + 'deg) ' +
        'scale(' + transform[6] + ',' + transform[7] + ')';
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