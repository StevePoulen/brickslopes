<?php

class EventRegistrationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = null;
        include_once('controllers/registered/eventRegistration.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "patch";
        new EventRegistration();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGet() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = 12345;
        $this->userId = 2;
        new EventRegistration($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true)['1'];
        $lineItems = $output['lineItems']['lineItems'][0];
        $this->assertEquals($output['ageVerification'] , 'YES');
        $this->assertEquals($output['paid'] , 'NO');
        $this->assertEquals($output['name'] , 'BrickSlopes - SLC');
        $this->assertEquals($output['registrationId'] , '1');
        $this->assertEquals($output['comments'] , 'This is a comment');
        $this->assertEquals($lineItems['registrationLineItemId'] , 2);
        $this->assertEquals($lineItems['lineItem'] , 'T-Shirt');
        $this->assertEquals($lineItems['amount'] , '15.75');
        $this->assertEquals($lineItems['total'] , '31.50');
        $this->assertEquals($lineItems['paid'] , 'NO');
        $this->assertEquals($lineItems['discount'] , 'YES');
        $this->assertEquals($lineItems['description'] , '');
        $this->assertEquals($lineItems['size'] , 'X-Large');
        $this->assertEquals($lineItems['quantity'] , '2');
        $this->assertEquals($lineItems['active'] , 'YES');
        $this->assertEquals($lineItems['isOwner'] , 'NO');
        $this->assertEquals($lineItems['entryDate'] , '2014-06-29 08:46:00');
    }

    public function testAuthenticatedGetNoRegistration() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 12345;
        new EventRegistration();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true);
        $this->assertEquals(sizeof($output) , 0);
    }

    public function testAuthenticatedPost() 
    {
        $_POST = array (
            'eventId' => '2',
            'discountDate' => '2015-05-16 08:00:00',
            'eventDiscount' => '60.00',
            'meetAndGreetDiscount' => '10.00',
            'meetAndGreet' => 'YES',
            'nameBadge' => 'NO',
            'draftOne' => 'NO',
            'draftTwo' => 'NO',
            'badgeLine1' => '2015 BrickSlopes',
            'tShirtDiscount' => '15.00',
            'tShirtSize' => 'X-Large'
        );
        $this->userId = 12345;
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = 12345;
        $eventRegistration = new EventRegistration($this->userId);
        $this->assertEquals(http_response_code(), 201);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 12345);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '60.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '3');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 12345);
        $this->assertEquals($lineItemObj['lineItem'], 'Meet and Greet');
        $this->assertEquals($lineItemObj['amount'], '10.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '2');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 12345);
        $this->assertEquals($lineItemObj['lineItem'], 'T-Shirt');
        $this->assertEquals($lineItemObj['amount'], '15.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], 'X-Large');
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 12345);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], '2015 BrickSlopes');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);

        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes Registration');
        $this->assertContains('confirms you are registered for BrickSlopes 2015', $emailOutput['body']);
        $this->assertEquals(sizeOf($emailOutput), 7);
        $this->expectOutputString('');
    }

    public function testAuthenticatedPatch() 
    {
        $_POST = array (
            'registrationId' => '27',
            'eventId' => '2',
            'discountDate' => '2015-05-16 08:00:00',
            'eventDiscount' => '60.00',
            'meetAndGreetDiscount' => '10.00',
            'meetAndGreet' => 'YES',
            'nameBadge' => 'NO',
            'draftOne' => 'NO',
            'draftTwo' => 'NO',
            'badgeLine1' => '2015 BrickSlopes',
            'tShirtDiscount' => '15.00',
            'tShirtSize' => 'X-Large'
        );
        $this->userId = 12345;
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $GLOBALS['db_query'] = 12345;
        $eventRegistration = new EventRegistration($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $queryObj = $GLOBALS['deleteRegistrationLineItems'];
        $this->assertEquals($queryObj['userId'], 12345);
        $this->assertEquals($queryObj['eventId'], 2);
        $queryObj = $GLOBALS['deleteGameUserInformation'];
        //Draft One
        $this->assertEquals($queryObj[0]['gameId'], 3);
        $this->assertEquals($queryObj[0]['userId'], 12345);
        $this->assertEquals($queryObj[0]['eventId'], 2);

        //Draft Two 
        $this->assertEquals($queryObj[1]['gameId'], 4);
        $this->assertEquals($queryObj[1]['userId'], 12345);
        $this->assertEquals($queryObj[1]['eventId'], 2);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 12345);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '60.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '3');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 12345);
        $this->assertEquals($lineItemObj['lineItem'], 'Meet and Greet');
        $this->assertEquals($lineItemObj['amount'], '10.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '2');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 12345);
        $this->assertEquals($lineItemObj['lineItem'], 'T-Shirt');
        $this->assertEquals($lineItemObj['amount'], '15.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], 'X-Large');
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 12345);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], '2015 BrickSlopes');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);

        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes Registration');
        $this->assertContains('confirms you are registered for BrickSlopes 2015', $emailOutput['body']);
        $this->assertEquals(sizeOf($emailOutput), 7);
        $this->expectOutputString('');
    }

    public function testAuthenticatedPostFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = NULL;
        $eventRegistration = new EventRegistration();
        $this->assertEquals(http_response_code(), 400);
    }
}
