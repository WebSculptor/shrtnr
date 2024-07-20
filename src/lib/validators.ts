import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email address is required to sign in." })
    .min(2, {
      message: "Email must contain at least 2 character(s)",
    })
    .max(50),
  password: z
    .string({ required_error: "Password is required to sign in." })
    .min(6, {
      message: "Password must contain at least 6 character(s)",
    })
    .max(50),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must contain at least 2 character(s)",
    })
    .max(50)
    .optional(),
  email: z
    .string({ required_error: "Email address is required to sign in." })
    .min(2, {
      message: "Email must contain at least 2 character(s)",
    })
    .max(50),
  password: z
    .string({ required_error: "Password is required to sign in." })
    .min(6, {
      message: "Password must contain at least 6 character(s)",
    })
    .max(50),
});

export const createLinkSchema = z.object({
  title: z
    .string({ required_error: "Title is required to create shrt url." })
    .min(2, {
      message: "Title must contain at least 2 character(s)",
    })
    .max(32),
  longUrl: z
    .string()
    .min(4, {
      message: "Url must contain at least 4 character(s)",
    })
    .max(50),
  customUrl: z
    .string()
    .max(10, {
      message: "Custom url must contain at most 10 character(s)",
    })
    .optional(),
  userId: z.string(),
});
