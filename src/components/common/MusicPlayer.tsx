import { useEffect, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import { useMusicStore } from '@store/musicStore';

const iconButtonBase =
  'flex items-center justify-center rounded-full border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35';

const panelButtonBase =
  'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40';

const dockHeightClass = 'bottom-[88px] sm:bottom-[104px]';

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
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!isPlaying || !playerRef.current) return;

    const interval = setInterval(() => {
      if (!playerRef.current) return;

      const currentSeek = playerRef.current.seek();
      setSeek(typeof currentSeek === 'number' ? currentSeek : 0);

      const currentDuration = playerRef.current.duration();
      if (currentDuration && currentDuration !== duration) {
        setDuration(currentDuration);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    setSeek(0);
    setDuration(0);
  }, [currentTrackIndex]);

  const handleLoad = () => {
    if (!playerRef.current) return;

    const trackDuration = playerRef.current.duration();
    if (trackDuration) {
      setDuration(trackDuration);
    }
  };

  const handleEnd = () => {
    if (loop) {
      setSeek(0);
      return;
    }

    nextTrack();
    setSeek(0);
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

  const progressPercent = duration > 0 ? (seek / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;
  const trackCountLabel = `${tracks.length} 首`;

  return (
    <>
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

      <div className="fixed inset-x-0 bottom-0 z-40">
        {(isManagementOpen || isPlaylistOpen) && (
          <div
            className={`absolute left-0 right-0 ${dockHeightClass} border-t border-[rgba(123,181,255,0.2)] bg-[linear-gradient(180deg,rgba(255,250,253,0.98)_0%,rgba(240,248,255,0.96)_100%)] shadow-[0_-16px_40px_rgba(109,156,218,0.12)] backdrop-blur-xl`}
          >
            <div className="mx-auto max-h-[min(55vh,34rem)] max-w-6xl overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            {isManagementOpen && (
              <div>
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[rgba(123,181,255,0.18)] pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#ff78b2]">Library</p>
                    <h3 className="text-lg font-semibold text-[#375489]">音乐管理</h3>
                  </div>
                  <button
                    onClick={toggleManagement}
                    className="rounded-full border border-[rgba(123,181,255,0.22)] px-3 py-1.5 text-sm text-[#5680bf] transition-all hover:border-[rgba(255,120,178,0.28)] hover:bg-[rgba(255,255,255,0.92)] hover:text-[#e75d9d]"
                  >
                    关闭
                  </button>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={addFolder}
                    disabled={isLoading}
                    className={`${panelButtonBase} border-[rgba(255,120,178,0.2)] bg-white/92 text-[#df5f9b] shadow-[0_8px_20px_rgba(255,120,178,0.08)] hover:border-[rgba(255,120,178,0.38)] hover:bg-[rgba(255,245,250,0.98)]`}
                  >
                    <span aria-hidden="true">📁</span>
                    添加文件夹
                  </button>
                  <button
                    onClick={addLocalFiles}
                    disabled={isLoading}
                    className={`${panelButtonBase} border-[rgba(255,120,178,0.2)] bg-white/92 text-[#df5f9b] shadow-[0_8px_20px_rgba(255,120,178,0.08)] hover:border-[rgba(255,120,178,0.38)] hover:bg-[rgba(255,245,250,0.98)]`}
                  >
                    <span aria-hidden="true">♪</span>
                    添加文件
                  </button>
                  <button
                    onClick={refreshAllFolders}
                    disabled={isLoading || folders.length === 0}
                    className={`${panelButtonBase} border-[rgba(123,181,255,0.22)] bg-[rgba(238,247,255,0.96)] text-[#4d81cf] shadow-[0_8px_20px_rgba(123,181,255,0.1)] hover:border-[rgba(123,181,255,0.4)] hover:bg-[rgba(229,242,255,1)]`}
                  >
                    <span aria-hidden="true">↻</span>
                    刷新全部
                  </button>
                </div>

                {isLoading && (
                  <div className="mb-4 rounded-2xl border border-dashed border-[rgba(123,181,255,0.2)] bg-white/82 px-4 py-3 text-sm text-[#5f7fb4]">
                    正在同步音乐库...
                  </div>
                )}

                <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
                  <section className="rounded-[22px] border border-[rgba(123,181,255,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(245,250,255,0.92)_100%)] p-4 shadow-[0_12px_28px_rgba(123,181,255,0.08)]">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#375489]">文件夹</h4>
                      <span className="rounded-full bg-[rgba(255,120,178,0.1)] px-2.5 py-1 text-xs text-[#db5b98]">
                        {folders.length} 个
                      </span>
                    </div>

                    {folders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[rgba(123,181,255,0.16)] bg-[rgba(250,253,255,0.95)] px-4 py-6 text-sm text-[#7091bf]">
                        还没有已授权的音乐文件夹。
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {folders.map((folder) => (
                          <div
                            key={folder.id}
                            className="flex items-center justify-between rounded-2xl border border-[rgba(123,181,255,0.14)] bg-[linear-gradient(135deg,rgba(255,247,251,0.95)_0%,rgba(242,249,255,0.96)_100%)] px-3 py-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-[#4f6da1]">{folder.name}</div>
                              <div className="text-xs text-[#92abd0]">本地授权目录</div>
                            </div>
                            <button
                              onClick={() => removeFolder(folder.id)}
                              className="rounded-full border border-[rgba(255,120,178,0.18)] px-3 py-1.5 text-xs text-[#de669f] transition-all hover:border-[rgba(255,120,178,0.34)] hover:bg-[rgba(255,241,247,0.96)]"
                            >
                              删除
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="rounded-[22px] border border-[rgba(123,181,255,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(245,250,255,0.92)_100%)] p-4 shadow-[0_12px_28px_rgba(123,181,255,0.08)]">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#375489]">播放列表</h4>
                      <span className="rounded-full bg-[rgba(123,181,255,0.1)] px-2.5 py-1 text-xs text-[#5c89cb]">
                        {trackCountLabel}
                      </span>
                    </div>

                    {tracks.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[rgba(123,181,255,0.16)] bg-[rgba(250,253,255,0.95)] px-4 py-6 text-sm text-[#7091bf]">
                        还没有添加音乐，先从文件夹或本地文件导入。
                      </div>
                    ) : (
                      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                        {tracks.map((track, index) => {
                          const isActive = index === currentTrackIndex;

                          return (
                            <div
                              key={track.id}
                              className={`flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors ${
                                isActive
                                  ? 'border-[rgba(255,120,178,0.34)] bg-[linear-gradient(135deg,rgba(255,244,249,0.98)_0%,rgba(236,247,255,0.98)_100%)] shadow-[0_10px_26px_rgba(150,196,255,0.12)]'
                                  : 'border-[rgba(123,181,255,0.14)] bg-[rgba(250,253,255,0.94)] hover:border-[rgba(255,120,178,0.24)]'
                              }`}
                            >
                              <button
                                onClick={() => playTrack(index)}
                                className={`h-9 w-9 flex-shrink-0 rounded-full border text-sm transition-colors ${
                                  isActive
                                    ? 'border-[#ff74ac] bg-[linear-gradient(135deg,#ff7fb6_0%,#7bb5ff_100%)] text-white'
                                    : 'border-[rgba(123,181,255,0.18)] bg-white text-[#5d85c4] hover:border-[rgba(255,120,178,0.3)] hover:text-[#de619d]'
                                }`}
                                aria-label={`播放 ${track.title}`}
                              >
                                {isActive && isPlaying ? '❚❚' : '▶'}
                              </button>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-[#42608f]">{track.title}</div>
                                <div className="truncate text-xs text-[#93abd0]">{track.artist || '未知艺术家'}</div>
                              </div>
                              <button
                                onClick={() => removeTrack(track.id)}
                                className="rounded-full border border-[rgba(255,120,178,0.18)] px-3 py-1.5 text-xs text-[#de669f] transition-all hover:border-[rgba(255,120,178,0.34)] hover:bg-[rgba(255,241,247,0.96)]"
                              >
                                删除
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}

            {isPlaylistOpen && !isManagementOpen && (
              <div>
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[rgba(123,181,255,0.18)] pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#ff78b2]">Queue</p>
                    <h3 className="text-lg font-semibold text-[#375489]">当前播放列表</h3>
                  </div>
                  <button
                    onClick={toggleManagement}
                    className="rounded-full border border-[rgba(123,181,255,0.22)] bg-[rgba(238,247,255,0.96)] px-3 py-1.5 text-sm text-[#4d81cf] transition-all hover:border-[rgba(255,120,178,0.28)] hover:bg-[rgba(229,242,255,1)] hover:text-[#e75d9d]"
                  >
                    管理音乐库
                  </button>
                </div>

                {tracks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[rgba(123,181,255,0.16)] bg-[rgba(250,253,255,0.95)] px-4 py-6 text-sm text-[#7091bf]">
                    播放列表为空。
                  </div>
                ) : (
                  <div className="grid gap-2 max-h-80 overflow-y-auto pr-1">
                    {tracks.map((track, index) => {
                      const isActive = index === currentTrackIndex;

                      return (
                        <button
                          key={track.id}
                          onClick={() => playTrack(index)}
                          className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                            isActive
                              ? 'border-[rgba(255,120,178,0.34)] bg-[linear-gradient(135deg,rgba(255,244,249,0.98)_0%,rgba(236,247,255,0.98)_100%)] shadow-[0_10px_26px_rgba(150,196,255,0.12)]'
                              : 'border-[rgba(123,181,255,0.14)] bg-[rgba(250,253,255,0.94)] hover:border-[rgba(255,120,178,0.24)]'
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-sm ${
                              isActive
                                ? 'border-[#ff74ac] bg-[linear-gradient(135deg,#ff7fb6_0%,#7bb5ff_100%)] text-white'
                                : 'border-[rgba(123,181,255,0.18)] bg-white text-[#5d85c4]'
                            }`}
                          >
                            {isActive ? '♪' : index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-[#42608f]">{track.title}</div>
                            <div className="truncate text-xs text-[#93abd0]">{track.artist || '未知艺术家'}</div>
                          </div>
                          {isActive && <span className="text-xs font-medium text-[#df609c]">播放中</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        )}

        <div className="border-t border-[rgba(123,181,255,0.18)] bg-[linear-gradient(180deg,rgba(255,252,254,0.98)_0%,rgba(239,247,255,0.95)_100%)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(247,251,255,0.9)]">
          <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6 sm:pt-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr),minmax(20rem,1fr)] lg:items-center lg:gap-6">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <button
                  onClick={togglePlay}
                  disabled={tracks.length === 0}
                  className={`${iconButtonBase} h-11 w-11 flex-shrink-0 border-[#ff78b2] bg-[linear-gradient(135deg,#ff86bb_0%,#7db8ff_100%)] text-lg text-white shadow-[0_10px_24px_rgba(138,190,255,0.22)] hover:brightness-105`}
                  aria-label={isPlaying ? '暂停' : '播放'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="rounded-full border border-[rgba(123,181,255,0.18)] bg-white/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[#df619d]">
                      BGM
                    </span>
                    <span className="text-[11px] text-[#81a3d4]">{trackCountLabel}</span>
                  </div>
                  <div className="mt-1 truncate font-sans text-[15px] font-semibold tracking-[0.01em] text-[#38548a] sm:text-[16px]">
                    {currentTrack?.title || '没有播放的音乐'}
                  </div>
                  <div className="truncate font-sans text-[11px] font-medium tracking-[0.04em] text-[#88a5cf] sm:text-[12px]">
                    {currentTrack?.artist || 'Liebe ist Tod und Neubeginn'}
                  </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    onClick={previousTrack}
                    disabled={tracks.length <= 1}
                    className={`${iconButtonBase} h-9 w-9 border-[rgba(123,181,255,0.2)] bg-white/88 text-[#5b86c6] hover:border-[rgba(255,120,178,0.28)] hover:text-[#df609c]`}
                    aria-label="上一首"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={nextTrack}
                    disabled={tracks.length <= 1}
                    className={`${iconButtonBase} h-9 w-9 border-[rgba(123,181,255,0.2)] bg-white/88 text-[#5b86c6] hover:border-[rgba(255,120,178,0.28)] hover:text-[#df609c]`}
                    aria-label="下一首"
                  >
                    ⏭
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr),auto] sm:items-center">
                <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
                    <span className="text-[11px] font-medium tabular-nums text-[#7396c7]">{formatTime(seek)}</span>
                    <label className="group relative block cursor-pointer">
                      <div className="h-1.5 rounded-full bg-[rgba(123,181,255,0.18)]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#ff82ba_0%,#7cb8ff_100%)]"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      step="0.1"
                      value={Math.min(seek, duration || 0)}
                      onChange={handleSeek}
                      className="music-slider absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="调整播放进度"
                    />
                  </label>
                  <span className="text-[11px] font-medium tabular-nums text-[#8f707d]">{formatTime(duration)}</span>
                </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                    <div className="flex items-center gap-2 sm:hidden">
                      <button
                        onClick={previousTrack}
                        disabled={tracks.length <= 1}
                        className={`${iconButtonBase} h-9 w-9 border-[rgba(123,181,255,0.2)] bg-white/88 text-[#5b86c6] hover:border-[rgba(255,120,178,0.28)] hover:text-[#df609c]`}
                        aria-label="上一首"
                      >
                      ⏮
                    </button>
                    <button
                      onClick={nextTrack}
                      disabled={tracks.length <= 1}
                        className={`${iconButtonBase} h-9 w-9 border-[rgba(123,181,255,0.2)] bg-white/88 text-[#5b86c6] hover:border-[rgba(255,120,178,0.28)] hover:text-[#df609c]`}
                        aria-label="下一首"
                      >
                      ⏭
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={toggleLoop}
                      className={`${iconButtonBase} h-9 min-w-[42px] px-2.5 text-sm ${
                        loop
                          ? 'border-[#ff77b0] bg-[#ff77b0] text-white shadow-[0_8px_18px_rgba(255,120,178,0.2)]'
                          : 'border-[rgba(255,120,178,0.18)] bg-white/88 text-[#df609c] hover:border-[rgba(255,120,178,0.34)] hover:text-[#c74f8a]'
                       }`}
                       aria-label="循环"
                     >
                      🔁
                    </button>
                    <button
                      onClick={toggleShuffle}
                      className={`${iconButtonBase} h-9 min-w-[42px] px-2.5 text-sm ${
                        shuffle
                          ? 'border-[#73aefe] bg-[#73aefe] text-white shadow-[0_8px_18px_rgba(123,181,255,0.22)]'
                          : 'border-[rgba(123,181,255,0.2)] bg-[rgba(239,247,255,0.94)] text-[#4e82cf] hover:border-[rgba(123,181,255,0.36)]'
                       }`}
                       aria-label="随机播放"
                     >
                      🔀
                    </button>
                    <button
                      onClick={toggleMute}
                      className="rounded-full border border-[rgba(123,181,255,0.2)] bg-white/88 px-3 py-2 text-sm text-[#5a85c5] transition-all hover:border-[rgba(255,120,178,0.28)] hover:text-[#df609c]"
                      aria-label={isMuted ? '取消静音' : '静音'}
                    >
                      {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                    </button>
                    <label className="hidden min-w-[96px] items-center gap-2 md:flex">
                      <span className="text-[11px] text-[#7396c7]">{Math.round(volumePercent)}%</span>
                      <span className="relative block flex-1 cursor-pointer">
                        <span className="block h-1.5 rounded-full bg-[rgba(123,181,255,0.18)]">
                          <span
                            className="block h-full rounded-full bg-[linear-gradient(90deg,#ff82ba_0%,#7cb8ff_100%)]"
                            style={{ width: `${volumePercent}%` }}
                          />
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="music-slider absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          aria-label="调整音量"
                        />
                      </span>
                    </label>
                    <button
                      onClick={togglePlaylist}
                      className={`${iconButtonBase} h-9 min-w-[52px] px-3 text-sm ${
                        isPlaylistOpen
                          ? 'border-[#ff77b0] bg-[rgba(255,120,178,0.12)] text-[#d55591]'
                          : 'border-[rgba(255,120,178,0.18)] bg-white/88 text-[#df609c] hover:border-[rgba(255,120,178,0.34)] hover:text-[#c74f8a]'
                       }`}
                       aria-label="查看播放列表"
                     >
                      列表
                    </button>
                    <button
                      onClick={toggleManagement}
                      className={`${iconButtonBase} h-9 min-w-[52px] px-3 text-sm ${
                        isManagementOpen
                          ? 'border-[#73aefe] bg-[rgba(123,181,255,0.14)] text-[#4e82cf]'
                          : 'border-[rgba(123,181,255,0.2)] bg-[rgba(239,247,255,0.94)] text-[#4e82cf] hover:border-[rgba(123,181,255,0.36)]'
                       }`}
                       aria-label="管理音乐库"
                     >
                      管理
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 h-[3px] w-full rounded-full bg-[rgba(123,181,255,0.16)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#ff82ba_0%,#7cb8ff_100%)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
