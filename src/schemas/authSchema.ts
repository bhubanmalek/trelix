import type { LoginFormData } from "@/types/auth";
import * as yup from "yup";

export const emailSchema = yup
  .string()
  .required("Email is required")
  .email("Please enter a valid email address")
  .min(5, "Email must be at least 5 characters")
  .max(100, "Email must not exceed 100 characters");

export const passwordSchema = yup
  .string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password must not exceed 50 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const loginSchema: yup.ObjectSchema<LoginFormData> = yup.object({
  email: emailSchema,
  password: passwordSchema,
});
