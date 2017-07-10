var modal = (function () {
    var message,
        softMessage,
        hide,
        confirm,
        overrule,
        _timer,
        _show,
        _clearUpConfirm;

    message = function(head, body, error, search) {
        var modal = $('#ventu-modal');
        if (error) {
            modal.addClass('error')
        } else {
            modal.removeClass('error');
        }

        if (search) {
            $('#ventu-modal-search').show();
        } else {
            $('#ventu-modal-search').hide();
        }
        _show(head, body);

        $('#ventu-modal-close').bind('click', function(){
            hide();
        });
    };

    softMessage = function(head, body, error) {
        message(head, body, error);
        _timer = setTimeout(function(){
            hide();
        }, 5000)
    };

    _show = function(head, body) {
        $('#ventu-modal-confirm').hide();

        $('#ventu-modal-head').html(head);
        $('#ventu-modal-body').html(body);

        $('#ventu-modal').fadeIn(100);


    };

    confirm = function(head, body, callback, scope) {
        var yesButton = $('#ventu-modal-confirm-yes'),
            noButton = $('#ventu-modal-confirm-no'),
            confirmDiv = $('#ventu-modal-confirm');
        message(head, body, false);
        yesButton.html(translate.translate('yes'));
        noButton.html(translate.translate('no'));
        confirmDiv.show();
        yesButton.click(function() {
            _clearUpConfirm(confirmDiv, yesButton, noButton);
            callback();
            if (scope) {
                scope.$apply();
            }
        });
        noButton.click(function() {
            _clearUpConfirm(confirmDiv, yesButton, noButton);
        });
    };

    _clearUpConfirm = function(confirmDiv, yesButton, noButton) {
        hide();
        confirmDiv.hide();
        yesButton.unbind();
        noButton.unbind();
    };

    hide = function() {
        $('#ventu-modal-body').html('');
        $('#ventu-modal').fadeOut(100);
        $('#ventu-modal-close').unbind();
    };




    return {
        message: message,
        softMessage: softMessage,
        confirm: confirm,
        hide: hide
    }
}());