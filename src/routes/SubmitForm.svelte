<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import CustomInput from "../lib/components/ui/form/custom-input.svelte";
  import { formSchema, type FormSchema } from "../lib/schema";
  import type { SuperValidated } from "sveltekit-superforms";
  import AudioRecorder from "$lib/components/ui/audio-recorder/AudioRecorder.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { FormOptions } from "formsnap";
  import { db } from "$lib/db";
  import { blobToBase64 } from "$lib/utils";
  import { toast } from "svelte-sonner";
  import { invalidate } from "$app/navigation";
  import { Camera } from "radix-icons-svelte";
  import { mediaQuery } from "svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Drawer from "$lib/components/ui/drawer";
  import { Plus } from "radix-icons-svelte";
  import { dialogOpen, drawerOpen } from "$lib/store";
  const isDesktop = mediaQuery("(min-width: 768px)");

  export let form: SuperValidated<FormSchema>;

  let audioBase64: string = "";

  const options: FormOptions<FormSchema> = {
    SPA: true,
    resetForm: true,
    async onUpdate({ form, formEl }) {
      const photoInputEle = formEl.querySelector(
        "input[type=file]",
      ) as HTMLInputElement;
      if (photoInputEle && photoInputEle.files) {
        const file = photoInputEle.files[0];

        if (!file || !form.valid) {
          return;
        }

        try {
          const base64 = (await blobToBase64(file)) as string;
          form.data.photo = base64;
          form.data.audio = audioBase64;
          //@ts-ignore id is autoincrement
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
          await invalidate("/");
          $dialogOpen = false;
          $drawerOpen = false;
        } catch (e) {
          toast.error("Failed to save");
        }
      }
    },
  };
</script>

{#if $isDesktop}
  <Dialog.Root bind:open={$dialogOpen}>
    <Dialog.Trigger asChild let:builder>
      <Button builders={[builder]} variant="outline">
        <Plus />
      </Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Add New Drink</Dialog.Title>
        <Dialog.Description>Save photo and audio.</Dialog.Description>
      </Dialog.Header>
      <Form.Root
        class="space-y-2 w-full  flex flex-col  justify-start"
        enctype="multipart/form-data"
        {form}
        {options}
        schema={formSchema}
        let:config
      >
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
            <div class="relative min-h-20">
              <div
                class="absolute inset-0 grid place-items-center mt-4 text-muted-foreground"
              >
                <Camera size={30} />
              </div>
              <Form.Input
                class="h-full absolute inset-0 bg-transparent"
                type="file"
                accept="image/*"
              />
            </div>
            <Form.Validation />
          </Form.Item>
        </Form.Field>

        <Form.Field {config} name="cold">
          <Form.Item
            class="flex flex-row items-center justify-between rounded-lg border px-4 py-2"
          >
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

        <Dialog.Footer class="p-0 mt-4">
          <Form.Button size="lg">Save</Form.Button>
          <Dialog.Close asChild let:builder>
            <Button builders={[builder]} variant="outline" size="lg"
              >Cancel</Button
            >
          </Dialog.Close>
        </Dialog.Footer>
      </Form.Root>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open={$drawerOpen} shouldScaleBackground>
    <Drawer.Trigger asChild let:builder>
      <Button builders={[builder]} variant="outline">
        <Plus />
      </Button>
    </Drawer.Trigger>
    <Drawer.Overlay class="fixed inset-0 bg-black/30" />

    <Drawer.Content>
      <div class="mx-auto w-full max-w-sm p-2">
        <Drawer.Header>
          <Drawer.Title>Add New Drink</Drawer.Title>
          <Drawer.Description>Save photo and audio.</Drawer.Description>
        </Drawer.Header>
        <Form.Root
          class="space-y-2 w-full  flex flex-col  justify-start px-2"
          enctype="multipart/form-data"
          {form}
          {options}
          schema={formSchema}
          let:config
        >
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
              <div class="relative min-h-20">
                <div
                  class="absolute inset-0 grid place-items-center mt-4 text-muted-foreground"
                >
                  <Camera size={30} />
                </div>
                <Form.Input
                  class="h-full absolute inset-0 bg-transparent"
                  type="file"
                  accept="image/*"
                />
              </div>
              <Form.Validation />
            </Form.Item>
          </Form.Field>

          <Form.Field {config} name="cold">
            <Form.Item
              class="flex flex-row items-center justify-between rounded-lg border px-4 py-2"
            >
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
            <Form.Button size="lg">Save</Form.Button>
            <Drawer.Close asChild let:builder>
              <Button builders={[builder]} variant="outline" size="lg"
                >Cancel</Button
              >
            </Drawer.Close>
          </Drawer.Footer>
        </Form.Root>
      </div>
    </Drawer.Content>
  </Drawer.Root>
{/if}
