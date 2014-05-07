
function validateTheRegistration() {
  var returnValue = true;

  var fieldsToValidate = {
    '#firstName' : true,
    '#lastName' : true,
    '#emailAddress' : true,
    '#address' : true,
    '#city' : true,
    '#state' : true,
    '#zipcode' : true
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
    $.post('/cgi/registration.php',
      $('#registrationForm').serialize(),
      function(html) {
        $.get(html, function(data) {
          $('#dashboardText').html(data);
        })
      }   
    );  
  }

  return false;
}
