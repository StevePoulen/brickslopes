<?php
  //require_once('../lib/db.php');

  class starWarsModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function selectAllStarWarsSets($data) {
      $reservedId = $data['filter'] != "" ? $data['filter'] : null;
      $page = $data['page'] != "" ? $data['page'] : null;
      return $this->query($this->selectQuery(null, $reservedId, $page));
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

    public function claimStarWarsSet($data) {
      $setId = $data['setId'] != "" ? $data['setId'] : null;
      $userId = $data['userId'] != "" ? $data['userId'] : null;
      $eventId = $data['eventId'] != "" ? $data['eventId'] : null;
      return $this->query($this->claimStarWarsSetQuery($setId, $userId, $eventId));
    }

    public function unclaimStarWarsSet($data) {
      $setId = $data['setId'] != "" ? $data['setId'] : null;
      $userId = $data['userId'] != "" ? $data['userId'] : null;
      $eventId = $data['eventId'] != "" ? $data['eventId'] : null;
      return $this->query($this->unclaimStarWarsSetQuery($setId, $userId, $eventId));
    }

    private function claimStarWarsSetQuery($setId, $userId, $eventId) {
      $claimedQuery = "
        SELECT 
          starWarsUsersConnectorId as id
        FROM
          starWarsUsersConnector
        WHERE
          starWarsSetsId = '$setId' AND
          eventId = '$eventId'
        ;
      ";

      $this->query($claimedQuery);
      if ($this->numRows) {
        $dbObj = $this->result->fetch_object();

        return "
          UPDATE 
            starWarsUsersConnector
          SET
            userId = '$userId' 
          WHERE
            starWarsUsersConnectorId = '$dbObj->id'
          ;
        ";
      } else {
        return "
          INSERT INTO 
            starWarsUsersConnector
            (userId, starWarsSetsId, eventId)
          VALUES 
            ('$userId', '$setId', '$eventId')
          ;
        ";
      }

    }

    private function unclaimStarWarsSetQuery($setId, $userId, $eventId) {
      $claimedQuery = "
        SELECT 
          starWarsUsersConnectorId as id
        FROM
          starWarsUsersConnector
        WHERE
          userId = '$userId' AND
          starWarsSetsId = '$setId' AND
          eventId = '$eventId'
        ;
      ";

      $this->query($claimedQuery);
      if ($this->numRows) {
        $dbObj = $this->result->fetch_object();

        return "
          UPDATE 
            starWarsUsersConnector
          SET
            userId = NULL
          WHERE
            starWarsUsersConnectorId = '$dbObj->id'
          ;
        ";
      }

      return '';
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

    private function selectQuery($starWarsSetId=null, $reservedId=null, $page = null) {
      $setWhereStmt = "";
      if ($starWarsSetId) {
        $setWhereStmt = " WHERE starWarsSetsId = '$starWarsSetId'";
      }

      $setWhereFilterStmt = "";
      if ($reservedId) {
        $setWhereFilterStmt = " WHERE reserved = '$reservedId'";
      }

      $setWhereFilterStmt = "";
      if ($reservedId) {
        $setWhereFilterStmt = " WHERE reserved = '$reservedId'";
      }

      $setWhereLimitStmt= "";
      if ($page != null) {
        $pageSize = 200;
        $start = $page * $pageSize;
        $setWhereLimitStmt = " LIMIT $start, $pageSize ";
      }

      return "
        SELECT
          sws.starWarsSetsId as id,
          sws.setId as setId,
          sws.description as description,
          sws.genre as genre,
          sws.year as year,
          sws.image as image,
          sws.availability as availability,
          sws.packaging as packaging,
          u.userId as userId,
          concat(u.firstName, ' ', SUBSTRING(u.lastName, 1, 1)) as user
        FROM
         starWarsSets sws
            LEFT JOIN starWarsUsersConnector swsuc ON 
              sws.starWarsSetsId = swsuc.starWarsSetsId
                LEFT JOIN users u ON 
                  swsuc.userId = u.userId
        $setWhereStmt
        $setWhereFilterStmt
        ORDER BY
          sws.setId
        $setWhereLimitStmt
        ;
      ";
    }
  }
?>
