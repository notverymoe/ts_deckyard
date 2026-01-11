// // Copyright 2026 Natalie Baker // AGPLv3 // //

/**
 * Attempts to format an untyped error as a user debug string.
 * - If the error is an instance of Error, then it will be
 *   formated with the name and message.
 * - If the error is not an object or a function, or is null,
 *   then it will be displayed as a raw value.
 * - Otherwise an unknown error string will be returned.
 */
export function formatError(error: unknown): String {
    if (error instanceof Error) {
        return `<${error.name} - ${error.message}>`;
    } else if ((error == null) || ((typeof error != "object") &&  (typeof error != "function"))) {
        return `<Raw - ${error}>`;
    } else {
        return `<Unknown Error>`
    }
}
