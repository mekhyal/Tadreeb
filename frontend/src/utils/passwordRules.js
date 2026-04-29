/** Must match backend `validators.js` isStrongPassword + PASSWORD_POLICY_MESSAGE. */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 24;

export const PASSWORD_REQUIREMENTS_MESSAGE = `Password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.`;

export function isPasswordStrong(password) {
  if (typeof password !== "string") return false;
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    return false;
  }
  return (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
