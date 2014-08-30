<?php

class VendorMeInformationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 5;
        include_once('controllers/registered/vendors/vendorMeInformation.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        new VendorMeInformation($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new VendorMeInformation($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $allVendors = json_decode(get_ob(), true);

        //Validate the object
        $this->assertEquals(sizeOf($allVendors), 3);

        //Validate the Store
        $output = $allVendors['store'];
        $this->assertEquals($output['storeId'], '1');
        $this->assertEquals($output['name'], "A Boy's Mission");
        $this->assertEquals($output['description'], 'All LEGO Bro');
        $this->assertEquals($output['url'], 'http://www.brickshelf.com/abm');
        $this->assertEquals($output['logo'], 'http://www.mylogo.com');
        $this->assertEquals($output['creationDate'], '2014-08-30 16:29:22');
        $this->assertEquals(sizeOf($output), 6);

        //Validate the Store
        $output = $allVendors['tables'];
        $this->assertEquals($output['tableId'], '56789');
        $this->assertEquals($output['tables'], '12');
        $this->assertEquals(sizeOf($output), 2);

        //Validate the Associates
        $output = $allVendors['associates'];
        $this->assertEquals($output[0]['associateId'], '123');
        $this->assertEquals($output[0]['firstName'], 'Ember');
        $this->assertEquals($output[0]['lastName'], 'Pilati');
        $this->assertEquals(sizeOf($output), 1);
        $this->assertEquals(sizeOf($output[0]), 3);
    }

    public function testAuthenticatedGETStoreNoTablesNoAssociates() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = [true, true, false, false];
        $GLOBALS['db_query'] = 1;
        new VendorMeInformation($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $allVendors = json_decode(get_ob(), true);

        //Validate the object
        $this->assertEquals(sizeOf($allVendors), 3);

        //Validate the Store
        $output = $allVendors['store'];
        $this->assertEquals($output['storeId'], '1');
        $this->assertEquals($output['name'], "A Boy's Mission");
        $this->assertEquals($output['description'], 'All LEGO Bro');
        $this->assertEquals($output['url'], 'http://www.brickshelf.com/abm');
        $this->assertEquals($output['logo'], 'http://www.mylogo.com');
        $this->assertEquals($output['creationDate'], '2014-08-30 16:29:22');
        $this->assertEquals(sizeOf($output), 6);

        //Validate the Store
        $output = $allVendors['tables'];
        $this->assertEquals(sizeOf($output), 0);
    }

    public function testAuthenticatedGETNoStoreData() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = '1';
        new VendorMeInformation($this->userId);
        $this->assertEquals(http_response_code(), 412);
    }
}
