<?php

class registrationLineItemModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getRegistrationLineItemsByUserId($userId) {
        return $this->query($this->selectQuery($userId));
    }

    public function addRegistrationLineItems($data) {
        return $this->query($this->insertQuery($data));
    }

    public function deleteRegistrationLineItems($userId, $eventId) {
        return $this->query($this->deleteQuery($userId, $eventId));
    }

    public function updateRegistrationLineItemsPaid($data) {
        return $this->query($this->updateQuery($data, 'YES'));
    }

    public function updateRegistrationLineItemsRevoke($data) {
        return $this->query($this->updateQuery($data, 'NO'));
    }

    private function selectQuery($userId) {
        return "
            SELECT 
                registrationLineItemId,
                eventId, 
                userId, 
                ec.code as lineItemCode,
                r.lineItem as lineItem,
                amount,
                paid,
                discount,
                description,
                size,
                quantity,
                active,
                size,
                isOwner,
                entryDate
            FROM
                registrationLineItems r,
                eventLineItemCodes ec
            WHERE
                userId = '{$userId}'
                AND r.eventLineItemCodeId = ec.eventLineItemCodeId
            ORDER BY
                r.amount DESC
        ;
      ";
    }

    private function deleteQuery($userId, $eventId) {
        return "
            DELETE FROM
                registrationLineItems
            WHERE
                userId = '{$userId}'
                AND eventId = '{$eventId}'
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                registrationLineItems 
            (
                eventId, 
                userId, 
                eventLineItemCodeId,
                lineItem,
                amount,
                paid,
                discount,
                description,
                size,
                quantity,
                active,
                isOwner,
                entryDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['eventLineItemCodeId'])}',
                '{$this->escapeCharacters($data['lineItem'])}',
                '{$this->escapeCharacters($data['amount'])}',
                '{$this->escapeCharacters($data['paid'])}',
                '{$this->escapeCharacters($data['discount'])}',
                '{$this->escapeCharacters($data['description'])}',
                '{$this->escapeCharacters($data['size'])}',
                '{$this->escapeCharacters($data['quantity'])}',
                '{$this->escapeCharacters($data['active'])}',
                '{$this->escapeCharacters($data['isOwner'])}',
                NOW()
          )
        ;
      ";
    }

    private function updateQuery($data, $paidStatus) {
        return "
            UPDATE 
                registrationLineItems 
            SET
                paid = '{$paidStatus}'
            WHERE
                registrationLineItemId = '{$this->escapeCharacters($data['registrationLineItemId'])}'
        ;
      ";
    }
}
?>
