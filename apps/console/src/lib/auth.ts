const TOKEN_KEY = 'jwt';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
};

export const requireToken = () => {
  const token = getToken();
  if (!token) {
    window.location.href = '/login';
  }
};
