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
    }

    public function name() { return $this->getData(__FUNCTION__,0); }
    public function city() { return $this->getData(__FUNCTION__,1); }
    public function state() { return $this->getData(__FUNCTION__,2); }
    public function year() { return $this->getData(__FUNCTION__,3); }
    public function cost() { return $this->getData(__FUNCTION__,4); }
    public function discount() { return $this->getData(__FUNCTION__,5); }
    public function meetAndGreetDiscount() { return $this->getData(__FUNCTION__,6); }
    public function meetAndGreetCost() { return $this->getData(__FUNCTION__,7); }
    public function discountDate() { return $this->getData(__FUNCTION__,8); }
}
?>
