#!/usr/bin/env node
const path = require('path');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const findUp = require('find-up');
const lib = require('../lib');

const showUsage = () => {
  console.log(
    commandLineUsage([
      {
        header: 'playroom',
        content:
          'Code-oriented component design tool.\n\nUsage: playroom <command> [options...]',
      },
      {
        header: 'Commands',
        content: [
          { name: 'start', summary: 'Start a local playroom.' },
          {
            name: 'build',
            summary: 'Build a playroom for production.',
          },
          { name: 'help', summary: 'Show this usage guide.' },
          {
            name: 'vite-start',
            summary: 'Start a local playroom with vite (experimental)',
          },
        ],
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'config',
            typeLabel: '{underline path}',
            description: 'Path to a config file.',
          },
        ],
      },
    ])
  );
};

/* eslint-disable consistent-return */
(async () => {
  const args = commandLineArgs([
    { name: 'command', defaultOption: true, defaultValue: 'start' },
    { name: 'config' },
    { name: 'help', type: Boolean },
  ]);

  // show help
  if (args.command === 'help' || args.help) {
    return showUsage();
  }

  const cwd = process.cwd();
  // Use the explicit config path if provided otherwise findup a playroom.config.js file
  const configPath = args.config
    ? path.resolve(cwd, args.config)
    : await findUp('playroom.config.js', { cwd });

  if (!configPath) {
    console.error(
      'Please add a playroom.config.js to the root of your project.'
    );
    process.exit(1);
  }

  const config = require(configPath);

  // Get the thing that does the playroom stuff
  const playroom = lib({
    cwd: path.dirname(configPath),
    ...config,
  });

  // If playroom can do "command", then do it
  console.log('command:', args.command);
  if (playroom.hasOwnProperty(args.command)) {
    playroom[args.command]((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  } else {
    showUsage();
    process.exit(1);
  }
})();
