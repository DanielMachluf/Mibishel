/**
 * Returns an Axios request config object with the Authorization header
 * populated from the JWT token stored in localStorage.
 *
 * Used by every authenticated API call so the token handling
 * lives in one place instead of being repeated per service method.
 */
export function createAuthConfig() {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token ?? ""}`
        }
    };
}
