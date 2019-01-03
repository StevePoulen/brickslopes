<?php

class RegistrationLineItemHelperStarWarsTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->tomorrow = date('Y-m-d h:i:s', mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));
        $this->yesterday = date('Y-m-d h:i:s', mktime(0, 0, 0, date("m")  , date("d")-1, date("Y")));
        $this->dto = array (
            'discountDate' => $this->tomorrow,
            'meetAndGreet' => 'YES',
            'tShirtSize' => 'X-LARGE',
            'userId' => 3,
            'eventId' => 2,
            'nameBadge' => 'YES',
            'draftOne' => 'NO',
            'draftTwo' => 'NO',
            'badgeLine1' => '2015 BrickSlopes',
            'badgeLine2' => 'Hello World Second Line',
            'badgeLine3' => 'Thank you Third Line',
            'package' => 'STARWARS'
        );
        $this->eventId = 2;
        $GLOBALS['db_query'] = '1';
        include_once('lib/helpers/registrationLineItemHelper.php');
        $this->helper = new RegistrationLineItemHelper($this->eventId);
    }

    public function testAddRegistrationLineItemsEventPassWithDiscount() 
    {
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 14);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Star Wars Limited Pass');
        $this->assertEquals($lineItemObj['amount'], '25.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 3);
        $this->assertEquals(sizeOf($lineItemObj), 13);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 17);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Star Wars Commemorative Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 3);
        $this->assertEquals(sizeOf($lineItemObj), 13);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 8);
    }

    public function testAddRegistrationLineItemsEventPassWithoutDiscount() 
    {
        $this->dto['discountDate'] = $this->yesterday;
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($this->dto);
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 14);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Star Wars Limited Pass');
        $this->assertEquals($lineItemObj['amount'], '35.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'NO');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 3);
        $this->assertEquals(sizeOf($lineItemObj), 13);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 17);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 3);
        $this->assertEquals($lineItemObj['lineItem'], 'Star Wars Commemorative Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'NO');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 3);
        $this->assertEquals(sizeOf($lineItemObj), 13);
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 8);
    }
}
