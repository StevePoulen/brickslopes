<?php

class emailHistory extends db {
    function __construct() {
        parent::__construct();
    }

    public function getEmailHistoryInformation() {
        return $this->query($this->selectQuery());
    }

    public function addEmailHistoryInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    public function updateEmailHistoryInformation($emailHistoryId, $errorMessage) {
        return $this->query($this->updateQuery($emailHistoryId, $errorMessage));
    }

    private function selectQuery() {
        return "
            SELECT 
                emailHistoryId,
                emailAddress,
                type,
                subject,
                body,
                priority
            FROM
                emailHistory
            WHERE
                sent IS NULL
            ORDER BY
                priority
            LIMIT 20
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                emailHistory    
            (
                creatorId, 
                recipientId, 
                type, 
                priority,
                emailAddress,
                subject,
                body,
                created
            )
        VALUES
          (
                '{$this->escapeCharacters($data['creatorId'])}',
                '{$this->escapeCharacters($data['recipientId'])}',
                '{$this->escapeCharacters($data['type'])}',
                '{$this->escapeCharacters($data['priority'])}',
                '{$this->escapeCharacters($data['emailAddress'])}',
                '{$this->escapeCharacters($data['subject'])}',
                '{$this->escapeCharacters($data['body'])}',
                now()
          )
        ;
      ";
    }

    private function updateQuery($emailHistoryId, $errorMessage) {
        return "
            UPDATE
                emailHistory    
            SET
                errorMessage = '{$this->escapeCharacters($errorMessage)}',
                sent = now()
            WHERE
                emailHistoryId = '{$this->escapeCharacters($emailHistoryId)}'
        ;
      ";
    }
}
?>
