import { create } from 'zustand';

const AUTH_KEY = 'coinpremier_auth';

function readStorage(storage) {
  try {
    const raw = storage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function readPersistedAuth() {
  return readStorage(localStorage) || readStorage(sessionStorage);
}

function clearPersistedAuth() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}

const persistedAuth = readPersistedAuth();

const useAuthStore = create((set) => ({
  usuario: persistedAuth?.usuario || null,
  token: persistedAuth?.token || null,
  isAuthenticated: Boolean(persistedAuth?.token),

  setAuth({ usuario, token, lembrar }) {
    const storage = lembrar ? localStorage : sessionStorage;
    clearPersistedAuth();
    storage.setItem(AUTH_KEY, JSON.stringify({ usuario, token }));
    set({ usuario, token, isAuthenticated: true });
  },

  hydrateFromStorage() {
    const stored = readPersistedAuth();
    set({
      usuario: stored?.usuario || null,
      token: stored?.token || null,
      isAuthenticated: Boolean(stored?.token),
    });
  },

  logout() {
    clearPersistedAuth();
    set({ usuario: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
