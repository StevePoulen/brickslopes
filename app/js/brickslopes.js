$(document).delegate(".eventPane, .myEventPane", "mouseenter", function(event) {
    event.stopPropagation();
    $(this).children('.eventText').toggle();
    $(this).children('.myEventText').toggle();
    $(this).children('.eventBrickSlopesLogo').toggle();
    $(this).children('.eventImageText').toggle();
});

$(document).delegate(".eventPane, .myEventPane", "mouseleave", function(event) {
    event.stopPropagation();
    $(this).children('.eventImageText').toggle();
    $(this).children('.eventText').toggle();
    $(this).children('.myEventText').toggle();
    $(this).children('.eventBrickSlopesLogo').toggle();
});

$(document).delegate('#comments', 'focus', function() {
    var comments = $(this).val();
    if (comments === 'Comments ...') {
        $('#comments').removeClass('greyFont');
        $(this).val('');
    }
});

$(document).delegate('#comments', 'blur', function() {
    var comments = $(this).val();
    if (comments === '') {
        $('#comments').addClass('greyFont');
        $(this).val('Comments ...');
    }
});

function deleteSession(ngWindow) {
    delete ngWindow.sessionStorage.token;
    delete ngWindow.sessionStorage.firstName;
    delete ngWindow.sessionStorage.lastName;
    delete ngWindow.sessionStorage.admin;
    delete ngWindow.sessionStorage.redirectUrl;
    delete ngWindow.sessionStorage.registered;
}

function storeSession(ngWindow, data) {
    ngWindow.sessionStorage.token = data.token;
    ngWindow.sessionStorage.firstName = data.firstName;
    ngWindow.sessionStorage.lastName = data.lastName;
    ngWindow.sessionStorage.admin = data.admin;
    ngWindow.sessionStorage.registered = data.registered;
}

