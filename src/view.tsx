import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { AppContext } from "./context";

const VIEW_TYPE_EXAMPLE = "example-view";

class ExampleView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		const root = createRoot(this.containerEl.children[1]);
		root.render(
			<AppContext.Provider value={this.app}>

			</AppContext.Provider>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
