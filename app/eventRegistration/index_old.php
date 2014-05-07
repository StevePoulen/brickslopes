<?php include_once '../includes/brickSlopesLogo.html'; ?> 

<meta charset="utf-8">
<html>
    <head>
        <link rel="icon" href="favicon.ico" type="image/ico">
        <link rel="shortcut icon" href="favicon.ico" type="image/ico">
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
        <meta http-equiv="X-UA-Compatible" content="IE=9" />

        <title>BrickSlopes &#8226; A LEGO Fan BrickSlopes</title>

<?php
  include_once '../includes/javascript.html';
?>
      <script type="text/javascript" src="/js/registration.js"></script>

    </head>
    <body>
        <div id="brickslopes">
<?php
  include_once '../includes/header.html';
?>
            <div id="dashboard">
              <div id="dashboardText">
                <div id="eventSwag" style="display: show">
                  <h2>Registration Includes ...</h2>
                  <ol>
                    <li>4-Day Pass</li>
                    <li>Keynote Speaker Access</li>
                    <li>MOC Display Space</li>
                    <li><?php createBrickSlopesLogo("1.0"); ?> Name Badge</li>
                    <li>Access to LEGO Fan Games</li>
                    <li>MOC Prizes</li>
                    <li>Swag</li>
                    <li>fun, Fun, FUN!</li>
                  </ol>
                  <h2>Meet & Greet Event Includes ...</h2>
                  <ol>
                    <li>Dinner Thursday May, 1st</li>
                    <li>Door Prizes</li>
                    <li>Swag</li>
                    <li>Access to AFOLs</li>
                  </ol>
                </div>
                <span id="dashboardText">
                    <h1><?php createBrickSlopesLogo("1.0"); ?> &#8226; Event Registration</h1>
                    <?php createBrickSlopesLogo("1.0", "blackFont"); ?> is an LEGO Event for Adult Fan's of LEGO.
                  <h2>Before April 1st, 2014</h2>
                  <span class="blueFont">AFOL 4-Day Event Pass</span> -- <b>$50 USD</b> per person 
                  <p>
                  <span class="redFont">Meet & Greet Event Pass</span> -- <b>$10 USD</b> per person

                  <h2>After April 1st, 2014</h2>
                  <span class="blueFont">AFOL 4-Day Event Pass</span> -- <b>$55 USD</b> per person
                  <p>
                  <span class="redFont">Meet & Greet Event Pass</span> -- <b>$15 USD</b> per person
                  <hr>
                  <h3>AFOL Event Registration Form</h3>
                  <form action="/cgi/mail.php" method="post" onsubmit="return validateTheRegistration()" >
                    <input type="hidden" name="subject" value="BrickSlopes Registration">
                    <input type="hidden" name="isRegistration" value="yes">
                    <input type="hidden" name="referPage" value="https://www.brickslopes.com/eventRegistration/registrationReceived.php">
                    <label id="firstNameLabel">First Name: (required)</label><br><input id="firstName" type="text" name="firstName" size=50>
                    <p>
                    <label id="lastNameLabel">Last Name: (required)</label><br><input id="lastName" type="text" name="lastName" size=50>
                    <p>
                    <label id="emailAddressLabel">E-mail Address: (required)</label><br><input id="emailAddress"  type="text" name="email" size=50>
                    <p>
                    <label id="cityLabel">City: (required)</label><br><input id="city" type="text" name="city" size=50>
                    <p>
                    <label id="stateLabel">State: (required)</label><br><input id="state" type="text" name="state" size=50>
                    <p>
                    <label id="zipcodeLabel">Zipcode: (required)</label><br><input id="zipcode" type="text" name="zipcode" size=50>
                    <p>
                    <label>Flickr Handle:</label><br><input type="text" name="flickr" size=50>
                    <p>
                    <label><?php createBrickSlopesLogo("1.0"); ?> Badge Line 1:</label><br><input type="text" name="badgeLine1" size=50 maxlength=15>
                    <p>
                    <label><?php createBrickSlopesLogo("1.0"); ?> Badge Line 2:</label><br><input type="text" name="badgeLine2" size=50 maxlength=15>
                    <p>
                    <label>Please include the Meet & Greet Event:</label> Yes <input type="radio" name="meetAndGreet" value="yes" checked> No <input type="radio" name="meetAndGreet" value="no">
                    <p>
                    <label>I am over 18 years old*:</label> Yes <input type="radio" name="ageVerification" value="yes" checked> No <input type="radio" name="ageVerification" value="no">
                    <p>
                    <label>Comments:</label><br><textarea cols="50" rows="5" name="comments"></textarea>
                    <p>
                    <input type="submit" value="Continue to Payment">
                    <p>
                    <font size=-1>* Persons under 18 years old must be accompanied by a registered adult.</font>
                  </form>
                </span>
              </div>
<?php
  include_once '../includes/footer.html';
?>
            </div>
        </div>
    </body>
</html>

