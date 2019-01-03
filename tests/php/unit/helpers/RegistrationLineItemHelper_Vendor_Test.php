<?php

class RegistrationLineItemHelperVendorTest extends PHPUnit_Framework_TestCase 
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
            'badgeLine3' => 'Thank you Third Line'
        );
        $this->eventId = 2;
        $GLOBALS['db_query'] = '1';
        include_once('lib/helpers/registrationLineItemHelper.php');
        $this->helper = new RegistrationLineItemHelper($this->eventId);
    }

    /**
     * Vendors
     */

    public function testAddRegistrationLineItemsVendor() 
    {
        $dto = array (
            'discountDate' => $this->tomorrow,
            'eventId' => 2,
            'userId' => 7,
            'badgeLine1' => 'My Favorite Store',
            'vendor' => 'YES',
            'vendorTables' => 12,
        );
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($dto);
        //Event Pass
        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);
        
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '11');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 7);
        $this->assertEquals($lineItemObj['lineItem'], 'Vendor Pass');
        $this->assertEquals($lineItemObj['amount'], '8.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 7);
        $this->assertEquals(sizeOf($lineItemObj), 13);

        //Event Brick
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 7);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'My Favorite Store');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 7);
        $this->assertEquals(sizeOf($lineItemObj), 13);

        //Tables
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '10');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 7);
        $this->assertEquals($lineItemObj['lineItem'], '1st Vendor Table');
        $this->assertEquals($lineItemObj['amount'], '101.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 7);
        $this->assertEquals(sizeOf($lineItemObj), 13);

        //Additional Tables
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '12');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 7);
        $this->assertEquals($lineItemObj['lineItem'], 'Additional Vendor Tables');
        $this->assertEquals($lineItemObj['amount'], '76.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 11);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 7);
        $this->assertEquals(sizeOf($lineItemObj), 13);
    }

    public function testAddRegistrationLineItemsVendorAssociate() 
    {
        $dto = array (
            'discountDate' => $this->tomorrow,
            'eventId' => 2,
            'userId' => 7,
            'associatePass' => 'YES'
        );
        $GLOBALS['db_query'] = '1';
        $this->helper->addRegistrationLineItems($dto);
        //Event Pass
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '13');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 7);
        $this->assertEquals($lineItemObj['lineItem'], 'Associate Pass');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 7);
        $this->assertEquals(sizeOf($lineItemObj), 13);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 1);
    }

    public function testAddVendorLineItemFormTables() 
    {
        $dto = array (
            'discountDate' => $this->tomorrow,
            'eventId' => 2,
            'userId' => 7,
            'vendor' => 'YES',
            'vendorTables' => 1
        );

        $GLOBALS['db_query'] = '1';
        $this->helper->addVendorLineItemFromTables($dto);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 1);
        //1st Table
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '10');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 7);
        $this->assertEquals($lineItemObj['lineItem'], '1st Vendor Table');
        $this->assertEquals($lineItemObj['amount'], '101.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals($lineItemObj['ownerId'], 7);
        $this->assertEquals(sizeOf($lineItemObj), 13);

        //Registration Paid Update
        $registrationUpdate = $GLOBALS['updateRegistrationPaidByUserIdAndEventId'];
        $this->assertEquals($registrationUpdate['userId'], 7);
        $this->assertEquals($registrationUpdate['eventId'], 2);
    }
}
