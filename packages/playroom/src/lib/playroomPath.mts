import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { findUpSync } from 'find-up';

const packageJsonPath = findUpSync('package.json', {
  cwd: path.dirname(fileURLToPath(import.meta.url)),
});

if (!packageJsonPath) {
  throw new Error("Unable to find playroom 'package.json'");
}

export const playroomPath = path.dirname(packageJsonPath);
