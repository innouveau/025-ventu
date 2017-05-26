function _Map() {}



// poly




// cards

_Map.prototype._removeCards = function() {
    for (var i = 0, l = this.cards.length; i < l; i++) {
        this.cards[i].destroy(false);
    }
    this.cards = [];
};



_Map.prototype.getBuilding = function(UniqueId) {
    for (var i = 0, l = window.ventu.objects.length; i < l; i++) {
        var obj = window.ventu.objects[i];
        if (obj.UniqueId === UniqueId) {
            return new Building(obj);
        }
    }
    return null;
};



// getters


_Map.prototype._getLaunchType = function() {
    if (window.ventu.user.askIfDidSee('cardLaunch') || !window.ventu.config.isMapPresent) {
        return 'normal';
    } else {
        return 'cool'
    }
};



// dom

_Map.prototype.updateDom = function() {
    this.updateResultBar();
    this.updateBottomBar();
    this.updateBottomBarType('love');
    this.updateBottomBarType('hate');
};

_Map.prototype.updateResultBar = function() {
    $('#ventu-filter-result').html(this.status.found);
};

_Map.prototype.updateBottomBar = function() {
    $('#ventu-bottom-bar-counter-label').html(this.status.left + ' objecten over');
};

_Map.prototype.updateBottomBarType = function(type) {
    var container = $('#ventu-bottom-bar-' + type + ' .ventu-bottom-bar-label-container'),
        label;
    if (container.hasClass('ventu-bottom-bar-label-container--rotated')) {
        label = container.find('.venu-bottom-bar-label-front .ventu-bottom-bar-label-text');
    } else {
        label = container.find('.venu-bottom-bar-label-back .ventu-bottom-bar-label-text');
    }
    if (parseInt(label.html()) !== this.status[type]) {
        label.html(this.status[type]);
        container.toggleClass('ventu-bottom-bar-label-container--rotated');
    }
};
