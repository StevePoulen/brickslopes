<?php
    #Information for testing on a local environment 
    //Copy this from config_template.php to config.php
    define('DB_HOST', '127.0.0.1');
    define('DB_PASSWD', '<local_db_passwd>');
    define('LOGMASK', 1);
    define('DB_USER', 'brickslopes');
    define('DB_NAME', 'brickslopes');
    define('JWT_KEY', 'mykey');
    define('WEBSITE', 'mybrickslopes.com');
    define('LOGGING_DEBUG', '/tmp/debug_log.txt');
    define('LOGGING_AUDIT', '/tmp/audit_log.txt');
?>
