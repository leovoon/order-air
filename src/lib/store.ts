import { persisted } from "svelte-persisted-store";

export const dialogOpen = persisted("dialogOpen", false);
export const drawerOpen = persisted("drawerOpen", false);
