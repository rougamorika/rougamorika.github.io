import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useArticleStore } from '@store/articleStore';
import { useEditorStore } from '@store/editorStore';
import { parseMarkdown } from '@utils/markdownParser';

export function MarkdownEditor() {
  const { currentArticle } = useArticleStore();
  const { currentContent, setContent: setEditorContent, saveContent, isSaving, saveError } = useEditorStore();
  const [localContent, setLocalContent] = useState('');
  const [preview, setPreview] = useState('');
  const [parseCount, setParseCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const updateTimerRef = useRef<NodeJS.Timeout>();

  // Initialize editor content from current article
  useEffect(() => {
    if (currentArticle?.rawMarkdown) {
      console.log('=== 初始化编辑器内容 ===');
      console.log('文章标题:', currentArticle.title);
      console.log('原始Markdown长度:', currentArticle.rawMarkdown.length);
      setLocalContent(currentArticle.rawMarkdown);
      setEditorContent(currentArticle.rawMarkdown);
    } else if (currentContent) {
      // Fallback to editorStore content if available
      setLocalContent(currentContent);
    } else {
      // Default empty content
      setLocalContent('# 新文章\n\n开始编写你的内容...\n');
    }
  }, [currentArticle]);

  // Update preview with proper markdown parser
  useEffect(() => {
    const updatePreview = async () => {
      console.log('=== 开始更新预览 ===');
      console.log('内容长度:', localContent.length);

      try {
        setIsLoading(true);
        // Use the proper unified/remark/rehype pipeline
        const { html } = await parseMarkdown(localContent);
        console.log('生成的HTML长度:', html.length);
        setPreview(html);
        setParseCount(prev => prev + 1);
      } catch (err) {
        console.error('转换错误:', err);
        setPreview('<p style="color: red;">转换错误: ' + String(err) + '</p>');
      } finally {
        setIsLoading(false);
      }
    };

    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
    }

    updateTimerRef.current = setTimeout(updatePreview, 500);

    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, [localContent]);

  // Handle content changes
  const handleContentChange = (value: string | undefined) => {
    const newValue = value || '';
    console.log('编辑器onChange，新内容长度:', newValue.length);
    setLocalContent(newValue);
    setEditorContent(newValue);
  };

  // Handle save using backend API
  const handleSave = async () => {
    if (!currentArticle) {
      setSaveMessage({ type: 'error', text: '没有选择文章' });
      return;
    }

    try {
      const result = await saveContent(currentArticle.slug, currentArticle.category);

      if (result.success) {
        setSaveMessage({ type: 'success', text: result.message });
        // Clear message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: '保存失败：' + (error instanceof Error ? error.message : '未知错误') });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-anime-pink to-anime-purple">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-white">
            ✏️ Markdown编辑器
          </h3>
          {currentArticle && (
            <span className="text-white text-sm">
              编辑: {currentArticle.title}
            </span>
          )}
          <span className="text-white text-sm opacity-75">
            {localContent.length}字 | 更新: {parseCount}次
          </span>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className={`text-sm px-3 py-1 rounded ${
              saveMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {saveMessage.text}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !currentArticle}
            className={`px-4 py-2 bg-white rounded-lg font-semibold transition-all ${
              isSaving || !currentArticle
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-anime-pink hover:shadow-lg'
            }`}
          >
            {isSaving ? '💾 保存中...' : '💾 保存'}
          </button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="w-1/2 border-r-2 border-gray-300">
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={localContent}
            onChange={handleContentChange}
            theme="vs-light"
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Preview */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h4 className="text-sm font-bold text-gray-600">
                📝 实时预览
              </h4>
              {isLoading && (
                <span className="text-xs text-gray-500">渲染中...</span>
              )}
            </div>

            {/* Preview with KaTeX support */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
