import { useEffect, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import { useMusicStore } from '@store/musicStore';

const iconButtonBase =
  'flex items-center justify-center rounded-full border transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-35';

const panelButtonBase =
  'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

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
            className={`absolute left-0 right-0 ${dockHeightClass} border-t border-[rgba(176,128,146,0.18)] bg-[rgba(255,249,251,0.96)] shadow-[0_-14px_34px_rgba(94,69,80,0.08)] backdrop-blur-xl`}
          >
            <div className="mx-auto max-h-[min(55vh,34rem)] max-w-6xl overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            {isManagementOpen && (
              <div>
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[rgba(176,128,146,0.14)] pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#9d7483]">Library</p>
                    <h3 className="text-lg font-semibold text-[#5b4550]">音乐管理</h3>
                  </div>
                  <button
                    onClick={toggleManagement}
                    className="rounded-full border border-[rgba(176,128,146,0.18)] px-3 py-1.5 text-sm text-[#7c616d] transition-colors hover:border-[rgba(176,128,146,0.32)] hover:bg-[rgba(255,255,255,0.9)]"
                  >
                    关闭
                  </button>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={addFolder}
                    disabled={isLoading}
                    className={`${panelButtonBase} border-[rgba(176,128,146,0.18)] bg-white text-[#815f6d] hover:border-[rgba(176,128,146,0.34)] hover:bg-[rgba(255,249,251,0.92)]`}
                  >
                    <span aria-hidden="true">📁</span>
                    添加文件夹
                  </button>
                  <button
                    onClick={addLocalFiles}
                    disabled={isLoading}
                    className={`${panelButtonBase} border-[rgba(176,128,146,0.18)] bg-white text-[#815f6d] hover:border-[rgba(176,128,146,0.34)] hover:bg-[rgba(255,249,251,0.92)]`}
                  >
                    <span aria-hidden="true">♪</span>
                    添加文件
                  </button>
                  <button
                    onClick={refreshAllFolders}
                    disabled={isLoading || folders.length === 0}
                    className={`${panelButtonBase} border-[rgba(134,114,171,0.18)] bg-[rgba(247,244,252,0.9)] text-[#705a9c] hover:border-[rgba(134,114,171,0.32)] hover:bg-[rgba(241,235,251,0.95)]`}
                  >
                    <span aria-hidden="true">↻</span>
                    刷新全部
                  </button>
                </div>

                {isLoading && (
                  <div className="mb-4 rounded-2xl border border-dashed border-[rgba(176,128,146,0.2)] bg-white/80 px-4 py-3 text-sm text-[#8d6977]">
                    正在同步音乐库...
                  </div>
                )}

                <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
                  <section className="rounded-[22px] border border-[rgba(176,128,146,0.12)] bg-white/84 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#5b4550]">文件夹</h4>
                      <span className="rounded-full bg-[rgba(130,96,110,0.08)] px-2.5 py-1 text-xs text-[#8d6977]">
                        {folders.length} 个
                      </span>
                    </div>

                    {folders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[rgba(176,128,146,0.16)] bg-[rgba(255,251,252,0.92)] px-4 py-6 text-sm text-[#957784]">
                        还没有已授权的音乐文件夹。
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {folders.map((folder) => (
                          <div
                            key={folder.id}
                            className="flex items-center justify-between rounded-2xl border border-[rgba(176,128,146,0.12)] bg-[rgba(255,251,252,0.92)] px-3 py-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-[#624752]">{folder.name}</div>
                              <div className="text-xs text-[#a0818e]">本地授权目录</div>
                            </div>
                            <button
                              onClick={() => removeFolder(folder.id)}
                              className="rounded-full border border-[rgba(176,128,146,0.18)] px-3 py-1.5 text-xs text-[#976c7c] transition-colors hover:border-[rgba(176,128,146,0.34)] hover:bg-[rgba(255,245,248,0.95)]"
                            >
                              删除
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="rounded-[22px] border border-[rgba(176,128,146,0.12)] bg-white/84 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#5b4550]">播放列表</h4>
                      <span className="rounded-full bg-[rgba(130,96,110,0.08)] px-2.5 py-1 text-xs text-[#8d6977]">
                        {trackCountLabel}
                      </span>
                    </div>

                    {tracks.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[rgba(176,128,146,0.16)] bg-[rgba(255,251,252,0.92)] px-4 py-6 text-sm text-[#957784]">
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
                                  ? 'border-[rgba(157,116,131,0.38)] bg-[rgba(255,247,249,0.98)]'
                                  : 'border-[rgba(176,128,146,0.12)] bg-[rgba(255,251,252,0.92)] hover:border-[rgba(176,128,146,0.22)]'
                              }`}
                            >
                              <button
                                onClick={() => playTrack(index)}
                                className={`h-9 w-9 flex-shrink-0 rounded-full border text-sm transition-colors ${
                                  isActive
                                    ? 'border-[#8a6574] bg-[#8a6574] text-white'
                                    : 'border-[rgba(176,128,146,0.18)] bg-white text-[#87616f] hover:border-[rgba(176,128,146,0.34)] hover:text-[#74535f]'
                                }`}
                                aria-label={`播放 ${track.title}`}
                              >
                                {isActive && isPlaying ? '❚❚' : '▶'}
                              </button>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-[#5e4650]">{track.title}</div>
                                <div className="truncate text-xs text-[#a07a88]">{track.artist || '未知艺术家'}</div>
                              </div>
                              <button
                                onClick={() => removeTrack(track.id)}
                                className="rounded-full border border-[rgba(176,128,146,0.18)] px-3 py-1.5 text-xs text-[#976c7c] transition-colors hover:border-[rgba(176,128,146,0.34)] hover:bg-[rgba(255,245,248,0.95)]"
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
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[rgba(176,128,146,0.14)] pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#9d7483]">Queue</p>
                    <h3 className="text-lg font-semibold text-[#5b4550]">当前播放列表</h3>
                  </div>
                  <button
                    onClick={toggleManagement}
                    className="rounded-full border border-[rgba(134,114,171,0.18)] bg-[rgba(247,244,252,0.9)] px-3 py-1.5 text-sm text-[#705a9c] transition-colors hover:border-[rgba(134,114,171,0.32)] hover:bg-[rgba(241,235,251,0.95)]"
                  >
                    管理音乐库
                  </button>
                </div>

                {tracks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[rgba(176,128,146,0.16)] bg-[rgba(255,251,252,0.92)] px-4 py-6 text-sm text-[#957784]">
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
                              ? 'border-[rgba(157,116,131,0.38)] bg-[rgba(255,247,249,0.98)]'
                              : 'border-[rgba(176,128,146,0.12)] bg-[rgba(255,251,252,0.92)] hover:border-[rgba(176,128,146,0.22)]'
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-sm ${
                              isActive
                                ? 'border-[#8a6574] bg-[#8a6574] text-white'
                                : 'border-[rgba(176,128,146,0.18)] bg-white text-[#87616f]'
                            }`}
                          >
                            {isActive ? '♪' : index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-[#5e4650]">{track.title}</div>
                            <div className="truncate text-xs text-[#a07a88]">{track.artist || '未知艺术家'}</div>
                          </div>
                          {isActive && <span className="text-xs font-medium text-[#8f6978]">播放中</span>}
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

        <div className="border-t border-[rgba(176,128,146,0.16)] bg-[rgba(255,250,252,0.96)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(255,250,252,0.9)]">
          <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6 sm:pt-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr),minmax(20rem,1fr)] lg:items-center lg:gap-6">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <button
                  onClick={togglePlay}
                  disabled={tracks.length === 0}
                  className={`${iconButtonBase} h-11 w-11 flex-shrink-0 border-[#8e6978] bg-[#8e6978] text-lg text-white hover:bg-[#7c5d69]`}
                  aria-label={isPlaying ? '暂停' : '播放'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="rounded-full border border-[rgba(176,128,146,0.16)] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[#8d6977]">
                      BGM
                    </span>
                    <span className="text-[11px] text-[#9f7e8c]">{trackCountLabel}</span>
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold text-[#57424c] sm:text-[15px]">
                    {currentTrack?.title || '没有播放的音乐'}
                  </div>
                  <div className="truncate text-xs text-[#927582] sm:text-[13px]">
                    {currentTrack?.artist || '等待选择音乐'}
                  </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    onClick={previousTrack}
                    disabled={tracks.length <= 1}
                    className={`${iconButtonBase} h-9 w-9 border-[rgba(176,128,146,0.18)] bg-white text-[#7f6170] hover:border-[rgba(176,128,146,0.34)] hover:text-[#684d59]`}
                    aria-label="上一首"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={nextTrack}
                    disabled={tracks.length <= 1}
                    className={`${iconButtonBase} h-9 w-9 border-[rgba(176,128,146,0.18)] bg-white text-[#7f6170] hover:border-[rgba(176,128,146,0.34)] hover:text-[#684d59]`}
                    aria-label="下一首"
                  >
                    ⏭
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr),auto] sm:items-center">
                <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
                  <span className="text-[11px] font-medium tabular-nums text-[#8f707d]">{formatTime(seek)}</span>
                  <label className="group relative block cursor-pointer">
                    <div className="h-1.5 bg-[rgba(125,97,109,0.14)]">
                      <div
                        className="h-full bg-[linear-gradient(90deg,#87626f_0%,#c8a2b0_100%)]"
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
                      className={`${iconButtonBase} h-9 w-9 border-[rgba(176,128,146,0.18)] bg-white text-[#7f6170] hover:border-[rgba(176,128,146,0.34)] hover:text-[#684d59]`}
                      aria-label="上一首"
                    >
                      ⏮
                    </button>
                    <button
                      onClick={nextTrack}
                      disabled={tracks.length <= 1}
                      className={`${iconButtonBase} h-9 w-9 border-[rgba(176,128,146,0.18)] bg-white text-[#7f6170] hover:border-[rgba(176,128,146,0.34)] hover:text-[#684d59]`}
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
                          ? 'border-[#87626f] bg-[#87626f] text-white'
                          : 'border-[rgba(176,128,146,0.18)] bg-white text-[#7f6170] hover:border-[rgba(176,128,146,0.34)] hover:text-[#684d59]'
                      }`}
                      aria-label="循环"
                    >
                      🔁
                    </button>
                    <button
                      onClick={toggleShuffle}
                      className={`${iconButtonBase} h-9 min-w-[42px] px-2.5 text-sm ${
                        shuffle
                          ? 'border-[#705a9c] bg-[#705a9c] text-white'
                          : 'border-[rgba(134,114,171,0.18)] bg-[rgba(247,244,252,0.9)] text-[#705a9c] hover:border-[rgba(134,114,171,0.32)]'
                      }`}
                      aria-label="随机播放"
                    >
                      🔀
                    </button>
                    <button
                      onClick={toggleMute}
                      className="rounded-full border border-[rgba(176,128,146,0.18)] bg-white px-3 py-2 text-sm text-[#7f6170] transition-colors hover:border-[rgba(176,128,146,0.34)] hover:text-[#684d59]"
                      aria-label={isMuted ? '取消静音' : '静音'}
                    >
                      {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                    </button>
                    <label className="hidden min-w-[96px] items-center gap-2 md:flex">
                      <span className="text-[11px] text-[#8f707d]">{Math.round(volumePercent)}%</span>
                      <span className="relative block flex-1 cursor-pointer">
                        <span className="block h-1.5 bg-[rgba(125,97,109,0.14)]">
                          <span
                            className="block h-full bg-[linear-gradient(90deg,#87626f_0%,#c8a2b0_100%)]"
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
                          ? 'border-[#87626f] bg-[rgba(135,98,111,0.12)] text-[#6c515c]'
                          : 'border-[rgba(176,128,146,0.18)] bg-white text-[#7f6170] hover:border-[rgba(176,128,146,0.34)] hover:text-[#684d59]'
                      }`}
                      aria-label="查看播放列表"
                    >
                      列表
                    </button>
                    <button
                      onClick={toggleManagement}
                      className={`${iconButtonBase} h-9 min-w-[52px] px-3 text-sm ${
                        isManagementOpen
                          ? 'border-[#705a9c] bg-[rgba(112,90,156,0.12)] text-[#705a9c]'
                          : 'border-[rgba(134,114,171,0.18)] bg-[rgba(247,244,252,0.9)] text-[#705a9c] hover:border-[rgba(134,114,171,0.32)]'
                      }`}
                      aria-label="管理音乐库"
                    >
                      管理
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 h-[3px] w-full bg-[rgba(125,97,109,0.12)]">
              <div
                className="h-full bg-[linear-gradient(90deg,#87626f_0%,#c8a2b0_100%)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
