<?php

class db extends \logging 
{
    protected $mysqli;
    public $result, $numRows;

	function __construct() {
        parent::__construct();

        $this->logging("db constructor");
		    $this->connect();
		}

		protected function connect() {
            $this->logging(__method__, 128);
			$this->logging("DBHOST IS : " . DB_HOST, 4); 
			$this->logging("DBUSER IS : " . DB_USER, 4);
			$this->logging("DBPASSWD IS : " . DB_PASSWD, 4);
			$this->logging("DB IS : " . DB_NAME, 4);

            try {
                $this->mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWD, DB_NAME);

                if ($this->mysqli->connect_error) {
                    $error = 'Database Connect Error (' . $this->mysqli->connect_errno . ') ' . $this->mysqli->connect_error;
                    #throw new AssertException($error, $this->mysqli->connect_errno);
                }

		        $this->logging("MYSQLI VERSION: " . mysqli_get_server_version($this->mysqli));
            } catch (Exception $e) {
                $this->mysqli = null;
                $this->sendErrorEmail($e->getMessage(), true);
            }
		}

    public function escapeCharacters($characters) {
      return $this->mysqli->real_escape_string($characters);
    }

		public function query($query) {
      $this->logging(__method__, 128);
      $this->logging("The Query is:: " . $query, 2);
      $this->audit($query, 8);

      //Execute the query
      try {
          $this->result = $this->mysqli->query($query);

          if ($this->result) {
              $patternSelect = '/^((\s+)?(select))/i';
              $patternCall = '/^((\s+)?(call))/i';
              $patternInsert = '/^((\s+)?(insert))/i';
              $patternReplace = '/^((\s+)?(replace))/i';
              if (preg_match($patternSelect, $query)) {
                  //Select & Call Queries
                  $this->numRows = (isset($this->result->num_rows) ? $this->result->num_rows : 0);
                  return $this->numRows;
              } else if (preg_match($patternCall, $query)) {
                  //Select & Call Queries
                  $this->numRows = (isset($this->mysqli->affected_rows) ? $this->mysqli->affected_rows: 1);
                  return $this->numRows;
              } else if (preg_match($patternInsert, $query)) {
                  //Insert Queries
                  $this->numRows = 0;
                  return $this->mysqli->insert_id;
              } else if (preg_match($patternReplace, $query)) {
                  //Replace Queries
                  $this->numRows = 0;
                  return $this->mysqli->insert_id;
              } else {
                  //Update Queries
                  $this->numRows = $this->mysqli->affected_rows;
                  if ($this->mysqli->error == "" && $this->numRows == 0) {
                      $this->numRows = 0;
                  }
                  return $this->numRows;
              }
          } else {
              $this->numRows = -1;
              //return DB_ERROR;	
              if ($this->mysqli->error == "") {
                  #throw new AssertException(DB_ERROR, CODE_DB);
              } else {
                  $this->audit("error SQL: $query", 1);
                  $this->audit("error: " . $this->mysqli->error, 1);
                  #throw new AssertException($this->mysqli->error, CODE_DB);
              }
              return $this->mysqli->error;
          }
      } catch (Exception $e) {
          //Send me an error if there is a problem
          $msg = "There was an exception with this query: $query Error: " . $e->getMessage();
          $this->audit($msg, 1);
          return $msg;
      }
		}

        public function call($query, $isMultiple) {
            $this->logging(__method__, 128);
            //Make a procedure call
			$return = $data = array();

            $this->query($query);
            if (is_object($this->result)) {
                while ($row = mysqli_fetch_assoc($this->result)) {
                    if($isMultiple) {
                        array_push($data, $row);
                    } else {
                        $data = $row;
                    }
                }
            } else {
                //Send me an error if there is a problem
               $msg = "The Call Returned No Rows: $query";
               $this->audit($msg, 1);
            }
            //$return = $data;
            if (count($data) ) {
                $return = $data;
            } else {
                //Since I know I am going to throw an error, I need to call freeResult here
                $this->freeResult();
                if ($this->mysqli->error == "") {
                    #throw new AssertException(DB_EMPTY, CODE_DB_NO_ROWS);
                } else {
                    $this->audit($query, 1);
                    #throw new AssertException($this->mysqli->error, CODE_DB);
                }
            }
                
            //Free the result
            return $return;
        }

		protected function freeResult() {
            $this->logging(__method__, 128);

            if ($this->mysqli == null) {
                return true;
            }

			if ($this->result instanceof mysqli_result) {
				$this->result->free();
			}
			//clear the other result(s) from buffer
			//loop through each result using the next_result() method
			while ($this->mysqli->next_result()) {
			//free each result.
				$this->result = $this->mysqli->use_result();
				if ($this->result instanceof mysqli_result) {
					$this->result->free();
				}
			}
		}

        public function describeTable($table, $printDescription=false) {
            $this->logging(__method__, 128);
            $query = "describe " . $table;
			if(! $this->query($query)) {
				$this->logging("Describe Table Query: $query", 4);
				$this->logging("Describe Table Error: " . $this->mysqli->error, 4);
				return "error: " . $this->mysqli->error;
			};

			$return = "Table Description for " . $table . "<p>";
			while ($row = $this->result->fetch_array(MYSQLI_NUM)) {
                $return .= $row[0] . " " . $row[1] . " " . $row[2] . "<br>";
			}

            $this->logging($return, 4);

            if ($printDescription) {
                return $return;
            }
        }

        function getStatusQuery($statusType, $columnName) {
            if ($statusType == 'failed') {
                return "AND $columnName = '$statusType'";
            } else if ($statusType == NULL) {
                return "";
            } else {
                return "AND $columnName != 'failed'";
            }
        }

		function __destruct() {
			$this->logging("Closing the mysqli connection", 128);
			// Free stored results
    		//clearStoredResults($this->mysqli);
			if (! $this->mysqli->close()) {
				$this->logging("An error occurred while closing the db connection");
			}
		}
	}
?>
