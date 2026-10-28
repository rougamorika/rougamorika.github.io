import { useCallback, useEffect, useRef, useState } from 'react';

type BgmMode = 'fresh' | 'electronic';

interface BgmTrack {
  id: BgmMode;
  label: string;
  title: string;
  artist: string;
  url: string;
}

const BGM_TRACKS: BgmTrack[] = [
  {
    id: 'fresh',
    label: '清新',
    title: 'Beautiful World -Da Capo Version-',
    artist: 'Hikaru Utada',
    url: '/audio/bgm/Beautiful_World_Da_Capo.mp4',
  },
  {
    id: 'electronic',
    label: '电子',
    title: '宝船',
    artist: 'DOUDOU / 燕云十六声',
    url: '/audio/bgm/Doudou_Baochuan.mp3',
  },
];

const DEFAULT_MODE: BgmMode = 'electronic';

/**
 * Minimal BGM dock: two buttons switch between the fresh and electronic
 * background tracks. The electronic track (DOUDOU - 宝船) is selected by
 * default; clicking the active button toggles play / pause.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mode, setMode] = useState<BgmMode>(DEFAULT_MODE);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = BGM_TRACKS.find((track) => track.id === mode) ?? BGM_TRACKS[1];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.65;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, mode]);

  // Browsers block autoplay until the first user interaction, so start the
  // default track after the first click / key press outside the player.
  useEffect(() => {
    const isInsidePlayer = (event: Event) => {
      const target = event.target as Element | null;
      return Boolean(target?.closest?.('[data-bgm-player]'));
    };

    const startPlayback = (event: Event) => {
      if (isInsidePlayer(event)) return;
      setIsPlaying(true);
      removeListeners();
    };

    const removeListeners = () => {
      document.removeEventListener('pointerdown', startPlayback);
      document.removeEventListener('keydown', startPlayback);
    };

    document.addEventListener('pointerdown', startPlayback);
    document.addEventListener('keydown', startPlayback);

    return removeListeners;
  }, []);

  const handleModeClick = useCallback(
    (nextMode: BgmMode) => {
      if (nextMode === mode) {
        setIsPlaying((playing) => !playing);
        return;
      }

      setMode(nextMode);
      setIsPlaying(true);
    },
    [mode]
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div
        data-bgm-player
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-[rgba(123,181,255,0.22)] bg-[linear-gradient(180deg,rgba(255,252,254,0.97)_0%,rgba(239,247,255,0.95)_100%)] px-2.5 py-2 shadow-[0_12px_30px_rgba(109,156,218,0.18)] backdrop-blur-xl"
      >
        <audio ref={audioRef} src={currentTrack.url} loop preload="none" />

        <span
          className="hidden max-w-[13rem] truncate pl-2 pr-1 text-[11px] text-[#7f9fcd] sm:block"
          aria-live="polite"
        >
          {isPlaying ? `♪ ${currentTrack.title}` : '已暂停'}
        </span>

        {BGM_TRACKS.map((track) => {
          const isActive = track.id === mode;

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => handleModeClick(track.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? 'border-[#ff78b2] bg-[linear-gradient(135deg,#ff86bb_0%,#7db8ff_100%)] text-white shadow-[0_8px_18px_rgba(138,190,255,0.28)]'
                  : 'border-[rgba(123,181,255,0.22)] bg-white/88 text-[#5b86c6] hover:border-[rgba(255,120,178,0.34)] hover:text-[#df609c]'
              }`}
              aria-pressed={isActive}
              aria-label={`${track.label}：${track.title}`}
              title={`${track.label} · ${track.title} · ${track.artist}`}
            >
              {track.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
