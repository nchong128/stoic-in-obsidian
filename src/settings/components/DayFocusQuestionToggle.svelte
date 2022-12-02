<script lang="ts">
  import type { Writable } from "svelte/store";
	import type { IStoicInObsidianSettings }  from "../index";
	import {App} from "obsidian";
	import Toggle from "./Toggle.svelte";
	import SettingItem from "./SettingItem.svelte";

	export let app: App;
  export let settings: Writable<IStoicInObsidianSettings>;
</script>

<SettingItem
  name="show day focus questions"
  type="toggle"
  isHeading={false}
>
  <Toggle
    slot="control"
    isEnabled={settings.morningShowDayFocusQuestions}
		onChange={(val) => {
      settings.morningShowDayFocusQuestions = val;
    }}
  />
</SettingItem>
