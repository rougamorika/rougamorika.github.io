export interface EditorState {
  isEditMode: boolean;
  currentContent: string;
  isDirty: boolean;
  lastSaved?: Date;
}

export interface EditorConfig {
  theme: 'vs-dark' | 'vs-light';
  fontSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
}

export type EditorMode = 'view' | 'edit' | 'split';
