import { writable } from "svelte/store";
import type StoicInObsidianPlugin from "./main";

const plugin = writable<StoicInObsidianPlugin>();

export default { plugin };
