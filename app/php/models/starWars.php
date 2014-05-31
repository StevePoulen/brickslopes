<?php
  //require_once('../lib/db.php');

  class StarWars extends db {
    function __construct() {
        parent::__construct();
    }

    public function selectAllStarWarsSets($reservedFilter) {
       return $this->query($this->selectQuery(null, $reservedFilter));
    }

    public function selectStarWarsSetById($starWarsSetId) {
       return $this->query($this->selectQuery($starWarsSetId));
    }

    public function getReservedStarWarsSetsCount() {
      return $this->query($this->getStarWarsSetsCountQuery(" reserved != '' "));
    }

    public function getAvailableStarWarsSetsCount() {
      return $this->query($this->getStarWarsSetsCountQuery(" reserved = '' "));
    }

    public function setReservedStarWarsSetByEmail($starWarsSetId, $emailAddress) {
      return $this->query($this->setStarWarsSetsReserveEmailQuery($starWarsSetId, $emailAddress));
    }

    private function setStarWarsSetsReserveEmailQuery($starWarsSetId, $emailAddress) {
      return "
        UPDATE
         starWarsSets
        SET
          reserved = '$emailAddress'
        WHERE
          starWarsSetsId = $starWarsSetId
        ;
      ";
    }

    private function getStarWarsSetsCountQuery($reservedWhereStmt) {
      return "
        SELECT
          count(setId)
        FROM
         starWarsSets
        WHERE
          $reservedWhereStmt
        GROUP BY
          setId
        ;
      ";
    }

    private function selectQuery($starWarsSetId=null, $reservedId=null) {
      $setWhereStmt = "";
      if ($starWarsSetId) {
        $setWhereStmt = " WHERE starWarsSetsId = '$starWarsSetId'";
      }

      $setWhereFilterStmt = "";
      if ($reservedId) {
        $setWhereFilterStmt = " WHERE reserved = '$reservedId'";
      }

      return "
        SELECT
          starWarsSetsId,
          setId,
          description,
          genre,
          year,
          image,
          reserved 
        FROM
         starWarsSets
        $setWhereStmt
        $setWhereFilterStmt
        ORDER BY
          setId
        ;
      ";
    }
  }
?>
