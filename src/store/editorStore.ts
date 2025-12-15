import { create } from 'zustand';
import type { EditorMode } from '@types/editor';
import { useAuthStore } from './authStore';

interface EditorStore {
  isEditMode: boolean;
  editorMode: EditorMode;
  currentContent: string;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;

  setEditMode: (mode: boolean) => void;
  setEditorMode: (mode: EditorMode) => void;
  setContent: (content: string) => void;
  setDirty: (dirty: boolean) => void;
  saveContent: (slug: string, category: string) => Promise<{ success: boolean; message: string }>;
  toggleEditMode: () => void;
}

const API_BASE_URL = 'http://localhost:3001';

export const useEditorStore = create<EditorStore>((set, get) => ({
  isEditMode: false,
  editorMode: 'view',
  currentContent: '',
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  saveError: null,

  setEditMode: (mode) => set({
    isEditMode: mode,
    editorMode: mode ? 'edit' : 'view'
  }),

  setEditorMode: (mode) => set({
    editorMode: mode,
    isEditMode: mode !== 'view'
  }),

  setContent: (content) => {
    set({
      currentContent: content,
      isDirty: true
    });
  },

  setDirty: (dirty) => set({ isDirty: dirty }),

  saveContent: async (slug: string, category: string) => {
    const { currentContent } = get();
    const { token } = useAuthStore.getState();

    set({ isSaving: true, saveError: null });

    try {
      console.log(`=== 保存文章到后端 ===`);
      console.log(`Slug: ${slug}`);
      console.log(`Category: ${category}`);
      console.log(`Content length: ${currentContent.length}`);

      // Check if user is authenticated
      if (!token) {
        throw new Error('未登录，无法保存文章');
      }

      const response = await fetch(`${API_BASE_URL}/api/articles/${slug}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: currentContent,
          category: category
        })
      });

      const data = await response.json();

      // Handle authentication errors
      if (response.status === 401) {
        // Token is invalid or expired, log out the user
        useAuthStore.getState().logout();
        throw new Error('登录已过期，请重新登录');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save article');
      }

      console.log('✅ 保存成功:', data.message);

      // Also save to localStorage as backup
      localStorage.setItem('draft-content', currentContent);

      set({
        isDirty: false,
        isSaving: false,
        lastSaved: new Date(),
        saveError: null
      });

      return { success: true, message: data.message };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save article';
      console.error('❌ 保存失败:', errorMessage);

      set({
        isSaving: false,
        saveError: errorMessage
      });

      return { success: false, message: errorMessage };
    }
  },

  toggleEditMode: () => {
    const { isAuthenticated } = useAuthStore.getState();

    // Prevent entering edit mode if not authenticated
    if (!isAuthenticated) {
      console.warn('Cannot enter edit mode: User not authenticated');
      return;
    }

    const { isEditMode } = get();
    set({
      isEditMode: !isEditMode,
      editorMode: !isEditMode ? 'edit' : 'view'
    });
  },
}));
