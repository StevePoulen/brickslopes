<?php
    include_once join('/', array(__DIR__, 'AutoLoader.php'));
    include_once join('/', array(__DIR__, '/', '..', '..', 'config', 'config.php'));

    header( 'Expires: Mon, 26 Jul 1997 05:00:00 GMT' );
    header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' );
    header( 'Cache-Control: no-cache, must-revalidate' );
    header( 'Pragma: no-cache' ); 

    class Controller {
        private $userId;
        private $isAdmin;
        private $isRegistered;
        private $error;

        public function __construct() {
            $this->userId = null;
            $this->isAdmin = false;
            $this->isRegistered = false;
            $this->error = 403;
            $this->setControllerModuleValues();
            $this->setHeader();
        }

        private function getError() {
            $error = array (
                '403' => '403 Forbidden',
                '412' => '412 Precondition Failed'
            );

            return $error[$this->error];
        }

        private function addControllerRouting() {
            if (! preg_match('/^controllers/i', $this->URI)) {
                $this->URI = "../{$this->URI}";
            }
        }

        private function removeParams() {
            $payloadPosition = strpos($this->URI, '?');
            if ($payloadPosition) {
                $this->URI = substr($this->URI, 0, $payloadPosition);
            }
        }

        private function isHomePage() {
            if ($this->URI == "") $this->URI = 'index.html'; 
        }

        private function setControllerModuleValues() {
            $this->URI = substr($_SERVER['REQUEST_URI'], 1);
            $this->removeParams();
            $this->isHomePage();
            $this->addControllerRouting();
        }

        private function setHeader() {
            header('Content-type: text/html');
        }

        private function isPost() {
            return (ISSET($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] === 'POST' : false);
        }

        private function isWhiteList() {
            if ($this->URI == '../index.html' ||
                $this->URI == 'controllers/emailUs.php' ||
                preg_match('/^..\/partials\/public/', $this->URI)
            ) {
                return true;
            } else if (
                preg_match('/controllers\/public\/.*/', $this->URI) ||
                (
                    $this->URI == 'controllers/user.php' &&
                    $this->isPost()
                )
            ) {
                $this->decodeJWT();
                return true;
            } else {
                return false;
            }
        }

        private function isAuthenticated() {
            if ($this->isWhiteList()) {
                return true;
            } else {
                return $this->decodeJWT();
            }
        }

        private function isAdminRequest() {
            return (
                preg_match('/^controllers\/admin\/.*/', $this->URI) ||
                preg_match('/^..\/partials\/admin\/.*/', $this->URI)
            );
        }

        private function isRegisteredRequest() {
            return (
                preg_match('/^controllers\/registered\/.*/', $this->URI) ||
                preg_match('/^..\/partials\/registered\/.*/', $this->URI)
            );
        }

        private function determineAdminFromJWT($decodedJWT) {
            return ($decodedJWT->admin == 'YES') ;
        }

        private function determineRegisteredFromJWT($decodedJWT) {
            return ($decodedJWT->registered == 'YES') ;
        }

        private function decodeJWT() {
            try {
                $headers = apache_request_headers();
                $jwt = $headers['Authtoken'];
                $decodedJWT = JWT::decode($jwt, JWT_KEY);
                if (preg_match('/\d+/', $decodedJWT->userId)) {
                    $this->userId = $decodedJWT->userId;
                    $this->isAdmin = $this->determineAdminFromJWT($decodedJWT);
                    $this->isRegistered = $this->determineRegisteredFromJWT($decodedJWT);
                    if ($this->isAdminRequest()) {
                        return $this->isAdmin;
                    }

                    if ($this->isRegisteredRequest()) {
                        if ($this->isAdmin) {
                            return true;
                        } else {
                            $this->error = 412;
                            return $this->isRegistered;
                        }
                    }

                    return true;
                } else {
                    return false;
                }
            } catch (Exception $e) {
                return false;
            }
        }

        public function invoke() {
            if ($this->isAuthenticated()) {
                if (file_exists($this->URI)) {
                    header("HTTP/1.0 200 Success");
                    include_once($this->URI);
                } else {
                    header("HTTP/1.0 404 Not Found");
                }
            } else {
                header("HTTP/1.0 {$this->getError()}");
            }
        }
    }

    $controller = new Controller();
    $controller->invoke();
?>
