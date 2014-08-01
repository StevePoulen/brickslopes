<?php

function get_ob() {
    $text = ob_get_clean();
    ob_start();
    return $text;
}

?>
