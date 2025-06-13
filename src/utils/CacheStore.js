class CacheStore {
  constructor(cacheName = 'default-cache') {
    this.cacheName = cacheName;
  }

  async set(key, value) {
    try {
      const data = {
        value,
        timestamp: Date.now()
      };
      localStorage.setItem(`${this.cacheName}-${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Cache set failed:', error);
    }
  }

  async setWithTTL(key, value, ttl) {
    try {
      const expiry = Date.now() + ttl;
      const data = {
        value,
        timestamp: Date.now(),
        expiry
      };
      localStorage.setItem(`${this.cacheName}-${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Cache setWithTTL failed:', error);
    }
  }

  async get(key) {
    try {
      const data = localStorage.getItem(`${this.cacheName}-${key}`);
      if (!data) return null;

      const parsedData = JSON.parse(data);
      return parsedData.value;
    } catch (error) {
      console.error('Cache get failed:', error);
      return null;
    }
  }

  async getWithTTL(key) {
    try {
      const data = localStorage.getItem(`${this.cacheName}-${key}`);
      if (!data) return null;

      const parsedData = JSON.parse(data);

      // Check if the data has expired
      if (parsedData.expiry && Date.now() > parsedData.expiry) {
        localStorage.removeItem(`${this.cacheName}-${key}`);
        return null;
      }

      return parsedData.value;
    } catch (error) {
      console.error('Cache getWithTTL failed:', error);
      return null;
    }
  }

  async delete(key) {
    try {
      localStorage.removeItem(`${this.cacheName}-${key}`);
    } catch (error) {
      console.error('Cache delete failed:', error);
    }
  }

  async clear() {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(`${this.cacheName}-`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Cache clear failed:', error);
    }
  }
}

export default CacheStore;
