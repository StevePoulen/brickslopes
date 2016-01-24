<?php
    class mailCronProcess {
        public function __construct($isLive=true) {
            $this->service = null; 
            if ($isLive) {
                $this->findQueuedEmails();
            }
        }

        public function sendEmailTest($email) {
            $mailObj = new mail($email);
            $emailProperties = $mailObj->sendEmailTest($email);

            $this->sendEmail($emailProperties['email'], $emailProperties['subject'], $emailProperties['body'], 'test');
        }

        public function sendSiteNewsEmail() {
            $mailObj = new mail(1);
            $mailObj->sendSiteNewsMessage();
        }

        private function findQueuedEmails() {
            $emailHistoryObj = new emailHistory();
            $emailCount = $emailHistoryObj->getEmailHistoryInformation();
            $sentEmailCount = 0;
            $output = "";

            $emailHistoryUpdateObj = new emailHistory();
            if($emailHistoryObj->result) {
                $output .= "Starting emails with {$emailCount} e-mails\n\n";
                while($dbObj = $emailHistoryObj->result->fetch_object()) {
                    $sentEmailCount++;
                    $output .= "Sending an email to '{$dbObj->emailAddress}' with '{$dbObj->subject}' Subject\n";
                    $responseObj = $this->sendEmail($dbObj->emailAddress, $dbObj->subject, $dbObj->body, $dbObj->type);
                    $emailStatus = ($responseObj['status'] ? 'SUCCESS' : $responseObj['errorMessage']);
                    $emailHistoryUpdateObj->updateEmailHistoryInformation (
                        $dbObj->emailHistoryId,
                        $emailStatus
                    );

                    $output .= "\tEmail Status is '{$emailStatus}'\n";
                }

                $output .= "\n\nEmails Finished\n\n";

                if ($sentEmailCount > 0) {
                    echo $output;
                }
            }
        }

        private function expandHomeDirectory($path) {
            $homeDirectory = getenv('HOME');
            if (empty($homeDirectory)) {
                $homeDirectory = getenv("HOMEDRIVE") . getenv("HOMEPATH");
            }
            return str_replace('~', realpath($homeDirectory), $path);
        }

        private function getClient() {
            $credentials_token_path = __DIR__ . '/../../../config/credentials_token.json';
            $scopes = implode(' ', array('https://mail.google.com/'));
            $client = new Google_Client();
            $client->setApplicationName('BrickSlopes Gmail Email Engine');
            $client->setClientId(EMAIL_CLIENT_ID);
            $client->setClientSecret(EMAIL_CLIENT_SECRET);
            $client->setScopes($scopes);
            $client->setRedirectUri('https://www.brickslopes.com');
            $client->setAccessType('offline');
            $client->setApprovalPrompt('force');

            // Load previously authorized credentials from a file.
            $credentialsTokenPath = $this->expandHomeDirectory($credentials_token_path);
            $accessToken = file_get_contents($credentialsTokenPath);
            $client->setAccessToken($accessToken);

            // Refresh the token if it's expired.
            if ($client->isAccessTokenExpired()) {
                $client->refreshToken($client->getRefreshToken());
                file_put_contents($credentialsTokenPath, $client->getAccessToken());
            }

            return $client;
        }

        private function sendMessage($userId, $message) {
            try {
                $message = $this->service->users_messages->send($userId, $message);
                return $message;
            } catch (Exception $e) {
                print 'An error occurred: ' . $e->getMessage();
            }
        }

        private function addEmails($emailAddress, $type) {
            $strToMailName = '';
            $emailString  = "";
            if ($type === 'mail::sendEmailUsMessage') {
                $emails = array('brian@brickslopes.com', 'steve@brickslopes.com', 'cody@brickslopes.com');
            } else {
                $emails = array($emailAddress);
            }

            foreach($emails as $email) {
                $emailString .= $strToMailName . " <" . $email. ">,";
            }

            return rtrim($emailString, ',');
        }

        private function buildMessage($emailAddress, $subject, $body, $type) {
            $boundary = uniqid(rand(), true);

            $subjectCharset = $charset = 'utf-8';
            $strSesFromName = 'Brick Slopes';
            $strSesFromEmail = 'brickslopes@gmail.com';
         
            $strRawMessage = 'To: ' . $this->addEmails($emailAddress, $type) . "\r\n";
            $strRawMessage .= 'From: '. $strSesFromName . " <" . $strSesFromEmail . ">\r\n";
         
            $strRawMessage .= 'Subject: =?' . $subjectCharset . '?B?' . base64_encode($subject) . "?=\r\n";
            $strRawMessage .= 'MIME-Version: 1.0' . "\r\n";
            $strRawMessage .= 'Content-type: Multipart/Alternative; boundary="' . $boundary . '"' . "\r\n";
         
            $strRawMessage .= "\r\n--{$boundary}\r\n";
            $strRawMessage .= 'Content-Type: text/plain; charset=' . $charset . "\r\n";
            $strRawMessage .= 'Content-Transfer-Encoding: 7bit' . "\r\n\r\n";
            $strRawMessage .= $body . "\r\n";
         
            $strRawMessage .= "--{$boundary}\r\n";
            $strRawMessage .= 'Content-Type: text/html; charset=' . $charset . "\r\n";
            $strRawMessage .= 'Content-Transfer-Encoding: quoted-printable' . "\r\n\r\n";
            $strRawMessage .= $body . "\r\n";

            $message_object = new Google_Service_Gmail_Message();
            $encoded_message = rtrim(strtr(base64_encode($strRawMessage), '+/', '-_'), '=');
            $message_object->setRaw($encoded_message);

            return $message_object;
        }

        private function sendEmail($emailAddress, $subject, $body, $type) {
            require __DIR__ . '/../../../vendor/autoload.php';

            if($this->service == null) {
                $this->service = new Google_Service_Gmail($this->getClient());
            }

            ob_start();
            $status = $this->sendMessage('me', $this->buildMessage($emailAddress, $subject, $body, $type));
            $output = ob_get_clean();

            return array (
                'status' => $status,
                'errorMessage' => $output 
            );
        }

        private function getDomain() {
            return "https://www." . WEBSITE;
        }
    }

