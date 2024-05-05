import { checkCapacity } from './utils/index.js';

/**
 * Creates a new web-based database using IndexedDB (i.e Web DB).
 *
 * @param {Object} [config] - The config for configuring the database.
 * @param {string} [config.name='default'] - The name of the database.
 * @param {number} [config.version=1] - The version of the database.
 * @param {number} [config.minCapacity=1024] - The minimum capacity you want for the database in mega bytes (MB). Defaults to 1024 MB (1 GB).
 * @param {Object[]} [config.stores=[]] - An array of object stores
 *
 * Where Each store can have the following:
 *
 * @param {string} store.topic - The name of the object store.
 * @param {string} [store.keyPath='id'] - The key path for the object store.
 * @param {boolean} [store.autoIncrement=true] - Whether the key should auto-increment.
 * @returns {Promise<object>} - when the database is connected successfully it returns an object containing methods for interacting with the database such as `create`, `read`, `update` and `delete`.
 */

export function createDatabase({
  name = 'default',
  version = 1,
  stores = [],
  minCapacity = 1024,
  onSuccess = null,
  onError = null,
}) {
  const dbName = name;
  const dbVersion = version;
  const objectStores = stores;
  const onsuccessCallback = onSuccess;
  const onErrorCallback = onError;

  const connection = async () => {
    let db = null;
    let isConnected = false;

    if (!('indexedDB' in window)) {
      console.error(
        'Your browser does not support IndexedDB, please update your browser!'
      );
      return;
    }
    // verify db capacity
    let check = await checkCapacity(minCapacity);
    if (!check.isCapable) {
      throw new Error(
        `Web storage doesn't have enough space, Requested: ${check.requested}, Capacity: ${check.capacity}, Used: ${check.used}`
      );
    }

    const createStores = async (db) => {
      if (objectStores.length === 0) {
        console.warn('No object stores found!');
        return;
      }
      objectStores?.forEach((storeConfig) => {
        const { topic, keyPath, ...options } = storeConfig;
        const store = db.createObjectStore(
          topic,
          keyPath || { keyPath: 'id', autoIncrement: true }
        );
        console.log('store::', store, ...options);
      });
    };

    // we attempt to open DB instance
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event) => {
      let createdDbInfo = event.target.result;
      isConnected = true;
      // db = request.transaction.db;
      // createStores(db);
      onsuccessCallback && onsuccessCallback(createdDbInfo);
    };

    request.onerror = (event) => {
      isConnected = false;
      onErrorCallback && onErrorCallback(event.target.error);
    };

    // Upgrade logic if needed (based on dbVersion changes)
    request.onupgradeneeded = (event) => {
      let createdDbInfo = event.target.result;
      // createStores(db);
    };

    return db;
  };

  const create = async (topic, data) => {
    const db = await connection();
    const transaction = db.transaction([topic], 'readwrite');
    const store = transaction.objectStore(topic);
    return new Promise((resolve, reject) => {
      // Omit id property to leverage auto-increment
      const request = store.add({ ...data });
      request.onsuccess = (event) => {
        resolve({ data: event.target.result, error: null });
      };
      request.onerror = (event) => {
        reject({ error: event.target.error, data: null });
      };
    });
  };

  const read = async (topic, key) => {
    const db = await connection();
    const transaction = db.transaction([topic], 'readonly');
    const store = transaction.objectStore(topic);
    return new Promise((resolve, reject) => {
      const request = key ? store.get(key) : store.getAll();
      request.onsuccess = (event) => {
        resolve({ data: event.target.result, error: null });
      };
      request.onerror = (event) => {
        reject({ error: event.target.error, data: null });
      };
    });
  };

  const update = async (topic, data) => {
    const db = await connection();
    const transaction = db.transaction([topic], 'readwrite');
    const store = transaction.objectStore(topic);
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = (event) => {
        resolve({ data: event.target.result, error: null });
      };
      request.onerror = (event) => {
        reject({ error: event.target.error, data: null });
      };
    });
  };

  const deleteItem = async (topic, key) => {
    const db = await connection();
    const transaction = db.transaction([topic], 'readwrite');
    const store = transaction.objectStore(topic);
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = (event) => {
        resolve({ data: event.target.result, error: null });
      };
      request.onerror = (event) => {
        reject({ error: event.target.error, data: null });
      };
    });
  };

  return { create, read, update, delete: deleteItem };
}
