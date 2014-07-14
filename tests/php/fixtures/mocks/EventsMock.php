<?php

class EventsMock extends modelObjects {
    protected $className;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/eventsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->name = $this->name();
        $this->city = $this->city();
        $this->state = $this->state();
        $this->year = $this->year();
        $this->cost = $this->cost();
        $this->discount = $this->discount();
        $this->meetAndGreetCost = $this->meetAndGreetCost();
        $this->meetAndGreetDiscount = $this->meetAndGreetDiscount();
        $this->discountDate = $this->discountDate();
        $this->tShirtCost = $this->tShirtCost();
        $this->tShirtDiscount = $this->tShirtDiscount();
    }

    public function name() { return $this->getData(0); }
    public function city() { return $this->getData(1); }
    public function state() { return $this->getData(2); }
    public function year() { return $this->getData(3); }
    public function cost() { return $this->getData(4); }
    public function discount() { return $this->getData(5); }
    public function meetAndGreetDiscount() { return $this->getData(6); }
    public function meetAndGreetCost() { return $this->getData(7); }
    public function discountDate() { return $this->getData(8); }
    public function tShirtCost() { return $this->getData(9); }
    public function tShirtDiscount() { return $this->getData(10); }
}
?>
