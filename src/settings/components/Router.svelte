<script lang="ts">
  import type { App } from "obsidian";
	import { slide } from "svelte/transition";

  import { onDestroy, onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
	import type { IStoicInObsidianSettings} from "..";
	import Arrow from "./Arrow.svelte";
	import NoteFolderSetting from "./NoteFolderSetting.svelte";
	import EmotionQuestionToggle from "./EmotionQuestionToggle.svelte";

	let errorMsg = "";
	let isMorningExpanded = false;
	let isEveningExpanded = false;

	export let app: App;
  export let settings: Writable<IStoicInObsidianSettings>;

	function toggleMorningExpand() {
		isMorningExpanded = !isMorningExpanded;
	}

	function toggleEveningExpand() {
		isEveningExpanded = !isEveningExpanded;
	}
</script>

<div class="calendarset-titlebar">
	<div
		class="calendarset-title">stoic in obsidian</div>
</div>
{#if errorMsg}
	<div class="calendarset-error">{errorMsg}</div>
{/if}

<div class="calendarset-groups">
	<div class="periodic-group">
		<div
			class="setting-item setting-item-heading periodic-group-heading"
			on:click={toggleEveningExpand}
		>
			<div class="setting-item-info">
				<h3 class="setting-item-name periodic-group-title">
					<Arrow />
					evening reflections
				</h3>
			</div>
			<div class="setting-item-control">
				<label
					class="checkbox-container"
					class:is-enabled={settings.eveningReflectionEnabled}
					on:click|stopPropagation
				>
					<input
						type="checkbox"
						bind:checked={settings.eveningReflectionEnabled}
						style="display: none;"
					/>
				</label>
			</div>
		</div>
		{#if isEveningExpanded}
			<div
				class="periodic-group-content"
				in:slide|local={{ duration: 300 }}
				out:slide|local={{ duration: 300 }}
			>
<!--				<NoteFormatSetting {config} {granularity} />-->
						<NoteFolderSetting {app} {settings} />
<!--				<NoteTemplateSetting {app} {config} {granularity} />-->
				<EmotionQuestionToggle {app} {settings} />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.calendarset-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
		padding-bottom: 1.4em;
	}

	.calendarset-title {
		font-size: 1.6em;
		min-width: 100px;
	}

	.calendarset-titlebar {
		align-items: center;
		display: flex;
		justify-content: space-between;
		margin-top: 12px;
	}

	.calendarset-title {
		font-size: 1.6em;
		min-width: 100px;
	}

	.calendarset-error {
		color: var(--text-error);
	}

	.calendarset-groups {
		margin-top: 2em;
	}

	.calendarset-toolbar {
		align-items: center;
		display: flex;
		gap: 8px;

		.view-action {
			padding: 2px;
		}
	}


	.section-title {
		margin: 0;
	}

	.section-nav {
		align-items: center;
		display: flex;
		justify-content: space-between;
		margin: 2em 0 0.8em;
	}

	.periodic-group-title {
		display: flex;
	}

	.badge {
		font-style: italic;
		margin-left: 1em;
		color: var(--text-muted);
		font-weight: 500;
		font-size: 70%;
	}

	.periodic-group {
		background: var(--background-primary-alt);
		border: 1px solid var(--background-modifier-border);
		border-radius: 16px;

		&:not(:last-of-type) {
			margin-bottom: 24px;
		}
	}

	.periodic-group-heading {
		cursor: pointer;
		padding: 24px;

		h3 {
			font-size: 1.1em;
			margin: 0;
		}
	}

	.periodic-group-content {
		padding: 24px;
	}
</style>
