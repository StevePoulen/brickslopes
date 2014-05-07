<?php include_once '../includes/brickSlopesLogo.html'; ?> 
<script type="text/javascript" src="/js/googleAnalytics.js"></script>
<script type="text/javascript" src="/js/mocRegistration.js"></script>
<div id="mocRegistrationCard">
  <div class="sampleFont">Sample</div>
  <div><?php createBrickSlopesLogo("2.0"); ?></div>
  <div id="sampleMocTitle"></div>
  <div id="sampleCreator">creator</div>
  <div id="sampleDisplayName"></div>
  <div id="sampleBrickSlopesLogo"><img src="/images/logo/brickSlopes_noword_50px.png"></div>
</div>
<div id="mocRegistrationCatagoriesCard">
	Prizes will be awared for the following catagories:
	<ul>
		<li>Best in Show</li>
		<li>Public Choice</li>
		<li>Best in Adventure (Castle, Pirates, Anchient Life)</li>
		<li>Best in Scuplture/Mosaic/Art</li>
		<li>Best in City/Train</li>
		<li>Best in Technic/ Bionicle</li>
		<li>Best in Space</li>
		<li>Best Use of parts</li>
		<li>Best Theme Mashup</li>
		<li>Best Super Hero Themes (in any theme)</li>
		<li>Plus more</li>
	</ul>
</div>

<h1><?php createBrickSlopesLogo("1.0"); ?> &#8226; <?php stylizePages("MOC Registration"); ?></h1>

	 

<h3>MOC Registration Form*</h3>
<div>
  <form onsubmit="return validateTheRegistration()" id="registrationForm">
    <input type="hidden" name="subject" value="MOC Registration">
    <input type="hidden" name="isRegistration" value="yes">
    <input type="hidden" name="referPage" value="https://www.brickslopes.com/mocRegistration/registrationReceived.php">
    <label id="firstNameLabel">First Name: (required)</label><br><input id="firstName" type="text" name="firstName" size=50>
    <p>
    <label id="lastNameLabel">Last Name: (required)</label><br><input id="lastName" type="text" name="lastName" size=50>
    <p>
    <label id="emailAddressLabel">E-mail Address: (required)</label><br><input id="emailAddress"  type="text" name="email" size=50>
    <p>
    <label id="mocTitleLabel">MOC Title: (required)</label><br><input id="mocTitle" type="text" name="mocTitle" size=50 maxlength="50">
    <p>
    <label id="displayNameLabel">Creator Display Name: (If Different from &lt;First Name Last Name&gt;)</label><br><input id="displayName" type="text" name="displayName" size=50>
    <p>
    <label>Image of MOC:</label><br><input type="text" name="mocImage" size=50 value="http://">
    <p>
    <label>MOC dimensions in 32x32 base plates:</label><br>
      Width: 
      <select name="baseplateWidth">
        <?php
          for ($i=1; $i<55; $i++) {
            print "<option value='{$i}'>{$i}</option>";
          }
        ?>
      </select>
      3+
      Depth: 
      <select name="baseplateDepth">
        <?php
          for ($i=1; $i<7; $i++) {
            print "<option value='{$i}'>{$i}</option>";
          }
        ?>
      </select>
    <p>
    <label>Comments:</label><br><textarea cols="50" rows="5" name="comments"></textarea>
    <p>
    <input type="submit" value="Register My MOC">
  </form>
</div>
          <div class='registeredMocDiv mediumFont'> 
            <label id='mocsNotRegistered'>
              * You must be registered with a 4-day AFOL event pass to participate. 
            </label>
            <p>
            <div id='mocsRegisterNow' style='display: none;'><input type=submit value='Register Now'></div>
          </div>
