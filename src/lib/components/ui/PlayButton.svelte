<script lang="ts">
  import { Play } from "radix-icons-svelte";
  import { onDestroy } from "svelte";
  import { sound } from "svelte-sound";

  export let audio: string;
  let isPlaying = false;

  let button: HTMLButtonElement;
  function onplay(id: string) {
    isPlaying = true;
  }
  function onend(id: string) {
    isPlaying = false;
  }
</script>

<button
  bind:this={button}
  class="h-9 px-4 py-2 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
  use:sound={{
    src: audio,
    events: ["click", "dblclick"],
    html5: true,
    onplay,
    onend,
  }}
  disabled={isPlaying}
>
  <Play />
</button>
