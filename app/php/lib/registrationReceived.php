
<?php
  function getPayPalMeetAndGreet() {
    if ($_GET['meetAndGreet'] == 'yes') {
      return '
        <input type="hidden" name="item_name_2" value="Meet & Greet Event Pass">
        <input type="hidden" name="amount_2" value="10.00">
        <input type="hidden" name="shipping_2" value="0.00">
      ';
    } else {
      return "";
    }
  }
  function getEventTotal() {
    return ($_GET['meetAndGreet'] == 'yes' ? "60.00" : "50.00");
  }

  function getMeetAndGreet() {
    return ($_GET['meetAndGreet'] == 'yes' ? getEventItem('Meet & Greet Event Pass', '$10.00') : "");
  }

  function getEventItem($item, $amount) {
    return "
      <div class='payment paymentFontOne'>
        <div id='description'>{$item}</div>
        <div id='amount'>{$amount}</div>
      </div>
      <div class='payment paymentFontTwo'>
        <div id='description'>Item Price: {$amount}</div>
      </div>
      <div class='payment paymentFontTwo'>
        <div id='description'>Quantity: 1</div>
      </div>
    ";
  }

?>

<script type="text/javascript" src="/js/googleAnalytics.js"></script>
<?php include_once '../includes/brickSlopesLogo.html'; ?> 

<h1>BrickSlopes &#8226; <?php stylizePages("Payment"); ?></h1>
We have received your registration! Please complete your registration by paying securely via PayPal.

<div id='paypalForm'>
  <h3>Your order summary</h3>
  <div class="payment paymentBackground paymentFontOne">
    <div id="description">Description</div>
    <div id="amount">Amount</div>
  </div>
  <?php echo getEventItem("BrickSlopes AFOL Event Pass", "$50.00"); ?>
  <?php echo getMeetAndGreet(); ?>
  <div class="payment paymentFontTwo">
    <hr>
  </div>
  <div class="payment paymentFontOne">
    <b>
    <div id="description">Item Total</div>
    <div id="amount">$<?php echo getEventTotal(); ?></div>
    </b>
  </div>
  <div class="payment paymentFontTwo">
    <hr>
  </div>
  <div class="payment paymentFontOne">
    <b>
    <div id="amount">Total $<?php echo getEventTotal();?> USD</div>
    </b>
  </div>
  <div class="payment paymentFontOne">
    <div id="amount">
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
        <input type="hidden" name="cmd" value="_cart">
        <input type="hidden" name="upload" value="1">
        <input type="hidden" name="business" value="events@brickslopes.com">
        <input type="hidden" name="item_name_1" value="BrickSlopes AFOL Event Pass">
        <input type="hidden" name="amount_1" value="50.00">
        <input type="hidden" name="shipping_1" value="0.00">
        <input type="submit" value="Continue to PayPal">
        <?php echo getPayPalMeetAndGreet(); ?>
      </form>
    </div>
  </div>
</div>


