<?php
require_once('echo.inc');
require_once('Cryptoquote.inc');
$page = new ePage();
$page->title('Solving Cryptoquote');
$page->set('js1', 'crypto_solve.js');
$page->set('onload', 'page_load()');
$page->content_start();

$ciphertext = stripslashes($_POST['ciphertext']);
$quote = new Cryptoquote($ciphertext);
?>
<h1>Solving your Cryptoquote</h1>

<p>
Below is the grid of your cryptoquote. When you enter a letter, all of the corresponding
letters are filled in with that value as well. Once you have a couple of letters
filled in, if you hit the space bar while your cursor is in a box, a list of
possible matches is presented to the right.
</p>

<div id="hinttitle">Word Hints</div>
<div id="hints" style=""></div>
<?php
$quote->parse();
$quote->display();
?>

<p>This definitely isn't a perfect system, there are a number of issues that I want to resolve:</p>
<ul>
  <li>Support more browsers than just Safari. IE and Firefox don't seem to work and I haven't tested Opera yet.</li>
  <li>Word hinting doesn't take into consideration all the letters you have placed when narrowing down your options.</li>
  <li style="text-decoration: line-through;">When you erase a letter that you have attempted, it doesn't remove the other same letters elsewhere.</li>
  <li style="text-decoration: line-through;">If you hit more than one key when you are typing in a box, it uses the latter entries for replacements, but not in the current letter.</li>
  <li>The word list isn't the greatest, it doesn't include plural and past tense words.
</ul>
<?php
$page->content_end();
$page->render();

/*
Y MFQ, EPSDFVYU MFCI HYO NJOS VZLAFVSWI YLI FO LZH OWCAFLQ SFEW. FS'O Y NYFUDZJOW CZV.
*/

?>