/**
 * Utility to keep the Render/Railway backend alive.
 * Most free tiers spin-down after 15 mins of inactivity.
 * This pinger runs every 14 mins to ensure the "Cold Start" is avoided.
 */

import { BASE_URL } from './apiClient';

let pingerInterval = null;

export const startKeepAlivePinger = () => {
  if (pingerInterval) return;

  console.log('🚀 Démarrage du Keep-Alive Pinger (toutes les 14 min)');
  
  // First ping immediately
  pingServer();

  // Then every 14 minutes (840,000 ms)
  pingerInterval = setInterval(pingServer, 14 * 60 * 1000);
};

const pingServer = async () => {
  try {
    const start = Date.now();
    // We ping the root of the API or a health check endpoint
    const response = await fetch(`${BASE_URL}/health`);
    const end = Date.now();
    
    if (response.ok) {
      console.log(`✅ Server is awake. Ping: ${end - start}ms`);
    } else {
      // If /health doesn't exist, we try the root
      await fetch(BASE_URL.replace('/api', ''));
      console.log('✅ Server pinged (fallback root)');
    }
  } catch (error) {
    console.warn('⚠️ Keep-alive ping failed (offline or server starting up?)', error.message);
  }
};

export const stopKeepAlivePinger = () => {
  if (pingerInterval) {
    clearInterval(pingerInterval);
    pingerInterval = null;
  }
};
