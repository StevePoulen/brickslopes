<?php
    class registrationLineItemHelper {
        private $registrationLineItemObj;

        public function __construct() {
            $this->registrationLineItemObj = new registrationLineItemModel();
        }

        public function deleteRegistrationLineItems($userId, $eventId) {
            $this->registrationLineItemObj->deleteRegistrationLineItems($userId, $eventId);
        }

        public function addRegistrationLineItems($data) {
            $data = $this->determineLineItemAmounts($data);
            $this->addEventLineItem($data);
            $this->addMeetAndGreetLineItem($data);
            $this->addTShirtLineItem($data);
            $this->addBricks($data);
        }

        private function determineLineItemAmounts($data) {
            if ($this->registrarGetsADiscount($data['discountDate'])) {
                $data['eventAmount'] = $data['eventDiscount'];
                $data['meetAndGreetAmount'] = $data['meetAndGreetDiscount'];
                $data['tShirtAmount'] = $data['tShirtDiscount'];
                $data['discount'] = 'YES';
            } else {
                $data['eventAmount'] = $data['eventCost'];
                $data['meetAndGreetAmount'] = $data['meetAndGreetCost'];
                $data['tShirtAmount'] = $data['tShirtCost'];
                $data['discount'] = 'NO';
            }

            return $data;
        }

        private function registrarGetsADiscount($discountDate) {
            return strtotime('now') < strtotime($discountDate);
        }

        private function addBrickLineItem($data, $lineItem, $brickType) {
            $dto = $this->getDTO($data);
            $dto['amount'] = 0;
            $dto['discount'] = 'YES';
            $dto['lineItem'] = $lineItem;
            $dto['description'] = $data[$brickType];
            $this->registrationLineItemObj->addRegistrationLineItems($dto);
        }

        private function addBricks($data) {
            if ($data['nameBadge'] === 'YES') {
                $dto = $this->getDTO($data);
                $dto['amount'] = '10.00';
                $dto['discount'] = 'YES';
                $dto['lineItem'] = 'Complete Name Badge';
                $dto['description'] = $data['badgeLine1'];
                $this->registrationLineItemObj->addRegistrationLineItems($dto);

                $this->addBrickLineItem($data, '1st Badge Brick', 'badgeLine2');
                $this->addBrickLineItem($data, '2nd Badge Brick', 'badgeLine3');
            }
            $this->addBrickLineItem($data, 'Event Badge Brick', 'badgeLine1');
        }

        private function addEventLineItem($data) {
            $dto = $this->getDTO($data);
            $dto['amount'] = $data['eventAmount'];
            $dto['discount'] = $data['discount'];
            $dto['lineItem'] = 'Event Pass';
            $this->registrationLineItemObj->addRegistrationLineItems($dto);
        }

        private function addMeetAndGreetLineItem($data) {
            if ($data['meetAndGreet'] === 'YES') {
                $dto = $this->getDTO($data);
                $dto['amount'] = $data['meetAndGreetAmount'];
                $dto['discount'] = $data['discount'];
                $dto['lineItem'] = 'Meet and Greet';
                $this->registrationLineItemObj->addRegistrationLineItems($dto);
            }
        }

        private function addTShirtLineItem($data) {
            if ($data['tShirtSize'] !== 'No Thanks') {
                $dto = $this->getDTO($data);
                $dto['amount'] = $data['tShirtAmount'];
                $dto['discount'] = $data['discount'];
                $dto['lineItem'] = 'T-Shirt';
                $dto['size'] = $data['tShirtSize'];
                $this->registrationLineItemObj->addRegistrationLineItems($dto);
            }
        }

        private function getDTO($data) {
            return array (
                'eventId' => $data['eventId'], 
                'userId' => $data['userId'], 
                'lineItem' => null,
                'amount' => null,
                'paid' => 'NO',
                'discount' => null,
                'description' => null,
                'size' => null,
                'quantity' => 1,
                'active' => 'YES'
            );
        }

    }

?>
