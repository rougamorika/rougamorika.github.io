/**
 * IndexedDB utility for music player
 * Stores file handles, playlists, and music metadata
 */

const DB_NAME = 'MusicPlayerDB';
const DB_VERSION = 1;

interface StoredFolder {
  id: string;
  name: string;
  handle: FileSystemDirectoryHandle;
  addedAt: number;
}

interface StoredTrack {
  id: string;
  title: string;
  artist?: string;
  fileHandle?: FileSystemFileHandle;
  url?: string;
  source: 'local' | 'url';
  addedAt: number;
}

interface StoredPlaylist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
  updatedAt: number;
}

class MusicDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Folders store
        if (!db.objectStoreNames.contains('folders')) {
          db.createObjectStore('folders', { keyPath: 'id' });
        }

        // Tracks store
        if (!db.objectStoreNames.contains('tracks')) {
          const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
          trackStore.createIndex('source', 'source', { unique: false });
        }

        // Playlists store
        if (!db.objectStoreNames.contains('playlists')) {
          db.createObjectStore('playlists', { keyPath: 'id' });
        }
      };
    });
  }

  // Folder operations
  async addFolder(name: string, handle: FileSystemDirectoryHandle): Promise<string> {
    if (!this.db) await this.init();

    const id = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const folder: StoredFolder = {
      id,
      name,
      handle,
      addedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['folders'], 'readwrite');
      const store = transaction.objectStore('folders');
      const request = store.add(folder);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getFolders(): Promise<StoredFolder[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['folders'], 'readonly');
      const store = transaction.objectStore('folders');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeFolder(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['folders'], 'readwrite');
      const store = transaction.objectStore('folders');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Track operations
  async addTrack(track: Omit<StoredTrack, 'id' | 'addedAt'>): Promise<string> {
    if (!this.db) await this.init();

    const id = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const storedTrack: StoredTrack = {
      ...track,
      id,
      addedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tracks'], 'readwrite');
      const store = transaction.objectStore('tracks');
      const request = store.add(storedTrack);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getTracks(): Promise<StoredTrack[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tracks'], 'readonly');
      const store = transaction.objectStore('tracks');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeTrack(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tracks'], 'readwrite');
      const store = transaction.objectStore('tracks');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearTracks(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tracks'], 'readwrite');
      const store = transaction.objectStore('tracks');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Playlist operations
  async addPlaylist(name: string, trackIds: string[] = []): Promise<string> {
    if (!this.db) await this.init();

    const id = `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const playlist: StoredPlaylist = {
      id,
      name,
      trackIds,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['playlists'], 'readwrite');
      const store = transaction.objectStore('playlists');
      const request = store.add(playlist);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getPlaylists(): Promise<StoredPlaylist[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['playlists'], 'readonly');
      const store = transaction.objectStore('playlists');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updatePlaylist(id: string, trackIds: string[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['playlists'], 'readwrite');
      const store = transaction.objectStore('playlists');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const playlist = getRequest.result;
        if (playlist) {
          playlist.trackIds = trackIds;
          playlist.updatedAt = Date.now();
          const updateRequest = store.put(playlist);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Playlist not found'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async removePlaylist(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['playlists'], 'readwrite');
      const store = transaction.objectStore('playlists');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const musicDB = new MusicDatabase();
export type { StoredFolder, StoredTrack, StoredPlaylist };
