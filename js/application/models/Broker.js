function Broker() {
    this.searchBox = null;
    this.resultElement = null;
    this.isBusy = false;
    this.numberOfLetters = 2;
    this.keystrokeTimeout = 350;
    this.service = this._getService();
    this.SelectedList = {};
    this.performSeachHandler = null;
}

Broker.prototype.init = function (busy, letters, timeOut)
{
    this.isBusy = busy;
    this.numberOfLetters = letters;
    this.keyStrokeTimeout = timeOut;
    this.searchBox = $("#input-search-broker")
    this.resultElement = $('#search-broker-result');
}

Broker.prototype.search = function (element) {
    var self = this;
    var searchQuery = element;
    if (searchQuery && searchQuery.length > self.numberOfLetters){
        function searchResultsCallback(results) {
            self.resultElement.html('');

            if (results && results.length > 0) {
                $(results).each(function (e, item) {
                    self.resultElement.append($('<div class="ventu-map-search-result clearfix">' +
                        '<div class="ventu-map-search-result-text"><span data-guid="' + item.GUID + '">' + item.Name + '</span></div></div></div>'));
                    self.resultElement.on('click', '.ventu-map-search-result, .ventu-map-search-result-actions', function (e) {

                        e.preventDefault();
                        e.stopPropagation();

                        var span = $(this).children().first().children().first();

                        if (span != undefined && span != null && span.length > 0) {
                            window.location = "/aanbieder/" + self.getCanonicalString(span.text()) + "/" + span.attr("data-guid");
                        }

                    });

                });
            }
            else {
                self.resultElement.append('<div class="ventu-map-search-result clearfix"><p class="search-broker-noresult">Er zijn geen resultaten gevonden voor: <strong>' + value + '</strong></p></div>');
            }
        }
        this.service.getOrganizationSearchResults(searchQuery, searchResultsCallback);
    }
    
};

Broker.prototype._getService = function () {
    if (window.ventuConfig.environment.development) {
        return new DataFaker();
    } else {
        return new DataService();
    }
};

Broker.prototype.getCanonicalString = function(str) {

    str = str.replace(/[/\\&;:*%,.+?\t\r ]|[\n]{2}/g, "-");
    str = str.replace(new RegExp("---", 'g'), "-");
    str = str.replace(new RegExp("--", 'g'), "-");
    str = str.lastIndexOf("-") == str.length - 1 ? str.substring(0, str.length - 1) : str;
    return str;
}

