function Building(building) {
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
    this.imageURL = building.PhotoURL !== null ? building.PhotoURL.replace('/wm', '/thumb') : null;
    this.detailLinkUrl = '/Project/' + building.DetailLinkUrl + '?c=1';
    this.brochureUrl = building.BrochureUrl;
    this.videoUrl = building.VideoUrl;
    this.primaryUsage = building.PrimaryUsage;
    this.objectUsageId = building.ObjectUsageId;
    this.productId = building.ProductId;
    this.includesOrganization = building.IncludesOrganization;
    this.salesHeaderLine = building.SalesHeaderLine;

    this.baseObject = building;
}

Building.prototype.getCardAddress = function () {
    if (this.productId > 0 && this.broker !== null && this.broker.Logo !== null && this.includesOrganization) {
        return this.fullAddressInfo;
    } else {
        return this.address;
    }
};

Building.prototype.getCardCity = function () {
    return this.city;
};

Building.prototype.getCardImage = function () {
    var img = this.imageURL === null ? '/img/misc/ventu-stock-thumb.jpg' : this.imageURL;
    return img; //'https://ventu.nl' + img;
};

Building.prototype.getCardBrokerLogo = function () {
    if (this.productId > 0 && this.broker !== null && this.broker.Logo !== null && this.includesOrganization) {
        return '<img class="brokerLogo" src="' + this.broker.Logo + '">';
    }
};

Building.prototype.getDetailUrl = function () {
    return this.detailLinkUrl;
};

Building.prototype.getCardFeatures = function () {
    var feature,
        result,
        hasPrimaryUsageData = this._hasProperty('primaryUsage'),
        hasSaleData = this._hasProperty('saleOrRent'),
        hasMetrageInfo = this._hasProperty('metrageInfo'),
        hasPriceInfo = this._hasProperty('priceInfo'),
        features = [];

    if (hasPrimaryUsageData || hasSaleData) {
        feature = {
            type: 'objectusage',
            content: (hasPrimaryUsageData ? this.primaryUsage : '') + (hasSaleData ? ' | ' + this.saleOrRent : '')
        };
        features.push(feature);
    }

    if (hasMetrageInfo) {
        var metrageInfoText = this.metrageInfo;
        if (metrageInfoText.indexOf('#') > -1) {
            result = metrageInfoText.match(/#(.*?)#/g).map(function (val) {
                return val.replace(/#/g, '');
            });

            $(result).each(function (index, resourceName) {
                metrageInfoText = metrageInfoText.replace('#' + resourceName + '#', window.ventuApi.getResourceValue('Ventu3.LocalResources.Home', resourceName));
            });
        }
        feature = {
            type: 'metrage',
            content: metrageInfoText
        };
        features.push(feature);
    }

    if (hasPriceInfo) {
        var priceInfoText = this.priceInfo;
        if (priceInfoText.indexOf('#') > -1) {
            result = priceInfoText.match(/#(.*?)#/g).map(function (val) {
                return val.replace(/#/g, '');
            });
            $(result).each(function (index, resourceName) {
                priceInfoText = priceInfoText.replace('#' + resourceName + '#', window.ventuApi.getResourceValue('Ventu3.LocalResources.Home', resourceName));
            });
        }
        feature = {
            type: 'price',
            content: priceInfoText
        };
        features.push(feature);
    }

    return this._listToUl(features);
};

Building.prototype.getDetailIcons = function () {
    // TODO: do we still use this on the card?
    var iconResult, icons = [];

    // image is always available
    icons.push({ style: 'image', url: this.detailLinkUrl + '#photos' });

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
    return icons;
};


// helpers

Building.prototype._hasProperty = function (property) {
    return this[property] != null && this[property] != undefined && this[property].length > 0;
};

Building.prototype._listToUl = function (list) {
    var ul, li, item;
    ul = $('<ul></ul>');
    for (var i = 0, l = list.length; i < l; i++) {
        item = list[i];
        li = $('<li>' + item.content + '</li>');
        switch (item.type) {
            case 'objectusage':
                li.addClass('ventu-features-objectusage-' + this.objectUsageId);
                break;
            case 'metrage':
                li.addClass('ventu-features-metrage');
                break;
            case 'price':
                li.addClass('ventu-features-price');
                break;
        }
        ul.append(li);
    }
    return ul;
};