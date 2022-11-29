import { ItemView, WorkspaceLeaf } from "obsidian";
import type StoicInObsidianPlugin from "./main";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactView } from "./ReactView";
import { createRoot } from "react-dom/client";
import { AppContext } from "./context";
import Component from "./Component.svelte";
import store  from "./store";

const VIEW_TYPE_EXAMPLE = "svelte-view";

class SvelteView extends ItemView {
	component : Component;
	plugin : StoicInObsidianPlugin;


	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "This is the Svelte example view";
	}

	async onOpen() {
		store.plugin.set(this.plugin);

		this.component = new Component({
			target: this.contentEl,
			props: {
				variable: 1
			}
		})
	}

	async onClose() {
		this.component.$destroy();
	}
}
