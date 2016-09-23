function DataFaker(app) {
    this.app = app;
    this.buildings = [
        {
            ImageURL: './img/kantoor.jpg',
            city: 'Amsterdam',
            icons: '',
            address: 'Amstel 77',
            VideoUrl: 'url to video',
            DetailLinkUrl: 'www.'

        }, {
            ImageURL: './img/kantoor2.jpg',
            city: 'Delft',
            icons: '',
            address: 'Taj Mahalplaats 61',
            BrochureUrl: 'url to brochure',
            DetailLinkUrl: 'www.'

        }
    ];
    this.current = 0;
}

DataFaker.prototype.init = function() {
    this.app.cards = Math.round(100 * Math.random());
    this.app.objects = [];
    for (var i = 0, l = this.buildings.length; i < l; i++) {
        this.app.objects.push(new Building(this.app, this.buildings[i]))
    }

    this.app.buildCard(0, this.app.cards);
};



DataFaker.prototype.translate = function(string) {
    // no need to translate in development modus
    return string;
};

DataFaker.prototype.post = function(id) {
    var n = Math.round((this.buildings.length - 1) * Math.random());
    this.app.objects.push(new Building(this.app, this.buildings[n]))
};

DataFaker.prototype.sessionStore = function(objects) {
    // do nothing
};