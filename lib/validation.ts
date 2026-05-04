/**
 * Email validation - RFC 5322 simplified pattern
 */
export const validateEmail = (
  email: string,
): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true };
};

/**
 * Password strength validation
 * Requirements: 8+ chars, at least one uppercase, one number, one special char
 */
export const validatePassword = (
  password: string,
): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain an uppercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain a number" };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain a special character" };
  }
  return { valid: true };
};

/**
 * Verify two passwords match (for sign-up confirmation)
 */
export const validatePasswordsMatch = (
  password1: string,
  password2: string,
): { valid: boolean; error?: string } => {
  if (password1 !== password2) {
    return { valid: false, error: "Passwords do not match" };
  }
  return { valid: true };
};
