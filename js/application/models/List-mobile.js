function ListMobile(type, title) {
    this.type = type;
    this.title = title;
    this.objects = [];
    this.element = {
        counter: null
    };
    this._create();
}

ListMobile.prototype._create = function () {
    this.element.counter = $('<a class="ventu-list-counter ' + this.type + '" href="' + (this.type == 'love' ? '/Interesselijst' : '/Prullenbak') + '">0</a>');
    window.ventu.domElements.bottomBar.append(this.element.counter);
    // prevent swipe suggest trying to add a class on not existing bottom bar element
    window.ventu.config.isCatcherPresent = false;

    var self = this;
    var sessionObjects = null;

    if (this.type == 'love') {
        sessionObjects = $.sessionStorage.get('ventu-favorites');
    } else if (this.type == 'hate') {
        sessionObjects = $.sessionStorage.get('ventu-trash');
    }

    if (sessionObjects && sessionObjects.length > 0) {
        this.objects = sessionObjects;
    }

    this._count();
};

ListMobile.prototype._count = function() {
    this.element.counter.html(this.objects.length);
};

ListMobile.prototype.add = function(Card) {
    Card.element.fadeOut(100);
    Card.shade.remove();

    var self = this;

    this.objects.unshift(Card.building);
    this._count();
    setTimeout(function(){
        Card.destroy(true);

        if (self.type == 'love') {
            window.ventu.service.ajaxPost('/Application/LikeObject', { objectGuid: Card.building.uniqueId });

            $.sessionStorage.set('ventu-favorites', JSON.stringify(self.objects));
        } else if (self.type == 'hate') {
            window.ventu.service.ajaxPost('/Application/DisLikeObject', { objectGuid: Card.building.uniqueId });

            $.sessionStorage.set('ventu-trash', JSON.stringify(self.objects));
        }
    }, 500)
};

