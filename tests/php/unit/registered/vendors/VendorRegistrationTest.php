<?php

class VendorRegistrationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 5;
        include_once('controllers/registered/vendors/vendorRegistration.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "DELETE";
        new VendorRegistration($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new VendorRegistration($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $allVendors = json_decode(get_ob(), true);
        $output = $allVendors;
        $this->assertEquals($output['storeId'], '1');
        $this->assertEquals($output['name'], "A Boy's Mission");
        $this->assertEquals($output['description'], 'All LEGO Bro');
        $this->assertEquals($output['url'], 'http://www.brickshelf.com/abm');
        $this->assertEquals($output['logo'], 'http://www.mylogo.com');
        $this->assertEquals($output['tables'], '12');
        $this->assertEquals(sizeOf($allVendors), 6);
    }

    public function testAuthenticatedGETNoData() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = '1';
        new VendorRegistration($this->userId);
        $this->assertEquals(http_response_code(), 412);
    }

    public function testAuthenticatedPOST() 
    {
        $_POST = array(
            'eventId' => 2,
            'name' => "A Boy's Mission",
            'tables' => 12 
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = '1456';
        new VendorRegistration($this->userId);
        $output = json_decode(get_ob(), true);
        $this->assertEquals(http_response_code(), 201);
        $this->assertEquals($output['storeId'], '1456');
    }

    public function testAuthenticatedPATCH() 
    {
        $_POST = array(
            'storeId' => 2,
            'name' => "A Boy's Mission",
            'tables' => 12 
        );
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $GLOBALS['db_query'] = '1456';
        new VendorRegistration($this->userId);
        $output = get_ob();
        $this->assertEquals(http_response_code(), 200);
        $this->assertEquals($output, 200);
    }
}
