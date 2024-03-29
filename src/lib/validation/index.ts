import * as z from "zod";

export const signupValidation = z.object({
  name: z.string().min(2, { message: "Too short" }),
  username: z.string().min(2, { message: "Too short" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Must be at least 8 characters." }),
});

export const signinValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Must be at least 8 characters." }),
});
