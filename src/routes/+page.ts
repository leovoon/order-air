import { superValidate } from "sveltekit-superforms/client";
import { formSchema } from "../lib/schema";
export const load = async () => {
  return {
    form: await superValidate(formSchema),
  };
};

// export const actions: Actions = {
//   default: async (event) => {
//     const form = await superValidate(event, formSchema);
//     if (!form.valid) {
//       return fail(400, {
//         form
//       });
//     }
//     return {
//       form
//     };
//   }
// };
