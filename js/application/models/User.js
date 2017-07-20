function User() {
    // things the user had done already
    this.did = user.did;
    this.timer = null;
    this.loveObjects = $.sessionStorage.get('ventu-favorites');
    this.hateObjects = $.sessionStorage.get('ventu-trash');
    // container for differenct timers. If timer complete boolean set to true
    this.fulltime = {};
}

User.prototype.didFindOut = function(what) {
    this.did.findout[what] = true;
};

User.prototype.askIfDidFindOut = function(what) {
    return this.did.findout[what];
};

User.prototype.uses = function(what) {
    var criteria,
        topic;
    this.did.use[what]++;

    switch (what) {
        case 'buttons':
            criteria = this.did.use.buttons > 3;
            topic = 'swiping';
            this._checkCriteria(criteria, topic);
            break;
        case 'rating':
            var criteria = this.did.use.rating > 20,
                topic = 'filter';
            this._checkCriteria(criteria, topic);
            break;
    }

};

User.prototype._checkCriteria = function(criteria, topic) {
    var head, message;
    if (criteria && !this.askIfDidFindOut(topic)) {
        // so he did a certain set of actions, but didn't find out
        // the related topic. Lets give him a hint.
        switch (topic) {
            case 'swiping':
                head = 'Swipen';
                message = 'Je kunt de kaarten ook swipen.<br>Als je de kaart naar rechts sleept en dan los laat, belandt hij in je interesselijst.<br><br>Als je naar links sleept vind je hem niet interessant.';
                break;
            case 'filter':
                head = 'Filters';
                message = 'Gebruik de filters om je selectie te verkleinen.';
                break;
            case 'lists':
                head = 'Je selectie bekijken?';
                message = 'Klik onderaan op de favorieten-balk om je selectie te bekijken.';
                break;
        }
        modal.message(head, message, false, false);

        // don't bother again
        this.didFindOut(topic);
    }
};

User.prototype.didSee = function(what) {
    this.did.see[what] = true;
};

User.prototype.askIfDidSee = function(what) {
    return this.did.see[what];
};

User.prototype.startTimer = function(what) {
    var self = this,
        time,
        criteria;
    this.stopTimer();

    switch (what) {
        case 'filter':
            time = 30000;
            // only bother him when there are enought markers, so
            // the user is willing to filter
            criteria = window.ventu.map.markers.length > 10
    }

    if (criteria) {
        this.timer = setTimeout(function () {
            self.fulltime[what] = true;
        }, time)
    }
};

User.prototype.stopTimer = function() {
    clearTimeout(this.timer);
};