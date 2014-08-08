<?php

class VendorTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 5;
        include_once('controllers/registered/vendors.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "DELETE";
        new Vendors($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new Vendors($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $allVendors = json_decode(get_ob(), true);
        $output = $allVendors[0];
        $this->assertEquals($output['vendorId'], '1');
        $this->assertEquals($output['name'], "A Boy's Mission");
        $this->assertEquals($output['description'], 'All LEGO Bro');
        $this->assertEquals($output['url'], 'http://www.brickshelf.com/abm');
        $this->assertEquals($output['logo'], 'http://www.mylogo.com');
        $this->assertEquals($output['tables'], '12');
        $this->assertEquals(sizeOf($allVendors), 1);

    }

    public function testAuthenticatedPOST() 
    {
        $_POST = array(
            'eventId' => 2,
            'name' => "A Boy's Mission",
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = '1456';
        new Vendors($this->userId);
        $output = json_decode(get_ob(), true);
        $this->assertEquals(http_response_code(), 201);
        $this->assertEquals($output['vendorId'], '1456');
    }
}
