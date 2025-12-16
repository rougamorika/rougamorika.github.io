import simpleGit from 'simple-git';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取项目根目录
const PROJECT_ROOT = join(__dirname, '..', '..');

// 初始化 git 实例
const git = simpleGit(PROJECT_ROOT);

/**
 * 生成 commit message
 * @param {string} action - 操作类型: 'create', 'update', 'delete', 'move'
 * @param {string} type - 资源类型: 'article', 'category'
 * @param {string} name - 资源名称 (slug 或 category id)
 * @param {object} metadata - 额外元数据
 * @returns {string} commit message
 */
function generateCommitMessage(action, type, name, metadata = {}) {
  const timestamp = new Date().toISOString().split('T')[0];

  const messages = {
    create: {
      article: `Create new article: ${name}`,
      category: `Create new category: ${name}`
    },
    update: {
      article: `Update article: ${name}`,
      category: `Update category: ${name}`
    },
    delete: {
      article: `Delete article: ${name}`,
      category: `Delete category: ${name}`
    },
    move: {
      article: `Move article: ${name} (${metadata.fromCategory} -> ${metadata.toCategory})`
    }
  };

  const message = messages[action]?.[type] || `${action} ${type}: ${name}`;
  return `${message} [${timestamp}]`;
}

/**
 * 执行 git add 和 commit
 * @param {string} action - 操作类型
 * @param {string} type - 资源类型
 * @param {string} name - 资源名称
 * @param {object} metadata - 额外元数据
 * @returns {Promise<object>} git 操作结果
 */
async function commitChanges(action, type, name, metadata = {}) {
  try {
    const commitMessage = generateCommitMessage(action, type, name, metadata);

    console.log(`\n[Git] Preparing to commit: ${commitMessage}`);

    // 检查是否有未提交的更改
    const status = await git.status();

    if (status.files.length === 0) {
      console.log('[Git] No changes to commit');
      return {
        success: true,
        message: 'No changes to commit',
        skipped: true
      };
    }

    console.log(`[Git] Found ${status.files.length} changed file(s)`);

    // 添加所有更改
    await git.add('.');
    console.log('[Git] Files staged');

    // 提交更改
    const commitResult = await git.commit(commitMessage);
    console.log(`[Git] Commit successful: ${commitResult.commit}`);

    // 推送到远程
    const pushResult = await git.push('origin', 'main');
    console.log('[Git] Push successful');

    return {
      success: true,
      message: 'Changes committed and pushed successfully',
      commit: commitResult.commit,
      skipped: false
    };

  } catch (error) {
    console.error('[Git] Error during commit/push:', error.message);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
}

/**
 * 异步执行 git 操作（不阻塞 API 响应）
 * @param {string} action - 操作类型
 * @param {string} type - 资源类型
 * @param {string} name - 资源名称
 * @param {object} metadata - 额外元数据
 */
function triggerGitCommit(action, type, name, metadata = {}) {
  // 使用 fire-and-forget 模式
  commitChanges(action, type, name, metadata)
    .then(result => {
      if (result.success) {
        if (!result.skipped) {
          console.log(`[Git] Successfully committed: ${name}`);
        }
      } else {
        console.error(`[Git] Failed to commit: ${result.message}`);
      }
    })
    .catch(error => {
      console.error('[Git] Unexpected error in git commit:', error);
    });
}

export { triggerGitCommit, commitChanges, generateCommitMessage };
