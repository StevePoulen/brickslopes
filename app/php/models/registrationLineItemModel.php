<?php

class registrationLineItemModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getRegistrationLineItemsByUserId($userId, $eventId) {
        return $this->query($this->selectQuery($userId, $eventId));
    }

    public function addRegistrationLineItems($data) {
        return $this->query($this->insertQuery($data));
    }

    public function deleteRegistrationLineItems($userId, $eventId) {
        return $this->query($this->deleteQuery($userId, $eventId));
    }

    public function deleteEventTableLineItems($userId, $eventId) {
        return $this->query($this->deleteEventTableQuery($userId, $eventId));
    }

    public function updateRegistrationLineItemsPaid($data) {
        return $this->query($this->updateQuery($data, 'YES'));
    }

    public function updateRegistrationLineItemsRevoke($data) {
        return $this->query($this->updateQuery($data, 'NO'));
    }

    private function selectQuery($userId, $eventId) {
        return "
            SELECT 
                r.registrationLineItemId,
                r.eventId, 
                r.userId, 
                ec.code as lineItemCode,
                r.lineItem as lineItem,
                r.amount,
                r.paid,
                r.discount,
                r.description,
                r.size,
                r.quantity,
                r.active,
                r.size,
                r.isOwner,
                r.ownerId,
                r.entryDate
            FROM
                registrationLineItems r,
                eventLineItemCodes ec
            WHERE
                r.userId = '{$userId}'
                AND r.eventId = '{$eventId}'
                AND r.eventLineItemCodeId = ec.eventLineItemCodeId
            ORDER BY
                r.amount DESC
        ;
      ";
    }

    private function deleteEventTableQuery($userId, $eventId) {
        return "
            DELETE FROM
                registrationLineItems
            WHERE
                userId = '{$userId}'
                AND eventId = '{$eventId}'
                AND (
                    eventLineItemCodeId = 10 OR
                    eventLineItemCodeId = 12
                )
        ;
      ";
    }

    private function deleteQuery($userId, $eventId) {
        return "
            DELETE FROM
                registrationLineItems
            WHERE
                (
                    userId = '{$this->escapeCharacters($userId)}'
                    OR
                    ownerId = '{$this->escapeCharacters($userId)}'
                )
                AND eventId = '{$this->escapeCharacters($eventId)}'
        ;
      ";
    }

    private function insertQuery($data) {
        $ownerId = (ISSET($data['ownerId']) ? $data['ownerId'] : $data['userId']);
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
                ownerId,
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
                '{$this->escapeCharacters($ownerId)}',
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
