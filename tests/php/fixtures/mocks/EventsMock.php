<?php

class EventsMock extends modelObjects {
    protected $className;

    public function __construct() {
        $this->className = 'events';
        $this->name = $this->name();
        $this->city = $this->city();
        $this->state = $this->state();
        $this->year = $this->year();
        $this->cost = $this->cost();
        $this->discount = $this->discount();
        $this->meetAndGreetCost = $this->meetAndGreetCost();
        $this->discountDate = $this->discountDate();
    }

    public function getDTO() {
        return array (
            'name' => 'BrickSlopes 2015',
            'city' => 'Salt Lake City',
            'state' => 'Utah',
            'year' => '2015',
            'cost' => '65.00',
            'discount' => '60.00',
            'meetAndGreetCost' => '10.00',
            'discountDate' => '2014-06-05 23:59:59'
        );
    }

    public function name() { return $this->getData(__FUNCTION__); }
    public function city() { return $this->getData(__FUNCTION__); }
    public function state() { return $this->getData(__FUNCTION__); }
    public function year() { return $this->getData(__FUNCTION__); }
    public function cost() { return $this->getData(__FUNCTION__); }
    public function discount() { return $this->getData(__FUNCTION__); }
    public function meetAndGreetCost() { return $this->getData(__FUNCTION__); }
    public function discountDate() { return $this->getData(__FUNCTION__); }
}
?>
