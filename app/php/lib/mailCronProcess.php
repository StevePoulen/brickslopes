<?php
    class mailCronProcess {
        public function __construct() {
            $this->findQueuedEmails();
        }

        public function sendEmailTest() {
            $mailObj = new mail('brianpilati@hotmail.com');
            $emailProperties = $mailObj->sendEmailTest();

            $this->sendEmail($emailProperties['email'], $emailProperties['subject'], $emailProperties['body'], 'test');

        }

        private function findQueuedEmails() {
            $emailHistoryObj = new emailHistory();
            $emailCount = $emailHistoryObj->getEmailHistoryInformation();

            $emailHistoryUpdateObj = new emailHistory();
            if($emailHistoryObj->result) {
                echo "Starting emails with {$emailCount} e-mails\n\n";
                while($dbObj = $emailHistoryObj->result->fetch_object()) {
                    echo "Sending an email to '{$dbObj->emailAddress}' with '{$dbObj->subject}' Subject\n";
                    $responseObj = $this->sendEmail($dbObj->emailAddress, $dbObj->subject, $dbObj->body, $dbObj->type);
                    $emailStatus = ($responseObj['status'] ? 'SUCCESS' : $responseObj['errorMessage']);
                    $emailHistoryUpdateObj->updateEmailHistoryInformation (
                        $dbObj->emailHistoryId,
                        $emailStatus
                    );

                    echo "\tEmail Status is '{$emailStatus}'\n";
                }

                echo "\n\nEmails Finished\n\n";
            }
        }

        private function sendEmail($emailAddress, $subject, $body, $type) {
            require_once __DIR__ . '/../../../vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
            $mail = new PHPMailer();

            if ($type === 'mail::sendEmailUsMessage') {
                $emails = array('brian@brickslopes.com', 'steve@brickslopes.com', 'cody@brickslopes.com');
            } else {
                $emails = array($emailAddress);
            }

            ob_start();
            $mail->Host = "smtp.gmail.com";
            $mail->IsSMTP();
            $mail->SMTPAuth = true;
            $mail->SMTPDebug = 2;
            $mail->SMTPSecure = "ssl";
            $mail->Username = EMAIL_ACCOUNT;
            $mail->Password = EMAIL_PASSWORD;
            $mail->Port = 465;
            $mail->FromName = 'Cody Ottley';
            $mail->From = "cody@brickslopes.com";
            foreach($emails as $email) {
                $mail->AddAddress($email);
            }
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->isHTML(true); 
            $mail->WordWrap = 50;
            $status = $mail->Send();
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
}

try {
    if (! ISSET($GLOBALS['isTest'])) {
        loadDependencies();
    }
} catch (exception $err) {
    loadDependencies();
}

$sendTestEmail = false;
if ($sendTestEmail) {
    $_SERVER['HTTP_HOST'] = 'mybrickslopes.com';
    include_once(__DIR__ . '/../../../config/config.php');
    $myMail = new mailCronProcess();
    //$myMail = new mail('brianpilati@gmail.com');
    //$myMail = new mail('brian.pilati@domo.com');
    $myMail->sendEmailTest();
} else {
    new mailCronProcess();
}
?>
