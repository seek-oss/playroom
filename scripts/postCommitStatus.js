/* eslint-disable no-console */
const core = require('@actions/core');

const writeSummary = async ({ title, message }) => {
  core.summary.addHeading(title, 3);
  core.summary.addRaw(`<p>${message}</p>`, true);

  await core.summary.write();
};

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

    const previewUrl = `https://playroom--${GITHUB_SHA}.surge.sh`;

    await octokit.repos.createCommitStatus({
      owner: 'seek-oss',
      repo: 'playroom',
      sha: GITHUB_SHA,
      state: 'success',
      context: 'Preview Site',
      target_url: previewUrl,
      description: 'The preview for this PR has been successfully deployed',
    });

    console.log('Successfully posted commit status to GitHub');

    await writeSummary({
      title: 'Preview published',
      message: `Playroom preview available at ${previewUrl}`,
    });
  } catch (err) {
    console.error(err);
    process.exit(1); // eslint-disable-line no-process-exit
  }
})();
