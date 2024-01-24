<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { db } from "$lib/db";
  import { toast } from "svelte-sonner";
  import { invalidate } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";

  let dialogOpen = false;
  let count = 10;
  export let src: string;
  export let name: string;
  export let id: number;

  async function handleDelete(id: number) {
    if (count > 1) {
      count = count - 1;
      return;
    }
    actuallyDeleteItem(id);
  }

  async function actuallyDeleteItem(id: number) {
    try {
      await db.OrderItems.delete(id);
      toast.success("Item deleted.");
      await invalidate("/");
      dialogOpen = false;
    } catch (error) {
      toast.error(`Error deleting item.`);
    }
  }
</script>

<AlertDialog.Root
  bind:open={dialogOpen}
  closeOnEscape
  onOpenChange={() => {
    count = 10;
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title
        >{count > 5
          ? "Delete this item?"
          : count === 1
            ? "Your last chance"
            : "Are you absolutely sure?"}</AlertDialog.Title
      >
      <AlertDialog.Description>
        <p>
          Delete <b>{name}</b>?
        </p>
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <Button
        variant="destructive"
        style="width: {(count / 10) * 100}%"
        class="transition-all"
        on:click={() => handleDelete(id)}
      >
        {#if count === 1}
          Yes
        {:else}
          Delete
        {/if}
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<button
  on:click={() => {
    dialogOpen = true;
  }}
  class="z-10 relative"
>
  <img
    {src}
    alt={name}
    class="z-0 rounded aspect-square object-cover pointer-events-none ios-select-none"
    on:contextmenu|preventDefault={() => false}
  />
</button>

<style>
  .ios-select-none {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
</style>
