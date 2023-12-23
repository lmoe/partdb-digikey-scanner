<script lang="ts">
  import recordIcon from "/record.svg";
  import * as ZX from "@zxing/library";
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import {decodeDigiKeyCode} from './lib/DigiKeyDecoder';

  const codeReader = new ZX.BrowserMultiFormatReader();
  let cameraDevices: Writable<MediaDeviceInfo[]> = writable([]);
  let selectedCameraID: string = "";
  let foundData: string = "";

  let videoElement: HTMLVideoElement;

  async function initializeApp() {
    $cameraDevices = await codeReader.listVideoInputDevices();

    // Voluntarily set some device
    if ($cameraDevices.length > 0) {
      selectedCameraID = $cameraDevices[0].deviceId;
    }
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
          foundData = result.getText();
          console.log(foundData);
          console.log(decodeDigiKeyCode(foundData));

          // Send data to PartDB, open modal, etc..

          // ..
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
      {#if !codeReader.isVideoPlaying(videoElement)}
      <div>
        <button on:click={() => startCapture()} type="submit">
          <!-- svelte-ignore a11y-missing-attribute -->
          <img class="capture_icon" src={recordIcon}  />
        </button>
      </div>
      {:else}
        <button on:click={() => stopCapture()}>Stop Capture</button>
      {/if}
      {#if foundData.length > 0}
        {foundData}
      {/if}

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


    </div>
  {/if}
</main>

<style>
  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

  select {
    margin: 15px;
  }

  .capture_icon {
    width: 20vw;
    height: 20vw;
  }
</style>
