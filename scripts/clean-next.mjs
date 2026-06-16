/**
 * Remove .next cache — fixes ENOENT manifest / 500 errors after build+dev conflicts
 */
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

const nextDir = join(process.cwd(), '.next');

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log('Cleared .next cache');
} else {
  console.log('.next not present — nothing to clear');
}
