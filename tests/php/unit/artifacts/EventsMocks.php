<?php

class EventsMock extends modelObjects {
    protected $className;

    public function __construct() {
        $this->className = 'users';
        $this->userId = $this->userId();
        $this->firstName = $this->firstName();
        $this->lastName = $this->lastName();
    }

    public function getDTO() {
        return array (
            'eventName' => 'BrickSlopes 2015',
            'eventCity' => 'Salt Lake City',
            'eventState' => 'Utah',
            'eventYear' => '2015',
            'eventCost' => '65.00',
            'eventDiscount' => '60.00',
            'eventMeetAndGreetCost' => '10.00',
            'eventDiscountDate' => '2014-06-05 23:59:59'
        );
    }

    public function userId() { return $this->getData(__FUNCTION__); }
    public function firstName() { return $this->getData(__FUNCTION__); }
    public function lastName() { return $this->getData(__FUNCTION__); }
}
?>
