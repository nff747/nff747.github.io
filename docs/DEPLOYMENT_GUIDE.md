# Production Deployment & Embed Guide // Nff747.Github.Io

## 1. Browser Native & Web Worker Environment
Install via your preferred package manager:
```bash
npm install nff747.github.io
```

```javascript
import { EngineContext } from 'nff747.github.io';

const engine = new EngineContext({
  arenaSize: 32 * 1024 * 1024,
  strictMode: true
});

await engine.initialize();
```

## 2. Air-Gapped / Sovereign Deployments
Download the zero-dependency bundle or clone directly. No external registry or network access is required at runtime.
