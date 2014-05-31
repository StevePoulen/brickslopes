/*
var $currentPage = "Home";

function getCurrentPageFromPath(path) {
    var pageMap = {
        '/index.php': 'Home',
        '/eventDetails/who.php': 'Who',
        '/eventDetails/index.php': 'What',
        '/eventDetails/': 'What',
        '/eventDetails': 'What',
        '/eventDetails/what.php': 'What',
        '/eventDetails/when.php': 'When',
        '/eventDetails/where.php': 'Where',
        '/eventContacts/index.php': 'CallUs',
        '/eventContacts/': 'CallUs',
        '/eventContacts': 'CallUs',
        '/eventContacts/emailUs.php': 'EmailUs',
        '/eventContacts/callUs.php': 'CallUs'
    }

    return (pageMap.hasOwnProperty(path) ? pageMap[path]: 'Home');
}

function setCurrentPageFromLocation() {
    setCurrentPage(getCurrentPageFromPath(location.pathname));
    if (getCurrentPage() != "Home") {
        displayCurrentPage();
    }
}

function setCurrentPage($page) {
    $currentPage = $page;
}

function displayCurrentPage() {
    $('#splashTextHome').toggle();
    $('#splashText' + getCurrentPage()).toggle();
}

function getCurrentPage() {
    return $currentPage;
}
*/

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
/*

$(document).delegate("#sponsorText", "click", function(event) {
    if (getCurrentPage() != "Sponsor") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextCallUs').toggle();
    }
    setCurrentPage("CallUs");
    return false;
});

$(document).delegate("#whoPage", "click", function(event) {
    if (getCurrentPage() != "Who") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextWho').toggle();
    }
    setCurrentPage("Who");
    return false;
});

$(document).delegate("#whatPage", "click", function(event) {
    if (getCurrentPage() != "What") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextWhat').toggle();
    }
    setCurrentPage("What");
    return false;
});

$(document).delegate("#whenPage", "click", function(event) {
    if (getCurrentPage() != "When") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextWhen').toggle();
    }
    setCurrentPage("When");
    return false;
});

$(document).delegate("#wherePage", "click", function(event) {
    if (getCurrentPage() != "Where") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextWhere').toggle();
    }
    setCurrentPage("Where");
    return false;
});

$(document).delegate("#emailUsPage", "click", function(event) {
    if (getCurrentPage() != "EmailUs") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextEmailUs').toggle();
    }
    setCurrentPage("EmailUs");
    return false;
});

$(document).delegate("#callUsPage", "click", function(event) {
    if (getCurrentPage() != "CallUs") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextCallUs').toggle();
    }
    setCurrentPage("CallUs");
    return false;
});

$(document).delegate("#homePage", "click", function(event) {
    if (getCurrentPage() != "Home") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextHome').toggle();
    }
    setCurrentPage("Home");
    return false;
});

$(document).delegate("#publicTicketsLink", "click", function(event) {
    if (getCurrentPage() != "PublicTickets") {
        $('#splashText' + getCurrentPage()).toggle();
        $('#splashTextPublicTickets').toggle();
    }
    setCurrentPage("PublicTickets");
    return false;
});

function getUriFromId(pageId) {
    var uriMap = {
        'clickRegistration': '/eventRegistration/index.php',
        'clickVendors': '/controllers/getRegisteredVendors.php',
        'clickGuests': '/controllers/getRegisteredAfols.php',
        'clickKeynote': '/eventKeynote/index.php',
        'clickVenue': '/eventVenue/index.php',
        'clickMocRegistration': '/mocRegistration/index.php',
        'clickMocList': '/controllers/getRegisteredMocList.php',
        'clickSchedule': '/eventSchedule/index.php',
        'clickFaq': '/eventFaq/index.php',
        'clickStarWars': '/eventStarWars/index.php',
        'clickHotel': '/eventHotel/index.php'
    };

    return (uriMap.hasOwnProperty(pageId) ? uriMap[pageId]: undefined);
}

$(document).delegate(".eventPane", "click", function(event) {
    var pageUri = getUriFromId($(this).attr('id'));
    if (pageUri) {
        $('#dashboard').toggle();
        $('#eventDashboard').toggle();
        getWebPage(pageUri);
    }
    return false;
});

$(document).delegate(".starWarsAvailableBackground", "click", function(event) {
    var offset = $(this).offset();
    var mainOffset = $('.mainStarWarsContainer').offset();
    var windowOffset = offset.top - mainOffset.top - 175;
    $('#reserveStarWarsSet').css({'top': windowOffset + 'px'});

    $('#reserveStarWarsSet').toggle();
    $.get('/controllers/getStarWarsSetInformation.php',
        {
            'starWarsSetId': $(this).attr('id')
        },
        function(html) {
            $('#reserveStarWarsSet #dashboardText').html(html);
        }
    );
    return false;
});

$(document).delegate("#reserveCloseButton", "click", function(event) {
    $('#reserveStarWarsSet').toggle();
    return false;
});

$(document).delegate("#starWarsSetRegistrationButton", "click", function(event) {
    var inputField = '#emailAddress';

    if ($(inputField).val() == "" || $(inputField).val() == null || $(inputField).val() == undefined) {
        $(inputField + "Label").removeClass("normalFont");
        $(inputField + "Label").addClass("errorFont");
        return false;
    } else {
        $(inputField + "Label").removeClass("errorFont");
        $(inputField + "Label").addClass("normalFont");
    }

    $.post('/controllers/setStarWarsReservedInformation.php',
        {
            'starWarsSetId': $('#starWarsSetId').val(),
            'emailAddress': $(inputField).val()
        },
        function(html) {
            if (html == "false") {
                $('#starWarsRegisterNow').toggle();
                $('#starWarsNotRegistered').attr('class', 'errorFont');
            } else {
                $('#' + $('#starWarsSetId').val()).attr('class', 'starWarsReserved starWarsReservedBackground');
                $('#' + $('#starWarsSetId').val()).html("Reserved");
                $('#reserveStarWarsSet').toggle();
            }
        }
    );
    return false;
});

$(document).delegate("#starWarsRegisterNow", "click", function(event) {
    var pageUri = getUriFromId('clickRegistration');
    if (pageUri) {
        $('#dashboardText').html("");
        getWebPage(pageUri);
    }
    return false;
});

$(document).delegate("#dashboardCloseButton", "click", function(event) {
    $('#eventDashboard').toggle();
    $('#dashboardText').html("");
    $('#dashboard').toggle();
    return false;
});

function getWebPage(page) {
    $.get(page,
        {
        //'domosapienId': dataModel.getDomosapienId(),
        },
        function(html) {
            $('#dashboardText').html(html);
        }
    );
}

*/
