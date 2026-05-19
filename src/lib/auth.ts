const AUTH_KEY = 'plab-ai-demo-auth-v1';

export function isDemoAuthenticated() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(AUTH_KEY) === 'true';
}

export function signInDemo() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_KEY, 'true');
}

export function signOutDemo() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_KEY);
}
