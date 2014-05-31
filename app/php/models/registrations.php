<?php
//  require_once(__DIR__ . '/../lib/db.php');

class registrations extends db {
    function __construct() {
        parent::__construct();
    }

    public function addRegistrationInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                registrations 
            (
                eventId, 
                userId,
                badgeLine1,
                badgeLine2,
                meetAndGreet,
                ageVerification,
                comments,
                amountPaid,
                type,
                registrationDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['badgeLine1'])}',
                '{$this->escapeCharacters($data['badgeLine2'])}',
                '{$this->escapeCharacters($data['meetAndGreet'])}',
                '{$this->escapeCharacters($data['ageVerification'])}',
                '{$this->escapeCharacters($data['comments'])}',
                '{$this->escapeCharacters($data['amountPaid'])}',
                '{$this->escapeCharacters($data['type'])}',
                NOW()
          )
        ;
      ";
    }
}
?>
