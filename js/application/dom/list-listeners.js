function listListeners() {

    $('#ventu-bottom-bar-love').on('click', function (e) {
        e.preventDefault();

        location.href = '/interesselijst';
    });

    $('#ventu-bottom-bar-hate').on('click', function (e) {
        e.preventDefault();

        location.href = '/prullenbak';
    });

}