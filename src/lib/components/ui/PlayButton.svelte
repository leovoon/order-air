<script lang="ts">
  import { Play } from "radix-icons-svelte";
  import { onDestroy } from "svelte";
  // import { sound } from "svelte-sound";
  import { Howl, Howler } from "howler";

  export let audio: string;
  let isPlaying = false;

  let button: HTMLButtonElement;
  function onplay(id: number) {
    isPlaying = true;
  }
  function onend(id: number) {
    isPlaying = false;
  }
</script>

<button
  bind:this={button}
  class="h-9 px-4 py-2 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
  on:click={() => {
    const sound = new Howl({
      src: [audio],
      onplay: (id) => onplay(id),
      onend: (id) => onend(id),
    });
    sound.play();
  }}
  disabled={isPlaying}
>
  <Play />
</button>
