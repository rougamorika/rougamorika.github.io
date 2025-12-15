# Anime Math Blog

A beautiful blog combining mathematics and anime aesthetics, built with React + Vite.

## Features

- 📝 Markdown-based articles with KaTeX math rendering
- 🗺️ Interactive mind map visualization for article relationships
- 🎵 Music player with custom playlists
- 🎨 Responsive anime-themed design
- 💻 Code syntax highlighting
- ⚡ Fast performance with Vite

## Live Site

Visit the blog at: [https://rougamorika.github.io](https://rougamorika.github.io)

## Local Development

```bash
# Install dependencies
npm install

# Start development server (frontend only)
npm run dev:frontend

# Start both frontend and backend
npm run dev
```

The blog will be available at `http://localhost:5173`

## Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This blog is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

### Manual Deployment

If you prefer manual deployment:

```bash
npm run build
# Then push the dist/ folder to your hosting service
```

## Adding New Articles

1. Create a new markdown file in `src/content/articles/[category]/`
2. Update `src/content/metadata/articles.json` with article metadata
3. Optionally update `src/content/metadata/relationships.json` for mind map connections
4. Commit and push - GitHub Actions will automatically rebuild and deploy

## Project Structure

```
Blog/
├── src/
│   ├── components/     # React components
│   ├── content/        # Articles and metadata
│   ├── hooks/          # Custom React hooks
│   ├── store/          # State management
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── public/             # Static assets
├── server/             # Backend API (not used in GitHub Pages deployment)
└── scripts/            # Build scripts
```

## Technologies

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Math Rendering**: KaTeX
- **Markdown**: Remark/Rehype
- **Code Highlighting**: Highlight.js
- **Routing**: React Router
- **State Management**: Zustand

## License

MIT

## Author

[rougamorika](https://github.com/rougamorika)
