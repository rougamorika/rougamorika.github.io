/**
 * Music player type definitions
 */

export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
}

export interface Playlist {
  tracks: Track[];
}
