function App() {
    this.manager = null;
    this.map = null;
    this.config = null;
    this.user = null;
    this.guide = null;



    this.domElements = {
        stack: $('#ventu-stack'),
        bottomBar: $('#ventu-bottom-bar'),
        filter: $('#ventu-filters')
    };

    this.objects = [];

    this.currentCard = null;
}

App.prototype.init = function() {
    this.config = new Config();
    if (this.config.device.type === 0) {
        window.ventu.config.isMapPresent = false;
        this.config.setTouchMove(false);
        //this.map = new MapMobile();
    } else {
        window.ventu.config.isMapPresent = true;
        this.map = new Map();
    }
    this.manager = new Manager();
    this.user = new User();
    this.guide = new Guide();
};



// updates

App.prototype.redraw = function(result) {
    this.createObjects(result.markers);
    this.createAndMatchBuildings(result.objects);
    if (this.map) {
        this.map.draw(result, false);
    }
    this.manager.update(result);
};

App.prototype.createObjects = function(objects) {
    this.objects = [];
    for (var i = 0, l = objects.length; i < l; i++) {
        var obj = new Obj(objects[i]);
        this.objects.push(obj);
    }
};

App.prototype.createAndMatchBuildings = function(buildings) {
    for (var i = 0, l = buildings.length; i < l; i++) {
        var building = buildings[i],
            obj = this.getObjectById(building.uniqueId);
        if (obj) {
            obj.building = new Building(obj, building);
        } else {
            console.log('Couldnt match building (of short list) with object (of long list)');
        }
    }
};




// dom

App.prototype.openFilter = function() {
    this.config.setTouchMove(true);
    this.domElements.filter.show();
    this.domElements.stack.hide();
};

App.prototype.closeFilter = function() {
    this.config.setTouchMove(false);
    this.domElements.filter.hide();
    this.domElements.stack.show();
};



// getters

App.prototype.getObjectById = function(UniqueId) {
    for (var i = 0, l = this.objects.length; i < l; i++) {
        var obj = this.objects[i];
        if (obj.UniqueId === UniqueId) {
            return obj;
        }
    }
    return null;
};