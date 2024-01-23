declare namespace svelteHTML {
  // enhance attributes
  interface HTMLAttributes<T> {
    "on:longpress"?: (event: CustomEvent) => void;
  }
}
