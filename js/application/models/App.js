function App() {
    this.map = null;
    this.config = null;
    this.user = null;

    this.domElements = {
        stack: $('#ventu-stack'),
        bottomBar: $('#ventu-bottom-bar')
    };
    this.objects = [];
    this.init();
}

App.prototype.init = function() {
    this.map = new Map();
    this.config = new Config();
    this.user = new User();
};

App.prototype.redraw = function(result) {
    this.objects = result.objects;
    this.map.draw(result, false);
};