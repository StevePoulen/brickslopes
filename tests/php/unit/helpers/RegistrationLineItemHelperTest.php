<?php

class RegistrationLineItemHelperTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->tomorrow = date('Y-m-d h:i:s', mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));
        $this->yesterday = date('Y-m-d h:i:s', mktime(0, 0, 0, date("m")  , date("d")-1, date("Y")));
        $this->dto = array (
            'discountDate' => $this->tomorrow,
            'eventDiscount' => '65.00',
            'eventCost' => '75.00',
            'meetAndGreetDiscount' => '15.00',
            'meetAndGreetCost' => '20.00',
            'meetAndGreet' => 'YES',
            'tShirtSize' => 'X-LARGE',
            'tShirtDiscount' => '18.00',
            'tShirtCost' => '23.00',
            'userId' => 3,
            'eventId' => 2,
            'nameBadge' => 'YES',
            'badgeLine1' => '2015 BrickSlopes',
            'badgeLine2' => 'Hello World Second Line',
            'badgeLine3' => 'Thank you Third Line'
        );
        new RegistrationLineItemsMock();
        include_once('lib/helpers/registrationLineItemHelper.php');
        $this->helper = new RegistrationLineItemHelper();
    }

    public function testDeleteRegistrationLineItems() 
    {
        $GLOBALS['db_query'] = '1';
        $this->helper->deleteRegistrationLineItems(20123, 256);
        $queryObj = $GLOBALS['deleteRegistrationLineItems'];
        $this->assertEquals($queryObj['userId'], 20123);
        $this->assertEquals($queryObj['eventId'], 256);
    }

    public function testAddRegistrationLineItemsBrickOne() 
    {
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Complete Name Badge');
        $this->assertEquals($lineItemObj['amount'], '10.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], '2015 BrickSlopes');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsBrickTwo() 
    {
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][4];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], '1st Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Hello World Second Line');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsBrickThree() 
    {
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][5];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], '2nd Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Thank you Third Line');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsEventPassWithDiscount() 
    {
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '65.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsMeetAndGreetWithDiscount() 
    {
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Meet and Greet');
        $this->assertEquals($lineItemObj['amount'], '15.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsTShirtWithDiscount() 
    {
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'T-Shirt');
        $this->assertEquals($lineItemObj['amount'], '18.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], 'X-LARGE');
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsEventPassWithoutDiscount() 
    {
        $this->dto['discountDate'] = $this->yesterday;
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '75.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'NO');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsMeetAndGreetWithoutDiscount() 
    {
        $this->dto['discountDate'] = $this->yesterday;
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Meet and Greet');
        $this->assertEquals($lineItemObj['amount'], '20.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'NO');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsTShirtWithoutDiscount() 
    {
        $this->dto['discountDate'] = $this->yesterday;
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'T-Shirt');
        $this->assertEquals($lineItemObj['amount'], '23.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'NO');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], 'X-LARGE');
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 7);
    }

    public function testAddRegistrationLineItemsNoMeetAndGreetAndTShirt() 
    {
        $this->dto['discountDate'] = $this->yesterday;
        $this->dto['meetAndGreet'] = 'NO';
        $this->dto['tShirtSize'] = 'No Thanks';
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '75.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'NO');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 5);
    }

    public function testAddRegistrationLineItemsNoNameBadge() 
    {
        $this->dto['nameBadge'] = 'NO';
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], '2015 BrickSlopes');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 10);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);
    }
}
