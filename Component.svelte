<script lang="ts">
	import type MyPlugin from "./main";
	import store from "./store";
  export let variable: number;
	let plugin: MyPlugin;
	store.plugin.subscribe((p) => (plugin = p));
</script>

<div class="number">
  <span>My number is {variable}!</span>
</div>

<style>
  .number {
    color: red;
  }
</style>
