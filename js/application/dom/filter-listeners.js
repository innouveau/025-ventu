function filterListeners() {

    filterLabelListener();
}

function filterLabelListener() {
    $('#ventu-filter-label').click(function(){
        $(this).parent().toggleClass('ventu-filters--inactive');
    })
}