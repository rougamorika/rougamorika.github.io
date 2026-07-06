export const giscusConfig = {
  enabled: false,
  repo: 'rougamorika/rougamorika.github.io',
  repoId: 'R_kgDOQpJTVQ',
  category: '',
  categoryId: '',
  mapping: 'specific',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  theme: 'light',
  lang: 'zh-CN',
} as const;

export function isGiscusConfigured(config = giscusConfig): boolean {
  return Boolean(
    config.enabled &&
      config.repo &&
      config.repoId &&
      config.category &&
      config.categoryId,
  );
}
