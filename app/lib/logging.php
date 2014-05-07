<?php
	class logging {
        function __construct() {
            $this->logging("logging constructor");
            $this->setTimeZone();
        }

        /***********************************
            Reporting Error Handling
        ***********************************/

        protected function sendErrorEmail($DTO) {
            try {
                 $to = "brian.pilati@domo.com";
                 $subject = "Test Results Red Alert -- Error On Reporting";
                 $body = var_export($DTO, true);
                 if (! mail($to, $subject, $body)) {
                    $this->logging("Oops! we need to install php mail", 1);
                    #throw new AssertException(ERROR_EMAIL, CODE_PHP_EMAIL_ERROR);
                 }
            } catch (Exception $e) {
                //Do nothing but don't kill the program
            }
        }

        /***********************************
            Reporting Error Handling
        ***********************************/

        public function setTimeZone($defaultTZ='America/Denver') {
            return date_default_timezone_set($defaultTZ);
        }

        public function audit($string, $logLevel=2) {
            if ($logLevel <= LOGMASK) {
                $this->setTimeZone();
                $date = date(DATE_RFC822);
            
                $pattern = '/\s+/is';
                $replacement = " ";
                $string = preg_replace($pattern ,  $replacement ,  $string);
           
                exec("echo \"$date :: AUDIT :: $string\" >> ". LOGGING_AUDIT);
            }
        }


        public function logData($data, $logLevel=32) {
            if ($logLevel <= LOGMASK) {
                $this->setTimeZone();
                $date = date(DATE_RFC822);
                
                 exec("echo \"$date :: LOGGING :: " . var_export($data, true) . "\" >> ". LOGGING_DEBUG);
            }
        }



		public function logging($string, $logLevel=32) {
			//if (($logLevel & LOGMASK) & LOGMASK) {
			if ($logLevel <= LOGMASK) {
                $this->setTimeZone();
                $date = date(DATE_RFC822);

				exec("echo \"$date :: LOGGING :: $string\" >> ". LOGGING_DEBUG);
			}
		}

		function __destruct() {
            $this->logging("Destruction of Logging Class", 128);
            //Do Nothing
		}
    }

?>
