function Config() {
    this.device = null;
    this.browser = this._getBrowser();
    this.os = this._getOS();
    this.isMapPresent = null;
    this.isCatcherPresent = null;
    this.card = null;
    this.shade = {

    };
    this.stack = {
        max: 5
    };
    this.zoom = 0;
    this.swipe = null;
    this.list = {
        max: 18 // make this x * 4 - 2, so that the catcher and the more together with the tiles form a square
    };
    this.sizes = {
        card: {
            width: 500,
            height: 400
        },
        bottomBar: null
    };
    this.event = {
        ontouchmoveAllowd: false
    };
    this._init();

}

Config.prototype._init = function() {
    this.inlineStyleContainer = $('<div id="inline-styles">').appendTo('body');
    this._initTouchMove();
    this._addResizeListener();
    this._resize();
};

Config.prototype._resize = function() {
    this.device = this._getDevice();
    this.card = this._getCardConfig();
    this.swipe = {
        suggest: this.device.type === 0 ? 50 : 100,
        complete: this.device.type === 0 ? 100 : 200
    };
    this.sizes.bottomBar = this._getBottomBarSizes();
    this._setBrowserSpecificStyle();
    this._setResponsiveSettings();
};


Config.prototype._initTouchMove = function() {
    var self = this;
    document.ontouchmove = function(event){
        if (!self.event.ontouchmoveAllowd) {
            event.preventDefault();
        }

    };
};

Config.prototype.setTouchMove = function(setting) {
    this.event.ontouchmoveAllowd = setting;
};



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
    } else if (width === 1024) {
        type = 2;
        name = 'tablet';
    } else {
        type = 3;
        name = 'desktop';
    }

    orientation = (width > height) ? 'landscape' : 'portrait';


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
        loveX = cardRight- 20 - 16;
        hateX = cardRight - 60 - 16;
        width = 40;
        height = 40;
        y = (this.device.height - 170) / 2 + 65;
    } else {
        cardTop = 124 + 200;
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

Config.prototype._getBrowser = function() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset+7);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
        (verOffset=nAgt.lastIndexOf('/')) )
    {
        browserName = nAgt.substring(nameOffset,verOffset);
        fullVersion = nAgt.substring(verOffset+1);
        if (browserName.toLowerCase()==browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
        fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
        fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
        fullVersion  = ''+parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion,10);
    }

    return {
        browserName: browserName,
        fullVersion: fullVersion,
        appName: navigator.appName,
        userAgent: navigator.userAgent
    }
};

Config.prototype._getOS = function() {
    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName = "Linux";
    return OSName;
};

Config.prototype._getCardConfig = function() {
    if (this.browser.browserName === 'Safari' && this.device.type > 0) {
        return {
            shift: 4,
            sealevel: 500,
            zGap: 200,
            zOffset: 10,
            rotation: 25
        };
    } else {
        return {
            shift: 4,
            sealevel: 0, // z position of top card
            zGap: 500, // if you change this, change @keyframes float-shade in card.less as well corresponding
            zOffset: 1, // z offset inside stack
            rotation: 25
        };
    }
};


// browser specific styles

Config.prototype._setBrowserSpecificStyle = function() {
    this._setFilterZindex();
    this._createBottomBarAnimationUnder();
    this._createBottomBarAnimationOver();
    this._createCardFloatAnimation();
    this._createShadowFloatAnimation();
};

Config.prototype._setFilterZindex = function() {
    if (this.browser.browserName === 'Safari' && this.device.type > 0) {
        var top = this.card.sealevel + 250,
            select2style = '.select2-container { transform: translateZ(' + (top + 1) + 'px); }';
        this._injectStyles((select2style));
        $('#ventu-filters').css('transform', 'translateZ(' + top + 'px)');
        $('nav').css('transform', 'translateZ(' + top + 'px)');

    }
};




