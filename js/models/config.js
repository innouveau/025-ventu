function Config(app) {
    this.app = app;
    this.device = this._getDevice();
    this.isMapPresent = null;
    this.isCatcherPresent = null;
    this.card = {
        shift: 4, // shift in stack
        zGap: 500, // if you change this, change @keyframes float-shade in card.less as well corresponding
        zOffset: 10, // z offset inside stack
        rotation: 15
    };
    this.shade = {

    };
    this.stack = {
        max: 3
    };
    this.zoom = 0;
    this.swipe = {
        suggest: this.device.type === 0 ? 50 : 100,
        complete: this.device.type === 0 ? 100 : 200
    };
    this.list = {
        max: 18 // make this x * 4 - 2, so that the catcher and the more together with the tiles form a square
    };
    this.sizes = {
        card: {
            width: 500,
            height: 400
        },
        bottomBar: this._getBottomBarSizes()
    }
}

Config.prototype._getDevice = function() {
    var width = $(window).outerWidth(),
        height = $(window).outerHeight(),
        orientation ='',
        type,
        name;

    if (width < 768) {
        type = 0;
        name = 'mobile';
    } else if (width < 1024) {
        type = 1;
        name = 'tablet';
        orientation = 'portrait';
    } else if (width === 1024) {
        type = 2;
        name = 'tablet';
        orientation = 'landscape';
    } else {
        type = 3;
        name = 'desktop';
    }

    return {
        name: name,
        orientation: orientation,
        type: type,
        width: width,
        height: height
    }
};

Config.prototype._getBottomBarSizes = function() {
    var cardTop, cardRight, bottomBarHeight, bottomBarShifted,
        catcherFromTop, catcherWidth, catcherHeight, halfCatcherWidth,
        marginBottomBar, halfCatcherHeight, rightBottomBar, y,
        loveX, hateX, width, height;

    if (this.device.type === 0) {
        cardRight = this.device.width / 2 - 5;
        loveX = cardRight- 20;
        hateX = cardRight - 60;
        width = 40;
        height = 40;
        y = (this.device.height - 170) / 2 + 65;
    } else {
        cardTop = 124 + 200 - 4;// perspective correction
        cardRight = 120 + 250;
        bottomBarHeight = 44;
        bottomBarShifted = 550;
        catcherFromTop = 11 + 25 + 5 + 1 + 15;
        catcherWidth = 276;
        catcherHeight = 221;
        halfCatcherWidth = catcherWidth / 2;
        marginBottomBar = 50 + 20;
        halfCatcherHeight = catcherHeight / 2;
        rightBottomBar = 320;
        y = this.device.height - cardTop - bottomBarHeight - bottomBarShifted + catcherFromTop + halfCatcherHeight;

        loveX = cardRight - marginBottomBar - halfCatcherWidth;
        hateX = -(rightBottomBar + marginBottomBar + halfCatcherWidth - cardRight);
        width = catcherWidth;
        height = catcherHeight;

    }
    return {
        love: {
            x: loveX,
            y: y,
            width: width,
            height: height
        },
        hate: {
            x: hateX,
            y: y,
            width: width,
            height: height
        }
    }
};