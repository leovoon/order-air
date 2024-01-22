<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Drawer from "$lib/components/ui/drawer";
  import Cold from "$lib/components/ui/icon/Cold.svelte";
  import Hot from "$lib/components/ui/icon/Hot.svelte";
  import { Moon, Play, Plus, Stop, Sun } from "radix-icons-svelte";
  import SubmitForm from "$lib/components/SubmitForm.svelte";
  import { liveQuery } from "dexie";
  import { db } from "$lib/db";
  import { sound } from "svelte-sound";
  import { toggleMode } from "mode-watcher";
  import { open } from "$lib/store";

  export let data;
  let items = liveQuery(() => db.OrderItems.toArray());
  let isPlaying = false;
  let plyBtn: HTMLButtonElement;

  function onplay(id: string, name: string) {
    isPlaying = true;
  }
  function onend(id: string) {
    isPlaying = false;
  }
</script>

<header class="p-2 flex gap-2">
  <h1 class="text-2xl ml-0 mr-auto">Menu</h1>
  <Button on:click={toggleMode} variant="outline" size="icon">
    <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span class="sr-only">Toggle theme</span>
  </Button>
  <Drawer.Root bind:open={$open}>
    <Drawer.Trigger asChild let:builder>
      <Button builders={[builder]} variant="outline">
        <Plus />
      </Button>
    </Drawer.Trigger>
    <Drawer.Content>
      <div class="mx-auto w-full max-w-sm p-4">
        <Drawer.Header>
          <Drawer.Title>Add New Drink</Drawer.Title>
          <Drawer.Description>Save photo and audio.</Drawer.Description>
        </Drawer.Header>
        <SubmitForm form={data.form} />
      </div>
    </Drawer.Content>
  </Drawer.Root>
</header>

<main class="grid auto-cols-fr grid-cols-2 gap-2 p-2">
  {#if $items}
    {#if $items.length === 0}
      <p class="text-center">No items yet.</p>
    {:else}
      {#each $items as { name, photo, audio, cold }}
        <Card.Root>
          <Card.Header>
            <Card.Title>{name}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div>
              <img src={photo} alt={name} class="rounded aspect-square object-cover" />
            </div>
          </Card.Content>
          <Card.Footer>
            <div class="w-full flex gap-2 justify-center">
              <button
                class="h-9 px-4 py-2 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
                use:sound={{
                  src: audio,
                  events: ["click"],
                  html5: true,
                  onplay,
                  onend,
                }}
                disabled={isPlaying}
                bind:this={plyBtn}
                on:dblclick={() => {
                  if (plyBtn) {
                    plyBtn.stop();
                    isPlaying = false;
                  }
                }}
              >
                <Play />
              </button>

              {#if cold}
                <Cold />
              {:else}
                <Hot />
              {/if}
            </div>
          </Card.Footer>
        </Card.Root>
      {/each}
    {/if}
  {:else}
    <p class="text-center">Loading...</p>
  {/if}
</main>
