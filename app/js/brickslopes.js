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
    ngWindow.sessionStorage.removeItem('token');
    ngWindow.sessionStorage.removeItem('firstName');
    ngWindow.sessionStorage.removeItem('lastName');
    ngWindow.sessionStorage.removeItem('admin');
    ngWindow.sessionStorage.removeItem('redirectUrl');
    ngWindow.sessionStorage.removeItem('registered');
    ngWindow.sessionStorage.removeItem('paid');
    ngWindow.sessionStorage.removeItem('userId');
}

function storeSession(ngWindow, data) {
    var callDelete = false;
    (data.token ? ngWindow.sessionStorage.token = data.token : callDelete = true);
    (data.firstName ? ngWindow.sessionStorage.firstName = data.firstName : callDelete = true);
    (data.lastName ? ngWindow.sessionStorage.lastName = data.lastName : callDelete = true);
    (data.admin ? ngWindow.sessionStorage.admin = data.admin : callDelete = true);
    (data.registered ? ngWindow.sessionStorage.registered = data.registered : callDelete = true);
    (data.paid ? ngWindow.sessionStorage.paid = data.paid : callDelete = true);
    (data.userId ? ngWindow.sessionStorage.userId = data.userId : deleteSession(ngWindow));

    if (callDelete) {
        deleteSession(ngWindow);
    }
}

