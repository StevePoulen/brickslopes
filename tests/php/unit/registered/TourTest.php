<?php

class TourTest extends PHPUnit_Framework_TestCase 
{

    public function setUp() 
    {
        $this->userId = 22;
        include_once('controllers/registered/tour.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new Tour($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedPatch() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $_GET['tourOption'] = 'NO';
        $GLOBALS['db_query'] = '1';
        new Tour($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $output = get_ob();
        $this->assertEquals($output, '');
    }
}
