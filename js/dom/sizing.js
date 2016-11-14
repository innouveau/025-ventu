function responsiveSizing() {
    if (ventu.config.device.type === 0) {
        sizeSearchBar();
    }
}

function sizeSearchBar() {
    var width = ventu.config.device.width - 130;
    $('.ventu-map-search').css('width', width);
}