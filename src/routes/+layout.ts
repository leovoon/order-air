import { superValidate } from "sveltekit-superforms/client";
import { formSchema } from "../lib/schema";
export const load = async () => {
  return {
    form: await superValidate(formSchema),
  };
};
