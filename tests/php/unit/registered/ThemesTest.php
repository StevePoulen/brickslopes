<?php

class ThemesTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $_GET['eventId'] = 2;
        include_once('controllers/registered/themes.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new Themes();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new Themes();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true);
        $themeObj = $output[0];
        $this->assertEquals($themeObj['eventId'] , 2);
        $this->assertEquals($themeObj['themeId'] , 1);
        $this->assertEquals($themeObj['theme'], 'Castle');
        $this->assertEquals($themeObj['type'], 'AFOL');
        $this->assertEquals($themeObj['selectable'], 'YES');
        $this->assertEquals($themeObj['awards'][0]['award'], "First Place");
        $this->assertEquals($themeObj['awards'][0]['place'], "1");
        $this->assertEquals($themeObj['awards'][1]['award'], "Second Place");
        $this->assertEquals($themeObj['awards'][1]['place'], "2");
    }

    public function testAuthenticatedGetFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 0;
        new Themes();
        $this->assertEquals(http_response_code(), 400);
    }
}
