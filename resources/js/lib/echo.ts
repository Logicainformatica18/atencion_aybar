import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const host = import.meta.env.VITE_REVERB_HOST;
const port = Number(import.meta.env.VITE_REVERB_PORT);
const scheme = import.meta.env.VITE_REVERB_SCHEME;

console.log('🌐 Echo config:', { host, port, scheme });

const echoInstance = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  cluster: 'mt1',
  wsHost: host,
  wsPort: port,
  wssPort: port,
  forceTLS: true,
  encrypted: true,
  disableStats: true,
  enabledTransports: ['wss'],
});


window.Echo = echoInstance;

export default echoInstance;
