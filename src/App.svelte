<script>
  import {onMount} from 'svelte';
  import QuoteEntry from './QuoteEntry.svelte';
  import Solver from './Solver.svelte';
  import Toaster from './Toaster.svelte';
  import Parser from './parser.js';
  import {save, load} from './storage.js';
  let words = [];
  let knowns = [];
  let msg = '';
  let msgType = 'error';
  const PARSED = 'PARSED';

  function startSolving(ev) {
    const { quote, knownEnc, knownPlain } = ev.detail;
    const enc = (knownEnc || '').toUpperCase();
    const plain = (knownPlain || '').toUpperCase();
    let flags;
    if (enc && plain) {
      flags = {[enc]: 'given'};
      knowns = [[enc, plain]];
    }
    const parsed = (new Parser(quote)).tokenize(flags);
    save(PARSED, parsed);
    words = parsed;
  }

  function startOver() {
    save(PARSED, null);
    knowns = [];
    words = [];
  }

  function showError(ev) {
    const error = ev.detail.msg;
    msg = error;
    msgType = 'error';
  }
  
  function showNote(ev) {
    const note = ev.detail.msg;
    msg = note;
    msgType = 'note';
  }
  function closeToast() {
    msg = '';
  }

  onMount(() => {
    console.log(`Mounting whole app, check for stored data`);
    let loaded = load(PARSED);
    const hash = window.location.hash;
    if (hash && hash.startsWith('#cypher=')) {
      const ct = decodeURIComponent(hash.replace(/^#cypher=/, '').replace(/\+/g, ' ')).trim();
      if (ct) {
        let proceed = true;
        if (loaded) {
          proceed = confirm('You were already solving a quote, would you like to replace it with the one provided in the URL?');
        }
        if (proceed) {
          loaded = (new Parser(ct)).tokenize();
          save(PARSED, loaded);
        }
      }
      window.location.hash = '';
    }
    if (loaded) {
      words = loaded;
    }
  });
</script>

<style>
  .content {
    margin: 0 auto;
    max-width: 60rem;
  }
</style>

<div class="content">
  <header><h1>DeCrypto</h1></header>
  <main>
    {#if words.length === 0}
      <QuoteEntry on:start={startSolving}/>
    {:else}
      <Solver words={words} knowns={knowns} on:reset={startOver} on:error={showError} on:note={showNote}/>
    {/if}
  </main>
  <Toaster msg={msg} type={msgType} on:close={closeToast}/>
</div>
