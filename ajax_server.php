<?php
require_once('echo.inc');
require_once('Ajax.inc');
require_once('Cryptoquote.inc');

// request comes in from Javascript with various actions:
// action: 1 data: regex for word to match result: list of likely words
// 

$action = $_GET['action'];
$data = $_GET['data'];

switch ($action) {
    case 1:
        $words = Cryptoquote::matchWords($data);
        if ($words === false) {
        	echo "No matches found.";
        } else echo $words;
        break;
    default:
        echo "rhuvium.com Cryptoquote solver";
}

?>