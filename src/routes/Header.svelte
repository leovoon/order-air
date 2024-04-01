<script lang="ts">
  import { toggleMode } from "mode-watcher";
  import { Moon, Sun } from "radix-icons-svelte";
  import SubmitForm from "./SubmitForm.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { SuperValidated } from "sveltekit-superforms";
  import type { FormSchema } from "../lib/schema";

  export let form: SuperValidated<FormSchema>;
</script>

<header class="flex mb-2">
  <h1 class="text-2xl ml-0 mr-auto">Menu</h1>
  <nav class="flex gap-2">
    <Button on:click={toggleMode} variant="outline" size="icon">
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>
    <SubmitForm {form} />
  </nav>
</header>
