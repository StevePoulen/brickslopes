$(document).delegate("#firstName", "change", function(event) {
  $('#displayName').val($(this).val());
  setSampleDisplayName($(this).val());
});

$(document).delegate("#lastName", "change", function(event) {
  $('#displayName').val($('#firstName').val() + " " + $(this).val());
  setSampleDisplayName($('#firstName').val() + " " + $(this).val());
});

$(document).delegate("#mocTitle", "change", function(event) {
  $('#sampleMocTitle').html($(this).val());
});

function setSampleDisplayName(displayName) {
  $('#sampleDisplayName').html(displayName);
}
$(document).delegate("#displayName", "change", function(event) {
  setSampleDisplayName($(this).val());
});

function validateTheRegistration() {
  var returnValue = true;

  var fieldsToValidate = {
    '#firstName' : true,
    '#lastName' : true,
    '#emailAddress' : true,
    '#mocTitle' : true,
    '#displayName' : true
  };

  for (var inputField  in fieldsToValidate) {
    if ($(inputField).val() == "" || $(inputField).val() == null || $(inputField).val() == undefined) {
      returnValue = false;
      $(inputField + "Label").removeClass("normalFont");
      $(inputField + "Label").addClass("errorFont");
    } else {
      $(inputField + "Label").removeClass("errorFont");
      $(inputField + "Label").addClass("normalFont");
    }
  }

  if (returnValue) {
    $.post('/controllers/setAfolMocsInformation.php',
      $('#registrationForm').serialize(),
      function(html) {
        if (html == "false") {
          $('#mocsRegisterNow').toggle();
          $('#mocsNotRegistered').attr('class', 'errorFont');
        } else {
          $('#dashboard').toggle();
          $('#eventDashboard').toggle();
          $('#dashboardText').html("");
        }
      }   
    );  
  }

  return false;
}
