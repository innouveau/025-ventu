function filterListeners() {

    initFilter();

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


function initFilter() {
    var type;
    // area
    $('#ventu-filter-area-min').val(ventu.service.filter.area.min);
    $('#ventu-filter-area-max').val(ventu.service.filter.area.max);
    updateFilterSummary($('#ventu-filter-area'), 'area');
    
    // offer
    $('.ventu-filter-offer-toggle').each(function(){
        if (ventu.service.filter.offer.indexOf($(this).data('value')) > -1) {
            $(this).addClass('ventu-filter-toggle-active');
        } else {
            $(this).removeClass('ventu-filter-toggle-active');
        }
    });
    updateFilterSummary($('#ventu-filter-offer'), 'offer');
    
    // search area
    $('.ventu-mini-map-set input[name=search-area]').each(function() {
        if (ventu.service.filter.searchArea.type === $(this).val()) {
            type = $(this).val();
            $(this).prop("checked", true);
            $(this).parent().addClass('selected');
        } else {
            $(this).prop("checked", false);
            $(this).parent().removeClass('selected');
        }
    });
    switch (type) {
        case 'circle':
            $('#ventu-filter-circle-km').val(ventu.service.filter.searchArea.km1);
            break;
        case 'rect':
            $('#ventu-filter-rect-km1').val(ventu.service.filter.searchArea.km1);
            $('#ventu-filter-rect-km2').val(ventu.service.filter.searchArea.km2);
            break;
    }
    updateFilterSummary($('#ventu-filter-search-area'), 'searchArea');
    
}

function openFilter(element) {
    var filter = $(element).parent();
    filter.addClass('filter-active');
    filter.find('.ventu-filter-summary').hide();
    filter.find('.ventu-filter-edit').addClass('hidden');
    filter.find('.ventu-filter-body').show();
    // update user
    ventu.user.didFindOut('filter');
}

function saveAllFilters() {
    updateFilterModel($('#ventu-filter-area'), 'area');
    updateFilterSummary($('#ventu-filter-area'), 'area');
    updateFilterModel($('#ventu-filter-offer'), 'offer');
    updateFilterSummary($('#ventu-filter-offer'), 'offer');
    updateFilterModel($('#ventu-filter-search-area'), 'searchArea');
    updateFilterSummary($('#ventu-filter-search-area'), 'searchArea');
    $('body').removeClass('to-filter');

}

function saveFilter(element, type) {
    var filter = $(element).parent().parent().parent();
    closeFilter($(element).parent()[0]);
    updateFilterModel(filter, type);
    updateFilterSummary(filter, type);
    ventu.service.filterUpdate();
}

function closeFilter(element) {
    var filter = $(element).parent().parent();
    filter.removeClass('filter-active');
    filter.find('.ventu-filter-summary').show();
    filter.find('.ventu-filter-edit').removeClass('hidden');
    filter.find('.ventu-filter-body').hide();
}

function updateFilterModel(filter, type) {
    var summary;
    switch (type) {
        case 'area':
            ventu.service.filter.area.min = checkFilterInput($('#ventu-filter-area-min').val());
            ventu.service.filter.area.max = checkFilterInput($('#ventu-filter-area-max').val());
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
            break;
        case 'searchArea':
            var thisType = $('.ventu-mini-map-set input[name=search-area]:checked').val();
            ventu.service.filter.searchArea.type = thisType;
            if (thisType === 'circle') {
                ventu.service.filter.searchArea.km1 = parseFloat($('#ventu-filter-circle-km').val());
            } else if (thisType === 'rect') {
                ventu.service.filter.searchArea.km1 = parseFloat($('#ventu-filter-rect-km1').val());
                ventu.service.filter.searchArea.km2 = parseFloat($('#ventu-filter-rect-km2').val());
            } else {
            }
            break;
    }
}

function updateFilterSummary(filter, type) {
    var summary;
    switch (type) {
        case 'area':
            summary = styleNumber(ventu.service.filter.area.min) + ' - ' + styleNumber(ventu.service.filter.area.max) + ' m²';
            break;
        case 'offer':
            summary = ventu.service.filter.offer.join(', ');
            break;
        case 'searchArea':
            var thisType = ventu.service.filter.searchArea.type;
            if (thisType === 'circle') {
                summary = 'Cirkel (' + ventu.service.filter.searchArea.km1 + 'km)';
            } else if (thisType === 'rect') {
                summary = 'Rechthoek (' + ventu.service.filter.searchArea.km1 + '×' + ventu.service.filter.searchArea.km2 + 'km)';
            } else {
                summary = 'Niet actief';
            }
            break;
    }
    filter.find('.ventu-filter-summary').html(summary);
}

function checkFilterInput(input) {
    // todo check the input
    return input;
}

function styleNumber(input) {
    // todo place dots, more?
    return input;
}

