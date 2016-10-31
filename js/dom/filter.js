function filterListeners() {
    $('.ventu-filter-toggle').click(function(){
        $(this).toggleClass('ventu-filter-toggle-active');
    });
    // todo, collect data from model and inject in inputs
    //setFilter();

    $('.ventu-mini-map-set input[type=radio]').on('change', function(){
        var value = $('.ventu-mini-map-set input[name=search-area]:checked').val();

        $('.ventu-mini-map-set').each(function(){
            if($(this).hasClass('ventu-mini-map-set-' + value)) {
                $(this).addClass('selected');
            } else {
                $(this).removeClass('selected');
            }
        })
    });
}

function openFilter(element) {
    var filter = $(element).parent();
    filter.addClass('filter-active');
    filter.find('.ventu-filter-summary').hide();
    filter.find('.ventu-filter-edit').addClass('hidden');
    filter.find('.ventu-filter-body').show();
}

function saveFilter(element, type) {
    var filter = $(element).parent().parent().parent();
    closeFilter($(element).parent()[0]);
    updateFilterSummary(filter, type);
}

function closeFilter(element) {
    var filter = $(element).parent().parent();
    filter.removeClass('filter-active');
    filter.find('.ventu-filter-summary').show();
    filter.find('.ventu-filter-edit').removeClass('hidden');
    filter.find('.ventu-filter-body').hide();
}

function updateFilterSummary(filter, type) {
    var summary;
    switch (type) {
        case 'area':
            // update model
            ventu.service.filter.area.min = checkFilterInput($('#ventu-filter-area-min').val());
            ventu.service.filter.area.max = checkFilterInput($('#ventu-filter-area-max').val());
            // update html
            summary = styleNumber(ventu.service.filter.area.min) + ' - ' + styleNumber(ventu.service.filter.area.max) + ' m²';
            break;
        case 'offer':
            // update model
            var offer = [];
            filter.find('.ventu-filter-toggle').each(function(){
                if ($(this).hasClass('ventu-filter-toggle-active')) {
                    var value = $(this).data('value');
                    offer.push(value);
                }
            });
            ventu.service.filter.offer = offer;
            // update html
            summary = offer.join(', ');
            
            break;
        case 'searchArea':
            var type = $('.ventu-mini-map-set input[name=search-area]:checked').val(),
                summary;
            ventu.service.filter.searchArea.type = type;
            if (type === 'circle') {
                ventu.service.filter.searchArea.km1 = parseFloat($('#ventu-filter-circle-km').val());
                summary = 'Cirkel (' + ventu.service.filter.searchArea.km1 + 'km)';
            } else if (type === 'rect') {
                ventu.service.filter.searchArea.km1 = parseFloat($('#ventu-filter-rect-km1').val());
                ventu.service.filter.searchArea.km2 = parseFloat($('#ventu-filter-rect-km2').val());
                summary = 'Rechthoek (' + ventu.service.filter.searchArea.km1 + '×' + ventu.service.filter.searchArea.km1 + 'km)';
            } else {
                summary = 'Niet actief';
            }
            break;
    }
    filter.find('.ventu-filter-summary').html(summary);
    ventu.service.filterUpdate();
}

function checkFilterInput(input) {
    // todo check the input
    return input;
}

function styleNumber(input) {
    // todo place dots, more?
    return input;
}