Config.prototype._createBottomBarAnimationOver = function() {
    var zBottomBarUnder = this.card.sealevel + 1,
        baseString = '#keyframes move-over { 0%{ #transform: translateY(0) translateZ(0); } 25% { #transform: translateY(0) translateZ(#zpx);}100% {#transform: translateY(-550px) translateZ(#zpx);}}';
    this._prefixAndInject(baseString, zBottomBarUnder);
};

Config.prototype._createBottomBarAnimationUnder = function() {
    var zBottomBarUnder = this.card.sealevel - this.card.zGap + 1,
        baseString = '#keyframes shift-under { 0%{ #transform: translateY(0) translateZ(0); } 25% { #transform: translateY(0) translateZ(#zpx);}100% {transform: translateY(-550px) translateZ(#zpx);}}';
    this._prefixAndInject(baseString, zBottomBarUnder);
};

Config.prototype._createShadowFloatAnimation = function() {
    var z = this.card.sealevel - this.card.zGap + 2,
        baseString = '#keyframes float-shade { 0%{ #transform: translateX(50px) translateY(50px) translateZ(#zpx) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.2,1.2); } 25% { #transform: translateX(140px) translateY(50px) translateZ(#zpx) rotateX(12.5deg) rotateY(0deg) rotateZ(0deg) scale(1.2,1.2); } 75% { #transform: translateX(-40px) translateY(50px) translateZ(#zpx) rotateX(12.5deg) rotateY(0deg) rotateZ(0deg) scale(1.2,1.2); } 100% { #transform: translateX(50px) translateY(50px) translateZ(#zpx) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.2,1.2); }}';
    this._prefixAndInject(baseString, z);
};

Config.prototype._createCardFloatAnimation = function() {
    var z = this.card.sealevel,
        baseString = '#keyframes float { 0%{ #transform: translateX(0px) translateY(0px) translateZ(#zpx) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1,1); } 25% { #transform: translateX(120px) translateY(0px) translateZ(#zpx) rotateX(25deg) rotateY(20deg) rotateZ(0deg) scale(1,1); } 75% { #transform: translateX(-120px) translateY(0px) translateZ(#zpx) rotateX(25deg) rotateY(-20deg) rotateZ(0deg) scale(1,1); } 100% { #transform: translateX(0px) translateY(0px) translateZ(#zx) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1,1); } }';
    this._prefixAndInject(baseString, z);
};




Config.prototype._prefixAndInject = function(baseString, z) {
    this._injectStyles(this._prefixStyle('@keyframes', 'transform', baseString, z));
    this._injectStyles(this._prefixStyle('@-moz-keyframes', '-moz-transform', baseString, z));
    this._injectStyles(this._prefixStyle('@-webkit-keyframes', '-webkit-transform', baseString, z));
    this._injectStyles(this._prefixStyle('@-o-keyframes', '-o-transform', baseString, z));
    this._injectStyles(this._prefixStyle('@-ms-keyframes', '-ms-transform', baseString, z));
};

Config.prototype._prefixStyle = function(keyframes, transform, baseString, z) {
    return baseString.replace(new RegExp('#keyframes', 'g'), keyframes).replace(new RegExp('#transform', 'g'), transform).replace(new RegExp('#z', 'g'), z);
};


Config.prototype._injectStyles = function(rule) {
    this.inlineStyleContainer.append('&shy;<style>' + rule + '</style>');
};




// device specifice sizes


Config.prototype._addResizeListener = function() {
    var self = this;
    $(window).resize(function() {
        self._resize();
    })
};

Config.prototype._setResponsiveSettings = function() {
    if (this.device.type === 0) {
        this._sizeSearchBar();
    }
};

Config.prototype._sizeSearchBar = function() {

    var element = $('.ventu-map-search');
    if (!$(element).parent().hasClass('ventu-map-search-wrapper')) { // otherwise it will also resize the homepage search box
        var width = this.device.width - 130;
        $('.ventu-map-search').css('width', width);
    }
};
