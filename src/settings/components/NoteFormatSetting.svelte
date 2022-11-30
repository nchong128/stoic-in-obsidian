<script lang="ts">
  import { onMount } from "svelte";

  import { validateFormat, validateFormatComplexity } from "../validation";
	import {App} from "obsidian";
	import type {Readable, Writable} from "svelte/store";
	import {type IStoicInObsidianSettings, DEFAULT_SETTINGS} from "../index";

	export let app: App;
	export let settings: Writable<IStoicInObsidianSettings>;

  let inputEl: HTMLInputElement;
  let value: string = "";
  let error: string;
  let warning: string;

  onMount(() => {
    error = validateFormat(inputEl.value);
    warning = validateFormatComplexity(inputEl.value);
  });

  function clearError() {
    error = "";
  }

  function onChange() {
    error = validateFormat(inputEl.value);
    warning = validateFormatComplexity(inputEl.value);
  }
</script>

<div class="setting-item">
  <div class="setting-item-info">
    <div class="setting-item-name"></div>
    <div class="setting-item-description">
      <a href="https://momentjs.com/docs/#/displaying/format/"
        >syntax Reference</a
      >
      <div>
        your current syntax looks like this: <b class="u-pop"
          >{window.moment().format(value || DEFAULT_SETTINGS.eveningFileFormat )}
        </b>
      </div>
    </div>
    {#if error}
      <div class="has-error">{error}</div>
    {/if}
  </div>
  <div class="setting-item-control">
    <input
      bind:value={settings.eveningFileFormat}
      bind:this={inputEl}
      class:has-error={!!error}
      type="text"
      spellcheck={false}
      placeholder={DEFAULT_SETTINGS.eveningFileFormat}
      on:change={onChange}
      on:input={clearError}
    />
  </div>
</div>

<style>
  .alert-warning {
    color: var(--text-muted);
    font-size: 80%;
    margin-top: 0.6em;
  }
  .setting-item-control input {
    flex-grow: 1;
  }
</style>
