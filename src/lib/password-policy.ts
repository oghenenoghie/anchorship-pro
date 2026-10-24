// Shared by the server schema and the form. bcrypt only reads the first 72 bytes of a password, so longer ones are
// refused rather than silently cut short.
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_BYTES = 72;
