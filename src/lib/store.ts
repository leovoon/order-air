import { persisted } from "svelte-persisted-store";

export const open = persisted("open", false);
