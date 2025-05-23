const { execSync } = require('child_process');

const readPackage = require('read-pkg-up');

/**
 * @returns {string | null} The current git branch name, or null if no branch is found
 */
const getGitBranch = () => {
  try {
    return execSync('git branch --show-current').toString().trim();
  } catch {
    return null;
  }
};

const generateStorageKey = () => {
  const pkg = readPackage.sync();
  const packageName = (pkg && pkg.packageJson && pkg.packageJson.name) || null;
  const branchName = getGitBranch();

  const packageLabel = packageName ? `package:${packageName}` : null;
  const branchLabel = branchName ? `branch:${branchName}` : null;

  return ['playroom', packageLabel, branchLabel].filter(Boolean).join('__');
};

module.exports = ({ storageKey, ...restConfig }) => ({
  port: 9000,
  openBrowser: true,
  storageKey: storageKey || generateStorageKey(),
  baseUrl: '',
  paramType: 'hash',
  ...restConfig,
});
