<?php

function buildJWT() {
    return JWT::encode(
        ARRAY (
            "iss" => "https://www.brickslopes.com",
            "aud" => "https://www.myjwt.com",
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "admin" => 'YES' 
        )
    , JWT_KEY);
}

function apache_request_headers() {
    if ($GLOBALS['authenticationRequest']) {
        return Array(
            'Authtoken' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsInVzZXJJZCI6MzM0LCJhZG1pbiI6IllFUyJ9.TQK2dHqJr9JCohYxPH1GM89IOOATEn-X8QOKxES9XZw'
        );
    } else if (array_key_exists('badAuthenticationRequest', $GLOBALS) && $GLOBALS['badAuthenticationRequest']) {
        return Array(
            'Authtoken' => '.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsInVzZXJJZCI6MzM0fQ.9Z2PXQwm_ugnSIzNLyV-HQXbNczehYYY6jkaR_ij1dM'
        );
    } else if (array_key_exists('adminRequestNoAuth', $GLOBALS)) {
        return Array(
            'AuthToken' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsImFkbWluIjoiWUVTIn0.PkUeockWzb5nVBtJecANB9NYNmdyR1Eg6Mjcw9If_1w'
        );
    } else {
        return Array();
    }
}

class ControllerTest extends PHPUnit_Framework_TestCase 
{

    public function setUp() 
    {
        //echo buildJWT();
        $GLOBALS['authenticationRequest'] = false;
    }

    public function testAuthenticatedSuccess() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/afol/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/{{eventYear}}/');
    }

    public function testAuthenticatedSuccessController() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/authentication.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputString('');
    }

    public function testAuthenticatedSuccessNotFound() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/afol/notfound.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 404);
        $this->expectOutputString('');
    }

    public function testAuthenticatedRequestNoAuthenticationHeader() 
    {
        $GLOBALS['authenticationRequest'] = false;
        $_SERVER['REQUEST_URI'] = "/partials/afol/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAuthenticatedRequestBadJWT() 
    {
        $GLOBALS['badAuthenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/afol/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAnonymousHomePageSuccess() 
    {
        $_SERVER['REQUEST_URI'] = "/";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/A LEGO Fan Event/');
    }

    public function testAnonymousSuccess() 
    {
        $_SERVER['REQUEST_URI'] = "/partials/public/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/A LEGO Fan Event/');
    }

    public function testAnonymousNotFound() 
    {
        $_SERVER['REQUEST_URI'] = "/partials/public/notfound.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 404);
        $this->expectOutputString('');
    }

    public function testAnonymousAdmin() 
    {
        $_SERVER['REQUEST_URI'] = "/partials/afol/admin/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoAdmin() 
    {
        $GLOBALS['badAuthenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/afol/admin/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAdminNoAuthentication() 
    {
        $GLOBALS['adminRequestNoAuth'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/afol/admin/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAdminAndAuthentication() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/admin/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/eventPane/');
    }

    public function testAdminAndAuthenticationControllers() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/admin/payment.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 405);
    }
}
