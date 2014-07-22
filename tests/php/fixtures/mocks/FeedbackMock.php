<?php

class FeedbackModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function addFeedbackInformation($data) {
        return $this->query();
    }

    public function getFeedbackInformation() {
        return $this->query();
    }
}

class FeedbackMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/feedbackDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->feedbackId = $this->feedbackId();
        $this->userId = $this->userId();
        $this->email = $this->email();
        $this->feedback = $this->feedback();
        $this->posted = $this->posted();
    }

    public function feedbackId() { return $this->getData(0); }
    public function userId() { return $this->getData(1); }
    public function email() { return $this->getData(2); }
    public function feedback() { return $this->getData(3); }
    public function posted() { return $this->getData(4); }
}
?>
