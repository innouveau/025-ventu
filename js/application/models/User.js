function User() {
    // things the user had done already
    this.did = user.did;
    this.timer = null;
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
    if (criteria && !this.askIfDidFindOut(topic)) {
        // so he did a certain set of actions, but didn't find out
        // the related topic. Lets give him a hint.
        window.ventu.guide.hint(topic);
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