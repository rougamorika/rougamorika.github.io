import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const playlistPath = 'public/audio/playlist.json';
const playerPath = 'src/components/common/MusicPlayer.tsx';

const playlist = JSON.parse(fs.readFileSync(playlistPath, 'utf8'));
const player = fs.readFileSync(playerPath, 'utf8');

const formatMatch = player.match(/format=\{\[([^\]]+)\]\}/);
const supportedFormats =
  formatMatch?.[1]
    .match(/'([^']+)'|"([^"]+)"/g)
    ?.map((value) => value.slice(1, -1).toLowerCase()) ?? [];

let hasError = false;

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
