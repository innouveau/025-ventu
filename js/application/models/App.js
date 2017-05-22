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
    this.map = new Map();
    this.user = new User();
    this.guide = new Guide();
};

App.prototype.redraw = function(result) {
    this.objects = result.objects;
    this.map.draw(result, false);
};