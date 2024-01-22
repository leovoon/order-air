<script lang="ts">
  import { getFormField } from "formsnap";

  export let value = "";
  const { name, setValue } = getFormField();
  $: setValue(value);
</script>

<input class="hidden" type="hidden" {value} {name} />
