import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const playlistPath = 'public/audio/playlist.json';
const playerPath = 'src/components/common/MusicPlayer.tsx';
const appPath = 'src/App.tsx';

const playlist = JSON.parse(fs.readFileSync(playlistPath, 'utf8'));
const player = fs.readFileSync(playerPath, 'utf8');
const app = fs.readFileSync(appPath, 'utf8');

const formatMatch = player.match(/format=\{\[([^\]]+)\]\}/);
const supportedFormats =
  formatMatch?.[1]
    .match(/'([^']+)'|"([^"]+)"/g)
    ?.map((value) => value.slice(1, -1).toLowerCase()) ?? [];

let hasError = false;

const defaultTrack = playlist.tracks?.[0];
const isDaCapoDefault =
  playlist.tracks?.length === 1 &&
  defaultTrack?.title === 'Beautiful World -Da Capo Version-' &&
  defaultTrack?.artist === 'Hikaru Utada' &&
  defaultTrack?.url === '/audio/bgm/Beautiful_World_Da_Capo.mp4';
const appEnablesLoop = /loop:\s*true/.test(app);

console.log(
  `default-bgm: daCapoSingleTrack=${isDaCapoDefault} appLoopEnabled=${appEnablesLoop}`,
);

if (!isDaCapoDefault || !appEnablesLoop) {
  hasError = true;
}

for (const track of playlist.tracks ?? []) {
  const localPath = track.url.replace(/^\//, 'public/');
  const extension = path.extname(localPath).slice(1).toLowerCase();
  const exists = fs.existsSync(localPath);
  const supported = supportedFormats.includes(extension);

  let tracked = false;
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', localPath], {
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    tracked = true;
  } catch {
    tracked = false;
  }

  console.log(
    `${track.id}: exists=${exists} tracked=${tracked} supported=${supported} ext=${extension} path=${localPath}`,
  );

  if (!exists || !tracked || !supported) {
    hasError = true;
  }
}

if (hasError) {
  process.exitCode = 1;
}
