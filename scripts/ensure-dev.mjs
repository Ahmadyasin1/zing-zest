/**
 * Pre-dev health check — prevents webpack ENOENT / module-not-found 500s
 */
import { rmSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const nextDir = join(root, '.next');

function walk(dir, match) {
  const hits = [];
  if (!existsSync(dir)) return hits;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) hits.push(...walk(p, match));
    else if (match(name)) hits.push(p);
  }
  return hits;
}

function isCorrupted() {
  if (!existsSync(nextDir)) return false;

  if (!existsSync(join(nextDir, 'routes-manifest.json'))) {
    console.warn('[dev] Missing routes-manifest.json — cache is corrupted');
    return true;
  }

  const partialPacks = walk(join(nextDir, 'cache'), (n) => n.endsWith('.pack.gz_'));
  if (partialPacks.length > 0) {
    console.warn(`[dev] Found ${partialPacks.length} stale webpack pack file(s)`);
    return true;
  }

  return false;
}

if (isCorrupted()) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log('[dev] Cleared corrupted .next cache');
}
