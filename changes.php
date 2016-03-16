<?php
require_once('echo.inc');
$page = new ePage();
$page->title('History of DeCryptoquote');
$page->content_start();
?>
<h1>History of DeCryptoquote</h1>

<h2>July 11, 2005</h2>

<ul>
  <li>Initial development</li>
</ul>

<h2>July 15, 2005</h2>

<ul>
  <li>Letters become upper case when you leave a field.</li>
  <li>When you enter a letter in a field, the focus is automatically sent to the next field.</li>
</ul>

<h2>July 17, 2005</h2>

<ul>
  <li>When there are no word matches, it now says that instead of 'null'.</li>
</ul>

<h2>July 30, 2005</h2>
<ul>
  <li>When you hit backspace on a letter it now deletes all of the corresponding letters as well.</li>
  <li>Likewise when you are in a box with an existing letter you can simply type in a replacement letter and that will replace all occurances.</li>
  <li>It now works functionally in Firefox. Still has some formatting issues, but it is usable.</li>
  
</ul>

<?php
$page->content_end();
$page->render();
?>