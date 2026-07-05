// export const AUTH_COOKIE_NAME = 'quickcheck-auth'

// export function setAuthSessionCookie() {
//   if (typeof document === 'undefined') return

//   document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=604800; SameSite=Lax`
// }

// export function clearAuthSessionCookie() {
//   if (typeof document === 'undefined') return

//   document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
// }

export function setAuthSessionCookie() {
  document.cookie =
    "quickcheck-auth=true; path=/; max-age=86400; SameSite=Lax";
}

export function clearAuthSessionCookie() {
  document.cookie =
    "quickcheck-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}