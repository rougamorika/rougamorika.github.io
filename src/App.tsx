import { useEffect } from 'react';
import { Header } from '@components/layout/Header';
import { LeftSidebar } from '@components/layout/LeftSidebar';
import { RightSidebar } from '@components/layout/RightSidebar';
import { MainContent } from '@components/layout/MainContent';
import { SplashScreen } from '@components/common/SplashScreen';
import { SettingsPanel } from '@components/common/SettingsPanel';
import { MusicPlayer } from '@components/common/MusicPlayer';
import { useUIStore } from '@store/uiStore';
import { useCodeThemeStore } from '@store/codeThemeStore';
import { useMusicStore } from '@store/musicStore';
import { useAuthStore } from '@store/authStore';
import { loadCodeTheme } from '@utils/codeThemeLoader';
import type { Playlist } from '@types/music';
import '@styles/globals.css';
import '@styles/anime-theme.css';

function App() {
  const { isLeftSidebarOpen, isRightSidebarOpen } = useUIStore();
  const { currentTheme } = useCodeThemeStore();
  const { setTracks } = useMusicStore();
  const { verifyToken } = useAuthStore();

  // Verify authentication token on mount (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      verifyToken();
    }
  }, [verifyToken]);

  // Load code theme on mount and when theme changes
  useEffect(() => {
    loadCodeTheme(currentTheme);
  }, [currentTheme]);

  // Load playlist and tracks from IndexedDB on mount
  useEffect(() => {
    const loadMusic = async () => {
      try {
        // Try to load BGM playlist first (auto-play background music)
        const bgmResponse = await fetch('/BGM/playlist.json');
        if (bgmResponse.ok) {
          const bgmPlaylist: Playlist = await bgmResponse.json();
          setTracks(bgmPlaylist.tracks);

          // Try to auto-play BGM with loop enabled
          useMusicStore.setState({
            currentTrackIndex: 0,
            isPlaying: true,
            loop: true
          });

          console.log('BGM loaded and attempting auto-play');

          // Handle browser autoplay restrictions
          // If autoplay is blocked, play on first user interaction
          const handleFirstInteraction = () => {
            const { isPlaying, tracks } = useMusicStore.getState();
            if (!isPlaying && tracks.length > 0) {
              useMusicStore.setState({ isPlaying: true });
              console.log('BGM started playing after user interaction');
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
          };

          // Add event listeners for first user interaction
          document.addEventListener('click', handleFirstInteraction);
          document.addEventListener('keydown', handleFirstInteraction);
          document.addEventListener('touchstart', handleFirstInteraction);

          return;
        }

        // Fallback: Try to load from IndexedDB
        await useMusicStore.getState().loadTracksFromDB();

        // Also load folders
        const folders = await (await import('@utils/musicDatabase')).musicDB.getFolders();
        useMusicStore.setState({ folders });

        // Fallback: load from playlist.json if no tracks in DB
        const tracks = useMusicStore.getState().tracks;
        if (tracks.length === 0) {
          const response = await fetch('/music/playlist.json');
          if (response.ok) {
            const playlist: Playlist = await response.json();
            setTracks(playlist.tracks);
          }
        }
      } catch (error) {
        console.error('Failed to load music:', error);
      }
    };

    loadMusic();
  }, [setTracks]);

  return (
    <div className="min-h-screen">
      {/* Splash Screen - Full screen opening animation */}
      <SplashScreen />

      {/* Main Blog Content - Appears below splash screen */}
      <div className="min-h-screen anime-bg-pattern">
        {/* Header */}
        <Header />

        {/* Main Layout - 3 Column Grid */}
        <div className="flex">
          {/* Left Sidebar - Navigation Tree */}
          <div
            className={`
              transition-all duration-300 ease-in-out
              ${isLeftSidebarOpen ? 'w-64' : 'w-0'}
              hidden md:block
            `}
          >
            <LeftSidebar />
          </div>

          {/* Mobile Left Sidebar Overlay */}
          <div
            className={`
              fixed inset-0 z-50 md:hidden
              transition-opacity duration-300
              ${isLeftSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => useUIStore.getState().setLeftSidebarOpen(false)}
            />
            <div
              className={`
                absolute left-0 top-0 h-full w-64 bg-bg-card
                transition-transform duration-300
                ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              <LeftSidebar />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <MainContent />
          </div>

          {/* Right Sidebar - Mind Map */}
          <div
            className={`
              transition-all duration-300 ease-in-out
              ${isRightSidebarOpen ? 'w-80' : 'w-0'}
              hidden lg:block
            `}
          >
            <RightSidebar />
          </div>

          {/* Mobile Right Sidebar Overlay */}
          <div
            className={`
              fixed inset-0 z-50 lg:hidden
              transition-opacity duration-300
              ${isRightSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => useUIStore.getState().setRightSidebarOpen(false)}
            />
            <div
              className={`
                absolute right-0 top-0 h-full w-80 bg-bg-card
                transition-transform duration-300
                ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
              `}
            >
              <RightSidebar />
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <SettingsPanel />

        {/* Music Player */}
        <MusicPlayer />
      </div>
    </div>
  );
}

export default App;
