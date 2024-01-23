<script lang="ts">
  import { longPressAction } from "svelte-legos";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { db } from "$lib/db";
  import { toast } from "svelte-sonner";
  import { invalidate } from "$app/navigation";

  let duration = 3000;
  let dialogOpen = false;

  export let src: string;
  export let name: string;
  export let id: number;

  async function handleDelete(id: number) {
    try {
      await db.OrderItems.delete(id);
      toast.success("Item deleted.");
      await invalidate("/");
    } catch (error) {
      toast.error(`Error deleting item.`);
      console.log(error);
    }
  }
</script>

<AlertDialog.Root bind:open={dialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        <p>
          Delete <b>{name}</b>?
        </p>
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={() => handleDelete(id)}>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<button
  use:longPressAction={duration}
  on:longpress={() => {
    dialogOpen = true;
  }}
>
  <img {src} alt={name} class="rounded aspect-square object-cover" />
</button>
