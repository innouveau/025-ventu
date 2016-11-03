function Config(app) {
    this.app = app;
    this.card = {
        shift: 4, // shift in stack
        zGap: 500, // if you change this, change @keyframes float-shade in card.less as well corresponding
        zOffset: 10, // z offset inside stack
        rotation: 15
    };
    this.shade = {

    };
    this.stack = {
        max: 5
    };
    this.zoom = 0;
    this.swipe = {
        suggest: 100,
        complete: 200
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

Config.prototype._getBottomBarSizes = function() {
    var cardTop = 124 + 200 - 4,// perspective correction
        cardRight = 120 + 250,
        bottomBarHeight = 44,
        bottomBarShifted = 550,
        catcherFromTop = 11 + 25 + 5 + 1 + 15,
        catcherWidth = 276,
        catcherHeight = 221,
        halfCatcherWidth = catcherWidth / 2,
        marginBottomBar = 50 + 20,
        halfCatcherHeight = catcherHeight / 2,
        rightBottomBar = 320,
        y = $(window).outerHeight() - cardTop - bottomBarHeight - bottomBarShifted + catcherFromTop + halfCatcherHeight,
        loveX = cardRight - marginBottomBar - halfCatcherWidth,
        hateX = -(rightBottomBar + marginBottomBar + halfCatcherWidth - cardRight),
        width = catcherWidth,
        height = catcherHeight;
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