import { LocalStorage } from 'quasar';
import { defineBoot } from '#q-app/wrappers';
import axios, { AxiosHeaders, type AxiosInstance, type AxiosError } from 'axios';
import { type Router } from 'vue-router';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const baseURL = process.env.DEV ? process.env.BASE_URL : process.env.BASE_URL_PROD;
const api = axios.create({ baseURL: baseURL || 'http://192.168.0.109:3001/api' });

let router: Router;

async function handleUnauthorizedLogoutAndRedirectToLogin(
  error: AxiosError,
  r: Router,
): Promise<void> {
  if (error.response && error.response.status === 401) {
    LocalStorage.remove('jwt');
    await r.replace({ name: 'login' });
  }
}

export default defineBoot(({ app, router: r }) => {
  router = r;

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

// Interceptor de Petición (normaliza headers antes de adjuntar credenciales)
api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = new AxiosHeaders();
  const headers =
    config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers);

  const jwt = LocalStorage.getItem<string>('jwt');
  const sanitizedJwt = typeof jwt === 'string' && jwt && jwt !== 'undefined' ? jwt : null;
  if (sanitizedJwt) {
    headers.set('Authorization', `Bearer ${sanitizedJwt}`);
  } else {
    headers.delete('Authorization');
  }

  const apiKey = LocalStorage.getItem<string>('apiKey');
  const sanitizedApiKey =
    typeof apiKey === 'string' && apiKey && apiKey !== 'undefined' ? apiKey : null;
  if (sanitizedApiKey) {
    headers.set('x-apikey', sanitizedApiKey);
  } else {
    headers.delete('x-apikey');
  }

  config.headers = headers;
  return config;
});

// Interceptor de Respuesta (con la nueva lógica)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (router) await handleUnauthorizedLogoutAndRedirectToLogin(error, router);
    return Promise.reject(error);
  },
);

export { api };
