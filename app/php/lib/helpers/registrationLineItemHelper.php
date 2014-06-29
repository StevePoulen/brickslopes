<?php
    class registrationLineItemHelper {
        private $registrationLineItemObj;

        public function __construct() {
            $this->registrationLineItemObj = new registrationLineItemModel();
        }

        public function addRegistrationLineItems($data) {
            $data = $this->determineLineItemAmounts($data);
            $this->addEventLineItem($data);
            $this->addMeetAndGreetLineItem($data);
            $this->addTShirtLineItem($data);
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
                'size' => null
            );
        }

    }

?>
