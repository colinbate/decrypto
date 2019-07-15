<script>
import {createEventDispatcher, onMount} from 'svelte';
import {findDuplicates} from './find-dupes.js';
import {saveMap, loadMap} from './storage.js';
import {writable, derived} from 'svelte/store';
export let words;
export let knowns;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let knownMap = new Map();
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

</script>
<style>
.word {
  margin-right: 1rem;
  margin-bottom: 1rem;
  float: left;
}

.letter {
  float: left;
  text-align: center;
  margin-right: 0.25rem;
}

.letter input {
  width: 2rem;
  text-align: center;
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
  border-color: hsla(10, 90%, 40%, 1);
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
</style>
<form class="solver">
  <div class="cf">
    {#each words as word}
      <div class="word cf">
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
                  class:dupe={$dupes.has(letter.char)}
                  disabled={!!letter.given}>
                <span>{letter.char}</span>
              </label>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
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