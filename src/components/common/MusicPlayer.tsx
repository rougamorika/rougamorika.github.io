import { useEffect, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import { useMusicStore } from '@store/musicStore';

const iconButtonBase =
  'flex items-center justify-center rounded-full border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35';

const panelButtonBase =
  'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

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

      <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 sm:px-4">
        {(isManagementOpen || isPlaylistOpen) && (
          <div className="mx-auto mb-3 max-w-6xl overflow-hidden rounded-[28px] border border-[#f3c7d6] bg-[rgba(255,248,250,0.96)] shadow-[0_-18px_45px_rgba(194,120,149,0.16)] backdrop-blur-xl">
            {isManagementOpen && (
              <div className="p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#f2d7e2] pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#c58aa0]">Library</p>
                    <h3 className="text-lg font-semibold text-[#5b4550]">音乐管理</h3>
                  </div>
                  <button
                    onClick={toggleManagement}
                    className="rounded-full border border-[#ecc7d7] px-3 py-1.5 text-sm text-[#8e6877] transition-colors hover:border-[#d88ea9] hover:text-[#b25f7c]"
                  >
                    关闭
                  </button>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={addFolder}
                    disabled={isLoading}
                    className={`${panelButtonBase} border-[#efbfd1] bg-white text-[#9c5f76] hover:border-[#d987a4] hover:bg-[#fff4f8]`}
                  >
                    <span aria-hidden="true">📁</span>
                    添加文件夹
                  </button>
                  <button
                    onClick={addLocalFiles}
                    disabled={isLoading}
                    className={`${panelButtonBase} border-[#efbfd1] bg-white text-[#9c5f76] hover:border-[#d987a4] hover:bg-[#fff4f8]`}
                  >
                    <span aria-hidden="true">♪</span>
                    添加文件
                  </button>
                  <button
                    onClick={refreshAllFolders}
                    disabled={isLoading || folders.length === 0}
                    className={`${panelButtonBase} border-[#ead8ff] bg-[#faf6ff] text-[#8262b5] hover:border-[#b89adf] hover:bg-[#f3ebff]`}
                  >
                    <span aria-hidden="true">↻</span>
                    刷新全部
                  </button>
                </div>

                {isLoading && (
                  <div className="mb-4 rounded-2xl border border-dashed border-[#e8bfd0] bg-white/80 px-4 py-3 text-sm text-[#9a6778]">
                    正在同步音乐库...
                  </div>
                )}

                <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
                  <section className="rounded-[24px] border border-[#f2dce5] bg-white/80 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#5b4550]">文件夹</h4>
                      <span className="rounded-full bg-[#fff1f6] px-2.5 py-1 text-xs text-[#b56b87]">
                        {folders.length} 个
                      </span>
                    </div>

                    {folders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#ecd7df] bg-[#fffafb] px-4 py-6 text-sm text-[#a4828f]">
                        还没有已授权的音乐文件夹。
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {folders.map((folder) => (
                          <div
                            key={folder.id}
                            className="flex items-center justify-between rounded-2xl border border-[#f2dce5] bg-[#fffafb] px-3 py-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-[#624752]">{folder.name}</div>
                              <div className="text-xs text-[#b08997]">本地授权目录</div>
                            </div>
                            <button
                              onClick={() => removeFolder(folder.id)}
                              className="rounded-full border border-[#f0c6d4] px-3 py-1.5 text-xs text-[#b45d79] transition-colors hover:border-[#dd8faa] hover:bg-[#fff0f5]"
                            >
                              删除
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="rounded-[24px] border border-[#f2dce5] bg-white/80 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#5b4550]">播放列表</h4>
                      <span className="rounded-full bg-[#fff1f6] px-2.5 py-1 text-xs text-[#b56b87]">
                        {trackCountLabel}
                      </span>
                    </div>

                    {tracks.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#ecd7df] bg-[#fffafb] px-4 py-6 text-sm text-[#a4828f]">
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
                                  ? 'border-[#e29ab4] bg-[linear-gradient(135deg,#fff1f6_0%,#fff8fb_100%)]'
                                  : 'border-[#f2dce5] bg-[#fffafb] hover:border-[#e3bdd0]'
                              }`}
                            >
                              <button
                                onClick={() => playTrack(index)}
                                className={`h-9 w-9 flex-shrink-0 rounded-full border text-sm transition-colors ${
                                  isActive
                                    ? 'border-[#d77999] bg-[#d77999] text-white'
                                    : 'border-[#efbfd1] bg-white text-[#ad6b82] hover:border-[#d987a4] hover:text-[#bf6784]'
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
                                className="rounded-full border border-[#f0c6d4] px-3 py-1.5 text-xs text-[#b45d79] transition-colors hover:border-[#dd8faa] hover:bg-[#fff0f5]"
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
              <div className="p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#f2d7e2] pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#c58aa0]">Queue</p>
                    <h3 className="text-lg font-semibold text-[#5b4550]">当前播放列表</h3>
                  </div>
                  <button
                    onClick={toggleManagement}
                    className="rounded-full border border-[#ead8ff] bg-[#faf6ff] px-3 py-1.5 text-sm text-[#8262b5] transition-colors hover:border-[#b89adf] hover:bg-[#f3ebff]"
                  >
                    管理音乐库
                  </button>
                </div>

                {tracks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#ecd7df] bg-[#fffafb] px-4 py-6 text-sm text-[#a4828f]">
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
                              ? 'border-[#e29ab4] bg-[linear-gradient(135deg,#fff1f6_0%,#fff8fb_100%)]'
                              : 'border-[#f2dce5] bg-[#fffafb] hover:border-[#e3bdd0]'
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-sm ${
                              isActive
                                ? 'border-[#d77999] bg-[#d77999] text-white'
                                : 'border-[#efbfd1] bg-white text-[#ad6b82]'
                            }`}
                          >
                            {isActive ? '♪' : index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-[#5e4650]">{track.title}</div>
                            <div className="truncate text-xs text-[#a07a88]">{track.artist || '未知艺术家'}</div>
                          </div>
                          {isActive && <span className="text-xs font-medium text-[#c06a88]">播放中</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-[#efc6d7] bg-[linear-gradient(180deg,rgba(255,252,253,0.97)_0%,rgba(255,244,248,0.98)_100%)] shadow-[0_22px_60px_rgba(199,124,154,0.18)] backdrop-blur-xl">
          {!isMinimized ? (
            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr),minmax(340px,1fr)] lg:items-center">
                <div className="min-w-0">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-[22px] border border-[#efbfd1] bg-[radial-gradient(circle_at_30%_30%,#fffefc_0%,#ffe5ee_45%,#f6bfd3_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                        <div className="absolute inset-[9px] rounded-full border border-white/70 bg-[radial-gradient(circle,#ffe7f0_10%,#ffbfd2_62%,#d97b9b_100%)]" />
                        <div
                          className={`absolute inset-[18px] rounded-full border border-white/60 bg-white/65 ${isPlaying ? 'animate-spin' : ''}`}
                          style={{ animationDuration: '5s' }}
                        />
                        <div className="absolute inset-[25px] rounded-full bg-[#d77b9b]" />
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#fff1f6] px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-[#c06a88]">
                            Now Playing
                          </span>
                          <span className="rounded-full border border-[#efc6d6] px-2.5 py-1 text-[11px] text-[#9c7382]">
                            {trackCountLabel}
                          </span>
                        </div>
                        <h3 className="truncate text-lg font-semibold text-[#5c4550] sm:text-xl">
                          {currentTrack?.title || '没有播放的音乐'}
                        </h3>
                        <p className="truncate text-sm text-[#9f7987]">
                          {currentTrack?.artist || '等待选择音乐'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsMinimized(true)}
                      className="rounded-full border border-[#efd0db] bg-white/80 px-3 py-2 text-sm text-[#9b6e7e] transition-colors hover:border-[#d98da8] hover:text-[#ba6581]"
                      title="最小化播放器"
                    >
                      收起
                    </button>
                  </div>

                  <div className="mb-3 grid grid-cols-[auto,1fr,auto] items-center gap-3">
                    <span className="text-xs font-medium tabular-nums text-[#9f7b88]">{formatTime(seek)}</span>
                    <label className="group relative block cursor-pointer">
                      <div className="h-2.5 rounded-full bg-[#f7d9e5] shadow-[inset_0_1px_2px_rgba(193,119,147,0.14)]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#dd7b9c_0%,#f1adc7_100%)]"
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
                    <span className="text-xs font-medium tabular-nums text-[#9f7b88]">{formatTime(duration)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={previousTrack}
                      disabled={tracks.length <= 1}
                      className={`${iconButtonBase} h-11 w-11 border-[#efc7d7] bg-white/85 text-[#a66c81] hover:border-[#d986a4] hover:text-[#c16382]`}
                      aria-label="上一首"
                    >
                      ⏮
                    </button>
                    <button
                      onClick={togglePlay}
                      disabled={tracks.length === 0}
                      className={`${iconButtonBase} h-14 w-14 border-[#dc84a4] bg-[linear-gradient(135deg,#e384a6_0%,#c96f92_100%)] text-xl text-white shadow-[0_10px_20px_rgba(210,119,151,0.28)] hover:brightness-105`}
                      aria-label={isPlaying ? '暂停' : '播放'}
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button
                      onClick={nextTrack}
                      disabled={tracks.length <= 1}
                      className={`${iconButtonBase} h-11 w-11 border-[#efc7d7] bg-white/85 text-[#a66c81] hover:border-[#d986a4] hover:text-[#c16382]`}
                      aria-label="下一首"
                    >
                      ⏭
                    </button>

                    <div className="ml-auto flex flex-wrap items-center gap-2">
                      <button
                        onClick={toggleLoop}
                        className={`${iconButtonBase} h-10 min-w-[48px] px-3 text-sm ${
                          loop
                            ? 'border-[#d986a4] bg-[#d986a4] text-white'
                            : 'border-[#efc7d7] bg-white/85 text-[#a66c81] hover:border-[#d986a4] hover:text-[#c16382]'
                        }`}
                        aria-label="循环"
                      >
                        🔁
                      </button>
                      <button
                        onClick={toggleShuffle}
                        className={`${iconButtonBase} h-10 min-w-[48px] px-3 text-sm ${
                          shuffle
                            ? 'border-[#b392df] bg-[#b392df] text-white'
                            : 'border-[#e5d8f6] bg-[#faf7ff] text-[#8467b6] hover:border-[#b392df] hover:text-[#7556ac]'
                        }`}
                        aria-label="随机播放"
                      >
                        🔀
                      </button>
                      <button
                        onClick={togglePlaylist}
                        className={`${iconButtonBase} h-10 min-w-[56px] px-3 text-sm ${
                          isPlaylistOpen
                            ? 'border-[#d986a4] bg-[#fff1f6] text-[#be6784]'
                            : 'border-[#efc7d7] bg-white/85 text-[#a66c81] hover:border-[#d986a4] hover:text-[#c16382]'
                        }`}
                        aria-label="查看播放列表"
                      >
                        列表
                      </button>
                      <button
                        onClick={toggleManagement}
                        className={`${iconButtonBase} h-10 min-w-[56px] px-3 text-sm ${
                          isManagementOpen
                            ? 'border-[#b392df] bg-[#f2ebff] text-[#7d60b1]'
                            : 'border-[#e5d8f6] bg-[#faf7ff] text-[#8467b6] hover:border-[#b392df] hover:text-[#7556ac]'
                        }`}
                        aria-label="管理音乐库"
                      >
                        管理
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 rounded-[24px] border border-[#f0d7e1] bg-white/72 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-[#c392a3]">Volume</div>
                      <div className="text-sm text-[#8d6d7a]">音量与状态</div>
                    </div>
                    <button
                      onClick={toggleMute}
                      className="rounded-full border border-[#efc7d7] bg-white px-3 py-2 text-sm text-[#a66c81] transition-colors hover:border-[#d986a4] hover:text-[#c16382]"
                      aria-label={isMuted ? '取消静音' : '静音'}
                    >
                      {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                    </button>
                  </div>

                  <div className="grid grid-cols-[1fr,auto] items-center gap-3">
                    <label className="group relative block cursor-pointer">
                      <div className="h-2.5 rounded-full bg-[#f7d9e5] shadow-[inset_0_1px_2px_rgba(193,119,147,0.14)]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#d47a99_0%,#eeb2c9_100%)]"
                          style={{ width: `${volumePercent}%` }}
                        />
                      </div>
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
                    </label>
                    <span className="text-sm font-medium tabular-nums text-[#9f7b88]">{Math.round(volumePercent)}%</span>
                  </div>

                  <div className="grid gap-2 rounded-2xl bg-[#fff7fa] p-3 text-sm text-[#8d6d7a] sm:grid-cols-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#c392a3]">模式</div>
                      <div>{shuffle ? '随机' : loop ? '循环' : '顺序'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#c392a3]">状态</div>
                      <div>{isPlaying ? '播放中' : '已暂停'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#c392a3]">来源</div>
                      <div>{folders.length > 0 ? `本地库 ${folders.length}` : '静态歌单'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-3 px-4 py-3 sm:px-5 md:grid-cols-[auto,minmax(0,1.35fr),minmax(120px,0.65fr),auto] md:gap-4">
              <button
                onClick={togglePlay}
                disabled={tracks.length === 0}
                className={`${iconButtonBase} h-11 w-11 flex-shrink-0 border-[#dc84a4] bg-[linear-gradient(135deg,#e384a6_0%,#c96f92_100%)] text-white hover:brightness-105`}
                aria-label={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <div className="min-w-0 overflow-hidden pr-1">
                <div className="truncate text-sm font-semibold leading-tight text-[#5d4752] sm:text-[15px]">
                  {currentTrack?.title || '没有播放的音乐'}
                </div>
                <div className="truncate pt-0.5 text-xs leading-tight text-[#9f7987] sm:text-[13px]">
                  {currentTrack?.artist || '等待选择音乐'}
                </div>
              </div>

              <div className="hidden min-w-[120px] max-w-[180px] md:block md:w-full">
                <div className="h-1.5 rounded-full bg-[#f7d9e5]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#dd7b9c_0%,#f1adc7_100%)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setIsMinimized(false)}
                className="flex-shrink-0 whitespace-nowrap rounded-full border border-[#efd0db] bg-white/80 px-2.5 py-2 text-xs text-[#9b6e7e] transition-colors hover:border-[#d98da8] hover:text-[#ba6581] sm:px-3 sm:text-sm"
              >
                展开
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
