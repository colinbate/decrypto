<?php
require_once('echo.inc');
$page = new ePage();
$page->title('DeCryptoQuote');
$page->content_start();
?>
<h1>De-CryptoQuote</h1>

<form action="solver" method="post">
<label for="frm_cipher">Encrypted Text</label>
<textarea name="ciphertext" id="frm_cipher" rows="10" cols="50"></textarea>
<br />
<label for="frm_submit"></label>
<input type="submit" value="Prepare Puzzle" id="frm_submit" />
</form>

<h3>Notes</h3>
<p>
Requires Safari or Firefox (<strong>NEW</strong>) at the moment. Javascript must be enabled. View <a href="changes.php">change history</a>.
</p>

<h3>Examples</h3>
<p>
Try pasting one of these into the textarea above if you don't have a Cryptoquote handy.
</p>
<div class="example">
CXS UTGCHCYD DSGSKCEV YJSKSU H XHKUVRHK'W WXYJJTKN RSGGH HKU GHEESU TC XYRS USWJYC.
<p>Hint: J equals P</p>
</div>
<div class="example">
OHIN PYD ONHKX HCYDF FON SNR MYSXYS-CHZNX HXIJQN QYMDTSJZF SHTNX RNZFTJSZFNK HCCP?
<p>Hint: C is equal to B</p>
</div>

<div class="example">
Y MFQ, EPSDFVYU MFCI HYO NJOS VZLAFVSWI YLI FO LZH OWCAFLQ SFEW. FS'O Y NYFUDZJOW CZV.
<p>Hint: N is equal to J</p>
</div>

<div class="example">
PRGZ CRG NZTQFHT BGNMGT CF UVZBCHFZ ZFQONKKS, HC VZTGQPGZC N ENMHB UQFZCNK QFEFCFOS.
<p>Hint: C is equal to T</p>
</div>

<?php
$page->content_end();
$page->render();
?>