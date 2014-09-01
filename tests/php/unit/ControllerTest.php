<?php

function buildJWT() {
    return JWT::encode(
        ARRAY (
            "iss" => "https://www.brickslopes.com",
            "aud" => "https://www.myjwt.com",
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "userId" => 13,
            "admin" => 'YES',
            "registered" => 'YES' 
        )
    , JWT_KEY);
}

function apache_request_headers() {
    if ($GLOBALS['authenticationRequest']) {
        return Array(
            'auth_token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsInVzZXJJZCI6MTMsImFkbWluIjoiWUVTIiwicmVnaXN0ZXJlZCI6IllFUyJ9.pTg2RbrtEzb70KBJLMb8hSXkvvDCmvRWEDfwi3SWbKY'
        );
    } else if (array_key_exists('badAuthenticationRequest', $GLOBALS) && $GLOBALS['badAuthenticationRequest']) {
        return Array(
            'auth_token' => '.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsInVzZXJJZCI6MzM0fQ.9Z2PXQwm_ugnSIzNLyV-HQXbNczehYYY6jkaR_ij1dM'
        );
    } else if (array_key_exists('adminRequestNoAuth', $GLOBALS)) {
        return Array(
            'auth_token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsImFkbWluIjoiWUVTIn0.PkUeockWzb5nVBtJecANB9NYNmdyR1Eg6Mjcw9If_1w'
        );
    } else if (array_key_exists('noRegistrationRequest', $GLOBALS)) {
        return Array(
            'auth_token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsInVzZXJJZCI6MTMsImFkbWluIjoiTk8iLCJyZWdpc3RlcmVkIjoiTk8ifQ.c82hoaC4cPd63v8XTXKE1kM3kmsJ3FO0KisU7wyWtdg'
        );
    } else if (array_key_exists('noRegistrationAdminRequest', $GLOBALS)) {
        return Array(
            'auth_token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsInVzZXJJZCI6MTMsImFkbWluIjoiWUVTIiwicmVnaXN0ZXJlZCI6Ik5PIn0.4sdaH7I-3z9ADTG2IWj91an26VkCiWynB7USJpLbAXU'
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
        $_SERVER['REQUEST_URI'] = "/partials/registered/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/{{eventYear}}/');
    }

    public function testNoAuthenticatedSuccessController() 
    {
        $GLOBALS['authenticationRequest'] = false;
        $GLOBALS['db_query'] = false;
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_SERVER['REQUEST_URI'] = "/controllers/public/user.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 400);
        $this->expectOutputString('{"data":"Duplicate E-mail","status":400}');
    }

    public function testNoAuthenticatedResetPasswordSuccessController() 
    {
        $GLOBALS['authenticationRequest'] = false;
        $GLOBALS['db_query'] = false;
        $_SERVER['REQUEST_METHOD'] = 'PUT';
        $_SERVER['REQUEST_URI'] = "/controllers/public/authentication.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputString('');
    }

    public function testNoAuthenticatedDirective() 
    {
        $GLOBALS['authenticationRequest'] = false;
        $_SERVER['REQUEST_URI'] = "/partials/directives/splashPageCTA.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->assertContains('Experience added fun', get_ob());
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

    public function testPublicRequestNoAuthenticationHeader() 
    {
        $GLOBALS['authenticationRequest'] = false;
        $_SERVER['REQUEST_URI'] = "/controllers/public/eventDates.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 405);
        $this->expectOutputString('');
    }

    public function testPublicRequestNoAuthenticationHeaderTwo() 
    {
        $GLOBALS['authenticationRequest'] = false;
        $_SERVER['REQUEST_URI'] = "/controllers/public/feedback.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 405);
        $this->expectOutputString('');
    }

    public function testAuthenticatedRequestNoAuthenticationHeader() 
    {
        $GLOBALS['authenticationRequest'] = false;
        $_SERVER['REQUEST_URI'] = "/partials/afol/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->assertContains("we can't find that page", get_ob());
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
        $_SERVER['REQUEST_URI'] = "/partials/admin/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoAdmin() 
    {
        $GLOBALS['badAuthenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/admin/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAdminNoAuthentication() 
    {
        $GLOBALS['adminRequestNoAuth'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/admin/index.html";
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

    /* Registered */

    public function testAnonymousRegistered() 
    {
        $_SERVER['REQUEST_URI'] = "/partials/registered/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoRegistration() 
    {
        $GLOBALS['noRegistrationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/registered/eventGames.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 412);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoRegistrationControllers() 
    {
        $GLOBALS['noRegistrationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/registered/vendors/vendors.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 412);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoRegistrationAdminControllers() 
    {
        $GLOBALS['noRegistrationAdminRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/registered/vendors/vendors.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 405);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoRegistrationControllersCrazyUrl() 
    {
        $GLOBALS['noRegistrationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/public/emailUs.php?eventId=2";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 405);
        $this->expectOutputString('');
    }

    public function testRegistrationNoAuthentication() 
    {
        $GLOBALS['adminRequestNoAuth'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/registered/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testRegisteredAndAuthentication() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/registered/eventMe.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/mePanes/');
    }

    public function testRegisteredAndAuthenticationControllers() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/registered/registrationLineItems.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 405);
    }

    /* Paid */

    public function testAnonymousPaid() 
    {
        $_SERVER['REQUEST_URI'] = "/partials/paid/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoPaid() 
    {
        $GLOBALS['noRegistrationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/paid/eventGames.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 412);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoPaidControllers() 
    {
        $GLOBALS['noRegistrationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/paid/mocs.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 412);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoPaidAdminControllers() 
    {
        $GLOBALS['noRegistrationAdminRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/paid/mocs.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 405);
        $this->expectOutputString('');
    }

    public function testAuthenticatedNoPaidControllersCrazyUrl() 
    {
        $GLOBALS['noRegistrationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/public/user.php?eventId=2";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputString('');
    }

    public function testPaidNoAuthentication() 
    {
        $GLOBALS['adminRequestNoAuth'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/paid/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testPaidAndAuthentication() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/paid/eventGames.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/Games/');
    }

    public function testPaidAndAuthenticationControllers() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/paid/games.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 405);
    }
}
