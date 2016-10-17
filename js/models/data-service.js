function DataService(app) {
    this.app = app;
    this.filter = {
        area : {
            min: 2500,
            max: 10000
        },
        offer: ['Koop', 'Huur'],
        searchCircle: {
            active: false,
            km: 1
        }
    }
}

DataService.prototype.init = function() {

};


DataService.prototype.filterUpdate = function() {
    
};

DataService.prototype.translate = function(string) {
    function completed(resourceValue) {
        text = resourceValue;
    }
    SearchUtil.getResourceValue('App.LocalResources.Home', string, completed);
};

DataService.prototype.post = function(type, id) {
    SearchUtil.post('/Services/GoogleSearch.svc/' + type, id);
};

DataService.prototype.sessionStore = function(objects) {
    $.sessionStorage.set('ventu-favorites', objects);
};