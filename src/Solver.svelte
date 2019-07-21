<script>
import {createEventDispatcher, onMount} from 'svelte';
import {findDuplicates} from './find-dupes.js';
import {createPattern} from './pattern.js';
import {saveMap, loadMap} from './storage.js';
import {writable, derived} from 'svelte/store';
export let words;
export let knowns;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let knownMap = new Map();
let selected = '';
let selectedWord = null;
let timer;
let showHelp = false;
const key = writable(new Map());
const dupes = derived(key, k => findDuplicates(k));
const guessed = derived(key, k => new Set(k.values()));
const dispatch = createEventDispatcher();
const KEYS = 'KEYS';
const KNOWN = 'KNOWN';
onMount(() => {
  const keys = loadMap(KEYS);
  knownMap = loadMap(KNOWN);
  if (keys) {
    key.update(() => keys);
  } else if (knowns.length) {
    knownMap = new Map();
    key.update(k => {
      knowns.forEach(known => {
        k.set(known[0], known[1]);
        knownMap.set(known[0], known[1]);
      });
      saveMap(KEYS, k);
      saveMap(KNOWN, knownMap);
      return k;
    });
  }
})
function enterGuess(enc) {
  return (ev) => {
    let plain = ev.target.value.toUpperCase();
    if (plain.length > 1) {
      const prev = $key.get(enc) || '';
      const newchar = plain.replace(prev, '');
      if (newchar.length > 1 || newchar === prev) {
        return;
      }
      plain = newchar;
    }
    if (($key.get(enc) || '') === plain) {
      return;
    }
    if (plain) {
      key.update(k => {
        k.set(enc, plain);
        saveMap(KEYS, k);
        return k;
      });
    } else {
      key.update(k => {
        k.delete(enc);
        saveMap(KEYS, k);
        return k;
      });
    }
  };
}

function clear(onlyEntered) {
  key.update(() => {
    const newmap = !onlyEntered ? new Map() : new Map(knownMap);
    saveMap(KEYS, !onlyEntered ? null : newmap);
    return newmap;
  });
}

function reset() {
  clear(false);
  knownMap = new Map();
  saveMap(KNOWN, null);
  dispatch('reset');
}

function select(enc, word) {
  return () => {
    selected = enc;
    if (timer) {
      clearTimeout(timer);
    }
    selectedWord = word;
  };
}

function deselect() {
  selected = '';
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(function () {
    selectedWord = null;
  }, 300);
}

function getHelp(word) {
  return () => {
    const pattern = createPattern(word, $key);
    console.log('Get Help', pattern, word);
    if (pattern == null) {
      dispatch('error', { msg: 'Word needs at least one letter defined to search.'})
    } else {
      showHelp = true;
      setTimeout(function() {
        const win = window.open(`https://xw.bate.dev/#advanced!$${pattern}`, 'xwhelp');
      }, 10);
    }
  };
}

function stopHelp() {
  showHelp = false;
}
</script>
<style>
.wrapmaster {
  display: flex;
  flex-direction: column;
}

.word {
  margin-right: 1rem;
  margin-bottom: 1rem;
  float: left;
  position: relative;
}

.word button.help {
  display: none;
}

.word.sel button.help {
  position: absolute;
  display: block;
  padding: 2px;
  width: 1.2rem;
  height: 1.3rem;
  line-height: 1;
  text-align: center;
  background-color: hsl(15, 100%, 50%);
  color: #fff;
  border-radius: 599px;
  border: 0;
  right: -0.85rem;
  top: -0.85rem;
  cursor: pointer;
  margin: 0;
}

.letter {
  float: left;
  text-align: center;
  margin-right: 0.25rem;
}

.letter input {
  width: 1.5rem;
  text-align: center;
  border: 0;
  background: hsla(0, 0%, 90%, 1);
  padding: 0.2rem;
}
.letter input[disabled] {
  color: hsl(120, 33%, 60%);
  background: #fff;
}
.letter span {
  display: block;
}
.punct {
  position: relative;
  top: 0.35rem;
}
.remaining, .reset {
  padding-top: 1rem;
  border-top: 1px solid #ccc;
  margin-top: 1rem;
}
.remaining {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.dupe {
  color: hsla(10, 90%, 40%, 1);
  background-color: hsla(10, 100%, 85%, 1);
}
.taken {
  color: hsla(0, 0%, 70%, 1);
  text-decoration: line-through;
}
button {
  margin-right: 1rem;
}
.letter .highlight {
  background: hsla(140, 60%, 80%, 1);
}
.helper {
  text-align: center;
  position: relative;
  padding: 0.75rem 1rem 0 1rem;
}
.closebtn {
  position: absolute;
  top: 0;
  left: 50%;
  margin: 0 0 0 138px;
  font-size: 1.5rem;
  width: 1em;
  height: 1em;
  border: 0;
  border-radius: 2em;
  background-color: hsl(15, 100%, 50%);
}

.closebtn::before, .closebtn::after {
  content: "";
  position: absolute;
  background-color: #fff;
  width: 0.15em;
  height: 0.7em;
  border-radius: 0.2em;
  top: 0.15em;
  left: 0.45em;
}

.closebtn::before {
  transform: rotate(45deg);
}

.closebtn::after {
  transform: rotate(135deg);
}
.frame {
  margin: 0 auto;
  border: 1px solid hsla(15, 100%, 50%, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 10px 20px hsla(0, 0%, 0%, 0.15), 0 3px 6px hsla(0, 0%, 0%, 0.1);
}

@media (min-width: 55rem) {
  .wrapmaster {
    flex-direction: row;
  }
  .helper {
    top: -4rem;
    padding: 0.75rem 0 0 0;
    margin-left: 1rem;
  }
}
</style>
<form class="solver">
  <div class="wrapmaster">
  <div class="cf">
    {#each words as word}
      <div class="word cf" class:sel={word === selectedWord}>
        {#each word as letter}
          <div class="letter">
            {#if letter.punctuation}
              <div class="punct">{letter.char}</div>
            {:else}
              <label>
                <input
                  type="text"
                  value={$key.get(letter.char) || ''}
                  on:input={enterGuess(letter.char)}
                  on:focus={select(letter.char, word)}
                  on:blur={deselect}
                  class:highlight={letter.char === selected}
                  class:dupe={$dupes.has(letter.char)}
                  disabled={!!letter.given}>
                <span>{letter.char}</span>
              </label>
            {/if}
          </div>
        {/each}
        <button type="button" on:click={getHelp(word)} class="help">?</button>
      </div>
    {/each}
  </div>
  {#if showHelp}
  <div class="helper">
    <button type="button" class="closebtn" on:click={stopHelp}></button>
    <iframe class="frame" name="xwhelp" title="Help Tool" width="300" height="400" src="about:blank"></iframe>
  </div>
  {/if}
  </div>
  <div class="remaining">
    {#each ALPHABET as rem}
      <span class:taken={$guessed.has(rem)}>{rem}</span>
    {/each}
  </div>
  <div class="reset">
    <button type="button" on:click={clear}>Clear Guesses</button>
    <button type="button" on:click={reset}>Try Different Quote</button>
  </div>
</form>