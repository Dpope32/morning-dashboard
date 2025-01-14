// src/dashboard/scripts/modules/storage.js
export const storage = {
    get: (key) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Storage error:', error);
      }
    }
  };
  
  // Add a prefix to prevent collisions
  const STORAGE_PREFIX = 'frost_dashboard_';