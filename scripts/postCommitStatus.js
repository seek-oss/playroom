/* eslint-disable no-console */
(async () => {
  try {
    console.log('Posting commit status to GitHub...');

    const { GITHUB_TOKEN, GITHUB_SHA } = process.env;

    if (!GITHUB_TOKEN || !GITHUB_SHA) {
      throw new Error(
        'GITHUB_TOKEN and GITHUB_SHA environment variables must be present'
      );
    }

    const { Octokit } = require('@octokit/rest');
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });

    await octokit.repos.createCommitStatus({
      owner: 'seek-oss',
      repo: 'playroom',
      sha: GITHUB_SHA,
      state: 'success',
      context: 'Preview Site',
      target_url: `https://playroom--${GITHUB_SHA}.surge.sh`,
      description: 'The preview for this PR has been successfully deployed',
    });

    console.log('Successfully posted commit status to GitHub');
  } catch (err) {
    console.error(err);
    process.exit(1); // eslint-disable-line no-process-exit
  }
})();
