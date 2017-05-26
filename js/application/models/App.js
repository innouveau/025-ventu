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
        this.config.setTouchMove(false);
        this.map = new MapMobile();
    } else {
        this.map = new Map();
    }
    this.user = new User();
    this.guide = new Guide();
};

App.prototype.redraw = function(result) {
    this.objects = result.objects;
    this.map.draw(result, false);
};

App.prototype.openFilter = function() {
    this.config.setTouchMove(true);
    $('#ventu-filters').show();
    $('#ventu-stack').hide();
};

App.prototype.closeFilter = function() {
    this.config.setTouchMove(false);
    $('#ventu-filters').hide();
    $('#ventu-stack').show();
};