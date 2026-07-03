import axios from 'axios';

declare global {
  interface Window {
    axios: typeof axios;
  }
}

window.axios = axios;

// Cette ligne est vitale pour que Laravel accepte tes requêtes AJAX/Inertia
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