function loadDependencies() {
    require_once (__DIR__ . '/../../../config/config.php');
    require_once (__DIR__ . '/mail.php');
    require_once (__DIR__ . '/logging.php');
    require_once (__DIR__ . '/db.php');
    require_once (__DIR__ . '/../models/emailHistory.php');
    require_once (__DIR__ . '/../models/events.php');
}

try {
    if (! ISSET($GLOBALS['isTest'])) {
        loadDependencies();
    }
} catch (exception $err) {
    loadDependencies();
}

$sendTestEmail = false;
$sendSiteNewsEmail = false;

if(ISSET($argv[1]) && $argv[1] === '--siteEmail') {
    $sendSiteNewsEmail = true;
};

if ($sendTestEmail) {
    $_SERVER['HTTP_HOST'] = 'mybrickslopes.com';
    include_once(__DIR__ . '/../../../config/config.php');
    $myMail = new mailCronProcess(false);
    //$myMail = new mail('brianpilati@gmail.com');
    //$myMail = new mail('brian.pilati@domo.com');
    $myMail->sendEmailTest('brianpilati@gmail.com');
    //$myMail->sendEmailTest('brianpilati@hotmail.com');
} else if ($sendSiteNewsEmail) {
    $_SERVER['HTTP_HOST'] = 'mybrickslopes.com';
    include_once(__DIR__ . '/../../../config/config.php');
    require_once (__DIR__ . '/../models/users.php');
    require_once (__DIR__ . '/../models/siteEmails.php');
    $myMail = new mailCronProcess(false);
    $myMail->sendSiteNewsEmail();
} else {
    new mailCronProcess();
}
?>
