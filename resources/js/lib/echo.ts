import Echo from 'laravel-echo';

const echoInstance = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: parseInt(import.meta.env.VITE_REVERB_PORT || '443'),
  wssPort: parseInt(import.meta.env.VITE_REVERB_PORT || '443'),
  forceTLS: true,
  encrypted: true,
  // disableStats: true, (si usabas Pusher)
});

export default echoInstance;
