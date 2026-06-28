import { useState, useEffect, useRef } from 'react';
import ReactHowler from 'react-howler';
import { useMusicStore } from '@store/musicStore';

export function MusicPlayer() {
  const {
    isPlaying,
    volume,
    isMuted,
    loop,
    shuffle,
    isPlaylistOpen,
    isManagementOpen,
    isLoading,
    folders,
    getCurrentTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    togglePlaylist,
    toggleManagement,
    toggleLoop,
    toggleShuffle,
    tracks,
    currentTrackIndex,
    playTrack,
    addFolder,
    removeFolder,
    addLocalFiles,
    removeTrack,
    refreshAllFolders,
  } = useMusicStore();

  const currentTrack = getCurrentTrack();
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const playerRef = useRef<any>(null);

  // Update seek position from actual player
  useEffect(() => {
    if (!isPlaying || !playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentSeek = playerRef.current.seek();
        setSeek(typeof currentSeek === 'number' ? currentSeek : 0);

        const currentDuration = playerRef.current.duration();
        if (currentDuration && currentDuration !== duration) {
          setDuration(currentDuration);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Reset seek when track changes
  useEffect(() => {
    setSeek(0);
    setDuration(0);
  }, [currentTrackIndex]);

  const handleLoad = () => {
    if (playerRef.current) {
      const trackDuration = playerRef.current.duration();
      if (trackDuration) {
        setDuration(trackDuration);
      }
    }
  };

  const handleEnd = () => {
    if (loop) {
      setSeek(0);
    } else {
      nextTrack();
      setSeek(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeek = parseFloat(e.target.value);
    setSeek(newSeek);

    if (playerRef.current) {
      playerRef.current.seek(newSeek);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* React Howler Audio Player */}
      {currentTrack && (
        <ReactHowler
          ref={playerRef}
          src={currentTrack.url}
          playing={isPlaying}
          volume={isMuted ? 0 : volume}
          loop={loop && tracks.length === 1}
          onEnd={handleEnd}
          onLoad={handleLoad}
          html5={true}
          format={['mp3', 'ogg', 'wav']}
        />
      )}

      {/* Music Player UI */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {/* Management Panel */}
        {isManagementOpen && (
          <div className="bg-white border-t-2 border-anime-pink max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-anime-purple">音乐管理</h3>
                <button
                  onClick={toggleManagement}
                  className="text-gray-500 hover:text-anime-pink"
                >
                  ✕
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={addFolder}
                  disabled={isLoading}
                  className="anime-button text-sm flex items-center gap-1"
                >
                  📁 添加文件夹
                </button>
                <button
                  onClick={addLocalFiles}
                  disabled={isLoading}
                  className="anime-button text-sm flex items-center gap-1"
                >
                  🎵 添加文件
                </button>
                <button
                  onClick={refreshAllFolders}
                  disabled={isLoading || folders.length === 0}
                  className="anime-button text-sm flex items-center gap-1"
                >
                  🔄 刷新全部
                </button>
              </div>

              {isLoading && (
                <div className="text-center py-2 text-anime-purple">
                  加载中...
                </div>
              )}

              {/* Folders List */}
              {folders.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    已添加的文件夹 ({folders.length})
                  </h4>
                  <div className="space-y-2">
                    {folders.map((folder) => (
                      <div
                        key={folder.id}
                        className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <span>📁</span>
                          <span className="text-sm">{folder.name}</span>
                        </div>
                        <button
                          onClick={() => removeFolder(folder.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracks List */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  播放列表 ({tracks.length} 首歌曲)
                </h4>
                {tracks.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    还没有添加音乐，点击上方按钮添加文件夹或文件
                  </div>
                ) : (
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {tracks.map((track, index) => (
                      <div
                        key={track.id}
                        className={`flex items-center justify-between p-2 text-sm ${
                          index === currentTrackIndex
                            ? 'bg-anime-pastel-pink'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{track.title}</div>
                          {track.artist && (
                            <div className="text-xs text-gray-500 truncate">
                              {track.artist}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => playTrack(index)}
                            className="text-anime-purple hover:text-anime-pink"
                          >
                            ▶️
                          </button>
                          <button
                            onClick={() => removeTrack(track.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Playlist Panel */}
        {isPlaylistOpen && !isManagementOpen && (
          <div className="bg-white border-t-2 border-anime-pink max-h-64 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-anime-purple">当前播放</h3>
                <button
                  onClick={toggleManagement}
                  className="anime-button text-xs"
                >
                  ⚙️ 管理
                </button>
              </div>
              <div className="space-y-2">
                {tracks.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    播放列表为空
                  </div>
                ) : (
                  tracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => playTrack(index)}
                      className={`
                        w-full text-left p-3 transition-colors
                        ${
                          index === currentTrackIndex
                            ? 'bg-anime-pastel-pink border-2 border-anime-pink'
                            : 'bg-gray-50 hover:bg-anime-pastel-blue border-2 border-transparent'
                        }
                      `}
                    >
                      <div className="font-medium text-gray-800">{track.title}</div>
                      {track.artist && (
                        <div className="text-sm text-gray-500">{track.artist}</div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compact Music Player */}
        <div className="bg-white border-t-2 border-anime-pink">
          {!isMinimized ? (
            /* Expanded View */
            <div className="container mx-auto px-4 py-3">
              {/* Track Info */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-3 bg-anime-pastel-pink p-3 border-2 border-anime-pink">
                  <div className={`w-8 h-8 border-2 border-anime-pink flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }}>
                    <div className="w-2 h-2 bg-anime-pink"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {currentTrack?.title || '没有播放的音乐'}
                    </div>
                    {currentTrack?.artist && (
                      <div className="text-xs text-gray-600 truncate">{currentTrack.artist}</div>
                    )}
                  </div>
                  <div className={`w-8 h-8 border-2 border-anime-pink flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }}>
                    <div className="w-2 h-2 bg-anime-pink"></div>
                  </div>
                </div>

                {/* Minimize Button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="px-3 py-2 bg-anime-pink text-white hover:bg-anime-purple transition-colors"
                  title="最小化"
                >
                  ▼
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-600 font-mono min-w-[35px]">{formatTime(seek)}</span>
                <div className="flex-1 h-2 bg-anime-pastel-pink overflow-hidden">
                  <div
                    className="h-full bg-anime-pink transition-all"
                    style={{ width: `${duration > 0 ? (seek / duration) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 font-mono min-w-[35px]">{formatTime(duration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={previousTrack}
                    disabled={tracks.length <= 1}
                    className="w-8 h-8 bg-anime-pastel-pink hover:bg-anime-pink hover:text-white transition-colors disabled:opacity-30 flex items-center justify-center"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={togglePlay}
                    disabled={tracks.length === 0}
                    className="w-12 h-12 bg-anime-pink text-white hover:bg-anime-purple transition-colors disabled:opacity-30 flex items-center justify-center text-xl"
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button
                    onClick={nextTrack}
                    disabled={tracks.length <= 1}
                    className="w-8 h-8 bg-anime-pastel-pink hover:bg-anime-pink hover:text-white transition-colors disabled:opacity-30 flex items-center justify-center"
                  >
                    ⏭
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLoop}
                    className={`w-8 h-8 ${loop ? 'bg-anime-pink text-white' : 'bg-anime-pastel-pink text-gray-600'} hover:bg-anime-purple hover:text-white transition-colors flex items-center justify-center`}
                  >
                    🔁
                  </button>
                  <button
                    onClick={toggleShuffle}
                    className={`w-8 h-8 ${shuffle ? 'bg-anime-pink text-white' : 'bg-anime-pastel-pink text-gray-600'} hover:bg-anime-purple hover:text-white transition-colors flex items-center justify-center`}
                  >
                    🔀
                  </button>
                  <button
                    onClick={togglePlaylist}
                    className={`w-8 h-8 ${isPlaylistOpen ? 'bg-anime-pink text-white' : 'bg-anime-pastel-pink text-gray-600'} hover:bg-anime-purple hover:text-white transition-colors flex items-center justify-center`}
                  >
                    📜
                  </button>
                  <button
                    onClick={toggleManagement}
                    className="w-8 h-8 bg-anime-purple text-white hover:bg-anime-blue transition-colors flex items-center justify-center"
                  >
                    ⚙️
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-gray-600 hover:text-anime-pink transition-colors">
                    {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-2 bg-anime-pastel-pink appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:bg-anime-pink
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-4
                      [&::-moz-range-thumb]:h-4
                      [&::-moz-range-thumb]:bg-anime-pink
                      [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Minimized View */
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  disabled={tracks.length === 0}
                  className="w-10 h-10 bg-anime-pink text-white hover:bg-anime-purple transition-colors disabled:opacity-30 flex items-center justify-center"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {currentTrack?.title || '没有播放的音乐'}
                  </div>
                  {currentTrack?.artist && (
                    <div className="text-xs text-gray-600 truncate">{currentTrack.artist}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1 bg-anime-pastel-pink overflow-hidden">
                    <div
                      className="h-full bg-anime-pink transition-all"
                      style={{ width: `${duration > 0 ? (seek / duration) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="px-3 py-1 bg-anime-pink text-white hover:bg-anime-purple transition-colors text-sm"
                  >
                    ▲
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
