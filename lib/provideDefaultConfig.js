const readPackage = require('read-pkg-up');
const currentGitBranch = require('current-git-branch');

const generateStorageKey = () => {
  const pkg = readPackage.sync();
  const packageName = (pkg && pkg.packageJson && pkg.packageJson.name) || null;
  const branchName = currentGitBranch();

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
