function App() {
    this.map = null;
    this.config = null;
    this.user = null;
    this.guide = null;

    this.domElements = {
        stack: $('#ventu-stack'),
        bottomBar: $('#ventu-bottom-bar')
    };
    this.objects = [];
}

App.prototype.init = function() {
    this.config = new Config();
    if (this.config.device.type === 0) {
        this.map = new MapMobile();
    } else {
        this.map = new MapMobile();
    }
    this.user = new User();
    this.guide = new Guide();
};

App.prototype.redraw = function(result) {
    this.objects = result.objects;
    this.map.draw(result, false);
};

App.prototype.openFilter = function() {
    $('#ventu-filters').show();
    $('#ventu-stack').hide();
};

App.prototype.closeFilter = function() {
    $('#ventu-filters').hide();
    $('#ventu-stack').show();
};