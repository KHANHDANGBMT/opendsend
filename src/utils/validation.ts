// Form validation utility functions

/**
 * Validates that an email string is properly formatted
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Ensures a string is not empty
 */
export const isRequired = (value: string): boolean => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * Validates minimum length of a string
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validates maximum length of a string
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validates that a string contains at least one number
 */
export const containsNumber = (value: string): boolean => {
  return /\d/.test(value);
};

/**
 * Validates that a string contains at least one uppercase letter
 */
export const containsUppercase = (value: string): boolean => {
  return /[A-Z]/.test(value);
};

/**
 * Validates that a string contains at least one lowercase letter
 */
export const containsLowercase = (value: string): boolean => {
  return /[a-z]/.test(value);
};

/**
 * Validates that a string contains at least one special character
 */
export const containsSpecialChar = (value: string): boolean => {
  return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
};

/**
 * Validates a password meets common security requirements
 */
export const isStrongPassword = (password: string): boolean => {
  return (
    hasMinLength(password, 8) &&
    containsNumber(password) &&
    containsUppercase(password) &&
    containsLowercase(password) &&
    containsSpecialChar(password)
  );
};

/**
 * Get password strength feedback
 * Returns an array of error messages for password requirements that are not met
 */
export const getPasswordFeedback = (password: string): string[] => {
  const feedback: string[] = [];
  
  if (!hasMinLength(password, 8)) {
    feedback.push('Password must be at least 8 characters long');
  }
  
  if (!containsNumber(password)) {
    feedback.push('Password must contain at least one number');
  }
  
  if (!containsUppercase(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  }
  
  if (!containsLowercase(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  }
  
  if (!containsSpecialChar(password)) {
    feedback.push('Password must contain at least one special character');
  }
  
  return feedback;
}; 