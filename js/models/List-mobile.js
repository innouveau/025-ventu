function ListMobile(app, type, title) {
    this.app = app;
    this.type = type;
    this.title = title;
    this.objects = [];
    this.element = {
        counter: null
    };
    this._create();
}

ListMobile.prototype._create = function() {
    this.element.counter = $('<a class="ventu-list-counter ' + this.type + '">x</a>');
    this.app.domElements.bottomBar.append(this.element.counter);
    // prevent swipe suggest trying to add a class on not existing bottom bar element
    this.app.config.isCatcherPresent = false;
    this._count();
};

ListMobile.prototype._count = function() {
    this.element.counter.html(this.objects.length);
};

ListMobile.prototype.add = function(Card) {
    Card.element.fadeOut(100);
    Card.shade.remove();


    this.objects.unshift(Card.building);
    this._count();
    setTimeout(function(){
        Card.destroy(true);
    }, 1000)
};

