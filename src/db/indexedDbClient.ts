/**
 * Cliente Nativo IndexedDB — PulseFlow (src/db/indexedDbClient.ts)
 * Encapsula a abertura do banco 'pulseflow_db' (versão 1), criação das 6 stores
 * e helpers baseados em Promises para transações seguras.
 */

export const DB_NAME = 'pulseflow_db';
export const DB_VERSION = 1;

// Nomes literais das object stores definidas na arquitetura do MVP 1.0
export type StoreName =
  | 'entries'
  | 'activityGroups'
  | 'activities'
  | 'goals'
  | 'regulationSessions'
  | 'settings';

let dbPromise: Promise<IDBDatabase> | null = null;

// Abre (ou reutiliza) a conexão única com o IndexedDB e cria os índices no upgrade
export function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Configura schema inicial na criação do banco local
    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('entries')) {
        const entriesStore = db.createObjectStore('entries', { keyPath: 'id' });
        entriesStore.createIndex('by_dateKey', 'dateKey', { unique: false });
        entriesStore.createIndex('by_timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains('activityGroups')) {
        const groupsStore = db.createObjectStore('activityGroups', { keyPath: 'id' });
        groupsStore.createIndex('by_order', 'order', { unique: false });
      }

      if (!db.objectStoreNames.contains('activities')) {
        const activitiesStore = db.createObjectStore('activities', { keyPath: 'id' });
        activitiesStore.createIndex('by_groupId', 'groupId', { unique: false });
      }

      if (!db.objectStoreNames.contains('goals')) {
        const goalsStore = db.createObjectStore('goals', { keyPath: 'id' });
        goalsStore.createIndex('by_activityId', 'activityId', { unique: false });
      }

      if (!db.objectStoreNames.contains('regulationSessions')) {
        const regStore = db.createObjectStore('regulationSessions', { keyPath: 'id' });
        regStore.createIndex('by_timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error ?? new Error('Falha ao abrir banco IndexedDB.'));
    };
  });

  return dbPromise;
}

// Fecha e apaga o banco local (utilizado para isolamento entre testes automatizados)
export async function resetDatabase(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}

// Executa uma operação em transação de leitura ou escrita em uma store específica
export async function withStore<T>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  executor: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = executor(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Lê todos os registros de uma object store
export function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  return withStore<T[]>(storeName, 'readonly', (store) => store.getAll());
}

// Lê um único registro pela chave primária
export function getByIdFromStore<T>(storeName: StoreName, id: string): Promise<T | undefined> {
  return withStore<T | undefined>(storeName, 'readonly', (store) => store.get(id));
}

// Insere ou atualiza um registro na object store
export async function putInStore<T>(storeName: StoreName, value: T): Promise<void> {
  await withStore(storeName, 'readwrite', (store) => store.put(value));
}

// Insere ou atualiza múltiplos registros em uma única transação atômica
export async function putManyInStore<T>(storeName: StoreName, values: T[]): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const item of values) {
      store.put(item);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Remove um registro pela chave primária
export async function deleteFromStore(storeName: StoreName, id: string): Promise<void> {
  await withStore(storeName, 'readwrite', (store) => store.delete(id));
}

// Limpa todos os registros de uma object store (útil em restauração de backup)
export async function clearStore(storeName: StoreName): Promise<void> {
  await withStore(storeName, 'readwrite', (store) => store.clear());
}
