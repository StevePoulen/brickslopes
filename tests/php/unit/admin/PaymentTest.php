<?php

class PaymentTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        new RegistrationLineItemsMock();
        include_once('controllers/admin/payment.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new Payment();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testRevokeNo() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $_POST = array (
            'revoke' => 'no',
            'registrationId' => '22',
            'userId' => '123445'
        );
        $GLOBALS['db_query'] = '1';
        $payment = new Payment();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(),true);
        $this->assertEquals($output['registrationPaid'], false);
        $dbObj = $GLOBALS['updateRegistrationPaid'];
        $this->assertEquals($dbObj['id'], 22);
        $this->assertEquals($dbObj['registrationPaid'], 'NO');
        $this->assertEquals($dbObj['amountPaid'], '65.0');
    }

    public function testRevokeYes() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $_POST = array (
            'revoke' => 'yes',
            'registrationId' => '22',
            'userId' => '123445',
        );
        $GLOBALS['db_query'] = '1';
        $payment = new Payment();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(),true);
        $this->assertEquals($output['registrationPaid'], false);
        $dbObj = $GLOBALS['updateRegistrationPaid'];
        $this->assertEquals($dbObj['id'], 22);
        $this->assertEquals($dbObj['registrationPaid'], 'NO');
        $this->assertEquals($dbObj['amountPaid'], '65.0');
    }

    public function testNoResponse() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $_POST = array (
            'revoke' => 'yes',
            'registrationId' => '22',
            'userId' => '123445',
        );
        $GLOBALS['db_query'] = 0;
        $payment = new Payment();
        $this->assertEquals(http_response_code(), 412);
    }
}
