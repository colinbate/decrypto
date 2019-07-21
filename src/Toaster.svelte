<script>
import { createEventDispatcher } from 'svelte';
import { scale } from 'svelte/transition';
export let msg = '';
export let type = 'error';
let timer;
const dispatch = createEventDispatcher();
const DEFAULT_DURATION = 5000;
$: if (msg.length) {
  timer = setTimeout(() => {
    dispatch('close');
  }, DEFAULT_DURATION);
} else {
  if (timer) {
    clearTimeout(timer);
  }
}

</script>
<style>
.toaster {
  position: fixed;
  top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 0;
  width: 100%;
}
.toast {
  max-width: 35em;
  padding: 0 1rem;
}
.error {
  background-color: hsl(350, 100%, 85%);
  color: hsl(350, 100%, 18%);
}
.note {
  background-color: hsl(195, 100%, 85%);
  color: hsl(195, 100%, 18%);
}
</style>
<div class="toaster">
{#if msg.length}
  <div class={'toast ' + type} transition:scale={{duration: 600}}>
    <p>{msg}</p>
  </div>
{/if}
</div>