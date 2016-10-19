function List(app, type, title) {
    this.app = app;
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

List.prototype._create = function() {
    var header = $('<div class="ventu-bottom-bar-header"></div>');
    this.element.main = $('<div class="ventu-bottom-bar-sub ventu-bottom-bar-sub-' + this.type + '"></div>');
    this.element.catcher = $('<div class="ventu-bottom-bar-catcher"></div>');
    this.element.list = $('<div class="ventu-bottom-bar-list"></div>');
    this.element.counter = $('<div class="ventu-list-counter">x</div>');
    header.append('Je hebt ');
    header.append(this.element.counter);
    header.append(' objecten in je <i>' + this.title + '</i>. <a href="list.html">Bekijken</a>');
    this.element.main.append(header);
    this.element.main.append(this.element.catcher);
    this.element.main.append(this.element.list);
    this.app.domElements.bottomBar.append(this.element.main);
};


List.prototype._appendLists = function() {
    this.objects = this.app.service.getList(this.type);
    for (var i = 0, l = this.objects.length; i < l; i++) {
        var item = this.objects[i];
        this._appendObject(item);
    }
    this._count();
};

List.prototype._appendObject = function(item) {
    var content = item.getContent(),
        element = $('<div class="ventu-bottom-bar-list-item"><div class="ventu-bottom-bar-list-item-image" style="background-image: url(' + content.image + ')"></div></div>');
    this.element.list.prepend(element);
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
        Card.destroy();
        self._appendObject(self.objects[0]);
    }, 1000)
};
