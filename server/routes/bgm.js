import express from 'express';
import fs from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Get the project root directory (two levels up from server/routes)
const PROJECT_ROOT = join(__dirname, '..', '..');
const BGM_DIR = join(PROJECT_ROOT, 'public', 'BGM');
const PLAYLIST_FILE = join(BGM_DIR, 'playlist.json');

/**
 * POST /api/bgm/sync
 * Scan BGM folder and update playlist.json
 */
router.post('/sync', async (req, res) => {
  try {
    console.log('\n🎵 Syncing BGM playlist...');

    // Ensure BGM directory exists
    await fs.ensureDir(BGM_DIR);

    // Read all files in the directory
    const files = await fs.readdir(BGM_DIR);

    // Filter MP3 files and sort
    const mp3Files = files.filter(f =>
      f.toLowerCase().endsWith('.mp3')
    ).sort();

    console.log(`   Found ${mp3Files.length} MP3 file(s)`);

    // Generate tracks array
    const tracks = mp3Files.map((filename, index) => {
      // Extract artist and title from filename
      // Format: "Artist - Title.mp3" or "Title.mp3"
      const nameWithoutExt = filename.replace(/\.mp3$/i, '');
      const parts = nameWithoutExt.split(' - ');

      const artist = parts.length > 1 ? parts[0].trim() : 'Unknown';
      const title = parts.length > 1 ? parts[1].trim() : nameWithoutExt;

      return {
        id: `bgm-${index + 1}`,
        title: title,
        artist: artist,
        url: `/BGM/${filename}`
      };
    });

    // Build playlist object
    const playlist = {
      name: '博客背景音乐',
      description: '博客自动播放的背景音乐',
      tracks: tracks,
      lastUpdated: new Date().toISOString(),
      totalTracks: tracks.length
    };

    // Write playlist.json
    await fs.writeJson(PLAYLIST_FILE, playlist, { spaces: 2 });

    console.log(`   ✅ Playlist updated: ${tracks.length} tracks`);

    res.json({
      success: true,
      message: 'BGM playlist synced successfully',
      playlist: playlist
    });

  } catch (error) {
    console.error('❌ Error syncing BGM:', error);
    res.status(500).json({
      success: false,
      message: `Failed to sync BGM: ${error.message}`
    });
  }
});

/**
 * GET /api/bgm/playlist
 * Get current playlist.json
 */
router.get('/playlist', async (req, res) => {
  try {
    const exists = await fs.pathExists(PLAYLIST_FILE);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    const playlist = await fs.readJson(PLAYLIST_FILE);

    res.json({
      success: true,
      playlist: playlist
    });

  } catch (error) {
    console.error('Error reading playlist:', error);
    res.status(500).json({
      success: false,
      message: `Failed to read playlist: ${error.message}`
    });
  }
});

export default router;
