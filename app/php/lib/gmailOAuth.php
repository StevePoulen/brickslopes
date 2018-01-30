<?php
require __DIR__ . '/../../../vendor/autoload.php';
include_once(__DIR__ . '/../../../config/config.php');

define('CREDENTIALS_TOKEN_PATH', __DIR__ . '/../../../config/credentials_token.json');
define('SCOPES', implode(' ', array('https://mail.google.com/')));
$user = 'me';

if (php_sapi_name() != 'cli') {
  throw new Exception('This application must be run on the command line.');
}

function getClient() {
    $client = new Google_Client();
    $client->setApplicationName('BrickSlopes Gmail Email Engine');
    $client->setClientId(EMAIL_CLIENT_ID);
    $client->setClientSecret(EMAIL_CLIENT_SECRET);
    $client->setScopes(SCOPES);
    $client->setRedirectUri('https://www.brickslopes.com');
    $client->setAccessType('offline');
    $client->setApprovalPrompt('force');

    // Load previously authorized credentials from a file.
    $credentialsTokenPath = expandHomeDirectory(CREDENTIALS_TOKEN_PATH);
    if (file_exists($credentialsTokenPath)) {
        $accessToken = file_get_contents($credentialsTokenPath);
    } else {
        // Request authorization from the user.
        $authUrl = $client->createAuthUrl();
        printf("Open the following link in your browser:\n%s\n", $authUrl);
        print 'Enter verification code: ';
        $authCode = trim(fgets(STDIN));

        // Exchange authorization code for an access token.
        $accessToken = $client->authenticate($authCode);

        // Store the credentials to disk.
        if(!file_exists(dirname($credentialsTokenPath))) {
             mkdir(dirname($credentialsTokenPath), 0700, true);
        }
        file_put_contents($credentialsTokenPath, $accessToken);
        printf("Credentials saved to %s\n", $credentialsTokenPath);
    }
    $client->setAccessToken($accessToken);

    // Refresh the token if it's expired.
    if ($client->isAccessTokenExpired()) {
        $client->refreshToken($client->getRefreshToken());
        file_put_contents($credentialsTokenPath, $client->getAccessToken());
    }

    return $client;
}

/**
 * Expands the home directory alias '~' to the full path.
 * @param string $path the path to expand.
 * @return string the expanded path.
 */
function expandHomeDirectory($path) {
    $homeDirectory = getenv('HOME');
    if (empty($homeDirectory)) {
        $homeDirectory = getenv("HOMEDRIVE") . getenv("HOMEPATH");
    }
    return str_replace('~', realpath($homeDirectory), $path);
}

function encodeRecipients($recipient){
    $recipientsCharset = 'utf-8';
    if (preg_match("/(.*)<(.*)>/", $recipient, $regs)) {
        $recipient = '=?' . $recipientsCharset . '?B?'.base64_encode($regs[1]).'?= <'.$regs[2].'>';
    }
    return $recipient;
}

function sendMessage($service, $userId, $message) {
    try {
        $message = $service->users_messages->send($userId, $message);
        return $message;
    } catch (Exception $e) {
        print 'An error occurred: ' . $e->getMessage();
    }
}

function addEmails($emailAddress, $type) {
    $strToMailName = '';
    $emailString  = "";
    if ($type === 'mail::sendEmailUsMessage' ||
        $type === 'mail::sendVendorContactMessage'
    ) {
        $emails = array('brian@brickslopes.com', 'steve@brickslopes.com', 'cody@brickslopes.com');
    } else {
        $emails = array($emailAddress);
    }

    foreach($emails as $email) {
        $emailString .= $strToMailName . " <" . $email. ">,";
    }

    return rtrim($emailString, ',');
}

function buildMessage($emailAddress, $subject, $body, $type) {
    $boundary = uniqid(rand(), true);

    $subjectCharset = $charset = 'utf-8';
    $strSesFromName = 'Brick Slopes';
    $strSesFromEmail = 'brickslopes@gmail.com';
 
    $strRawMessage = 'To: ' . addEmails($emailAddress, $type) . "\r\n";
    $strRawMessage .= 'From: '. encodeRecipients($strSesFromName . " <" . $strSesFromEmail . ">") . "\r\n";
 
    $strRawMessage .= 'Subject: =?' . $subjectCharset . '?B?' . base64_encode($subject) . "?=\r\n";
    $strRawMessage .= 'MIME-Version: 1.0' . "\r\n";
    $strRawMessage .= 'Content-type: Multipart/Alternative; boundary="' . $boundary . '"' . "\r\n";
 
//  $strRawMessage .= "\r\n--{$boundary}\r\n";
//    $strRawMessage .= 'Content-Type: '. $mimeType .'; name="'. $fileName .'";' . "\r\n";            
//    $strRawMessage .= 'Content-ID: <' . $strSesFromEmail . '>' . "\r\n";            
//    $strRawMessage .= 'Content-Description: ' . $fileName . ';' . "\r\n";
//    $strRawMessage .= 'Content-Disposition: attachment; filename="' . $fileName . '"; size=' . filesize($filePath). ';' . "\r\n";
//    $strRawMessage .= 'Content-Transfer-Encoding: base64' . "\r\n\r\n";
//    $strRawMessage .= chunk_split(base64_encode(file_get_contents($filePath)), 76, "\n") . "\r\n";
//    $strRawMessage .= '--' . $boundary . "\r\n";
 
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

// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Gmail($client);
$status = sendMessage($service, $user, buildMessage('brianpilati@gmail.com', 'Hello World', 'This is the body', 'test'));
