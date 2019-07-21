<script>
import {createEventDispatcher} from 'svelte';
import {getNewQuote} from './quotes.js';
let cypher = '';
let knownEnc = '';
let knownPlain = '';
function setNewQuote() {
  getNewQuote().then(quote => {
    cypher = quote;
  });
}
const dispatch = createEventDispatcher();
</script>
<style>
  .control {
    margin-bottom: 1rem;
    position: relative;
  }
  textarea {
    width: 100%;
  }
  label {
    padding: 0.375rem 0;
  }
  .btn-small {
    font-size: 0.75rem;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.3rem 0.4rem;
  }
  input {
    text-align: center;
  }
  .opt {
    color: hsla(0, 0%, 60%, 1);
  }
  p {
    max-width: 35em;
    line-height: 1.5;
  }
</style>
<form>
  <p>
    A simple utility to help you solve letter substitution puzzles.
    Enter the cypher text below. You can click the '?' button after
    each word to search using my <a href="https://xw.cbate.com/#advanced">xw</a> tool.</p>
  <div class="control">
    <label>Cypher Text</label>
    <button type="button" class="btn-small" on:click={setNewQuote}>Load Random Quote</button>
    <textarea bind:value={cypher} rows="6"></textarea>
  </div>
  <div class="control">
    <label>Known Replacement <span class="opt">(optional)</span></label>
    <input type="text" size="3" bind:value={knownEnc}> stands for <input type="text" size="3" bind:value={knownPlain}>
  </div>
  <button type="button" on:click={() => dispatch('start', {quote:cypher, knownEnc, knownPlain})}>Start Solving</button>
</form>