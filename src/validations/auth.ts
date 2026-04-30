export type LoginErrors = { email?: string; password?: string };

export type RegisterFields = {
  firstName: string;
  lastName: string;
  practiceName: string;
  email: string;
  password: string;
};

export type RegisterErrors = Partial<Record<keyof RegisterFields, string>>;

export type ForgotPasswordErrors = { email?: string };

export type ResetPasswordErrors = { password?: string; confirm?: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | undefined {
  if (!value) return "Email is required";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
  return undefined;
}

export function validateLoginForm(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = "Password is required";
  return errors;
}

export function validateRegisterForm(form: RegisterFields): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (!form.lastName.trim()) errors.lastName = "Last name is required";
  if (!form.practiceName.trim()) errors.practiceName = "Practice name is required";
  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;
  if (!form.password) errors.password = "Password is required";
  else if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  return errors;
}

export function validateForgotPasswordEmail(email: string): ForgotPasswordErrors {
  const errors: ForgotPasswordErrors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  return errors;
}

export function validateResetPasswordForm(password: string, confirm: string): ResetPasswordErrors {
  const errors: ResetPasswordErrors = {};
  if (!password) errors.password = "New password is required";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters";
  if (!confirm) errors.confirm = "Please confirm your password";
  else if (confirm !== password) errors.confirm = "Passwords do not match";
  return errors;
}
