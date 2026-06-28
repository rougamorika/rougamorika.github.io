# Task Board

## Global Facts
- Repo root: D:\Blog
- Branch: main
- Task: 美化博客；重点修复 MusicPlayer：可拖动进度、倍速、歌单、在线导入、歌词本、点赞；Apple glass / 保留粉色系。
- Coordination: 16 个只读分析线程 + 主线程统一实现，避免多人改同一文件。
- Local verification: npm run build

## Agent Ownership
| Agent | Scope | Write ownership | Status |
|---|---|---|---|
| T01 | MusicPlayer component | read-only | running |
| T02 | musicStore | read-only | running |
| T03 | music types/db | read-only | running |
| T04 | global/anime CSS | read-only | running |
| T05 | layout visual integration | read-only | running |
| T06 | Apple glass design reference | read-only | running |
| T07 | playlist/import UX | read-only | running |
| T08 | lyrics UX/data | read-only | running |
| T09 | like/favorites persistence | read-only | running |
| T10 | accessibility | read-only | running |
| T11 | responsive/mobile | read-only | running |
| T12 | build/type risk | read-only | running |
| T13 | current assets/playlist | read-only | running |
| T14 | color token plan | read-only | running |
| T15 | online audio import constraints | read-only | running |
| T16 | final QA checklist | read-only | running |

## Findings
| Time | Agent | Finding | Evidence | Confidence |
|---|---|---|---|---|

## Open Questions
- [ ] 是否需要真实联网搜索歌曲 API？当前默认做“URL 导入在线音频/歌词”。
