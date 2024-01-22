<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { DotsHorizontal } from "radix-icons-svelte";
  import { blobToBase64 } from "$lib/utils";

  export let audioBase64: string = "";
  let mediaArray: Array<BlobPart> = [];
  let mediaRecorder: MediaRecorder | null = null;
  let audio: HTMLAudioElement | null = null;

  onMount(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
      mediaArray.push(e.data);
    };
    mediaRecorder.onstop = function () {
      const blob = new Blob(mediaArray, { type: "audio/ogg; codecs=opus" });
      blobToBase64(blob).then((base64) => {
        audioBase64 = base64 as string;
      });
      const srcBlob = window.URL.createObjectURL(blob);
      (audio as HTMLAudioElement).src = srcBlob;
      audio?.play();
    };
  });

  onDestroy(() => {
    mediaRecorder?.stop();
    mediaArray = [];
  });

  $: isRecording = mediaRecorder?.state == "recording";

  function startRecording() {
    if (mediaRecorder) {
      if (mediaRecorder.state == "recording") {
        mediaRecorder.stop();
      }
      mediaRecorder.start();
      mediaRecorder = mediaRecorder;
      mediaArray = [];
    }
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder = mediaRecorder;
      const event = new FocusEvent("focusin", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      audio?.dispatchEvent(event);
    }
  }
</script>

<div class="flex flex-col space-y-1.5 p-2">
  <div class="flex justify-center items-center gap-2">
    <audio bind:this={audio} controls />
    <Button
      class="gap-2 inline-flex"
      variant={!isRecording ? "destructive" : "default"}
      disabled={isRecording}
      on:click={startRecording}
    >
      {#if isRecording}
        Recording
        <DotsHorizontal class="animate-ping" />
      {:else}
        Record
      {/if}
    </Button>
    {#if isRecording}
      <Button variant="destructive" on:click={stopRecording}>Stop</Button>
    {/if}
  </div>
</div>
