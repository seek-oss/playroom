import { execSync } from 'node:child_process';

import readPackage from 'read-pkg-up';

import type { PlayroomConfig } from '../utils/index.ts';

export type ResolvedPlayroomConfig = PlayroomConfig &
  Required<
    Pick<
      PlayroomConfig,
      'cwd' | 'storageKey' | 'port' | 'openBrowser' | 'paramType' | 'baseUrl'
    >
  >;

const getGitBranch = (): string | null => {
  try {
    return execSync('git branch --show-current').toString().trim();
  } catch {
    return null;
  }
};

const generateStorageKey = () => {
  const pkg = readPackage.sync();
  const packageName = pkg?.packageJson?.name || null;
  const branchName = getGitBranch();

  const packageLabel = packageName ? `package:${packageName}` : null;
  const branchLabel = branchName ? `branch:${branchName}` : null;

  return ['playroom', packageLabel, branchLabel].filter(Boolean).join('__');
};

export default ({
  storageKey,
  cwd,
  ...restConfig
}: PlayroomConfig): ResolvedPlayroomConfig => ({
  port: 9000,
  openBrowser: true,
  storageKey: storageKey || generateStorageKey(),
  baseUrl: '',
  paramType: 'hash',
  ...restConfig,
  cwd: cwd ?? process.cwd(),
});
