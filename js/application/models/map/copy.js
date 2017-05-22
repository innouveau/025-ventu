

// actions

Card.prototype._unsetCurrent = function (rotate, zIndex, shiftX, shiftY, shadeZindex) {
    this.position.rotate = rotate;
    this.position.zIndex = zIndex;
    this.position.shadeZindex = shadeZindex;
    this.position.shiftX = shiftX;
    this.position.shiftY = shiftY;
    this._moveToOriginalPositionInStack();
    if (window.ventu.config.isMapPresent) {
        this.marker.unselect();
    }
};

Card.prototype.swap = function () {
    var self = this,
        topCard = window.ventu.map.currentCard,
        originalX = this.position.shiftX;
    // pull both horizontal out of stack
    topCard.position.shiftX = -500;
    this.position.shiftX = 500;
    topCard._moveToOriginalPositionInStack();
    this._moveToOriginalPositionInStack();

    setTimeout(function () {

        topCard._unsetCurrent(self.position.rotate, self.position.zIndex, originalX, self.position.shiftY, self.position.shadeZindex);
        self._setCurrent();

        if (this.shade) {
            window.ventu.domElements.stack.append(self.shade.element);
        }
        window.ventu.domElements.stack.append(self.element);

        self.marker.parent.cards.move(self.index, 0);

        $(self.marker.parent.cards).each(function (index, card) {
            if (card !== null) {
                card.index = index;
                card.position = card._getPosition(index);
                card._moveToOriginalPositionInStack();
            }
        });

    }, 500);
};


// moves


Card.prototype._moveToOriginalPositionInStack = function () {
    var thisTransform = [0, 0, 0, 0, 0, 0, 1, 1];
    this.setTransform(thisTransform, false);

    if (this.shade) {
        this.shade.project(thisTransform, false);
        this.shade.fadeIn();
    }
};

Card.prototype._moveToOrigin = function (unrotate) {
    var transform = [0, 0, 0, 0, 0, 0, 1, 1];
    if (unrotate) {
        this.position.rotate = 0;
    }
    this.element.removeClass('no-transition');
    if (this.shade) {
        this.shade.element.removeClass('no-transition');
    }
    this.setTransform(transform, false);
    if (this.shade) {
        this.shade.project(transform, true);
    }
};















// administration





