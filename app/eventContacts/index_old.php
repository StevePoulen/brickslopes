
<meta charset="utf-8">
<html>
    <head>
        <link rel="icon" href="favicon.ico" type="image/ico">
        <link rel="shortcut icon" href="favicon.ico" type="image/ico">
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
        <meta http-equiv="X-UA-Compatible" content="IE=9" />

        <title>BrickSlopes &#8226; A LEGO Fan BrickSlopes</title>

<?php include_once '../includes/javascript.html'; ?>

    </head>
    <body>
        <div id="brickslopes">
<?php include_once '../includes/header.html'; ?>
            <div id="dashboard">
              <div id="dashboardText">
                <span id="dashboardText">
                  <a id="callUs"><h1>BrickSlopes &#8226; Call Us</h1></a> 
                    Event Questions - Steve Poulsen - (801) 680-9026
                  <p>
                    Vendor Questions - Cody Ottley - (801) 787-8656
                  <hr>
                  <a id="emailUs"><h1>BrickSlopes &#8226; Email Us</h1></a> 
                  <form action="/mail.php" method="post">
                    <input type="hidden" name="subject" value="BrickSlopes Question">
                    <input type="hidden" name="referPage" value="https://www.brickslopes.com/eventContacts/contactReceived.php">
                    <label>First Name:</label><br><input type="text" name="firstName" size=50>
                    <p>
                    <label>Last Name:</label><br><input type="text" name="lastName" size=50>
                    <p>
                    <label>E-mail Address:</label><br><input type="text" name="email" size=50>
                    <p>
                    <label>Question or Comment:</label><br><textarea cols="50" rows="10" name="questionOrComment"></textarea>
                    <p>
                    <input type="submit" value="Contact Us">
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

