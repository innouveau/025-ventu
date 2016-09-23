function Building(app, building) {
    this.app = app;
    this.ImageURL = building.ImageURL;
    this.city = building.city;
    this.icons = building.icons;
    this.DetailLinkUrl = building.DetailLinkUrl;
    this.address = building.address;
    this.BrochureUrl = building.BrochureUrl;
    this.VideoUrl = building.VideoUrl;
    this.PrimaryUsage = building.PrimaryUsage;
    this.SaleOrRent = building.SaleOrRent;
    this.MetrageInfo = building.MetrageInfo;
    this.PriceInfo = building.PriceInfo;
}

Building.prototype.hasProperty = function(property) {
    return this[property] != null && this[property] != undefined && this[property].length > 0;
};

Building.prototype.getContent = function() {
    var hasPrimaryUsageData = this.hasProperty('PrimaryUsage'),
        hasSaleData = this.hasProperty('SaleOrRent'),
        hasMetrageInfo = this.hasProperty('MetrageInfo'),
        hasPriceInfo = this.hasProperty('PriceInfo'),
        list = [],
        icons = [];

    if (hasPrimaryUsageData || hasSaleData) {
        list.push((hasPrimaryUsageData ? this.PrimaryUsage : '') + (hasSaleData ? ' | ' + this.SaleOrRent : ''));
    }

    if (hasMetrageInfo) {
        var metrageInfoText = this.MetrageInfo;

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
        var priceInfoText = this.PriceInfo;
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

    var iconResult = { style: 'image', url: this.DetailLinkUrl + '#photos' };

    // image is always available
    icons.push(iconResult);

    if (this.BrochureUrl) {
        iconResult = { style: 'document', url: this.DetailLinkUrl + '#brochure' }
        icons.push(iconResult);
    }

    if (this.VideoUrl) {
        iconResult = { style: 'video', url: this.DetailLinkUrl + '#objectmovie' }
        icons.push(iconResult);
    }

    if (this.TourUrl) {
        iconResult = { style: 'video', url: this.DetailLinkUrl + '#objectmovie' }
        icons.push(iconResult);
    }

    result = {
        image: this.ImageURL == null ? '/img/misc/ventu-stock-thumb.jpg' : this.ImageURL,
        text: {
            head: this.city,
            sub: this.address,
            list: list,
            detailLinkUrl: this.DetailLinkUrl
        },
        icons: icons
    };
    return result;
};