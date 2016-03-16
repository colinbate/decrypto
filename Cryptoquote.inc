<?php

define('DICTIONARY', '/usr/share/dict/words');
define('GREP', '/bin/grep');

define('LEX_LETTER', 0);
define('LEX_SPACE', 1);
define('LEX_PUNCTUATION', 2);
define('LEX_WORDBEGIN', 3);
define('LEX_WORDEND', 4);
define('LEX_NONE', 8);
define('LEX_END', 9);
class Cryptoquote {

    var $cipher;
    var $lexpos;
    var $display;
    var $letternum;
    var $lastype;
    
    function Cryptoquote($cipher) {
        $this->cipher = strtoupper($cipher);
        $this->lexpos = 0;
        $this->display = '';
        $this->letternum = 0;
        $this->lastype = LEX_NONE;
    }
    
    function lex(&$type, &$value) {
        if ($this->lexpos == strlen($this->cipher)) {
            if ($this->lastype == LEX_WORDEND) {
                $type = LEX_END;
            } else {
                $type = LEX_WORDEND;
            }
            $this->lastype = $type;
            return;
        }
        $value = $this->cipher[$this->lexpos];
        if ($this->lexpos == 0 && $this->lastype == LEX_NONE) {
            $type = LEX_WORDBEGIN;
        } else if (ord($value) == 32) {
            if ($this->lastype == LEX_LETTER || $this->lastype == LEX_PUNCTUATION) {
                $type = LEX_WORDEND;
            } else {
                $type = LEX_SPACE;
            }
        } else if (ord($value) >= 65 && ord($value) <= 90) {
            if ($this->lastype == LEX_SPACE) {
                $type = LEX_WORDBEGIN;
            } else {
                $type = LEX_LETTER;
            }
        } else {
        	if ($this->lastype == LEX_SPACE) {
        		$type = LEX_WORDBEGIN;
        	} else {
	            $type = LEX_PUNCTUATION;
	        }
        }
        
        if ($type != LEX_WORDBEGIN && $type != LEX_WORDEND) {
            $this->lexpos++;
        }
        
        // Set the last type.
        $this->lastype = $type;
    }
    
    function parse() {
        $this->lex($type, $value);
        while ($type != LEX_END) {
            switch ($type) {
                case LEX_WORDEND:
                    $this->display .= "  </div>\n";
                    break;
                case LEX_WORDBEGIN:
                    $this->display .= "  <div class=\"word\">\n";
                    break;
                case LEX_LETTER:
                    $this->letternum++;
                    $this->display .= "    <div class=\"letter\"><input type=\"text\" size=\"3\" tabindex=\"$this->letternum\" name=\"l$this->letternum\" class=\"$value\" maxlength=\"1\" onkeypress=\"return letterTyped(event, '$value', this);\" onblur=\"capitalize(this);\" /><div>$value</div></div>\n";
                    break;
                case LEX_SPACE:
                    $this->display .= "    <div class=\"space\">&nbsp;</div>\n";
                    break;
                case LEX_PUNCTUATION:
                    $this->display .= "    <div class=\"punct\">" . htmlentities($value) . "</div>\n";
                    break;
            }
            $this->lex($type, $value);
        }
    }

    function display() {
        echo "<div id=\"cryptogrid\">\n<form action=\"verify\" method=\"post\">\n";
        echo $this->display;
        echo "</form>\n<div style=\"clear: left;\"></div>\n</div>\n";
    }

    function matchWords($regex) {
        if (!validate($regex, "/^[\.a-z]+$/")) {
            echo "0";
            exit();
        }
        $regex = ' "^' . $regex . '$" ';
        $cmd = GREP . $regex . DICTIONARY;
        $results = shell_exec($cmd);
        if (trim($results) == '' || trim($results) == 'null') return false;
        return $results;
    }

}
?>