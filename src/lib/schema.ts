import { z } from "zod";

export const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Give a longer name").max(50, "Name too long"),
  photo: z.string().url(),
  audio: z.string().min(6, "Hit that record button to include audio."),
  cold: z.boolean(),
});
export type FormSchema = typeof formSchema;
