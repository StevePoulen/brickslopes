<?php include_once '../includes/brickSlopesLogo.html'; ?> 
<meta charset="utf-8">
<html>
    <head>
        <link rel="icon" href="favicon.ico" type="image/ico">
        <link rel="shortcut icon" href="favicon.ico" type="image/ico">
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
        <meta http-equiv="X-UA-Compatible" content="IE=9" />

        <title>BrickSlopes - A LEGO Fan Event</title>

<?php include_once '../includes/javascript.html'; ?>

    </head>
    <body>
        <div id="brickslopes">
<?php include_once '../includes/header.html'; ?>
            <div id="splashPageDashboard">
              <div id="splashPage">
                <div id="splashText">
                  <?php createBrickSlopesLogo("1.25"); ?> 
                  <br>
                  A LEGO Fan Event
                  <p>
                  Public Showing
                  <br>
                  May 2nd & 3rd, 2014
                  <p>
                  South Towne Expo
                  <br>
                  Sandy, Utah
                </div>
                <div id="splashTextHome" class="splashTextHome">
                  <?php createBrickSlopesLogo("1.25"); ?> assembles amazing original LEGO creations from adult and teen builders around the United States. 
                  <p>
                  <span class="blueFont bold">Creations from all your favorite themes</span>
                  <span class="eventsFont">
                    <br>&#8226; Lord of the Rings &#8226; Star Wars &#8226;
                    <br>&#8226; Castle &#8226; Pirates &#8226; Harry Potter &#8226;
                    <br>&#8226; Marvel & DC Super Heroes &#8226;
                    <br>&#8226; Space &#8226; Mechs &#8226; Trains &#8226; City &#8226;
                    <br>&#8226; Sculptures &#8226; Mosiacs &#8226;
                    <br>&#8226; Technic &#8226; Bionicle &#8226; Hero Factory &#8226;
                    <br>&#8226; Wizard of Oz &#8226; Jurassic Park &#8226;
                    <br>&#8226; Custom Mini-figs, Accessories & Sets &#8226;
                  </span>
                  <div id="splashFigJackSparrow"><img src="/images/publicPics/JackSparrow150px.png"></div>
                  <div id="splashFigBatman"><img id="batman" src="/images/publicPics/Batman150px.png"></div>
                </div>
                <div id="splashTextCallUs" class="splashTextHome" style="display: none;">
                  <h2>Call Us</h2>
                  <b>Event Questions</b><br>Steve Poulsen - (801) 680-9026
                  <br>
                  steve @ brickslopes.com
                  <p>
                  <b>Vendor or Sponsor Questions</b><br> Cody Ottley - (801) 787-8656
                  <br>
                  cody @ brickslopes.com
                </div>
                <div id="splashTextPublicTickets" class="splashTextHome" style="display: none;">
                  <div>
                  	<img src="/images/BrickSlopesCoupon.png">
                  	<p>Public Tickets availble at the Door
                  	$7 per person, Children 8 and under Free
                  </div>
                  <br>
                  
                </div>
                <div id="splashTextEmailUs" class="splashTextHome" style="display: none;">
                  <h2>E-mail Us</h2>
                  <form action="/cgi/mail.php" method="post">
                    <input type="hidden" name="subject" value="BrickSlopes Question">
                    <input type="hidden" name="referPage" value="https://www.brickslopes.com/eventContacts/contactReceived.php">
                    <label class="smallFont">First Name:</label><br> <input type="text" name="firstName" size=50>
                    <br>
                    <label class="smallFont">Last Name:</label><br> <input type="text" name="lastName" size=50>
                    <br>
                    <label class="smallFont">E-mail Address:</label><br> <input type="text" name="email" size=50>
                    <br>
                    <label class="smallFont">Question or Comment:</label><br> <textarea cols="50" rows="10" name="questionOrComment"></textarea>
                    <p>
                    <input type="submit" value="Contact Us">
                  </form>
                </div>
                <div id="splashTextWho" class="splashTextHome" style="display: none;">
                  <h2>Who</h2>
                  <?php createBrickSlopesLogo("1.0");?> is a LEGO Fan Event for all AFOLs (Adult Fans of LEGO) in the World -- especially those in the Intermountain West and Pacific Coast.
                  <p>
                  There will also be a public showing during the event where all ages will be able to see the LEGO creations and speak with the builders.
                </div>
                <div id="splashTextWhat" class="splashTextHome" style="display: none;">
                  <h2>What</h2>
                  <?php createBrickSlopesLogo("1.0");?> is an annual LEGO Fan Event organized by the SBC Corporation and held in Salt Lake City, Utah. 
                  <div id="sponsorText" class="mediumFont blueFont" style="display: none">
                    <a href="/eventContacts/callUs.php" id="callUsPage">Want to Sponsor?</a>
                  </div>
                </div>
                <div id="splashTextWhen" class="splashTextHome" style="display: none;">
                  <h2>When</h2>
                  <p>
                    <b>Public Showing</b>
                    <br>
                    May 2nd & 3rd, 2014
                    <p>
                    Friday, May 2nd.
                    <br>
                    Hours: 3 pm to 8* pm
                    <p>
                    Saturday, May 3rd.
                    <br>
                    Hours: 9 am to 8* pm
                    <h6>
                    * Ticket sales will end at 7 pm each night</h6>
                </div>
                <div id="splashTextWhere" class="splashTextHome" style="display: none;">
                  <h2>Where</h2>
                  <p>
                  BrickSlopes will be held at the South Towne Exposition Center in beautiful Sandy, Utah (A suburb of Salt Lake City). 
                  <p>
                  9575 S State St  Sandy, UT 84070
                  <p>
                  The South Towne Exposition Center can be easily reached from the Salt Lake City International Airport (SLC) or I-15.
                </div>
                <div id="publicTickets">
                  <div id="publicTicketsText"> 
                    Buy Public Tickets
                    <a href="http://www.eventbrite.com/e/brickslopes-a-lego-fan-event-tickets-11404407891">
                    	<img src="/images/publicPics/Online-Tickets.png">
                    </a>
                    <br>
                   
                    <a href="eventRegistration/public.php" id="publicTicketsLink">
                      <img src="/images/publicPics/Discount-Tickets.png">
                    
                      <!--<img src="/images/publicPics/Discount-Coupon-Button.png">-->
                    </a>
                                        <span class="oneEMFont">
                      <br>
                      &#8226; LEGOLand® without the trip! &#8226;
                    </span>

                  </div>
                </div>
                <div id="splashFigSuperMan"><img id="superman" src="/images/publicPics/Superman150px.png"></div>
              </div>
              <div id="afolRegistration">
                <a href="https://www.brickslopes.com/afolSite/index.php">
                  <span id="afolRegistrationText" class="largeFont blueFont bold">
                    MasterBuilder, AFOL or TFOL? 
                  </span>
                  <div id="afolRegistrationImage">
                    <img src="/images/publicPics/afolRegistrationButton.png" id="miniAFOLRegistrationImage">
                  </div>
                </a>
                  <a href="/afolSite/index.php">
                    <div id="starWarsFlyIn" class="oneEMFont blueFont">
                        <span class="italic">May The Fourth Be With You</span><br>'Build The Empire' Event
                    </div>
                  </a>
                <div id="starWarsPic">
                  <img id="miniStarWars" src="/images/publicPics/Millenium-Falcon150px.png">
                </div>
              </div>
            </div>
<?php include_once '../includes/footer.html'; ?>
        </div>
    </body>
</html>

