<script lang="ts">
  import type { App } from "obsidian";
  import { onMount } from "svelte";
  import { validateFolder } from "../../validation";
	import type {Readable, Writable} from "svelte/store";
	import {FolderSuggest} from "../../file-suggest";
	import type {IStoicInObsidianSettings} from "../../index";

	export let app: App;
	export let settings: Writable<IStoicInObsidianSettings>;

  let inputEl: HTMLInputElement;
  let error: string;

  function onChange() {
    error = validateFolder(app, inputEl.value);
  }

  function clearError() {
    error = "";
  }

  onMount(() => {
    error = validateFolder(app, inputEl.value);
    new FolderSuggest(app, inputEl);
  });
</script>

<div class="setting-item">
  <div class="setting-item-info">
    <div class="setting-item-name">folder path</div>
    <div class="setting-item-description">
			new reflections will be placed here. if insights are enabled, SiO will look in this folder for your notes
    </div>
    {#if error}
      <div class="has-error">{error}</div>
    {/if}
  </div>
  <div class="setting-item-control">
    <input
      bind:value={settings.eveningNoteFolderPath}
      bind:this={inputEl}
      class:has-error={!!error}
      type="text"
      spellcheck={false}
      placeholder="e.g. folder 1/folder 2"
      on:change={onChange}
      on:input={clearError}
    />
  </div>
</div>

<style>
  .setting-item-control input {
    flex-grow: 1;
  }
</style>
