<script script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import Cold from "$lib/components/ui/icon/Cold.svelte";
  import Hot from "$lib/components/ui/icon/Hot.svelte";
  import ImageButton from "$lib/components/ui/ImageButton.svelte";
  import PlayButton from "$lib/components/ui/PlayButton.svelte";
  import { liveQuery } from "dexie";
  import { db } from "$lib/db";
  import Header from "./Header.svelte";
  import { DotsHorizontal, Update } from "radix-icons-svelte";

  export let data;
  let items = liveQuery(() => db.OrderItems.reverse().toArray());
</script>

<div class="flex flex-col h-[100dvh] p-2 bg-white dark:bg-black" data-vaul-drawer-wrapper>
  <Header form={data.form} />
  <main class="{$items ? '' : 'flex-grow'} grid auto-cols-fr grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 my-2">
    {#if $items}
      {#if $items.length === 0}
        <p class="col-span-2 h-full grid place-items-center p-2">No items yet.</p>
      {:else}
        {#each $items as { id, name, photo, audio, cold }}
          <Card.Root class="self-baseline">
            <Card.Header>
              <Card.Title>{name}</Card.Title>
            </Card.Header>
            <Card.Content>
              <ImageButton src={photo} {name} {id} />
            </Card.Content>
            <Card.Footer>
              <div class="w-full flex gap-2 justify-center">
                <PlayButton {audio} />
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
      <p class="col-span-2 h-full grid place-items-center">
        <DotsHorizontal class="animate-ping" />
      </p>
    {/if}
  </main>
</div>
