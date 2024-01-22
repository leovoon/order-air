<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import CustomInput from "./ui/form/custom-input.svelte";
  import { formSchema, type FormSchema } from "../../routes/schema";
  import type { SuperValidated } from "sveltekit-superforms";
  import * as Drawer from "$lib/components/ui/drawer";
  import AudioRecorder from "$lib/components/ui/audio-recorder/AudioRecorder.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { FormOptions } from "formsnap";
  import { db } from "$lib/db";
  import { blobToBase64 } from "$lib/utils";
  import { toast } from "svelte-sonner";
  import { invalidateAll } from "$app/navigation";
  import { open } from "$lib/store";

  export let form: SuperValidated<FormSchema>;

  let audioBase64: string = "";

  const options: FormOptions<FormSchema> = {
    SPA: true,
    resetForm: true,
    async onUpdate({ form, formEl }) {
      const photoInputEle = formEl.querySelector("input[type=file]") as HTMLInputElement;
      if (photoInputEle && photoInputEle.files) {
        const file = photoInputEle.files[0];

        if (!file) {
          return;
        }

        const base64 = (await blobToBase64(file)) as string;
        form.data.photo = base64;
        form.data.audio = audioBase64;

        if (form.valid) {
          try {
            db.OrderItems.add({
              name: form.data.name,
              photo: form.data.photo,
              audio: form.data.audio,
              cold: form.data.cold,
            });
            toast.success("Saved successfully", {
              dismissable: true,
              duration: 3000,
            });
            await invalidateAll();
            $open = false;
            console.log($open);
          } catch (e) {
            toast.error("Failed to save");
          }
        }
      }
    },
  };
</script>

<Form.Root class="space-y-2" enctype="multipart/form-data" {form} {options} schema={formSchema} let:config>
  <Form.Field {config} name="name">
    <Form.Item>
      <Form.Label>Name</Form.Label>
      <Form.Input />
      <Form.Validation />
    </Form.Item>
  </Form.Field>

  <Form.Field {config} name="photo">
    <Form.Item>
      <Form.Label>Photo</Form.Label>
      <Form.Input type="file" accept="image/*" />
      <Form.Validation />
    </Form.Item>
  </Form.Field>

  <Form.Field {config} name="cold">
    <Form.Item class="flex flex-row items-center justify-between rounded-lg border px-4 py-2">
      <div class="space-y-0.5">
        <Form.Label>Is cold?</Form.Label>
      </div>
      <Form.Switch class="ml-auto mr-0 !mt-0 " aria-readonly />
      <Form.Validation />
    </Form.Item>
  </Form.Field>

  <Form.Field {config} name="audio">
    <Form.Item class="mt-4">
      <Form.Label>Audio</Form.Label>
      <CustomInput bind:value={audioBase64} />
      <AudioRecorder bind:audioBase64 />
      <Form.Validation />
    </Form.Item>
  </Form.Field>

  <Drawer.Footer class="p-0 mt-4">
    <Form.Button>Save</Form.Button>
    <Drawer.Close asChild let:builder>
      <Button builders={[builder]} variant="outline">Cancel</Button>
    </Drawer.Close>
  </Drawer.Footer>
</Form.Root>
