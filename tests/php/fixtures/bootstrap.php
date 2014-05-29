<?php

DEFINE('JWT_KEY', 'mykey');
DEFINE('LOGMASK', 1);
DEFINE('DB_HOST', 'localhost');
DEFINE('DB_USER', 'brick');
DEFINE('DB_PASSWD', 'slopes');
DEFINE('DB_NAME', 'brickSlopes');
ob_start();

if (!file_exists('./vendor/autoload.php')) {
    echo "\n\n";
    die(<<<'EOT'
You must set up the project dependencies, run the following commands:

wget http://getcomposer.org/composer.phar
php composer.phar install

EOT
    );
}


/*include join('/', array(__DIR__, '..', '..', '..', 'app', 'php',  'AutoLoader.php'));*/
include join('/', array('.', 'app', 'php',  'AutoLoader.php'));

/**
* http://www.kammerl.de/ascii/AsciiSignature.php
* starwars 
*/

//printWords();

    function printWords() {
echo "
##################################################################################################################
#                                                                                                                #
# .______   .______       __    ______  __  ___      _______. __        ______   .______    _______     _______. #
# |   _  \  |   _  \     |  |  /      ||  |/  /     /       ||  |      /  __  \  |   _  \  |   ____|   /       | #
# |  |_)  | |  |_)  |    |  | |  ,----'|  '  /     |   (----`|  |     |  |  |  | |  |_)  | |  |__     |   (----` #
# |   _  <  |      /     |  | |  |     |    <       \   \    |  |     |  |  |  | |   ___/  |   __|     \   \     #
# |  |_)  | |  |\  \----.|  | |  `----.|  .  \  .----)   |   |  `----.|  `--'  | |  |      |  |____.----)   |    #
# |______/  | _| `._____||__|  \______||__|\__\ |_______/    |_______| \______/  | _|      |_______|_______/     #
#                                                                                                                #
#       __    __  .__   __.  __  .___________.   .___________. _______     _______.___________.    _______.      #
#       |  |  |  | |  \ |  | |  | |           |   |           ||   ____|   /       |           |   /       |     #
#       |  |  |  | |   \|  | |  | `---|  |----`   `---|  |----`|  |__     |   (----`---|  |----`  |   (----`     #
#       |  |  |  | |  . `  | |  |     |  |            |  |     |   __|     \   \       |  |        \   \         #
#       |  `--'  | |  |\   | |  |     |  |            |  |     |  |____.----)   |      |  |    .----)   |        #
#        \______/  |__| \__| |__|     |__|            |__|     |_______|_______/       |__|    |_______/         #
#                                                                                                                # 
##################################################################################################################
";
}

    // Register the directory to your include files
    AutoLoader::registerDirectory('./app/php');

    chdir(__DIR__ . '/../../../app');
?>
