/**
 * Map Clerk error codes to user-friendly messages
 */
export const mapClerkError = (error: any): string => {
  if (!error) return "An error occurred. Please try again.";

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle Clerk's standard error format (errors array)
  const clerkErrors = error.errors || (Array.isArray(error) ? error : null);
  if (clerkErrors && Array.isArray(clerkErrors) && clerkErrors.length > 0) {
    const firstError = clerkErrors[0];
    
    // Check for specific codes
    if (firstError.code) {
      switch (firstError.code) {
        case "form_password_pwned":
          return "This password is not secure. Please choose a different password.";
        case "form_param_format_invalid":
          return "Invalid format. Please check your input.";
        case "form_identifier_not_found":
          return "Email not found. Please check and try again or create an account.";
        case "form_password_incorrect":
          return "Incorrect password. Please try again.";
        case "form_identifier_exists":
          return "This email is already in use. Please sign in or use a different email.";
        case "identification_exists":
          return "This email is already registered. Please sign in or use a different email.";
        case "form_code_incorrect":
          return "Invalid verification code. Please check and try again.";
        case "verification_expired":
          return "Verification code expired. Please request a new one.";
        case "not_allowed_access":
          return "Access denied. Please check your credentials.";
        case "client_id_invalid":
          return "Configuration error. Please contact support.";
        case "form_identifier_invalid_length":
          return "Email is too long. Please use a shorter email.";
      }
    }
    
    if (firstError.message) {
      return firstError.message;
    }
  }

  // Handle error objects with code property (legacy or fallback)
  if (error.code) {
    // ... same switch logic could be here, but we covered it above
  }

  // Handle message property
  if (error.message) {
    return error.message;
  }

  // Fallback
  return "An error occurred. Please try again.";
};

/**
 * Extract field-specific errors from Clerk response
 */
export const getFieldError = (
  error: any,
  fieldName: string,
): string | undefined => {
  if (!error) return undefined;

  // Handle Clerk's standard error format
  const clerkErrors = error.errors || (Array.isArray(error) ? error : null);
  if (clerkErrors && Array.isArray(clerkErrors)) {
    const fieldError = clerkErrors.find(
      (err: any) => 
        err.meta?.paramName === fieldName || 
        err.meta?.param_name === fieldName ||
        err.code?.includes(fieldName)
    );
    if (fieldError) {
      return fieldError.message;
    }
  }

  // Handle errors.fields pattern (legacy)
  if (error.fields && error.fields[fieldName]) {
    return error.fields[fieldName].message;
  }

  return undefined;
};

/**
 * Network/system error mapping
 */
export const mapNetworkError = (error: any): string => {
  if (!error)
    return "An error occurred. Please check your connection and try again.";

  const message = error.message || "";
  if (message.toLowerCase().includes("network")) {
    return "Network error. Please check your connection and try again.";
  }

  if (message.toLowerCase().includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  return "An error occurred. Please try again.";
};

