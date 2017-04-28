function List(type, title) {
    this.type = type;
    this.title = title;
    this.objects = [];
    this.element = {
        main: null,
        counter: null,
        catcher: null,
        list: null
    };
    this._create();
    this._appendLists();
}

List.prototype._create = function () {
    var _self = this;

    var header = $('<div class="ventu-bottom-bar-header"></div>'),
        label;
    this.element.main = $('<div class="ventu-bottom-bar-sub ventu-bottom-bar-sub-' + this.type + '"></div>');
    this.element.catcher = $('<div class="ventu-bottom-bar-catcher"></div>');
    this.element.list = $('<div class="ventu-bottom-bar-list"></div>');
    this.element.counter = $('<div class="ventu-list-counter ' + this.type + '">0</div>');
    this.element.more = $('<div class="ventu-list-more"></div>');

    //label = $('<div class="ventu-list-label"></div>');
    //label.append('Je hebt ');
    //label.append(this.element.counter);
    //label.append(' objecten in je <i>' + this.title + '</i>.');
    //header.append(label);

    if (SearchUtil) {
        function completed1(resourceValue) {
            var strings = resourceValue.split('#');

            label = $('<div class="ventu-list-label"></div>');
            label.append(strings[0]);
            label.append(_self.element.counter);
            label.append(strings[1]);
            header.append(label);
        }
        SearchUtil.getResourceValue('Ventu2.LocalResources.Application', 'JeHebtXObjecten' + _self.title, completed1);

        function completed2(resourceValue) {
            $('body').append('<a class="ventu-to-list ventu-to-list-' + _self.type + '" href="' + (_self.type == 'love' ? '/Interesselijst' : '/Prullenbak') + '">' + resourceValue + '</a>');
        }
        SearchUtil.getResourceValue('Ventu2.LocalResources.Application', 'Bekijken', completed2);
    }
    else {
        label = $('<div class="ventu-list-label"></div>');
        label.append('Je hebt ');
        label.append(this.element.counter);
        label.append(' objecten in je <i>' + this.title + '</i>.');
        header.append(label);

        $('body').append('<a class="ventu-to-list ventu-to-list-' + this.type + '" href="' + (this.type == 'love' ? '/Interesselijst' : '/Prullenbak') + '">Bekijken</a>');
    }

    this.element.more.hide();
    this.element.list.append(this.element.more);
    this.element.main.append(header);
    this.element.main.append(this.element.catcher);
    this.element.main.append(this.element.list);
    window.ventu.domElements.stack.append(this.element.main);
    window.ventu.config.isCatcherPresent = true;

    var self = this;
    var sessionObjects = null;

    if (this.type == 'love') {
        sessionObjects = $.sessionStorage.get('ventu-favorites');
    } else if (this.type == 'hate') {
        sessionObjects = $.sessionStorage.get('ventu-trash');
    }

    if (sessionObjects && sessionObjects.length > 0) {
        this.objects = sessionObjects;

        $(this.objects).each(function (index, building) {
            self._appendObject(building);
        });

        self._count();
    }

};


List.prototype._appendLists = function() {
    var self = this;
     window.ventu.service.getList(this.type, listFillCallback);
    
    function listFillCallback(list) {
        self.objects = list;
        for (var i = 0, l = self.objects.length; i < l; i++) {
            var item = self.objects[i];
            self._appendObject(item);
        }
        self._count();
    }

};

List.prototype._appendObject = function (item) {
    if (this.objects.length <= window.ventu.config.list.max) {
        var imageURL = "https://ventu.nl/" + (item.imageURL == null ? '/img/misc/ventu-stock-thumb.jpg' : item.imageURL);

        var element = $('<div class="ventu-bottom-bar-list-item"><div class="ventu-bottom-bar-list-item-image" style="background-image: url(' + imageURL + ')"></div></div>');
        this.element.list.prepend(element);
    } else {
        this.element.more.show();
        this.element.more.html('+' + (this.objects.length - window.ventu.config.list.max));
    }
};

List.prototype._count = function() {
    this.element.counter.html(this.objects.length);
};

List.prototype.add = function(Card) {
    var self = this;
    Card.element.css('transform', '');
    this.element.catcher.append(Card.element);
    Card.shade.remove();
    this.element.main.removeClass('selected');
    this.objects.unshift(Card.building);
    this._count();
    setTimeout(function(){
        Card.destroy(true);
        self._appendObject(Card.building);

        if (self.type == 'love') {
            window.ventu.service.ajaxPost('/Application/LikeObject', { objectGuid: Card.building.uniqueId });

            $.sessionStorage.set('ventu-favorites', JSON.stringify(self.objects));

        } else if (self.type == 'hate') {
            window.ventu.service.ajaxPost('/Application/DisLikeObject', { objectGuid: Card.building.uniqueId });

            $.sessionStorage.set('ventu-trash', JSON.stringify(self.objects));
        }

    }, 500)
};

