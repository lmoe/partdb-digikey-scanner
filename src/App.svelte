<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./lib/Counter.svelte";
  import * as ZX from "@zxing/library";
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";

  const codeReader = new ZX.BrowserMultiFormatReader();
  let cameraDevices: Writable<MediaDeviceInfo[]> = writable([]);
  let selectedCameraID: string = "";
  let foundData: string = "";

  let videoElement: HTMLVideoElement;

  function askPermission() {
    //add constraints object
    var constraints = {
      audio: true,
      video: true,
    };

    //call getUserMedia
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (mediaStream) {})
      .catch(function (err) {
        console.log("There's an error!" + err.message);
      });
  }

  async function initializeApp() {
    console.log("INIT");
    const devices = await codeReader.listVideoInputDevices();
    cameraDevices.set(devices);
    console.log(devices);
  }

  function stopCapture() {
    codeReader.stopContinuousDecode();
    codeReader.reset();
  }

  async function startCapture() {
    codeReader.decodeFromVideoDevice(
      selectedCameraID,
      videoElement,
      (result, err) => {
        if (result) {
          console.log(result);
          foundData = result.getText();
          codeReader.reset();
        }
        if (err && !(err instanceof ZX.NotFoundException)) {
          console.error(err);
          foundData = err.message;
        }
      },
    );
  }

  onMount(initializeApp);
</script>

<main>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video bind:this={videoElement}></video>
  {#if videoElement}
    <div class="controls">
      <select
        bind:value={selectedCameraID}
        on:change={() => console.log(selectedCameraID)}
      >
        {#each $cameraDevices as device}
          <option
            id={device.deviceId}
            title={device.deviceId}
            value={device.deviceId}
          >
            {device.label}
          </option>
        {/each}
      </select>

      {#if !codeReader.isVideoPlaying(videoElement)}
        <button on:click={() => startCapture()}>Start Capture</button>
      {:else}
        <button on:click={() => stopCapture()}>Stop Capture</button>
      {/if}
      {#if foundData.length > 0}
        {foundData}
      {/if}
    </div>
  {/if}
</main>

<style>
  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    margin: 0;
    width: 100%;
    height: 100%;
  }
</style>
