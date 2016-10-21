function Building(app, building) {
    this.app = app;
    this.uniqueId = building.UniqueId;
    // address
    this.address = building.Address;
    this.city = building.City;
    this.postcode = building.Postcode;
    this.fullAddressInfo = building.FullAddressInfo;
    // price
    this.price = building.Price;
    this.priceInfo = building.PriceInfo;
    this.priceNOTK = building.PriceNOTK;
    this.pricePerYear = building.PricePerYear;
    this.saleOrRent = building.SaleOrRent;
    this.metrageInfo = building.MetrageInfo;
    this.broker = building.Broker;
    // extra info
    this.imageURL = building.ImageURL;
    this.detailLinkUrl = building.DetailLinkUrl;
    this.brochureUrl = building.BrochureUrl;
    this.videoUrl = building.VideoUrl;
    this.primaryUsage = building.PrimaryUsage;

    // temp fake data
    this.imageURL = 'https://ventu.nl' + this.imageURL;
    this.detailLinkUrl = './detail.html';

}

Building.prototype.hasProperty = function(property) {
    return this[property] != null && this[property] != undefined && this[property].length > 0;
};

Building.prototype.getCardContent = function() {
    var hasPrimaryUsageData = this.hasProperty('primaryUsage'),
        hasSaleData = this.hasProperty('saleOrRent'),
        hasMetrageInfo = this.hasProperty('metrageInfo'),
        hasPriceInfo = this.hasProperty('priceInfo'),
        list = [],
        icons = [];

    if (hasPrimaryUsageData || hasSaleData) {
        list.push((hasPrimaryUsageData ? this.primaryUsage : '') + (hasSaleData ? ' | ' + this.saleOrRent : ''));
    }

    if (hasMetrageInfo) {
        var metrageInfoText = this.metrageInfo;

        if (metrageInfoText.indexOf('#') > -1) {
            var result = metrageInfoText.match(/#(.*?)#/g).map(function (val) {
                return val.replace(/#/g, '');
            });
            $(result).each(function (index, resourceName) {
                function completed(resourceValue) {
                    metrageInfoText = metrageInfoText.replace('#' + resourceName + '#', resourceValue);
                }
                //SearchUtil.getResourceValue('App.LocalResources.Home', resourceName, completed); // todo replace this?
            });
        }
        list.push(metrageInfoText);
    }

    if (hasPriceInfo) {
        var priceInfoText = this.priceInfo;
        if (priceInfoText.indexOf('#') > -1) {
            var result = priceInfoText.match(/#(.*?)#/g).map(function (val) {
                return val.replace(/#/g, '');
            });
            $(result).each(function (index, resourceName) {
                function completed(resourceValue) {
                    priceInfoText = priceInfoText.replace('#' + resourceName + '#', resourceValue);
                }
                //SearchUtil.getResourceValue('App.LocalResources.Home', resourceName, completed); // todo replace this?
            });
        }
        list.push(priceInfoText);
    }

    var iconResult = { style: 'image', url: this.detailLinkUrl + '#photos' };

    // image is always available
    icons.push(iconResult);

    if (this.brochureUrl) {
        iconResult = { style: 'document', url: this.detailLinkUrl + '#brochure' };
        icons.push(iconResult);
    }

    if (this.videoUrl) {
        iconResult = { style: 'video', url: this.detailLinkUrl + '#objectmovie' };
        icons.push(iconResult);
    }

    if (this.TourUrl) {
        iconResult = { style: 'video', url: this.detailLinkUrl + '#objectmovie' };
        icons.push(iconResult);
    }
    result = {
        image: this.imageURL == null ? '/img/misc/ventu-stock-thumb.jpg' : this.imageURL,
        text: {
            head: this.address,
            sub: this.city,
            list: this._listToUl(list),
            address: this.fullAddressInfo,
            detailLinkUrl: this.detailLinkUrl
        },
        icons: icons
    };
    return result;
};

Building.prototype._listToUl = function(list) {
    var ul = '<ul>';
    for (var i = 0, l = list.length; i < l; i++) {
        ul += '<li>' + list[i] + '</li>';
    }
    return ul += '</ul>';
};