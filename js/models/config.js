function Config(app) {
    this.app = app;
    this.card = {
        horizontalShift: 0, // horizontal shift card relative to container
            selectedPosition: ''
    };
    this.shade = {
        active: false,
            selected: {
            y: 160, // distance shade form stack
                width: 0.6,
                height: 0.16
        },
        normal: {
            width: 0.22,
                height: 0.26
        }
    };
    this.stack = {
        n: 5,
        offset: 4, // pixels vertical offset inside stack
            verticalPosition :0
    };
    this.zoom = 0.2; // factor of magnification of stack
    this.swipe = 200;
    this.sizes = {
        card: {
            width: 500,
            height: 400
        },
        bottomBar: this._getBottomBarSizes()
    }
}

Config.prototype._getBottomBarSizes = function() {
    var cardTop = 104 + 200,
        cardRight = 40 + 250,
        bottomBarHeight = 44,
        bottomBarShifted = 550,
        catcherFromTop = 11 + 25 + 5 + 1 + 15,
        catcherWidth = 276,
        catcherHeight = 221,
        halfCatcherWidth = catcherWidth / 2,
        marginBottomBar = 20,
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