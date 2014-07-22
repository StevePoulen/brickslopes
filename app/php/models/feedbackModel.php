<?php

class feedbackModel extends \db {
    function __construct() {
        parent::__construct();
    }

    public function addFeedbackInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    public function getFeedbackInformation() {
        return $this->query($this->selectQuery());
    }

    private function insertQuery($data) {
        $email = (ISSET($data['email']) ? $this->escapeCharacters($data['email']) : 'Unknown');
        return "
            INSERT INTO
                feedback 
            (
                userId, 
                email, 
                feedback,
                posted 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['userId'])}',
                '{$email}',
                '{$this->escapeCharacters($data['feedback'])}',
                NOW()
          )
        ;
      ";
    }

    private function selectQuery() {
        return "
            SELECT 
                feedbackId,
                userId,
                email,
                feedback,
                posted 
            FROM
                feedback 
        ;
      ";
    }
}
?>
