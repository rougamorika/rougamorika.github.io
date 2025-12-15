import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track } from '@types/music';
import { musicDB, type StoredFolder } from '@utils/musicDatabase';

interface MusicStore {
  // State
  tracks: Track[];
  folders: StoredFolder[];
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isPlaylistOpen: boolean;
  isManagementOpen: boolean;
  loop: boolean;
  shuffle: boolean;
  isLoading: boolean;

  // Actions - Playback
  setTracks: (tracks: Track[]) => void;
  playTrack: (index: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  togglePlaylist: () => void;
  toggleManagement: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;

  // Actions - File Management
  addFolder: () => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  scanFolder: (folderId: string) => Promise<void>;
  addLocalFiles: () => Promise<void>;
  removeTrack: (trackId: string) => Promise<void>;
  loadTracksFromDB: () => Promise<void>;
  refreshAllFolders: () => Promise<void>;

  // Computed
  getCurrentTrack: () => Track | null;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tracks: [],
      folders: [],
      currentTrackIndex: 0,
      isPlaying: false,
      volume: 0.7,
      isMuted: false,
      isPlaylistOpen: false,
      isManagementOpen: false,
      loop: false,
      shuffle: false,
      isLoading: false,

      // Playback Actions
      setTracks: (tracks) => set({ tracks }),

      playTrack: (index) => {
        const { tracks } = get();
        if (index >= 0 && index < tracks.length) {
          set({ currentTrackIndex: index, isPlaying: true });
        }
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      nextTrack: () => {
        const { tracks, currentTrackIndex, shuffle, loop } = get();
        if (tracks.length === 0) return;

        let nextIndex: number;

        if (shuffle) {
          if (tracks.length > 1) {
            do {
              nextIndex = Math.floor(Math.random() * tracks.length);
            } while (nextIndex === currentTrackIndex);
          } else {
            nextIndex = 0;
          }
        } else {
          nextIndex = currentTrackIndex + 1;
          if (nextIndex >= tracks.length) {
            nextIndex = loop ? 0 : tracks.length - 1;
          }
        }

        set({ currentTrackIndex: nextIndex });
      },

      previousTrack: () => {
        const { tracks, currentTrackIndex, loop } = get();
        if (tracks.length === 0) return;

        let prevIndex = currentTrackIndex - 1;
        if (prevIndex < 0) {
          prevIndex = loop ? tracks.length - 1 : 0;
        }

        set({ currentTrackIndex: prevIndex });
      },

      setVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ volume: clampedVolume, isMuted: false });
      },

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      togglePlaylist: () => set((state) => ({ isPlaylistOpen: !state.isPlaylistOpen })),

      toggleManagement: () => set((state) => ({ isManagementOpen: !state.isManagementOpen })),

      toggleLoop: () => set((state) => ({ loop: !state.loop })),

      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

      // File Management Actions
      addFolder: async () => {
        try {
          // Check if File System Access API is supported
          if (!('showDirectoryPicker' in window)) {
            alert('您的浏览器不支持文件夹选择功能。请使用 Chrome 或 Edge 浏览器。');
            return;
          }

          set({ isLoading: true });

          // Show directory picker
          const dirHandle = await (window as any).showDirectoryPicker({
            mode: 'read',
          });

          // Save folder to IndexedDB
          const folderId = await musicDB.addFolder(dirHandle.name, dirHandle);

          // Scan folder for MP3 files
          await get().scanFolder(folderId);

          // Reload folders
          const folders = await musicDB.getFolders();
          set({ folders });

          set({ isLoading: false });
        } catch (error) {
          console.error('Failed to add folder:', error);
          set({ isLoading: false });
          if ((error as Error).name !== 'AbortError') {
            alert('添加文件夹失败: ' + (error as Error).message);
          }
        }
      },

      removeFolder: async (id: string) => {
        try {
          set({ isLoading: true });

          // Remove folder from IndexedDB
          await musicDB.removeFolder(id);

          // Reload folders and tracks
          const folders = await musicDB.getFolders();
          await get().loadTracksFromDB();

          set({ folders, isLoading: false });
        } catch (error) {
          console.error('Failed to remove folder:', error);
          set({ isLoading: false });
          alert('删除文件夹失败: ' + (error as Error).message);
        }
      },

      scanFolder: async (folderId: string) => {
        try {
          const hadNoTracks = get().tracks.length === 0;

          const folders = await musicDB.getFolders();
          const folder = folders.find((f) => f.id === folderId);
          if (!folder) return;

          // Request permission
          const permission = await folder.handle.queryPermission({ mode: 'read' });
          if (permission !== 'granted') {
            const newPermission = await folder.handle.requestPermission({ mode: 'read' });
            if (newPermission !== 'granted') {
              alert('需要文件夹访问权限才能扫描音乐文件');
              return;
            }
          }

          // Scan for MP3 files
          const tracks: Track[] = [];
          for await (const entry of folder.handle.values()) {
            if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.mp3')) {
              const file = await entry.getFile();
              const url = URL.createObjectURL(file);

              // Extract metadata from filename
              const nameWithoutExt = entry.name.replace(/\.mp3$/i, '');
              const parts = nameWithoutExt.split(' - ');
              const title = parts.length > 1 ? parts[1] : nameWithoutExt;
              const artist = parts.length > 1 ? parts[0] : undefined;

              // Add track to IndexedDB
              const trackId = await musicDB.addTrack({
                title,
                artist,
                fileHandle: entry,
                source: 'local',
              });

              tracks.push({
                id: trackId,
                title,
                artist,
                url,
              });
            }
          }

          // Reload all tracks
          await get().loadTracksFromDB();

          // Auto-play if there were no tracks before
          if (hadNoTracks && get().tracks.length > 0) {
            set({ currentTrackIndex: 0, isPlaying: true });
          }
        } catch (error) {
          console.error('Failed to scan folder:', error);
          alert('扫描文件夹失败: ' + (error as Error).message);
        }
      },

      addLocalFiles: async () => {
        try {
          set({ isLoading: true });

          // Create file input
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'audio/mp3,audio/mpeg';
          input.multiple = true;

          input.onchange = async (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (!files) return;

            const hadNoTracks = get().tracks.length === 0;

            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const url = URL.createObjectURL(file);

              // Extract metadata from filename
              const nameWithoutExt = file.name.replace(/\.mp3$/i, '');
              const parts = nameWithoutExt.split(' - ');
              const title = parts.length > 1 ? parts[1] : nameWithoutExt;
              const artist = parts.length > 1 ? parts[0] : undefined;

              // Add track to IndexedDB
              await musicDB.addTrack({
                title,
                artist,
                url,
                source: 'url',
              });
            }

            // Reload tracks
            await get().loadTracksFromDB();

            // Auto-play if there were no tracks before
            if (hadNoTracks && get().tracks.length > 0) {
              set({ currentTrackIndex: 0, isPlaying: true });
            }

            set({ isLoading: false });
          };

          input.click();
        } catch (error) {
          console.error('Failed to add local files:', error);
          set({ isLoading: false });
          alert('添加文件失败: ' + (error as Error).message);
        }
      },

      removeTrack: async (trackId: string) => {
        try {
          await musicDB.removeTrack(trackId);
          await get().loadTracksFromDB();
        } catch (error) {
          console.error('Failed to remove track:', error);
          alert('删除音乐失败: ' + (error as Error).message);
        }
      },

      loadTracksFromDB: async () => {
        try {
          set({ isLoading: true });

          const storedTracks = await musicDB.getTracks();
          const tracks: Track[] = [];

          for (const storedTrack of storedTracks) {
            if (storedTrack.source === 'local' && storedTrack.fileHandle) {
              try {
                // Request permission for file handle
                const permission = await storedTrack.fileHandle.queryPermission({ mode: 'read' });
                if (permission !== 'granted') {
                  await storedTrack.fileHandle.requestPermission({ mode: 'read' });
                }

                const file = await storedTrack.fileHandle.getFile();
                const url = URL.createObjectURL(file);

                tracks.push({
                  id: storedTrack.id,
                  title: storedTrack.title,
                  artist: storedTrack.artist,
                  url,
                });
              } catch (error) {
                console.warn(`Failed to load file for track ${storedTrack.id}:`, error);
                // Skip this track if file is not accessible
              }
            } else if (storedTrack.source === 'url' && storedTrack.url) {
              tracks.push({
                id: storedTrack.id,
                title: storedTrack.title,
                artist: storedTrack.artist,
                url: storedTrack.url,
              });
            }
          }

          set({ tracks, isLoading: false });
        } catch (error) {
          console.error('Failed to load tracks from DB:', error);
          set({ isLoading: false });
        }
      },

      refreshAllFolders: async () => {
        try {
          set({ isLoading: true });

          // Clear all tracks
          await musicDB.clearTracks();

          // Rescan all folders
          const folders = await musicDB.getFolders();
          for (const folder of folders) {
            await get().scanFolder(folder.id);
          }

          set({ isLoading: false });
        } catch (error) {
          console.error('Failed to refresh folders:', error);
          set({ isLoading: false });
          alert('刷新文件夹失败: ' + (error as Error).message);
        }
      },

      // Computed
      getCurrentTrack: () => {
        const { tracks, currentTrackIndex } = get();
        return tracks[currentTrackIndex] || null;
      },
    }),
    {
      name: 'music-player-storage',
      partialize: (state) => ({
        volume: state.volume,
        loop: state.loop,
        shuffle: state.shuffle,
        currentTrackIndex: state.currentTrackIndex,
      }),
    }
  )
);
