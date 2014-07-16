<?php

$_SERVER['HTTP_HOST'] = 'www.mybrickslopes.com';
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

include join('/', array('.', 'app', 'php',  'AutoLoader.php'));
include join('/', array('.', 'config', 'config.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'DbMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'EmailMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'MocsMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'EventRegistrationsMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'RegistrationsMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'RegisteredAfolsMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'RegistrationLineItemsMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'UsersMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'EventsMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'EventDatesMock.php'));
include join('/', array(__DIR__, '..', 'fixtures', 'mocks', 'ThemesMock.php'));

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

    chdir(__DIR__ . '/../../../app/php');
?>
